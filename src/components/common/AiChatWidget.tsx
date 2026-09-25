import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import {
  ArrowUpRight,
  X,
  Terminal,
  RotateCcw,
  Paperclip,
  FileText,
  Upload,
  Copy,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { toast } from 'sonner';
import { useSiteData } from '../../context/SiteDataContext';
import { ViewMode } from '../../App';
import { sendToAiAgent, ChatResponse } from '../../lib/aiAgentApi';

interface ActionSpec {
  title: string;
  actionText: string;
  view?: ViewMode;
  sectionId?: string;
  externalUrl?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  specCard?: ActionSpec;
  tokensPerSec?: number;
  confidence?: number;
  highlightWords?: string[];
  attachmentName?: string;
  userType?: string;
}

interface AiChatWidgetProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
  isAdmin?: boolean;
}

const BroomIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v7" />
    <path d="M8 9h8a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1Z" />
    <path d="M7 14l-1.5 7" />
    <path d="M10 14v7" />
    <path d="M14 14v7" />
    <path d="M17 14l1.5 7" />
  </svg>
);

const UNIVERSAL_PROMPT_PILLS = [
  {
    id: 'arch',
    label: 'AI Architecture & Latency',
    prompt: 'How do you approach AI systems architecture, latency, and engineering craft?',
  },
  {
    id: 'works',
    label: 'Explore Featured Works',
    prompt: 'What are your most significant engineering projects and technical accomplishments?',
  },
  {
    id: 'philosophy',
    label: 'Wabi-Sabi Journey',
    prompt: 'How do Ma (間) and Wabi-Sabi (侘寂) influence your software architecture?',
  },
  {
    id: 'dialogue',
    label: 'Initiate Dialogue & Availability',
    prompt: 'Are you available for engineering roles or architectural collaborations?',
  },
];

