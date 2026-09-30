import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  X,
  FileCode2,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  Download,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import {
  supabase,
  uploadResumePdf,
  fetchResumeData,
  saveResumeLatex,
  getResumePdfUrl,
  formatErrorMessage,
  withTimeout,
} from '../../../lib/supabase';
import { tokenizeLatexLine, getTokenClassName } from '../../../lib/latexHighlight';
import { toast } from 'sonner';
import { CornerBrackets } from '../../common/CornerBrackets';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { useAdminDirty } from '../shared/useAdminDirty';
import { Button } from '../../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';

type Tab = 'upload' | 'editor';

const DEFAULT_LATEX_CV = `% -- Vincent Yuan: Curriculum Vitae ----------------------------------
\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape Vincent Yuan} \\\\ \\vspace{1pt}
    \\small Full-Stack Software Engineer $\\cdot$ Systems Architecture \\& AI $\\cdot$ Philadelphia, PA \\\\ \\vspace{1pt}
    \\href{mailto:vincentyuan1020@gmail.com}{\\underline{vincentyuan1020@gmail.com}} $|$ 
    \\href{https://github.com/VincentYuann}{\\underline{github.com/VincentYuann}} $|$
    \\href{https://linkedin.com}{\\underline{linkedin.com}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubheading
      {Drexel University -- College of Computing \\& Informatics}{Philadelphia, PA}
      {Bachelor of Science in Computer Science $|$ GPA: 3.69/4.0}{Anticipated Graduation: June 2029}
      \\resumeItemListStart
        \\resumeItem{Relevant Coursework: Computing \\& Informatics Design I--III, Computer Programming I \\& II, Calculus I--IV, Linear Algebra, Physics I \\& II}
      \\resumeItemListEnd

%-----------PROJECTS-----------
\\section{Projects}
  \\resumeProjectHeading
      {\\textbf{Ascension} $|$ \\emph{Python, Pygame, Git, GitLab, Thonny}}{Jan 2025 -- June 2025}
      \\resumeItemListStart
        \\resumeItem{Contribute to level design, gameplay mechanics, character animations, and sound integration for a 2D Foddian-style platformer developed by a team of four.}
        \\resumeItem{Apply object-oriented programming in Python and Pygame to encapsulate complex functionality, improve readability, and create reusable blueprints in the code design.}
        \\resumeItem{Practice Agile development by setting weekly goals, conducting team meetings to review progress, resolve challenges, and plan upcoming iterations.}
        \\resumeItem{Use GitLab for version control and collaboration, maintain a Kanban board for task management and a wiki page to document team progress.}
      \\resumeItemListEnd

  \\resumeProjectHeading
      {\\textbf{Virtual Pet Machine} $|$ \\emph{Tranquility, HTML, CSS, Linux}}{Dec 2024}
      \\resumeItemListStart
        \\resumeItem{Developed a web-based virtual pet using a finite state machine model that responds to user clicks with varied behaviors.}
        \\resumeItem{Used SSH to connect to Drexel's Tux server, performing file management and editing directly in the Linux terminal.}
        \\resumeItem{Programmed nested and timed logic structures in Tranquility to simulate complex pet state transitions.}
      \\resumeItemListEnd

  \\resumeProjectHeading
      {\\textbf{John's Farmer Market} $|$ \\emph{JavaScript, HTML, CSS, Replit}}{Mar 2023 -- Apr 2023}
      \\resumeItemListStart
        \\resumeItem{Developed a simulated online food market on Replit in a team of three, contributing to user login, checkout functionality, and coupon-based discounts.}
        \\resumeItem{Coded JavaScript logic for a static login system with preset credentials and limited coupon validation, triggering a UI transition upon successful authentication.}
        \\resumeItem{Structured and styled a visually appealing login interface using HTML and CSS.}
      \\resumeItemListEnd

  \\resumeProjectHeading
      {\\textbf{Card Game} $|$ \\emph{JavaScript, HTML, CSS, Replit}}{Dec 2022 -- Jan 2023}
      \\resumeItemListStart
        \\resumeItem{Created a narrative card game with branching story paths driven by player choices and conditional logic.}
        \\resumeItem{Programmed dynamic stat tracking (e.g., health, currency) and game-over conditions using JavaScript.}
        \\resumeItem{Designed intuitive UI elements to present story, cards, and decisions using HTML and CSS.}
      \\resumeItemListEnd

%-----------EXPERIENCE-----------
\\section{Work Experiences}
  \\resumeSubheading
      {Kung Fu Tea}{Philadelphia, PA}
      {Barista \\& Cashier}{Aug 2022 -- Present}
      \\resumeItemListStart
        \\resumeItem{Prepare and customize a variety of beverages while ensuring consistent and high-quality standards.}
        \\resumeItem{Handle cash and card transactions using POS system, managing high volume sales with accuracy.}
        \\resumeItem{Provide exceptional customer service by addressing inquiries and assisting with orders.}
      \\resumeItemListEnd

  \\resumeSubheading
      {Hung Vuong Supermarket}{Philadelphia, PA}
      {Stocker}{June 2020 -- Dec 2020}
      \\resumeItemListStart
        \\resumeItem{Maintained optimal on-shelf product availability across high-traffic aisles, rapidly replenishing stock during peak shopping periods with meticulous attention to detail.}
        \\resumeItem{Streamlined warehouse staging and backroom inventory operations by unloading incoming freight shipments, organizing pallet storage, and practicing strict FIFO rotation.}
        \\resumeItem{Upheld rigorous store safety, hazard prevention, and sanitation standards to maintain an organized, clean, and accessible shopping environment for hundreds of daily customers.}
      \\resumeItemListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: JavaScript, TypeScript, Python, HTML/CSS, SQL, C/C++, Java} \\\\
     \\textbf{Frameworks}{: React, Next.js, Node.js, Tailwind CSS, Express, Fastify, Pygame} \\\\
     \\textbf{Developer Tools}{: Git, GitHub, GitLab, Docker, Supabase, PostgreSQL, Linux, VS Code} \\\\
     \\textbf{Libraries}{: Three.js, Lucide Icons, Framer Motion, TanStack Query, Radix UI}
    }}
 \\end{itemize}

\\end{document}
`;

