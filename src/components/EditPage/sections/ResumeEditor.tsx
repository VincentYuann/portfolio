import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  FileText,
  X,
  FileCode2,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  supabase,
  uploadResumePdf,
  fetchResumeLatex,
  saveResumeLatex,
  formatErrorMessage,
  withTimeout,
} from '../../../lib/supabase';
import { toast } from 'sonner';
import { CornerBrackets } from '../../CornerBrackets';
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing LaTeX source on mount
  useEffect(() => {
    fetchResumeLatex().then((content) => {
      if (content) setLatex(content);
    });
  }, []);

  const resetResume = useCallback(() => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    fetchResumeLatex().then((content) => {
      if (content) setLatex(content);
      else setLatex(DEFAULT_LATEX_CV);
    });
  }, []);

  const handleSaveRef = useRef<() => void>(() => {});

  const { notifyDirty, notifyClean } = useAdminDirty('resume', resetResume, () => {
    handleSaveRef.current();
  });

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
          // 1. If a PDF is uploaded, push it to the S3-backed Supabase Storage bucket
          if (tab === 'upload' && uploadedFile && uploadedFile.name.toLowerCase().endsWith('.pdf')) {
            await uploadResumePdf(uploadedFile);
          }

          // 2. Persist current LaTeX source to database
          await saveResumeLatex(latex);
        })(),
        20000,
        'Save request timed out. Please check your network and try again.'
      );

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
  const charCount = latex.length;

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
            <TabsList className="h-9 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
              <TabsTrigger value="upload" className="text-xs px-3 gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-terracotta" />
                <span>Upload PDF</span>
              </TabsTrigger>
              <TabsTrigger value="editor" className="text-xs px-3 gap-1.5 cursor-pointer">
                <FileCode2 className="w-3.5 h-3.5 text-ochre" />
                <span>LaTeX Editor</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      {/* Upload Panel */}
      {tab === 'upload' && (
        <div className="relative bg-light-surface-card dark:bg-[#181920] border border-light-border dark:border-dark-border rounded-xl p-6 sm:p-8 shadow-xs classical-card-frame">
          <CornerBrackets size="md" />
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.tex,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploadedFile ? (
            <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg bg-light-surface dark:bg-dark-surface border border-bamboo/40">
              <FileText className="w-8 h-8 text-bamboo shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium text-light-ink dark:text-dark-ink truncate">
                  {uploadedFile.name}
                </p>
                <p className="font-mono text-[11px] text-light-ink-muted dark:text-dark-ink-muted mt-0.5">
                  {(uploadedFile.size / 1024).toFixed(1)} KB · Ready to sync with Supabase Storage
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUploadedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="h-8 w-8 p-0 text-light-ink-muted hover:text-red-500 shrink-0 cursor-pointer"
                aria-label="Remove uploaded file"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
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
              className="w-full flex flex-col items-center gap-2.5 sm:gap-3 py-8 sm:py-14 px-4 border-2 border-dashed border-light-border dark:border-dark-border rounded-xl hover:border-terracotta hover:bg-terracotta/5 transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta"
            >
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-light-ink-subtle dark:text-dark-ink-subtle group-hover:text-terracotta transition-colors" />
              <div className="text-center">
                <p className="font-sans text-xs sm:text-sm text-light-ink dark:text-dark-ink font-medium">
                  Click or drag PDF / .tex file here
                </p>
                <p className="font-sans text-[11px] sm:text-xs text-light-ink-muted dark:text-dark-ink-muted mt-1">
                  Accepts .pdf, .tex, .txt up to 10 MB
                </p>
              </div>
            </div>
          )}

          <p className="mt-3.5 font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted">
            Uploading a <code className="font-mono bg-light-surface dark:bg-dark-surface px-1 py-0.5 rounded border border-light-border dark:border-dark-border">.tex</code> file will populate the LaTeX editor directly.
          </p>
        </div>
      )}

      {/* LaTeX Code Editor */}
      {tab === 'editor' && (
        <div className="relative bg-light-surface-card dark:bg-[#181920] border border-light-border dark:border-dark-border rounded-xl shadow-xs overflow-hidden classical-card-frame">
          <CornerBrackets size="md" />
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 bg-light-surface/90 dark:bg-dark-surface/90 border-b border-light-border dark:border-dark-border flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <FileCode2 className="w-3.5 h-3.5 text-terracotta" />
                <span className="font-mono text-xs text-light-ink font-medium dark:text-dark-ink">
                  resume.tex
                </span>
              </div>
              <span className="text-light-ink-subtle text-xs">·</span>
              <span className="font-mono text-[10px] text-light-ink-muted dark:text-dark-ink-muted truncate">
                {lineCount} lines · {charCount} chars
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPreviewMode((v) => !v)}
              className="gap-1.5 h-7 text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta cursor-pointer"
            >
              {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{previewMode ? 'Code Mode' : 'Preview Mode'}</span>
            </Button>
          </div>

          {previewMode ? (
            <pre className="p-5 font-mono text-xs text-light-ink dark:text-dark-ink leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[60vh] bg-light-surface/30 dark:bg-dark-surface/30">
              {latex}
            </pre>
          ) : (
            <textarea
              value={latex}
              onChange={(e) => {
                notifyDirty();
                setLatex(e.target.value);
              }}
              className="w-full p-5 font-mono text-xs text-light-ink dark:text-dark-ink bg-transparent resize-none focus:outline-none leading-relaxed selection:bg-terracotta/20 selection:text-terracotta"
              style={{ minHeight: '60vh' }}
              spellCheck={false}
              placeholder="Write or paste your LaTeX resume code…"
              aria-label="LaTeX Resume Code"
            />
          )}
        </div>
      )}
    </div>
  );
};