export const AiChatWidget: React.FC<AiChatWidgetProps> = ({ onNavigate, isAdmin = false }) => {
  const { profile, projects, experiences, pillars } = useSiteData();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [displayedStreamingText, setDisplayedStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputId = useId();

  // Multi-turn conversational thread pointer backed by useState (resets on browser refresh)
  const [interactionId, setInteractionId] = useState<string | null>(null);
  const [callerContext, setCallerContext] = useState<{ userType: string; email?: string | null } | null>(null);
  // 50 MB upper limit (strictly matching AI Agent MAX_FILE_SIZE_BYTES)
  const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate and clean up object URLs for image preview thumbnails
  useEffect(() => {
    if (attachedFile && attachedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(attachedFile);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setFilePreviewUrl(null);
  }, [attachedFile]);

  // Chat window size & position (resizable & draggable - null defaults purely to bottom-right CSS)
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>(() => {
    if (typeof window !== 'undefined') {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxH = Math.max(340, vh - 24);
      return {
        width: Math.min(420, vw - 24),
        height: Math.min(580, maxH),
      };
    }
    return { width: 400, height: 560 };
  });
  const [windowPos, setWindowPos] = useState<{ x: number; y: number } | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: "Greetings. I am Vincent's AI Companion. I synthesize his architectural philosophies, systems engineering lineage, and selected works. Ask about distributed systems, low-latency AI pipelines, or our artisan philosophy.",
      timestamp: 'ONLINE · SYNTHESIS READY',
      tokensPerSec: 142,
      confidence: 99.8,
      specCard: {
        title: 'Spec: Telemetry // Komorebi Architecture',
        actionText: 'Explore Projects →',
        view: 'projects',
      },
    },
  ]);

  // Keep widget reactive and strictly inside screen bounds
  const clampWindowBounds = useCallback((
    pos: { x: number; y: number },
    size: { width: number; height: number }
  ) => {
    if (typeof window === 'undefined') return pos;
    const minX = 8;
    const minY = 8;
    const maxX = Math.max(minX, window.innerWidth - size.width - 8);
    const maxY = Math.max(minY, window.innerHeight - 56);
    return {
      x: Math.max(minX, Math.min(pos.x, maxX)),
      y: Math.max(minY, Math.min(pos.y, maxY)),
    };
  }, []);

  // Update bounds on window resize
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxAllowedH = Math.max(340, vh - 24);

      // Adjust window size if larger than screen
      setWindowSize((prev) => {
        const targetWidth = Math.min(prev.width, vw - 16);
        const targetHeight = Math.min(prev.height, maxAllowedH);
        return {
          width: Math.max(300, targetWidth),
          height: Math.max(340, targetHeight),
        };
      });

      // Clamp chat window position if currently custom positioned
      setWindowPos((prev) => {
        if (!prev) return null;
        return clampWindowBounds(prev, windowSize);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampWindowBounds, windowSize]);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (window.innerWidth >= 768) {
        inputRef.current?.focus();
      }
    }
  }, [isOpen, messages, displayedStreamingText]);

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const getTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  // Grounded response generator
  const generateResponse = (userQuery: string): {
    text: string;
    specCard?: ActionSpec;
    confidence: number;
    tokensPerSec: number;
  } => {
    const q = userQuery.toLowerCase();

    if (q.includes('wabi-sabi') || q.includes('ma') || q.includes('philosophy') || q.includes('craft') || q.includes('間') || q.includes('侘寂')) {
      const topPillar = pillars && pillars.length > 0 ? pillars[0].title : 'Disciplined Minimalism';
      return {
        text: `In Vincent's architecture, Ma (間) represents intentional negative space: translated as eliminating orchestrator bloat, strict backpressure, and zero unneeded microservice hops.\n\nWabi-Sabi (侘寂) manifests as accepting inherent node failures through graceful degradation and deterministic state recovery rather than fragile distributed locks. The core philosophy centers on ${topPillar}.`,
        specCard: {
          title: 'Philosophy: Origin & Craft // Ma (間)',
          actionText: 'Inspect Philosophy →',
          view: 'home',
          sectionId: 'philosophy',
        },
        confidence: 99.4,
        tokensPerSec: 142,
      };
    }

    if (q.includes('architect') || q.includes('latency') || q.includes('sub-100ms') || q.includes('system') || q.includes('ai') || q.includes('stream')) {
      return {
        text: `Vincent's AI and backend architecture focuses on sub-100ms streaming pipelines, zero-waste data paths, and robust telemetry. High-throughput edge endpoints utilize asynchronous I/O and strict type constraints across TypeScript, Python, and Go.\n\nEvery interface emphasizes observable telemetry, resilient back-off policies, and deterministic execution.`,
        specCard: {
          title: 'Spec: Telemetry // Komorebi Distributed Stream',
          actionText: 'Inspect Spec →',
          view: 'projects',
        },
        confidence: 99.1,
        tokensPerSec: 156,
      };
    }

    if (q.includes('project') || q.includes('works') || q.includes('build') || q.includes('portfolio') || q.includes('accomplish')) {
      const firstProject = projects && projects.length > 0 ? projects[0] : null;
      const secondProject = projects && projects.length > 1 ? projects[1] : null;

      const projectSummary = firstProject
        ? `${firstProject.title} (${firstProject.subtitle || 'Production System'})${secondProject ? ` alongside ${secondProject.title}` : ''}`
        : 'distributed telemetry suites and high-performance full-stack web applications';

      return {
        text: `Vincent's selected portfolio highlights ${projectSummary}.\n\nEach build pairs artisan user interfaces with robust backend infrastructure, real-time database synchronization via Supabase, and disciplined architectural boundaries.`,
        specCard: {
          title: firstProject ? `Work: ${firstProject.title} // Interactive Showcase` : 'Selected Portfolio · 作品',
          actionText: 'View All Works →',
          view: 'projects',
        },
        confidence: 98.7,
        tokensPerSec: 138,
      };
    }

    if (q.includes('experience') || q.includes('career') || q.includes('job') || q.includes('role') || q.includes('resume') || q.includes('background') || q.includes('work at')) {
      const currentRole = experiences && experiences.length > 0 ? experiences[0] : null;
      const roleText = currentRole
        ? `Currently active as ${currentRole.title} at ${currentRole.company}, operating across ${currentRole.domainLabel || 'systems engineering'}.`
        : 'Operating across systems engineering, full-stack development, and AI integration.';

      return {
        text: `${roleText}\n\nVincent brings deep engineering rigor across full-stack systems, modern cloud infrastructure, and low-latency client experiences. Detailed trajectory and verified accomplishments are archived in the curriculum vitae.`,
        specCard: {
          title: 'Archive: Curriculum Vitae // Experience Record',
          actionText: 'Open Full Resume →',
          view: 'resume',
        },
        confidence: 99.2,
        tokensPerSec: 148,
      };
    }

    if (q.includes('contact') || q.includes('hire') || q.includes('avail') || q.includes('collaborat') || q.includes('email') || q.includes('talk') || q.includes('reach')) {
      const email = profile?.email || 'contact@vincentyuan.me';
      return {
        text: `Vincent is actively open to exceptional engineering opportunities, advisory roles, and architectural dialogues.\n\nYou can reach out directly via the encrypted contact portal on this site or dispatch an email to ${email}.`,
        specCard: {
          title: 'Dialogue: Direct Communication Channel',
          actionText: 'Initiate Dialogue →',
          view: 'home',
          sectionId: 'contact',
        },
        confidence: 99.6,
        tokensPerSec: 164,
      };
    }

    return {
      text: `Vincent's engineering lineage integrates Shokunin artisan discipline with modern distributed infrastructure. Whether designing reactive frontend architectures or high-throughput backend services, the primary tenet remains clarity, zero unnecessary hops, and deterministic behavior.\n\nFeel free to explore his projects, review the career trajectory, or initiate a direct inquiry.`,
      specCard: {
        title: 'Overview: Systems Architecture & Portfolio Index',
        actionText: 'Explore Works →',
        view: 'projects',
      },
      confidence: 97.9,
      tokensPerSec: 135,
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend ?? inputValue;
    const trimmed = rawText.trim();
    if ((!trimmed && !attachedFile) || isStreaming) return;

    const userMsgId = `user-${Date.now()}`;
    const currentFile = attachedFile;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: trimmed || (currentFile ? `[Uploaded attachment: ${currentFile.name}]` : ''),
      timestamp: `YOU · ${getTimestamp()}`,
      attachmentName: currentFile?.name,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setAttachedFile(null);
    setIsStreaming(true);
    setDisplayedStreamingText('');

    const startTime = performance.now();

    try {
      // Execute call to FastAPI Gemini Agent microservice
      const data: ChatResponse = await sendToAiAgent({
        message: trimmed || 'Please inspect the attached document or image.',
        previousInteractionId: interactionId,
        file: currentFile,
      });

      // Update multi-turn interaction_id in useState (resets on browser refresh)
      if (data.interaction_id) {
        setInteractionId(data.interaction_id);
      }
      if (data.user_type) {
        setCallerContext({
          userType: data.user_type,
          email: data.user_email,
        });
      }

      const fullText = data.response;
      const durationSec = Math.max(0.3, (performance.now() - startTime) / 1000);
      const estimatedTokens = Math.max(16, Math.round(fullText.length / 3.8));
      const tokensPerSec = Math.round(estimatedTokens / durationSec);

      let charIndex = 0;
      const chunkSize = Math.max(2, Math.floor(fullText.length / 35));

      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }

      streamIntervalRef.current = setInterval(() => {
        charIndex += chunkSize;
        if (charIndex >= fullText.length) {
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
          }
          setDisplayedStreamingText(fullText);
          setIsStreaming(false);

          const finalAiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: fullText,
            timestamp: getTimestamp(),
            tokensPerSec,
            confidence: 99.6,
            userType: data.user_type,
          };
          setMessages((prev) => [...prev, finalAiMsg]);
        } else {
          setDisplayedStreamingText(fullText.slice(0, charIndex));
        }
      }, 20);
    } catch (err) {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
      setIsStreaming(false);
      setDisplayedStreamingText('');

      const errorText = (err as Error).message || 'Failed to reach AI Agent microservice.';

      // Generate graceful local fallback so conversation is never broken
      const fallback = generateResponse(trimmed);
      const finalAiMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `**Microservice Notice**: ${errorText}\n\n*Local architectural synthesis:*\n\n${fallback.text}`,
        timestamp: 'OFFLINE FALLBACK',
        specCard: fallback.specCard,
        tokensPerSec: 130,
        confidence: 94.5,
      };
      setMessages((prev) => [...prev, finalAiMsg]);
    }
  };

  const handleClearHistory = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }
    setIsStreaming(false);
    setDisplayedStreamingText('');
    setInteractionId(null);
    setCallerContext(null);
    setAttachedFile(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: "Dialogue memory reset. Thread cleared. All architectural contexts and Gemini tools are online.",
        timestamp: 'SYNCHRONIZED',
        tokensPerSec: 142,
        confidence: 99.9,
      },
    ]);
  };

  const handleActionClick = (spec?: ActionSpec) => {
    if (!spec) return;
    if (spec.externalUrl) {
      window.open(spec.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (onNavigate && spec.view) {
      onNavigate(spec.view, spec.sectionId);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateAndStageFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(
        `File "${file.name}" (${formatFileSize(file.size)}) exceeds the 50 MB maximum limit.`,
        { description: 'Please choose a file smaller than 50 MB.' }
      );
      return false;
    }
    setAttachedFile(file);
    toast.success(`Attached ${file.name} (${formatFileSize(file.size)})`);
    return true;
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (!isAdmin) return;
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          validateAndStageFile(file);
          return;
        }
      }
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDraggingFile(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndStageFile(files[0]);
    }
  };

  const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    return (
      <div className="markdown-content select-text selection:bg-terracotta/20 selection:text-terracotta dark:selection:bg-terracotta/30 dark:selection:text-ochre">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p({ children }) {
              return (
                <p className="leading-relaxed font-sans text-xs sm:text-[13px] text-light-ink dark:text-dark-ink mb-2.5 last:mb-0">
                  {children}
                </p>
              );
            },
            strong({ children }) {
              return (
                <strong className="font-bold text-light-ink dark:text-white">
                  {children}
                </strong>
              );
            },
            em({ children }) {
              return <em className="italic font-serif">{children}</em>;
            },
            ul({ children }) {
              return (
                <ul className="my-2 space-y-1.5 list-disc pl-4 text-xs sm:text-[13px] text-light-ink dark:text-dark-ink">
                  {children}
                </ul>
              );
            },
            ol({ children }) {
              return (
                <ol className="my-2 space-y-1.5 list-decimal pl-4 text-xs sm:text-[13px] text-light-ink dark:text-dark-ink">
                  {children}
                </ol>
              );
            },
            li({ children }) {
              return <li className="leading-relaxed pl-0.5">{children}</li>;
            },
            blockquote({ children }) {
              return (
                <blockquote className="my-2.5 border-l-2 border-terracotta/70 bg-terracotta/5 dark:bg-terracotta/10 px-3.5 py-2 rounded-r-lg text-xs sm:text-[13px] text-light-ink dark:text-dark-ink italic shadow-xs">
                  {children}
                </blockquote>
              );
            },
            hr() {
              return <hr className="my-3.5 border-terracotta/30 dark:border-terracotta/40" />;
            },
            h1({ children }) {
              return (
                <h1 className="font-serif font-bold text-base text-terracotta my-2.5 pb-1 border-b border-terracotta/20">
                  {children}
                </h1>
              );
            },
            h2({ children }) {
              return (
                <h2 className="font-serif font-bold text-sm text-terracotta my-2">
                  {children}
                </h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className="font-serif font-semibold text-xs text-light-ink dark:text-dark-ink my-1.5">
                  {children}
                </h3>
              );
            },
            a({ href, children }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta underline hover:text-terracotta/80 underline-offset-2 transition-colors font-medium"
                >
                  {children}
                </a>
              );
            },
            code({ inline, className, children }: any) {
              if (inline) {
                return (
                  <code className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-terracotta/10 text-terracotta dark:text-ochre border border-terracotta/20 select-text">
                    {children}
                  </code>
                );
              }
              const codeString = String(children).replace(/\n$/, '');
              const language = className?.replace('language-', '') || 'code';
              return (
                <div className="relative my-2.5 rounded-lg border border-light-border dark:border-dark-border bg-black/5 dark:bg-black/40 overflow-hidden group/code select-text">
                  <div className="flex items-center justify-between px-3 py-1 bg-black/5 dark:bg-white/5 border-b border-light-border/40 dark:border-dark-border/40 text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle select-none">
                    <span>{language}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(codeString);
                        toast.success('Code copied to clipboard');
                      }}
                      className="hover:text-terracotta transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy code"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-3 overflow-x-auto text-[11px] font-mono leading-relaxed text-light-ink dark:text-dark-ink select-text">
                    <code>{children}</code>
                  </pre>
                </div>
              );
            },
            table({ children }) {
              return (
                <div className="my-2.5 overflow-x-auto rounded-lg border border-light-border dark:border-dark-border">
                  <table className="min-w-full divide-y divide-light-border dark:divide-dark-border text-xs">
                    {children}
                  </table>
                </div>
              );
            },
            th({ children }) {
              return (
                <th className="px-3 py-1.5 bg-black/5 dark:bg-white/5 font-serif font-semibold text-terracotta text-left">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="px-3 py-1.5 border-t border-light-border/40 dark:border-dark-border/40 text-light-ink dark:text-dark-ink">
                  {children}
                </td>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────────────────
     2. DRAGGING THE CHAT WINDOW BY ITS HEADER BAR
     ───────────────────────────────────────────────────────────────────────── */
  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const target = e.currentTarget as HTMLElement;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }

    const rect = chatWindowRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentPos = windowPos || { x: rect.left, y: rect.top };
    let curX = currentPos.x;
    let curY = currentPos.y;
    let lastX = e.clientX;
    let lastY = e.clientY;

    if (chatWindowRef.current) {
      chatWindowRef.current.style.transition = 'none';
      chatWindowRef.current.style.top = '0px';
      chatWindowRef.current.style.left = '0px';
      chatWindowRef.current.style.right = 'auto';
      chatWindowRef.current.style.bottom = 'auto';
      chatWindowRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
    }

    const onPointerMove = (moveEv: PointerEvent) => {
      const dx = moveEv.clientX - lastX;
      const dy = moveEv.clientY - lastY;
      lastX = moveEv.clientX;
      lastY = moveEv.clientY;

      curX += dx;
      curY += dy;

      const minX = 8;
      const minY = 8; // Top of screen: z-[60] stays above navbar and never traps
      const maxX = Math.max(minX, window.innerWidth - windowSize.width - 8);
      const maxY = Math.max(minY, window.innerHeight - 56);

      curX = Math.max(minX, Math.min(curX, maxX));
      curY = Math.max(minY, Math.min(curY, maxY));

      if (chatWindowRef.current) {
        chatWindowRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      }
    };

    const onPointerUp = (upEv: PointerEvent) => {
      try {
        target.releasePointerCapture(upEv.pointerId);
      } catch {
        // Ignore if pointer capture release fails
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (chatWindowRef.current) {
        chatWindowRef.current.style.transition = '';
        chatWindowRef.current.style.top = '';
        chatWindowRef.current.style.left = '';
        chatWindowRef.current.style.right = '';
        chatWindowRef.current.style.bottom = '';
        chatWindowRef.current.style.transform = '';
      }
      setWindowPos({ x: curX, y: curY });
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  /* ─────────────────────────────────────────────────────────────────────────
     3. RESIZING / EXPANDING THE CHATBOT WIDGET
     ───────────────────────────────────────────────────────────────────────── */
  const handleResizeStart = (
    e: React.PointerEvent,
    direction: 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.button !== 0) return;

    const target = e.currentTarget as HTMLElement;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }

    const rect = chatWindowRef.current?.getBoundingClientRect();
    if (!rect) return;

    let curWidth = windowSize.width;
    let curHeight = windowSize.height;
    let curX = windowPos ? windowPos.x : rect.left;
    let curY = windowPos ? windowPos.y : rect.top;
    let lastX = e.clientX;
    let lastY = e.clientY;

    const minW = 300;
    const minH = 340;
    const maxW = window.innerWidth - 16;
    const maxH = window.innerHeight - 16;

    if (chatWindowRef.current) {
      chatWindowRef.current.style.transition = 'none';
      chatWindowRef.current.style.top = '0px';
      chatWindowRef.current.style.left = '0px';
      chatWindowRef.current.style.right = 'auto';
      chatWindowRef.current.style.bottom = 'auto';
      chatWindowRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
    }

    const onPointerMove = (moveEv: PointerEvent) => {
      const dx = moveEv.clientX - lastX;
      const dy = moveEv.clientY - lastY;
      lastX = moveEv.clientX;
      lastY = moveEv.clientY;

      if (direction.includes('w')) {
        const nextW = curWidth - dx;
        if (nextW >= minW && nextW <= maxW && curX + dx >= 8) {
          curWidth = nextW;
          curX += dx;
        }
      } else if (direction.includes('e')) {
        const nextW = curWidth + dx;
        if (nextW >= minW && curX + nextW <= window.innerWidth - 8) {
          curWidth = nextW;
        }
      }

      if (direction.includes('n')) {
        const nextH = curHeight - dy;
        if (nextH >= minH && nextH <= maxH && curY + dy >= 8) {
          curHeight = nextH;
          curY += dy;
        }
      } else if (direction.includes('s')) {
        const nextH = curHeight + dy;
        if (nextH >= minH && curY + nextH <= window.innerHeight - 8) {
          curHeight = nextH;
        }
      }

      if (chatWindowRef.current) {
        chatWindowRef.current.style.width = `${curWidth}px`;
        chatWindowRef.current.style.height = `${curHeight}px`;
        chatWindowRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      }
    };

    const onPointerUp = (upEv: PointerEvent) => {
      try {
        target.releasePointerCapture(upEv.pointerId);
      } catch {
        // Ignore if pointer capture release fails
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (chatWindowRef.current) {
        chatWindowRef.current.style.transition = '';
        chatWindowRef.current.style.top = '';
        chatWindowRef.current.style.left = '';
        chatWindowRef.current.style.right = '';
        chatWindowRef.current.style.bottom = '';
        chatWindowRef.current.style.transform = '';
      }
      setWindowSize({ width: curWidth, height: curHeight });
      setWindowPos({ x: curX, y: curY });
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  return (
    <>
      {/* ─── 1. STATIONARY BOTTOM-RIGHT LAUNCHER ─── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[60] select-none cursor-pointer focus:outline-none group"
          title="Ask Vincent's AI Companion"
          aria-label="Toggle Vincent's AI Assistant"
        >
          <div className="relative flex items-center gap-2.5 p-1 rounded-full animate-float-subtle">
            {/* Desktop Pill Trigger with Signature Rectangular Corner Frame */}
            <div className="relative hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full border-2 transition-all duration-200 backdrop-blur-md overflow-hidden border-terracotta/70 dark:border-terracotta/80 bg-light-surface-raised dark:bg-[#1E2028] shadow-akari-raised dark:shadow-[0_12px_28px_rgba(0,0,0,0.65)] group-hover:border-terracotta group-hover:shadow-hanko-glow group-hover:scale-[1.02]">
              {/* Subtle inner hairline perimeter */}
              <div className="absolute inset-1 rounded-full border border-terracotta/20 dark:border-terracotta/30 pointer-events-none" />

              <span className="font-serif text-terracotta font-bold text-xs">問</span>
              <span className="font-sans text-[11px] font-semibold text-light-ink dark:text-dark-ink tracking-wide">
                Ask Vincent's AI
              </span>
              <span className="text-[10px] font-mono text-terracotta/80 dark:text-ochre">
                // 問答
              </span>
            </div>

            {/* Circular Hanko Seal Button with High-Contrast Terracotta Aura */}
            <div className="relative flex items-center justify-center">
              <div className="w-13 h-13 sm:w-12 sm:h-12 rounded-full bg-terracotta text-white flex items-center justify-center transition-transform duration-150 border-2 border-white/30 dark:border-white/20 shadow-hanko-glow animate-launcher-glow group-hover:scale-105 active:scale-95">
                <span className="font-serif font-black text-xl sm:text-lg tracking-wider text-white select-none drop-shadow-xs">
                  問
                </span>
              </div>
            </div>
          </div>
        </button>
      )}

      {/* ─── 2. HIGH-CONTRAST EXPANDABLE CHATBOT WINDOW (OUTER RECTANGLE CORNERS) ─── */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          onPaste={handlePaste}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            width: `${windowSize.width}px`,
            height: `${windowSize.height}px`,
            maxHeight: 'calc(100vh - 16px)',
            transform: windowPos
              ? `translate3d(${windowPos.x}px, ${windowPos.y}px, 0)`
              : undefined,
          }}
          className={`fixed ${
            windowPos ? 'top-0 left-0' : 'bottom-4 right-4 sm:bottom-6 sm:right-6'
          } z-[60] flex flex-col rounded-2xl border-2 border-terracotta dark:border-terracotta bg-light-surface-raised dark:bg-[#1A1C23] shadow-2xl shadow-terracotta/20 dark:shadow-[0_25px_65px_rgba(0,0,0,0.85)] ring-1 ring-terracotta/40 dark:ring-terracotta/50 overflow-hidden animate-in zoom-in-95 fade-in duration-200`}
          role="dialog"
          aria-labelledby="ai-chat-title"
        >
          {/* Drag & Drop File Overlay (Admin only) */}
          {isDraggingFile && isAdmin && (
            <div className="absolute inset-0 z-50 rounded-2xl bg-terracotta/90 dark:bg-terracotta/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white border-2 border-dashed border-white/70 animate-in fade-in duration-150 pointer-events-none">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-3 shadow-lg">
                <Upload className="w-8 h-8 text-white animate-bounce" />
              </div>
              <span className="font-serif font-bold text-base tracking-wide">Drop file to attach</span>
              <span className="font-mono text-xs text-white/90 mt-1">Images, PDF, or DOCX · Max 50 MB</span>
            </div>
          )}

          {/* ── RECTANGLE CORNER BORDERS DIRECTLY ON OUTSIDE PERIMETER (MATCHING USER REFERENCE IMAGE) ── */}
          {/* Outer High-Contrast Hairline Perimeter Line */}
          <div className="absolute inset-1.5 sm:inset-2 pointer-events-none border border-terracotta/40 dark:border-terracotta/40 rounded-xl z-30" />

          {/* 4 Precision Right-Angle Terracotta Corner Brackets (Exact match to media_1790299169496.png) */}
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-4 h-4 border-t-2 border-l-2 border-terracotta pointer-events-none z-40" />
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 border-t-2 border-r-2 border-terracotta pointer-events-none z-40" />
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-4 h-4 border-b-2 border-l-2 border-terracotta pointer-events-none z-40" />
          <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-4 h-4 border-b-2 border-r-2 border-terracotta pointer-events-none z-40" />

          {/* ── RESIZE HANDLES (EXPAND WIDGET IN ALL DIRECTIONS) ── */}
          {/* Top-Left Corner Resize Grip */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 'nw')}
            className="absolute -top-1 -left-1 w-7 h-7 cursor-nwse-resize z-50 flex items-start justify-start p-1 group"
            title="Drag to resize widget"
          >
            <div className="w-3 h-3 border-t-2 border-l-2 border-terracotta group-hover:scale-110 transition-transform" />
          </div>

          {/* Top Edge Handle */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 'n')}
            className="absolute top-0 left-6 right-6 h-2.5 cursor-ns-resize z-40 hover:bg-terracotta/20 transition-colors"
            title="Drag top edge to expand vertically"
          />

          {/* Left Edge Handle */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 'w')}
            className="absolute left-0 top-6 bottom-6 w-2.5 cursor-ew-resize z-40 hover:bg-terracotta/20 transition-colors"
            title="Drag left edge to expand horizontally"
          />

          {/* Bottom-Right Corner Resize Grip (Traditional Window Handle) */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 'se')}
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 flex items-end justify-end p-1.5 group"
            title="Drag corner to expand widget"
          >
            <svg viewBox="0 0 10 10" className="w-3 h-3 text-terracotta transition-transform group-hover:scale-110">
              <line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="5" x2="5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="8" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* ─── 1. DRAGGABLE WINDOW HEADER (HIGH CONTRAST) ─── */}
          <div
            onPointerDown={handleHeaderPointerDown}
            onDoubleClick={() => setWindowPos(null)}
            className="relative z-30 flex items-center justify-between px-4 py-3 border-b-2 border-terracotta/30 bg-light-surface dark:bg-[#15171F] cursor-grab active:cursor-grabbing select-none"
            title="Drag header to move window // Double-click to dock to bottom-right"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center text-white shadow-md flex-shrink-0">
                <span className="font-serif font-black text-sm">問</span>
              </div>
              <div>
                <h3
                  id="ai-chat-title"
                  className="font-serif text-sm font-semibold text-light-ink dark:text-dark-ink tracking-tight flex items-center gap-1.5"
                >
                  <span className="text-terracotta">問答</span>
                  <span className="text-light-ink-subtle dark:text-dark-ink-subtle font-mono text-xs">//</span>
                  <span>Vincent's AI Companion</span>
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-bamboo animate-pulse" />
                  <span className="font-mono text-[9px] tracking-widest text-light-ink-subtle dark:text-dark-ink-subtle uppercase">
                    {isStreaming
                      ? 'COMMUNICATING // GEMINI MICROSERVICE'
                      : callerContext
                      ? `${callerContext.userType.toUpperCase()} // READY`
                      : 'SYSTEM ONLINE // READY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div
              className="flex items-center gap-1.5"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {windowPos && (
                <button
                  onClick={() => setWindowPos(null)}
                  className="p-1.5 rounded-md text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta hover:bg-terracotta/10 transition-colors"
                  title="Dock to bottom-right corner"
                  aria-label="Dock to bottom-right corner"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-md text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta hover:bg-terracotta/10 transition-colors"
                title="Clear conversation"
                aria-label="Clear conversation history"
              >
                <BroomIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink hover:bg-terracotta/10 transition-colors"
                title="Close assistant"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ─── 2. UNIVERSAL PREPREPARED PROMPT BUTTONS ─── */}
          <div className="relative z-30 px-3 py-2 border-b border-light-border/70 dark:border-dark-border/70 bg-light-surface/70 dark:bg-dark-surface/70 overflow-x-auto scrollbar-none flex items-center gap-1.5 whitespace-nowrap">
            {UNIVERSAL_PROMPT_PILLS.map((pill) => (
              <button
                key={pill.id}
                onClick={() => handleSendMessage(pill.prompt)}
                disabled={isStreaming}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-raised hover:border-terracotta hover:text-terracotta dark:hover:border-terracotta text-light-ink dark:text-dark-ink text-[11px] font-sans transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group flex-shrink-0 shadow-xs"
              >
                <span>{pill.label}</span>
              </button>
            ))}
          </div>

          {/* ─── 3. MESSAGES VIEWPORT (Washi Pattern Subtle Grid) ─── */}
          <div className="relative z-30 flex-1 overflow-y-auto p-4 space-y-4 washi-pattern scroll-smooth">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              if (!isAi) {
                return (
                  <div key={msg.id} className="flex flex-col items-end space-y-1">
                    <span className="font-mono text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle tracking-wider uppercase">
                      {msg.timestamp}
                    </span>
                    <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-tr-none bg-light-button-dark dark:bg-dark-surface-raised border border-light-border dark:border-dark-border-strong text-light-on-dark dark:text-dark-ink font-sans text-xs leading-relaxed shadow-sm">
                      {msg.attachmentName && (
                        <div className="flex items-center gap-1.5 text-[10px] text-terracotta dark:text-ochre mb-1.5 pb-1 border-b border-white/10 dark:border-white/10">
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[200px]">{msg.attachmentName}</span>
                        </div>
                      )}
                      {msg.text}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex flex-col space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-terracotta flex items-center justify-center text-white text-[11px] font-serif font-bold shadow-xs">
                        原
                      </div>
                      <span className="font-serif font-medium text-xs text-light-ink dark:text-dark-ink">
                        Vincent AI
                      </span>
                      {msg.userType && (
                        <span className="font-mono text-[9px] px-1.5 py-0.2 rounded border border-terracotta/40 bg-terracotta/10 text-terracotta tracking-wider uppercase">
                          {msg.userType}
                        </span>
                      )}
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded border border-ochre/40 bg-ochre/10 text-ochre tracking-wider uppercase">
                        GEMINI 3.6 FLASH
                      </span>
                    </div>
                  </div>

                  {/* AI Response Card with Matching Rectangle Corner Frame */}
                  <div className="relative rounded-xl border border-terracotta/35 dark:border-terracotta/40 bg-light-surface-card dark:bg-[#16171E] p-4 shadow-sm overflow-hidden group select-text">
                    {/* Inner rectangle hairline and corner tick */}
                    <div className="absolute inset-1.5 pointer-events-none border border-terracotta/25 dark:border-terracotta/25 rounded-lg" />
                    <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-terracotta pointer-events-none" />
                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-terracotta pointer-events-none" />
                    <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-terracotta pointer-events-none" />
                    <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-terracotta pointer-events-none" />

                    {/* Top right action bar: Copy response */}
                    <div className="absolute top-2 right-2.5 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(msg.text);
                          setCopiedMessageId(msg.id);
                          toast.success('Response copied to clipboard');
                          setTimeout(() => setCopiedMessageId(null), 2000);
                        }}
                        className="p-1 rounded bg-light-surface/90 dark:bg-dark-surface/90 border border-light-border dark:border-dark-border text-light-ink-subtle hover:text-terracotta shadow-xs transition-colors cursor-pointer"
                        title="Copy response"
                        aria-label="Copy response"
                      >
                        {copiedMessageId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-bamboo" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="absolute top-2 right-2.5 select-none pointer-events-none text-3xl font-serif text-light-ink-subtle/10 dark:text-dark-ink-subtle/10">
                      侘寂
                    </div>

                    <MarkdownRenderer content={msg.text} />

                    {msg.specCard && (
                      <div className="mt-3 pt-2 border-t border-light-border/60 dark:border-dark-border/60">
                        <button
                          onClick={() => handleActionClick(msg.specCard)}
                          className="w-full flex items-center justify-between p-2 rounded-lg border border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-raised hover:border-terracotta/70 transition-all duration-200 group/card text-left"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-5 h-5 rounded bg-terracotta flex items-center justify-center text-white flex-shrink-0">
                              <Terminal className="w-3 h-3 text-white" />
                            </div>
                            <span className="font-mono text-[11px] text-light-ink-muted dark:text-dark-ink-muted truncate">
                              {msg.specCard.title}
                            </span>
                          </div>
                          <span className="font-sans text-[11px] font-medium text-terracotta group-hover/card:translate-x-0.5 transition-transform flex-shrink-0 ml-2">
                            {msg.specCard.actionText}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle tracking-wider px-1">
                    <span>TOKENS: {msg.tokensPerSec || 142}/s · CONFIDENCE: {msg.confidence || 99.4}%</span>
                    {interactionId && (
                      <span className="text-[9px] opacity-70">
                        THREAD: {interactionId.slice(-8)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {isStreaming && (
              <div className="flex flex-col space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-terracotta flex items-center justify-center text-white text-[11px] font-serif font-bold">
                    原
                  </div>
                  <span className="font-serif font-medium text-xs text-light-ink dark:text-dark-ink">
                    Vincent AI
                  </span>
                  <span className="font-mono text-[9px] px-1.5 py-0.2 rounded border border-bamboo/40 bg-bamboo/10 text-bamboo tracking-wider uppercase animate-pulse">
                    STREAMING
                  </span>
                </div>

                <div className="relative rounded-xl border border-terracotta/35 dark:border-terracotta/40 bg-light-surface-card dark:bg-[#16171E] p-4 shadow-sm overflow-hidden select-text">
                  <div className="absolute inset-1.5 pointer-events-none border border-terracotta/25 dark:border-terracotta/25 rounded-lg" />
                  <div className="absolute top-2 right-2.5 select-none pointer-events-none text-3xl font-serif text-light-ink-subtle/10 dark:text-dark-ink-subtle/10">
                    侘寂
                  </div>
                  <MarkdownRenderer content={displayedStreamingText} />
                  <span className="inline-block w-1.5 h-3.5 bg-terracotta ml-1 animate-pulse align-middle" />
                </div>

                <div className="font-mono text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle tracking-wider px-1">
                  TOKENS: 148/s · BUFFERING...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ─── 4. INPUT BAR DOCK ─── */}
          <div className="relative z-30 p-3 border-t-2 border-terracotta/30 bg-light-surface dark:bg-[#15171F]">
            {/* Staged file preview with thumbnail, mime badge, and 50MB limit indicator */}
            {attachedFile && (
              <div className="mb-2 flex items-center justify-between p-2 rounded-xl border border-terracotta/40 bg-terracotta/5 dark:bg-terracotta/10 text-xs font-mono text-light-ink dark:text-dark-ink shadow-xs animate-in fade-in slide-in-from-bottom-1 duration-150">
                <div className="flex items-center gap-2.5 min-w-0">
                  {filePreviewUrl ? (
                    <img
                      src={filePreviewUrl}
                      alt={attachedFile.name}
                      className="w-10 h-10 object-cover rounded-lg border border-terracotta/40 shrink-0 shadow-xs"
                    />
                  ) : attachedFile.type.startsWith('image/') ? (
                    <div className="w-10 h-10 rounded-lg bg-terracotta/15 flex items-center justify-center shrink-0 border border-terracotta/30">
                      <ImageIcon className="w-5 h-5 text-terracotta" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-terracotta/15 flex items-center justify-center shrink-0 border border-terracotta/30">
                      <FileText className="w-5 h-5 text-terracotta" />
                    </div>
                  )}
                  <div className="min-w-0 flex flex-col">
                    <span className="truncate font-sans font-medium text-xs text-light-ink dark:text-dark-ink max-w-[200px] sm:max-w-[260px]">
                      {attachedFile.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle mt-0.5">
                      <span className="px-1.5 py-0.2 rounded bg-terracotta/15 text-terracotta font-mono font-semibold uppercase text-[9px]">
                        {attachedFile.name.split('.').pop() || 'FILE'}
                      </span>
                      <span>{formatFileSize(attachedFile.size)}</span>
                      <span className="opacity-60">/ 50 MB max</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="p-1 rounded-md text-light-ink-muted hover:text-terracotta hover:bg-terracotta/10 transition-colors ml-2 shrink-0 cursor-pointer"
                  title="Remove attachment"
                  aria-label="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center rounded-xl border-2 border-terracotta/40 dark:border-terracotta/50 bg-light-surface-raised dark:bg-dark-surface-raised px-3 py-1.5 focus-within:border-terracotta transition-colors shadow-inner"
            >
              {isAdmin && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        validateAndStageFile(e.target.files[0]);
                      }
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isStreaming}
                    className="p-1.5 rounded-lg text-light-ink-subtle hover:text-terracotta hover:bg-terracotta/10 transition-colors mr-1 shrink-0 disabled:opacity-50 cursor-pointer"
                    title="Attach file (Paste, drag & drop, or click · Max 50 MB)"
                    aria-label="Attach file"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                </>
              )}

              <label htmlFor={inputId} className="sr-only">
                Ask about systems, code, or craft
              </label>
              <input
                id={inputId}
                ref={inputRef}
                type="text"
                value={inputValue}
                maxLength={500}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about systems, code, or craft..."
                disabled={isStreaming}
                className="flex-1 bg-transparent text-xs sm:text-[13px] text-light-ink dark:text-dark-ink placeholder:text-light-ink-subtle/70 dark:placeholder:text-dark-ink-subtle/70 focus:outline-none disabled:opacity-50 pr-16"
              />

              <span className="font-mono text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle mr-2 select-none">
                {inputValue.length}/500
              </span>

              <button
                type="submit"
                disabled={(!inputValue.trim() && !attachedFile) || isStreaming}
                className="w-7 h-7 rounded-lg bg-terracotta hover:bg-terracotta-hover disabled:opacity-30 disabled:hover:bg-terracotta text-white flex items-center justify-center transition-all duration-150 active:scale-95 flex-shrink-0 shadow-xs"
                aria-label="Send query"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