export const ResumeEditor: React.FC = () => {
  const [tab, setTab] = useState<Tab>('upload');
  const [latex, setLatex] = useState(DEFAULT_LATEX_CV);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>(getResumePdfUrl());
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [stagedPreviewUrl, setStagedPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load live existing LaTeX source & live PDF URL on mount
  useEffect(() => {
    fetchResumeData().then((data) => {
      if (data?.latex) setLatex(data.latex);
      if (data?.resumeLink) setCurrentPdfUrl(data.resumeLink);
    });
  }, []);

  // Clean up staged blob URL when component unmounts or staged file changes
  useEffect(() => {
    return () => {
      if (stagedPreviewUrl && stagedPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(stagedPreviewUrl);
      }
    };
  }, [stagedPreviewUrl]);

  const clearStagedFile = useCallback(() => {
    if (stagedPreviewUrl && stagedPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(stagedPreviewUrl);
    }
    setStagedPreviewUrl(null);
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [stagedPreviewUrl]);

  const resetResume = useCallback(() => {
    clearStagedFile();
    fetchResumeData().then((data) => {
      if (data?.latex) setLatex(data.latex);
      else setLatex(DEFAULT_LATEX_CV);
      if (data?.resumeLink) setCurrentPdfUrl(data.resumeLink);
    });
  }, [clearStagedFile]);

  const handleSaveRef = useRef<() => void>(() => {});

  const { notifyDirty, notifyClean } = useAdminDirty('resume', resetResume, () => {
    handleSaveRef.current();
  });

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    toast.success('LaTeX source copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTex = () => {
    const blob = new Blob([latex], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Vincent_Yuan_Resume.tex';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['.pdf', '.tex', '.txt'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      toast.error('Only .pdf, .tex, or .txt files are accepted.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10 MB.');
      return;
    }

    notifyDirty();
    setUploadedFile(file);

    // If it's a PDF, create a temporary preview URL so admin can inspect before publishing
    if (ext === '.pdf') {
      if (stagedPreviewUrl && stagedPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(stagedPreviewUrl);
      }
      const localUrl = URL.createObjectURL(file);
      setStagedPreviewUrl(localUrl);
      toast.info(`Staged "${file.name}". Click 'Save & Publish PDF' to publish to website.`);
    }

    // If it's a .tex or .txt, read contents directly into editor
    if (ext === '.tex' || ext === '.txt') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setLatex(ev.target.result as string);
          setTab('editor');
          toast.info('Loaded LaTeX source into editor!');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSave = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');

    try {
      if (!supabase) throw new Error('Supabase client is not configured.');

      await withTimeout(
        (async () => {
          let uploadedUrl: string | undefined = undefined;
          // 1. If a PDF is uploaded, push it to the S3-backed Supabase Storage bucket
          if (tab === 'upload' && uploadedFile && uploadedFile.name.toLowerCase().endsWith('.pdf')) {
            uploadedUrl = await uploadResumePdf(uploadedFile);
            if (uploadedUrl) {
              setCurrentPdfUrl(uploadedUrl);
            }
          }

          // 2. Persist current LaTeX source and S3 resume link to database
          await saveResumeLatex(latex, uploadedUrl);
        })(),
        20000,
        'Save request timed out. Please check your network and try again.'
      );

      clearStagedFile();
      notifyClean();
      setSaveState('success');
      toast.success('Resume PDF & LaTeX source saved to Supabase!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      setSaveState('error');
      toast.error('Failed to save resume: ' + formatErrorMessage(err));
      setTimeout(() => setSaveState('idle'), 8000);
    }
  };

  handleSaveRef.current = handleSave;

  const lineCount = latex.split('\n').length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Universal Section Header */}
      <EditorSectionHeader
        title="Resume & Curriculum Vitae"
        subtitle="Manage compiled PDF documents and synchronize live LaTeX source code."
        saveState={saveState}
        onSave={handleSave}
        saveLabel={tab === 'upload' ? 'Save & Publish PDF' : 'Save LaTeX Code'}
        extraActions={
          <Tabs
            value={tab}
            onValueChange={(val) => setTab(val as Tab)}
            className="w-auto shrink-0"
          >
            <TabsList className="h-9 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-[3px]">
              <TabsTrigger value="upload" className="text-xs px-3 gap-1.5 cursor-pointer rounded-[2px]">
                <Upload className="w-3.5 h-3.5 text-terracotta dark:text-[#D4A853]" />
                <span>Upload PDF</span>
              </TabsTrigger>
              <TabsTrigger value="editor" className="text-xs px-3 gap-1.5 cursor-pointer rounded-[2px]">
                <FileCode2 className="w-3.5 h-3.5 text-ochre" />
                <span>LaTeX Editor</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      {/* Upload & Published PDF Panel */}
      {tab === 'upload' && (
        <div className="relative pt-1 space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.tex,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Staged New Upload Card */}
          {uploadedFile && (
            <div className="flex flex-col gap-4 p-5 rounded-[3px] bg-light-surface-card dark:bg-dark-surface-card border-2 border-dashed border-bamboo/60 shadow-2xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-[2px] bg-bamboo/10 dark:bg-bamboo/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-bamboo" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-2xs uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-bamboo/10 text-bamboo font-semibold">
                        Staged for Publishing
                      </span>
                    </div>
                    <p className="font-sans text-sm font-semibold text-light-ink dark:text-dark-ink truncate mt-0.5">
                      {uploadedFile.name}
                    </p>
                    <p className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted">
                      {(uploadedFile.size / 1024).toFixed(1)} KB · Ready to publish to Supabase Storage
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearStagedFile}
                  className="h-8 px-2.5 text-xs text-light-ink-muted hover:text-red-500 rounded-[2px] cursor-pointer gap-1"
                  aria-label="Cancel staged upload"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cancel</span>
                </Button>
              </div>

              {/* Staged Preview Frame */}
              {stagedPreviewUrl && (
                <div className="w-full rounded-[2px] overflow-hidden border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
                  <div className="flex items-center justify-between px-3 py-2 bg-light-surface-raised dark:bg-dark-surface-raised border-b border-light-border dark:border-dark-border text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />
                      <span>Staged Document Preview</span>
                    </span>
                    <a
                      href={stagedPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-light-ink dark:hover:text-dark-ink transition-colors"
                    >
                      <span>Open Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <iframe
                    src={stagedPreviewUrl}
                    title="Staged PDF Preview"
                    className="w-full h-[450px] border-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Upload Dropzone */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className="w-full flex flex-col items-center gap-2.5 sm:gap-3 py-8 sm:py-10 px-4 border-2 border-dashed border-light-border dark:border-dark-border rounded-[3px] hover:border-terracotta dark:hover:border-ochre hover:bg-terracotta/5 dark:hover:bg-ochre/5 transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta dark:focus:ring-ochre"
          >
            <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-light-ink-subtle dark:text-dark-ink-subtle group-hover:text-terracotta dark:group-hover:text-ochre transition-colors" />
            <div className="text-center">
              <p className="font-sans text-xs sm:text-sm text-light-ink dark:text-dark-ink font-medium">
                {uploadedFile ? 'Click or drag to select a different PDF' : 'Click or drag PDF / .tex file here to upload'}
              </p>
              <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mt-1">
                Accepts .pdf, .tex, .txt up to 10 MB
              </p>
            </div>
          </div>

          {/* Active Live Published PDF Panel */}
          {currentPdfUrl && (
            <div className="relative bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-light-border/60 dark:border-dark-border/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-bamboo animate-pulse" />
                    <span className="font-mono text-2xs uppercase tracking-widest text-bamboo font-semibold">
                      Live Published Resume Document · 公開中
                    </span>
                  </div>
                  <h3 className="font-sans text-sm font-semibold text-light-ink dark:text-dark-ink mt-1">
                    Vincent_Yuan_Resume.pdf
                  </h3>
                  <p className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted truncate max-w-lg mt-0.5">
                    {currentPdfUrl}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={currentPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-[#D4A853]/60 text-light-ink dark:text-dark-ink text-xs font-mono transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-terracotta dark:text-[#D4A853]" />
                    <span>View Live PDF</span>
                  </a>
                  <a
                    href={currentPdfUrl}
                    download="Vincent_Yuan_Resume.pdf"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-[#D4A853]/60 text-light-ink dark:text-dark-ink text-xs font-mono transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                </div>
              </div>

              {/* Embedded Live PDF Document Viewer */}
              <div className="w-full rounded-[2px] overflow-hidden border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
                <iframe
                  src={currentPdfUrl}
                  title="Current Published Resume PDF"
                  className="w-full h-[520px] border-none"
                />
              </div>
            </div>
          )}

          <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted">
            Uploading a <code className="font-mono bg-light-surface dark:bg-dark-surface px-1 py-0.5 rounded-[2px] border border-light-border dark:border-dark-border">.tex</code> file will populate the LaTeX editor directly.
          </p>
        </div>
      )}

      {/* LaTeX Code Editor & Syntax-Highlighted Themed Viewer */}
      {tab === 'editor' && (
        <div className="relative bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] shadow-xs overflow-hidden classical-card-frame">
          <CornerBrackets size="md" />

          {/* Editor Header Bar (Unified with ResumePage.tsx) */}
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 bg-light-surface/90 dark:bg-dark-surface/90 border-b border-light-border dark:border-dark-border flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-bamboo/70 inline-block" />
                <span className="font-mono text-xs text-light-ink font-semibold dark:text-dark-ink">
                  resume.tex (TeX / LaTeX 2e)
                </span>
              </div>
              <span className="text-light-ink-subtle text-xs">·</span>
              <span className="font-mono text-2xs text-light-ink-muted dark:text-dark-ink-muted truncate">
                {lineCount} lines · UTF-8
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyLatex}
                className="gap-1 h-7 text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink cursor-pointer rounded-[2px]"
                title="Copy LaTeX source"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-bamboo" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDownloadTex}
                className="gap-1 h-7 text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink cursor-pointer rounded-[2px]"
                title="Download .tex file"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download .tex</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPreviewMode((v) => !v)}
                className="gap-1.5 h-7 text-xs bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink hover:border-terracotta dark:hover:border-ochre cursor-pointer rounded-[2px] shadow-2xs"
              >
                {previewMode ? <EyeOff className="w-3.5 h-3.5 text-ochre" /> : <Eye className="w-3.5 h-3.5 text-terracotta" />}
                <span>{previewMode ? 'Raw Code Editor' : 'Themed Syntax Viewer'}</span>
              </Button>
            </div>
          </div>

          {previewMode ? (
            /* Syntax Highlighted Themed Viewer (Single Source of Truth match to ResumePage) */
            <div className="w-full max-h-[70vh] overflow-auto p-4 sm:p-6 font-mono text-xs leading-relaxed bg-[#FDFCFA] dark:bg-[#18191D]">
              <pre className="table w-full">
                {latex.split('\n').map((line, idx) => {
                  const tokens = tokenizeLatexLine(line);
                  return (
                    <div key={idx} className="table-row hover:bg-light-surface-muted/40 dark:hover:bg-dark-surface-muted/30">
                      <span className="table-cell select-none pr-4 text-right opacity-30 text-2xs w-10 align-top font-mono">
                        {idx + 1}
                      </span>
                      <span className="table-cell whitespace-pre-wrap break-all">
                        {tokens.map((token, tIdx) => (
                          <span key={tIdx} className={getTokenClassName(token.type)}>
                            {token.text}
                          </span>
                        ))}
                      </span>
                    </div>
                  );
                })}
              </pre>
            </div>
          ) : (
            /* Live Raw Code Editor with Line Gutter */
            <div className="flex bg-[#FDFCFA] dark:bg-[#18191D] max-h-[70vh] overflow-hidden">
              <div className="select-none py-5 px-3 bg-light-surface/40 dark:bg-dark-surface/40 border-r border-light-border/40 dark:border-dark-border/40 text-right font-mono text-2xs text-light-ink-muted/50 dark:text-dark-ink-muted/50 leading-relaxed min-w-[3rem] overflow-hidden">
                {latex.split('\n').map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>
              <textarea
                value={latex}
                onChange={(e) => {
                  notifyDirty();
                  setLatex(e.target.value);
                }}
                className="w-full p-5 font-mono text-xs text-light-ink dark:text-dark-ink bg-transparent resize-none focus:outline-none leading-relaxed selection:bg-terracotta/20 selection:text-terracotta overflow-y-auto"
                style={{ minHeight: '65vh' }}
                spellCheck={false}
                placeholder="Write or paste your LaTeX resume code…"
                aria-label="LaTeX Resume Code"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

