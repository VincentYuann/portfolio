import React, { useState, useRef, useEffect, useId } from 'react';
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
  Sparkles,
  Activity,
  ChevronDown,
  Maximize2,
  Minimize2,
  Lock,
  Mic,
  MicOff,
} from 'lucide-react';
import { MarkdownRenderer } from './chat/MarkdownRenderer';
import { useDraggableWindow } from './chat/useDraggableWindow';
import { useBottomSheetGesture } from './chat/useBottomSheetGesture';
import { toast } from 'sonner';
import { ViewMode } from '../../App';
import { useSiteData } from '../../context/SiteDataContext';
import { sendToAiAgent, ChatResponse } from '../../lib/aiAgentApi';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  Marker,
  MarkerContent,
  MarkerIcon,
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  ChatInput,
} from '../ui/chat';

interface ActionSpec {
  title: string;
  actionText: string;
  view?: ViewMode;
  sectionId?: string;
  externalUrl?: string;
}

interface MessageTelemetry {
  model: string;
  tokensPerSec?: number;
  latencyMs: number;
  interactionId?: string;
  isFallback: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  specCard?: ActionSpec;
  attachmentName?: string;
  attachmentUrl?: string;
  userType?: string;
  telemetry?: MessageTelemetry;
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
    aria-hidden="true"
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

// File upload constraints matching AI Agent backend (app/files.py & app/config.py)
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB hard limit
const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/markdown',
  'text/plain',
]);
const ALLOWED_FILE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.pdf', '.docx', '.doc', '.md', '.markdown', '.txt'];
const ACCEPTED_FILE_TYPES_ATTR = [
  ...ALLOWED_FILE_EXTENSIONS,
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/markdown',
  'text/plain',
].join(',');

export const AiChatWidget: React.FC<AiChatWidgetProps> = ({ onNavigate, isAdmin = false }) => {
  const { refresh: refreshSiteData } = useSiteData();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [displayedStreamingText, setDisplayedStreamingText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const prevIsOpenRef = useRef(false);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputId = useId();

  // Multi-turn conversational interaction state
  const [interactionId, setInteractionId] = useState<string | null>(null);
  const [callerContext, setCallerContext] = useState<{ userType: string; email?: string | null } | null>(null);

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [expandedTelemetryId, setExpandedTelemetryId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech-To-Text hook for admin voice dictation
  const {
    isListening: isSttListening,
    isSupported: isSttSupported,
    stopListening: stopStt,
    toggleListening: toggleStt,
  } = useSpeechToText({
    isAdmin,
    value: inputValue,
    onChange: (val) => setInputValue(val),
  });

  // Stop STT listening when chat modal is closed
  useEffect(() => {
    if (!isOpen && isSttListening) {
      stopStt();
    }
  }, [isOpen, isSttListening, stopStt]);

  // Auto-generate and clean up object URLs for image preview thumbnails
  useEffect(() => {
    if (
      attachedFile &&
      (attachedFile.type.startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(attachedFile.name))
    ) {
      const url = URL.createObjectURL(attachedFile);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setFilePreviewUrl(null);
  }, [attachedFile]);

  // Automatically clear attached file if user is logged out or is not an administrator
  useEffect(() => {
    if (!isAdmin && attachedFile) {
      setAttachedFile(null);
      toast.info('File Cleared', {
        description: 'Multimodal file analysis is reserved for administrator sessions.',
      });
    }
  }, [isAdmin, attachedFile]);

  // Chat window size & position state (responsive initial dimensions)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>(() => {
    if (typeof window !== 'undefined') {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxH = Math.max(360, vh - 32);
      return {
        width: Math.min(430, vw - 24),
        height: Math.min(580, maxH),
      };
    }
    return { width: 420, height: 580 };
  });
  const [windowPos, setWindowPos] = useState<{ x: number; y: number } | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Initial welcome message reflecting Vincent's architectural perspective
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: "Greetings. I am Vincent's AI Companion. I synthesize his architectural philosophies, systems engineering lineage, and selected works. Ask about distributed systems, low-latency AI pipelines, or our artisan philosophy.",
      timestamp: 'ONLINE · SYNTHESIS READY',
      specCard: {
        title: 'Spec: Telemetry // Komorebi Architecture',
        actionText: 'Explore Projects →',
        view: 'projects',
      },
      telemetry: {
        model: 'Vincent Architectural Kernel',
        latencyMs: 8,
        isFallback: true,
      },
    },
  ]);

  // Update bounds on window resize atomically without stale closure dependencies
  useEffect(() => {
    let resizeTimer: number | null = null;
    const handleResize = () => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const mobile = vw < 640;
        setIsMobile(mobile);

        if (mobile) {
          // Bottom-sheet mode on mobile: release floating desktop coordinates
          setWindowPos(null);
        } else {
          setIsExpandedMobile(false);
          const maxAllowedH = Math.max(340, vh - 24);
          setWindowSize((prev) => ({
            width: Math.max(300, Math.min(prev.width, vw - 16)),
            height: Math.max(340, Math.min(prev.height, maxAllowedH)),
          }));

          setWindowPos((prev) => {
            if (!prev) return null;
            const minX = 8;
            const minY = 8;
            const maxX = Math.max(minX, vw - 320);
            const maxY = Math.max(minY, vh - 64);
            return {
              x: Math.max(minX, Math.min(prev.x, maxX)),
              y: Math.max(minY, Math.min(prev.y, maxY)),
            };
          });
        }
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
    };
  }, []);

  // MessageScrollerProvider owns intelligent streaming follow and scroll anchoring without jumping

  // Modal open/close lifecycle: auto-focus input on open, restore focus to launcher on close
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (window.innerWidth >= 640) {
          inputRef.current?.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsExpandedMobile(false);
      if (prevIsOpenRef.current) {
        // WCAG 2.4.3 Focus Order: restore focus to launcher on modal dismiss
        // Defer through setTimeout to ensure newly mounted launcher receives focus
        // after the browser finishes pointer/click event dispatch on the unmounted close element.
        const timer = setTimeout(() => {
          launcherRef.current?.focus();
        }, 16);
        return () => clearTimeout(timer);
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  // Ensure DOM inline position styles are cleared when window is docked to bottom-right corner
  useEffect(() => {
    if (!windowPos && chatWindowRef.current) {
      chatWindowRef.current.style.top = '';
      chatWindowRef.current.style.left = '';
      chatWindowRef.current.style.right = '';
      chatWindowRef.current.style.bottom = '';
      chatWindowRef.current.style.transform = '';
    }
  }, [windowPos]);

  // Global hotkeys: Cmd+K / Ctrl+K toggles widget, Escape closes it, Tab cycles focus within modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      // Modal focus trapping for WCAG 2.1.2 compliance
      if (e.key === 'Tab' && chatWindowRef.current) {
        const focusable = chatWindowRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          const firstElement = focusable[0];
          const lastElement = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  const handleSendMessage = async (textToSend?: string) => {
    if (isSttListening) {
      stopStt();
    }
    const rawText = textToSend ?? inputValue;
    const trimmed = rawText.trim();
    if ((!trimmed && !attachedFile) || isStreaming) return;

    // Guard against devtool state manipulation or unauthorized file attachment
    if (attachedFile && !isAdmin) {
      toast.info('Admin Privilege Required', {
        description: 'File attachments and multimodal analysis are restricted to administrator sessions. Please ask your questions via text!',
        duration: 5000,
      });
      setAttachedFile(null);
      return;
    }

    const userMsgId = `user-${Date.now()}`;
    const currentFile = attachedFile;
    const currentPreviewUrl = filePreviewUrl;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: trimmed || (currentFile ? `[Uploaded attachment: ${currentFile.name}]` : ''),
      timestamp: `YOU · ${getTimestamp()}`,
      attachmentName: currentFile?.name,
      attachmentUrl: currentPreviewUrl || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setAttachedFile(null);
    setDisplayedStreamingText('');
    setIsStreaming(true);
    const startTime = performance.now();

    try {
      // Execute call to Gemini Agent microservice with REAL-TIME SSE streaming
      let accumulated = '';
      const data: ChatResponse = await sendToAiAgent({
        message: trimmed || 'Please inspect the attached document or image.',
        previousInteractionId: interactionId,
        file: currentFile,
        stream: true,
        onDelta: (textChunk: string) => {
          accumulated += textChunk;
          setDisplayedStreamingText(accumulated);
        },
      });

      const latencyMs = Math.round(performance.now() - startTime);

      if (data.interaction_id) {
        setInteractionId(data.interaction_id);
      }
      if (data.user_type) {
        setCallerContext({
          userType: data.user_type,
          email: data.user_email,
        });
      }

      // Eagerly refresh site data if in admin session to synchronize any database mutations
      if (isAdmin) {
        refreshSiteData().catch((err) => console.warn('Post-interaction site refresh caught:', err));
      }

      const fullText = data.response || accumulated;
      const estimatedTokens = Math.max(16, Math.round(fullText.length / 3.8));
      const tokensPerSec = Math.round(estimatedTokens / Math.max(0.3, latencyMs / 1000));

      setDisplayedStreamingText('');
      setIsStreaming(false);

      const finalAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fullText,
        timestamp: `VINCENT AI · ${getTimestamp()}`,
        userType: data.user_type,
        telemetry: {
          model: data.model ? data.model.replace(/^models\//, '') : 'gemini-3.5-flash-lite',
          latencyMs,
          tokensPerSec,
          interactionId: data.interaction_id || undefined,
          isFallback: false,
        },
      };
      setMessages((prev) => [...prev, finalAiMsg]);
    } catch (err: any) {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
      setDisplayedStreamingText('');
      setIsStreaming(false);

      const latencyMs = Math.round(performance.now() - startTime);
      const rawMessage = err instanceof Error ? err.message : String(err || 'Unknown error');

      const isForbidden = rawMessage.toLowerCase().includes('administrator') || rawMessage.toLowerCase().includes('restricted') || rawMessage.includes('403');
      const isRateLimit = rawMessage.toLowerCase().includes('rate limit') || rawMessage.toLowerCase().includes('limit reached') || rawMessage.includes('429');
      const isNetwork = rawMessage.toLowerCase().includes('connect') || rawMessage.toLowerCase().includes('network') || rawMessage.toLowerCase().includes('unavailable') || rawMessage.includes('502');

      let userFacingText: string;
      if (isForbidden) {
        userFacingText = '⚠️ **Access Restricted**: File attachments and multimodal analysis are reserved for administrator sessions. Please submit your inquiries via text.';
        toast.info('Admin Privilege Required', {
          description: 'File attachments are restricted to administrator sessions.',
        });
      } else if (isRateLimit) {
        userFacingText = '⏳ **Rate Limit**: The AI service is currently experiencing high demand. Please wait a few moments and try again.';
      } else if (isNetwork) {
        userFacingText = `⚠️ **Connection Issue**: Unable to connect to the AI service. (${rawMessage})\n\nPlease verify your connection and ensure the backend service is online.`;
      } else {
        userFacingText = `⚠️ **Service Notice**: ${rawMessage}`;
      }

      const errorAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: userFacingText,
        timestamp: `VINCENT AI · ${getTimestamp()}`,
        telemetry: {
          model: 'Error Diagnostic',
          latencyMs,
          isFallback: true,
        },
      };
      setMessages((prev) => [...prev, errorAiMsg]);
    }
  };

  const handleClearHistory = () => {
    if (isSttListening) {
      stopStt();
    }
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
        id: `marker-${Date.now()}`,
        sender: 'system',
        text: 'Dialogue Thread Refreshed · Context Reset',
        timestamp: getTimestamp(),
      },
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: 'Dialogue thread refreshed. All architectural contexts and synthesis tools are online.',
        timestamp: `VINCENT AI · ${getTimestamp()}`,
      },
    ]);
    toast.success('Conversation thread refreshed');
  };

  const handleDockToCorner = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.style.top = '';
      chatWindowRef.current.style.left = '';
      chatWindowRef.current.style.right = '';
      chatWindowRef.current.style.bottom = '';
      chatWindowRef.current.style.transform = '';
      chatWindowRef.current.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        if (chatWindowRef.current) {
          chatWindowRef.current.style.transition = '';
        }
      }, 260);
    }
    setWindowPos(null);
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
    if (!isAdmin) {
      toast.info('Admin Privilege Required', {
        description: 'Multimodal document and image analysis is reserved for administrator sessions to manage Gemini compute quotas. You can explore and ask anything via text!',
        duration: 5000,
      });
      return false;
    }

    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    const isExtensionAllowed = ALLOWED_FILE_EXTENSIONS.includes(ext);
    const isMimeAllowed = file.type ? ALLOWED_MIME_TYPES.has(file.type) : false;

    if (!isExtensionAllowed && !isMimeAllowed) {
      toast.error('Unsupported file format', {
        description: `"${file.name}" is not supported. Please upload an image (PNG, JPG, WEBP, GIF) or document (PDF, DOCX, DOC, MD, TXT).`,
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error('File exceeds 50 MB limit', {
        description: `"${file.name}" (${formatFileSize(file.size)}) exceeds the 50 MB maximum allowed upload size.`,
      });
      return false;
    }

    setAttachedFile(file);
    toast.success(`Attached ${file.name} (${formatFileSize(file.size)})`);
    return true;
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        e.preventDefault();
        if (!isAdmin) {
          toast.info('Admin Privilege Required', {
            description: 'File attachments and multimodal analysis are restricted to administrator sessions. Please ask your questions via text!',
            duration: 5000,
          });
          return;
        }
        const file = item.getAsFile();
        if (file) {
          validateAndStageFile(file);
          return;
        }
      }
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDraggingFile(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (!isAdmin) {
        toast.info('Admin Privilege Required', {
          description: 'File attachments and multimodal analysis are restricted to administrator sessions. Please ask your questions via text!',
          duration: 5000,
        });
        return;
      }
      validateAndStageFile(files[0]);
    }
  };


  /* ─────────────────────────────────────────────────────────────────────────
     WINDOW DRAGGING (DESKTOP) & SWIPE-TO-DISMISS (MOBILE)
     ───────────────────────────────────────────────────────────────────────── */
  const { handleDesktopDragStart } = useDraggableWindow({
    chatWindowRef,
    windowPos,
    windowSize,
    setWindowPos,
    disabled: isMobile,
  });

  const { handleMobileSheetPointerDown } = useBottomSheetGesture({
    chatWindowRef,
    isExpandedMobile,
    setIsExpandedMobile,
    setIsOpen,
    disabled: !isMobile,
  });

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if (isMobile) {
      handleMobileSheetPointerDown(e);
    } else {
      handleDesktopDragStart(e);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
     WINDOW RESIZING (DESKTOP)
     ───────────────────────────────────────────────────────────────────────── */
  const resizeRafRef = useRef<number | null>(null);

  const handleResizeStart = (
    e: React.PointerEvent,
    direction: 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.button !== 0 || isMobile) return;

    const target = e.currentTarget as HTMLElement;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // Ignore pointer capture fallback
    }

    const rect = chatWindowRef.current?.getBoundingClientRect();
    if (!rect) return;

    let curWidth = windowSize.width;
    let curHeight = windowSize.height;
    let curX = windowPos ? windowPos.x : rect.left;
    let curY = windowPos ? windowPos.y : rect.top;
    let lastX = e.clientX;
    let lastY = e.clientY;

    const minW = 320;
    const minH = 360;
    const maxW = window.innerWidth - 16;
    const maxH = window.innerHeight - 16;

    if (chatWindowRef.current) {
      chatWindowRef.current.style.transition = 'none';
      chatWindowRef.current.style.top = '0px';
      chatWindowRef.current.style.left = '0px';
      chatWindowRef.current.style.right = 'auto';
      chatWindowRef.current.style.bottom = 'auto';
      chatWindowRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      chatWindowRef.current.style.width = `${curWidth}px`;
      chatWindowRef.current.style.height = `${curHeight}px`;
    }

    const onPointerMove = (moveEv: PointerEvent) => {
      const dx = moveEv.clientX - lastX;
      const dy = moveEv.clientY - lastY;
      lastX = moveEv.clientX;
      lastY = moveEv.clientY;

      if (direction.includes('e')) {
        curWidth = Math.min(maxW, Math.max(minW, curWidth + dx));
      }
      if (direction.includes('s')) {
        curHeight = Math.min(maxH, Math.max(minH, curHeight + dy));
      }
      if (direction.includes('w')) {
        const nextW = Math.min(maxW, Math.max(minW, curWidth - dx));
        curX += curWidth - nextW;
        curWidth = nextW;
      }
      if (direction.includes('n')) {
        const nextH = Math.min(maxH, Math.max(minH, curHeight - dy));
        curY += curHeight - nextH;
        curHeight = nextH;
      }

      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        if (chatWindowRef.current) {
          chatWindowRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
          chatWindowRef.current.style.width = `${curWidth}px`;
          chatWindowRef.current.style.height = `${curHeight}px`;
        }
      });
    };

    const onPointerUp = (upEv: PointerEvent) => {
      try {
        target.releasePointerCapture(upEv.pointerId);
      } catch {
        // Ignore pointer release
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (resizeRafRef.current) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }

      if (chatWindowRef.current) {
        chatWindowRef.current.style.transition = '';
      }
      setWindowSize({ width: curWidth, height: curHeight });
      setWindowPos({ x: curX, y: curY });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  return (
    <>
      {/* ─── 1. SINGULAR HANKO TRIGGER (DESIGN SYSTEM ALIGNED) ─── */}
      {!isOpen && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 p-1.5 sm:pl-2 sm:pr-3.5 sm:py-1.5 rounded-full bg-light-surface-card dark:bg-dark-surface-card border border-terracotta/40 hover:border-terracotta dark:border-terracotta/40 dark:hover:border-terracotta text-light-ink dark:text-dark-ink shadow-md hover:shadow-hanko-glow transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 active:scale-95 cursor-pointer min-h-[48px] min-w-[48px]"
          aria-label="Open Vincent's AI Companion (Press Cmd+K or Ctrl+K)"
          aria-haspopup="dialog"
          aria-expanded={false}
          title="Ask Vincent's AI (⌘K)"
        >
          {/* Authentic Hanko Stamp Mark */}
          <div className="w-9 h-9 rounded-full bg-terracotta text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs group-hover:scale-105 transition-transform shrink-0">
            問
          </div>
          {/* Launcher Label & Shortcut Affordance (Responsive Desktop Expansion) */}
          <div className="hidden sm:flex items-center gap-2 pr-0.5">
            <span className="font-serif text-xs sm:text-sm font-medium tracking-tight">
              Ask Vincent's AI
            </span>
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface text-light-ink-subtle dark:text-dark-ink-subtle">
              ⌘K
            </kbd>
          </div>
        </button>
      )}

      {/* ─── 2. ACCESSIBLE CHATBOT DIALOG MODAL (SHADCN COMPOSE PATTERN) ─── */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          onPaste={handlePaste}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            width: isMobile ? '100%' : `${windowSize.width}px`,
            height: isMobile
              ? isExpandedMobile
                ? 'calc(100dvh - 8px)'
                : '85dvh'
              : `${windowSize.height}px`,
            maxHeight: isMobile
              ? isExpandedMobile
                ? 'calc(100dvh - 8px)'
                : '85dvh'
              : 'calc(100vh - 24px)',
            top: !isMobile && windowPos ? '0px' : undefined,
            left: !isMobile && windowPos ? '0px' : undefined,
            right: !isMobile && windowPos ? 'auto' : undefined,
            bottom: !isMobile && windowPos ? 'auto' : undefined,
            transform: !isMobile && windowPos
              ? `translate3d(${windowPos.x}px, ${windowPos.y}px, 0)`
              : undefined,
            transition: isMobile
              ? 'height 0.28s cubic-bezier(0.16, 1, 0.3, 1), max-height 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
              : undefined,
          }}
          className={`fixed z-[60] flex flex-col ${
            windowPos && !isMobile
              ? 'top-0 left-0 right-auto bottom-auto'
              : 'bottom-0 left-0 right-0 sm:top-auto sm:bottom-6 sm:right-6 sm:left-auto'
          } rounded-t-2xl sm:rounded-xl border border-terracotta/40 dark:border-terracotta/50 bg-light-surface-card dark:bg-dark-surface-card shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in duration-200`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-chat-title"
        >
          {/* Subtle Outer Joinery Corner Brackets (Desktop Only) */}
          <div className="hidden sm:block absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-terracotta pointer-events-none z-40 opacity-70" />
          <div className="hidden sm:block absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-terracotta pointer-events-none z-40 opacity-70" />
          <div className="hidden sm:block absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-terracotta pointer-events-none z-40 opacity-70" />
          <div className="hidden sm:block absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-terracotta pointer-events-none z-40 opacity-70" />

          {/* Desktop Resizing Affordances */}
          <div
            onPointerDown={(e) => handleResizeStart(e, 'nw')}
            className="hidden sm:flex absolute -top-1 -left-1 w-6 h-6 cursor-nwse-resize z-50 items-start justify-start p-1"
            title="Resize window"
            aria-hidden="true"
          />
          <div
            onPointerDown={(e) => handleResizeStart(e, 'n')}
            className="hidden sm:block absolute top-0 left-6 right-6 h-2 cursor-ns-resize z-40 hover:bg-terracotta/20 transition-colors"
            title="Resize vertically"
            aria-hidden="true"
          />
          <div
            onPointerDown={(e) => handleResizeStart(e, 'w')}
            className="hidden sm:block absolute left-0 top-6 bottom-6 w-2 cursor-ew-resize z-40 hover:bg-terracotta/20 transition-colors"
            title="Resize horizontally"
            aria-hidden="true"
          />
          <div
            onPointerDown={(e) => handleResizeStart(e, 'se')}
            className="hidden sm:flex absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 items-end justify-end p-1.5 text-terracotta opacity-70 hover:opacity-100 transition-opacity"
            title="Resize window"
            aria-hidden="true"
          >
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5">
              <line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="5" x2="5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="8" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Drag & Drop File Overlay */}
          {isDraggingFile && (
            <div className="absolute inset-0 z-50 bg-terracotta/95 dark:bg-terracotta/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white border-2 border-dashed border-white/70 animate-in fade-in duration-150 pointer-events-none select-none text-center">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-2.5 shadow-sm">
                {isAdmin ? <Upload className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white" />}
              </div>
              <span className="font-serif font-semibold text-sm tracking-wide">
                {isAdmin ? 'Drop file to attach' : 'Admin Privilege Required'}
              </span>
              <span className="font-mono text-[11px] text-white/90 mt-1 max-w-xs text-center">
                {isAdmin
                  ? 'Images (PNG, JPG, WEBP, GIF) · PDF · DOCX · Max 50 MB'
                  : 'Multimodal file analysis is reserved for administrator sessions. Please ask questions via text!'}
              </span>
            </div>
          )}

          {/* Mobile Sheet Handle Affordance (Tap or swipe up for fullscreen, swipe down to dismiss) */}
          <button
            type="button"
            onPointerDown={handleHeaderPointerDown}
            onClick={() => setIsExpandedMobile((prev) => !prev)}
            className="sm:hidden flex flex-col items-center justify-center pt-2.5 pb-1 w-full bg-light-surface-raised dark:bg-dark-surface-raised cursor-grab active:cursor-grabbing touch-none select-none border-none outline-hidden focus-visible:ring-1 focus-visible:ring-terracotta"
            aria-label={isExpandedMobile ? "Collapse chat sheet" : "Expand chat to fullscreen"}
          >
            <div className="w-10 h-1.5 rounded-full bg-light-ink-subtle/30 dark:bg-dark-ink-subtle/30 hover:bg-terracotta/50 transition-colors" />
          </button>

          {/* ─── MODAL HEADER ─── */}
          <div
            onPointerDown={handleHeaderPointerDown}
            className="relative z-30 flex items-center justify-between px-4 py-3 border-b border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-raised sm:cursor-grab active:cursor-grabbing select-none touch-none"
            title="Drag header to move or swipe down on mobile"
          >
            <div className="flex items-center gap-2.5">
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg bg-terracotta flex items-center justify-center text-white shadow-xs shrink-0 select-none cursor-default"
              >
                <span className="font-serif font-bold text-xs">問</span>
              </div>
              <div>
                <h3
                  id="ai-chat-title"
                  className="font-serif text-xs sm:text-sm font-semibold text-light-ink dark:text-dark-ink tracking-tight flex items-center gap-1.5"
                >
                  <span className="text-terracotta">問答</span>
                  <span className="text-light-ink-subtle dark:text-dark-ink-subtle font-mono text-xs">·</span>
                  <span>Vincent's AI Companion</span>
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-bamboo animate-pulse" />
                  <span className="font-mono text-[10px] tracking-wider text-light-ink-subtle dark:text-dark-ink-subtle uppercase">
                    {isStreaming
                      ? 'Synthesizing...'
                      : callerContext
                      ? `${callerContext.userType.toUpperCase()} · ONLINE`
                      : 'ONLINE · READY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Controls (Accessible touch boundaries) */}
            <div
              className="flex items-center gap-1"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {!isMobile && windowPos && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDockToCorner}
                      className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta hover:bg-terracotta/10 min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px]"
                      aria-label="Dock to bottom-right corner"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Dock to bottom-right corner</TooltipContent>
                </Tooltip>
              )}
              {isMobile && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsExpandedMobile((prev) => !prev)}
                      className="w-9 h-9 rounded-lg text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta hover:bg-terracotta/10 min-w-[36px] min-h-[36px]"
                      aria-label={isExpandedMobile ? "Collapse to standard view" : "Expand to fullscreen"}
                    >
                      {isExpandedMobile ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {isExpandedMobile ? "Collapse sheet" : "Expand fullscreen"}
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearHistory}
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta hover:bg-terracotta/10 min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px]"
                    aria-label="Refresh conversation thread"
                  >
                    <BroomIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Refresh conversation</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink hover:bg-terracotta/10 min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px]"
                    aria-label="Close assistant"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Close assistant (Esc)</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* ─── QUICK TOPIC PROMPTS (NON-CLIPPING HORIZONTAL SCROLLER) ─── */}
          <div className="relative z-30 px-3 py-2 border-b border-light-border/60 dark:border-dark-border/60 bg-light-surface-raised dark:bg-dark-surface-card overflow-x-auto scrollbar-none flex items-center gap-1.5 whitespace-nowrap">
            {UNIVERSAL_PROMPT_PILLS.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => handleSendMessage(pill.prompt)}
                disabled={isStreaming}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-3 sm:py-1 rounded-full border border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-raised hover:border-terracotta hover:text-terracotta text-light-ink dark:text-dark-ink text-[11px] font-sans transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-2xs cursor-pointer min-h-[38px] sm:min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-1"
              >
                <Sparkles className="w-3 h-3 text-terracotta" />
                <span>{pill.label}</span>
              </button>
            ))}
          </div>

          {/* Screen reader live announcement for status transitions */}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {isStreaming ? "Vincent's AI is synthesizing response..." : ""}
          </div>

          {/* ─── CHAT MESSAGES SCROLLER (SHADCN CANONICAL PRIMITIVES) ─── */}
          <MessageScrollerProvider autoScroll>
            <MessageScroller className="flex-1">
              <MessageScrollerViewport>
                <MessageScrollerContent className="pt-3">
                  {messages.map((msg) => {
                    if (msg.sender === 'system') {
                      return (
                        <MessageScrollerItem key={msg.id} messageId={msg.id}>
                          <Marker variant="separator">
                            <MarkerIcon>
                              <RotateCcw className="size-3" />
                            </MarkerIcon>
                            <MarkerContent>{msg.text}</MarkerContent>
                          </Marker>
                        </MessageScrollerItem>
                      );
                    }

                    const isAi = msg.sender === 'ai';

                    if (!isAi) {
                      return (
                        <MessageScrollerItem key={msg.id} messageId={msg.id} scrollAnchor>
                          <ChatBubble variant="sent">
                            <div className="flex flex-col items-end space-y-1">
                              <ChatBubbleTimestamp>{msg.timestamp}</ChatBubbleTimestamp>
                              <ChatBubbleMessage variant="sent">
                                {msg.attachmentName && (
                                  <div className="mb-2">
                                    <Attachment
                                      state="done"
                                      size="xs"
                                      className="bg-white/10 dark:bg-black/20 border-white/20 text-white"
                                    >
                                      <AttachmentMedia
                                        variant={msg.attachmentUrl ? 'image' : 'icon'}
                                        className="size-6 bg-white/20 text-white border-0 overflow-hidden"
                                      >
                                        {msg.attachmentUrl ? (
                                          <img
                                            src={msg.attachmentUrl}
                                            alt={msg.attachmentName}
                                            className="size-full object-cover"
                                          />
                                        ) : (
                                          <FileText className="size-3 text-white" />
                                        )}
                                      </AttachmentMedia>
                                      <AttachmentContent>
                                        <AttachmentTitle className="text-white text-[11px] truncate max-w-[160px]">
                                          {msg.attachmentName}
                                        </AttachmentTitle>
                                        <AttachmentDescription className="text-white/80 text-[10px]">
                                          ATTACHMENT
                                        </AttachmentDescription>
                                      </AttachmentContent>
                                    </Attachment>
                                  </div>
                                )}
                                {msg.text}
                              </ChatBubbleMessage>
                            </div>
                          </ChatBubble>
                        </MessageScrollerItem>
                      );
                    }

                    return (
                      <MessageScrollerItem key={msg.id} messageId={msg.id}>
                        <div className="flex flex-col space-y-1.5 animate-in fade-in duration-150">
                          {/* Assistant Identity Row */}
                          <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-terracotta flex items-center justify-center text-white text-[10px] font-serif font-bold shadow-2xs">
                        原
                      </div>
                      <span className="font-serif font-medium text-xs text-light-ink dark:text-dark-ink">
                        Vincent AI
                      </span>
                      {msg.userType && (
                        <Badge variant="terracotta" className="text-[10px] px-1.5 py-0 h-4">
                          {msg.userType}
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 font-mono ${
                          msg.telemetry?.isFallback
                            ? 'text-ochre border-ochre/40 bg-ochre/5'
                            : 'text-terracotta border-terracotta/40 bg-terracotta/5'
                        }`}
                      >
                        {msg.telemetry?.isFallback ? 'ARCHIVE' : 'GEMINI'}
                      </Badge>
                    </div>
                    <ChatBubbleTimestamp>{msg.timestamp}</ChatBubbleTimestamp>
                  </div>

                  {/* Clean Artisan Message Card (No Slop, No Giant Watermark, No Corner Bracket Clutter) */}
                  <div className="relative rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface-raised p-4 shadow-2xs group select-text">
                    {/* Copy Response Action */}
                    <div className="absolute top-2.5 right-2.5 z-20 flex items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(msg.text);
                              setCopiedMessageId(msg.id);
                              toast.success('Response copied to clipboard');
                              setTimeout(() => setCopiedMessageId(null), 2000);
                            }}
                            className="w-8 h-8 sm:w-7 sm:h-7 rounded-md text-light-ink-subtle hover:text-terracotta bg-light-surface/90 dark:bg-dark-surface/90 shadow-2xs min-w-[32px] min-h-[32px]"
                            aria-label="Copy response"
                          >
                            {copiedMessageId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-bamboo" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Copy response</TooltipContent>
                      </Tooltip>
                    </div>

                    <MarkdownRenderer content={msg.text} />

                    {/* Grounded Action Spec Card */}
                    {msg.specCard && (
                      <div className="mt-3 pt-2.5 border-t border-light-border/60 dark:border-dark-border/60">
                        <button
                          type="button"
                          onClick={() => handleActionClick(msg.specCard)}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface hover:border-terracotta transition-all text-left group/card cursor-pointer shadow-2xs"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <div className="w-6 h-6 rounded bg-terracotta flex items-center justify-center text-white shrink-0">
                              <Terminal className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted truncate">
                              {msg.specCard.title}
                            </span>
                          </div>
                          <span className="font-sans text-xs font-semibold text-terracotta group-hover/card:translate-x-0.5 transition-transform shrink-0">
                            {msg.specCard.actionText}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Optional Telemetry Inspector Drawer */}
                  {msg.telemetry && (
                    <div className="px-1">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedTelemetryId((prev) =>
                            prev === msg.id ? null : msg.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle hover:text-terracotta dark:hover:text-terracotta transition-colors py-0.5 cursor-pointer select-none"
                        aria-expanded={expandedTelemetryId === msg.id}
                        aria-label={expandedTelemetryId === msg.id ? 'Collapse telemetry drawer' : 'Inspect telemetry'}
                      >
                        <Activity className="w-3 h-3 text-terracotta" />
                        <span>{expandedTelemetryId === msg.id ? 'Hide Telemetry' : 'Inspect Telemetry'}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-150 ${
                            expandedTelemetryId === msg.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {expandedTelemetryId === msg.id && (
                        <div className="mt-1.5 p-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-raised text-[10px] font-mono space-y-1 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between text-light-ink-muted dark:text-dark-ink-muted">
                            <span>Engine:</span>
                            <span className="text-light-ink dark:text-dark-ink font-medium">{msg.telemetry.model}</span>
                          </div>
                          <div className="flex items-center justify-between text-light-ink-muted dark:text-dark-ink-muted">
                            <span>Latency:</span>
                            <span className="text-light-ink dark:text-dark-ink font-medium">{msg.telemetry.latencyMs} ms</span>
                          </div>
                          {msg.telemetry.tokensPerSec && (
                            <div className="flex items-center justify-between text-light-ink-muted dark:text-dark-ink-muted">
                              <span>Throughput:</span>
                              <span className="text-light-ink dark:text-dark-ink font-medium">~{msg.telemetry.tokensPerSec} tok/s</span>
                            </div>
                          )}
                          {msg.telemetry.interactionId && (
                            <div className="flex items-center justify-between text-light-ink-muted dark:text-dark-ink-muted">
                              <span>Thread:</span>
                              <span className="text-light-ink dark:text-dark-ink font-medium">{msg.telemetry.interactionId.slice(-8)}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-light-ink-muted dark:text-dark-ink-muted">
                            <span>Dispatch:</span>
                            <span className={msg.telemetry.isFallback ? 'text-ochre font-medium' : 'text-bamboo font-medium'}>
                              {msg.telemetry.isFallback ? 'Local Architectural Knowledge Base' : 'Live Agent Microservice'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </MessageScrollerItem>
            );
                  })}

                  {/* Live Streaming State */}
                  {isStreaming && (
                    <MessageScrollerItem messageId="streaming">
                      <div className="flex flex-col space-y-1.5 animate-in fade-in duration-150">
                        <div className="flex items-center gap-2 px-1">
                          <div className="w-5 h-5 rounded bg-terracotta flex items-center justify-center text-white text-[10px] font-serif font-bold">
                            原
                          </div>
                          <span className="font-serif font-medium text-xs text-light-ink dark:text-dark-ink">
                            Vincent AI
                          </span>
                          <Badge variant="terracotta" className="text-[10px] px-1.5 py-0 h-4 animate-pulse">
                            STREAMING
                          </Badge>
                        </div>

                        <div className="relative rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface-raised p-4 shadow-2xs select-text">
                          {displayedStreamingText ? (
                            <>
                              <MarkdownRenderer content={displayedStreamingText} />
                              <span className="inline-block w-1.5 h-3.5 bg-terracotta ml-1 animate-pulse align-middle" aria-hidden="true" />
                            </>
                          ) : (
                            <div className="flex items-center gap-2 text-xs font-mono text-light-ink-subtle dark:text-dark-ink-subtle py-1">
                              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
                              <span>Synthesizing response...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </MessageScrollerItem>
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>

          {/* ─── INPUT DOCK BAR ─── */}
          <div className="relative z-30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-raised">
            {/* Staged file preview with canonical shadcn Attachment */}
            {attachedFile && (
              <div className="mb-2 animate-in fade-in duration-150">
                <Attachment state="idle" size="sm">
                  <AttachmentMedia variant={filePreviewUrl ? 'image' : 'icon'}>
                    {filePreviewUrl ? (
                      <img
                        src={filePreviewUrl}
                        alt={attachedFile.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <FileText className="size-4" />
                    )}
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{attachedFile.name}</AttachmentTitle>
                    <AttachmentDescription>
                      {formatFileSize(attachedFile.size)} · {attachedFile.name.split('.').pop()?.toUpperCase() || 'FILE'} / 50 MB max
                    </AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction
                      onClick={() => setAttachedFile(null)}
                      title="Remove attachment"
                      aria-label="Remove attachment"
                    >
                      <X className="size-3.5" />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              </div>
            )}

            {/* Live speech dictation indicator */}
            {isAdmin && isSttListening && (
              <div className="mb-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-terracotta/10 border border-terracotta/20 text-xs text-terracotta animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-terracotta animate-ping shrink-0" />
                  <span className="font-sans font-medium text-[11px] sm:text-xs">
                    Listening to microphone... Speak to dictate.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => stopStt()}
                  className="font-mono text-[11px] underline hover:text-terracotta-hover transition-colors ml-2 cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-end rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface-card p-1.5 focus-within:border-terracotta focus-within:ring-1 focus-within:ring-terracotta/30 transition-all shadow-xs"
            >
              {isAdmin && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_FILE_TYPES_ATTR}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        validateAndStageFile(e.target.files[0]);
                      }
                      e.target.value = '';
                    }}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isStreaming}
                        className="w-9 h-9 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] rounded-lg shrink-0 mb-0.5 cursor-pointer text-light-ink-subtle hover:text-terracotta hover:bg-terracotta/10"
                        aria-label="Attach file (PNG, JPG, WEBP, GIF, PDF, DOCX up to 50 MB)"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start" sideOffset={6} className="max-w-xs text-xs">
                      Attach file (PNG, JPG, WEBP, GIF, PDF, DOCX · Max 50 MB)
                    </TooltipContent>
                  </Tooltip>
                </>
              )}

              <label htmlFor={inputId} className="sr-only">
                Ask about systems, code, or craft
              </label>
              <ChatInput
                id={inputId}
                ref={inputRef}
                value={inputValue}
                maxLength={800}
                onChange={(e) => setInputValue(e.target.value)}
                onEnterSubmit={() => handleSendMessage()}
                placeholder="Ask about systems, code, or craft... (Enter to send, Shift+Enter for newline)"
                disabled={isStreaming}
                className="py-1.5 px-2 text-xs sm:text-[13px]"
              />

              <div className="flex items-center gap-1.5 shrink-0 mb-0.5 pr-0.5">
                {inputValue.length > 0 && (
                  <span className="hidden sm:inline font-mono text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle select-none">
                    {inputValue.length}/800
                  </span>
                )}
                {/* Admin Speech-to-Text Dictation Button */}
                {isAdmin && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={async () => {
                          await toggleStt();
                        }}
                        disabled={isStreaming}
                        className={`w-9 h-9 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] rounded-lg shrink-0 transition-colors ${
                          isSttListening
                            ? 'text-terracotta bg-terracotta/20 ring-2 ring-terracotta/40 animate-pulse'
                            : 'text-light-ink-subtle hover:text-terracotta hover:bg-terracotta/10'
                        }`}
                        aria-label={
                          isSttListening
                            ? 'Stop voice dictation'
                            : isSttSupported
                            ? 'Dictate with voice (Admin STT)'
                            : 'Speech-to-text unavailable in this browser'
                        }
                      >
                        {isSttListening ? (
                          <MicOff className="w-4 h-4 text-terracotta animate-pulse" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isSttListening
                        ? 'Stop dictating (Admin STT)'
                        : isSttSupported
                        ? 'Dictate with voice (Admin STT)'
                        : 'Voice dictation requires Chrome/Edge'}
                    </TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      disabled={(!inputValue.trim() && !attachedFile) || isStreaming}
                      className="w-9 h-9 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] rounded-lg bg-terracotta hover:bg-terracotta-hover text-white flex items-center justify-center transition-transform active:scale-95 shrink-0 p-0 shadow-xs"
                      aria-label="Send query"
                    >
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Send query (Enter)</TooltipContent>
                </Tooltip>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
