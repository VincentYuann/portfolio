import React, { useState, useEffect } from 'react';
import { FileText, Code2, Download, Copy, Check, ExternalLink, ArrowLeft } from 'lucide-react';
import { tokenizeLatexLine, getTokenClassName } from '../../../lib/latexHighlight';
import { CornerBrackets } from '../../common/CornerBrackets';
import { VerticalMarginWidget, MARGIN_PRESETS } from '../../common/VerticalMarginWidget';
import { getResumePdfUrl, fetchResumeLatex } from '../../../lib/supabase';
import { ViewMode } from '../../../App';

interface ResumePageProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
}

const DEFAULT_RESUME_TEX = `%-------------------------
% Vincent Yuan - Professional Curriculum Vitae
% Full-Stack Software Engineering & Systems Architecture
%-------------------------

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
     \\textbf{Programming}{: Python, JavaScript, HTML, CSS, Tranquility (custom language)} \\\\
     \\textbf{Tools \\& Platforms}{: Git, GitLab, Pygame, Visual Studio Code, Replit, Thonny, Codio, CLI, Windows, Linux} \\\\
     \\textbf{Languages}{: Chinese (native), English (fluent)}
    }}
 \\end{itemize}

\\end{document}
`;

export const ResumePage: React.FC<ResumePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'latex'>('pdf');
  const [latexSource, setLatexSource] = useState(DEFAULT_RESUME_TEX);
  const [copied, setCopied] = useState(false);

  // Supabase S3-backed storage bucket PDF URL (with local / relative fallback)
  const supabasePdfUrl = getResumePdfUrl();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch live LaTeX from Supabase if available
    fetchResumeLatex().then((content) => {
      if (content) setLatexSource(content);
    });
  }, []);

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(latexSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = () => {
    const link = document.createElement('a');
    link.href = supabasePdfUrl;
    link.download = 'Vincent_Yuan_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTex = () => {
    const blob = new Blob([latexSource], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Vincent_Yuan_Resume.tex';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-clip">
      {/* Floating Vertical Margins in Left & Right Empty Spaces */}
      <VerticalMarginWidget
        side="left"
        top="top-72"
        {...MARGIN_PRESETS.seiJaku}
      />
      <VerticalMarginWidget
        side="right"
        top="top-96"
        type="calligraphy"
        motto="経歴の記録"
        submotto="CURRICULUM VITAE"
        coordinate="WATERLOO · TOKYO"
        stampChar="記"
        pulseColor="bamboo"
      />
      <VerticalMarginWidget
        side="left"
        top="top-[65%]"
        type="minimal"
        stampChar="証"
      />

      <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back navigation button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => onNavigate?.('home')}
            className="inline-flex items-center gap-2 font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio</span>
          </button>
        </div>

        {/* Top Header Section */}
        <div className="mb-8 sm:mb-10 pb-8 border-b border-light-border/70 dark:border-dark-border/80 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-serif text-terracotta text-sm">ARCHIVE //</span>
              <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                CURRICULUM VITAE · 履歴書
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal">
              Curriculum Vitae{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
                履歴書
              </span>
            </h1>
            <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 max-w-2xl font-light leading-relaxed">
              Complete technical qualifications, research background, and systems engineering experience of Vincent Yuan.
            </p>
          </div>

        {/* Action Controls & Format Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="bg-light-surface-muted dark:bg-dark-surface p-1 rounded-lg border border-light-border dark:border-dark-border flex items-center">
            <button
              onClick={() => setActiveTab('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans tracking-wide transition-all ${
                activeTab === 'pdf'
                  ? 'bg-light-surface-raised dark:bg-dark-surface-raised text-terracotta font-semibold shadow-xs'
                  : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Document</span>
            </button>
            <button
              onClick={() => setActiveTab('latex')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans tracking-wide transition-all ${
                activeTab === 'latex'
                  ? 'bg-light-surface-raised dark:bg-dark-surface-raised text-terracotta font-semibold shadow-xs'
                  : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>LaTeX Source (.tex)</span>
            </button>
          </div>

          {/* Download Action */}
          {activeTab === 'pdf' ? (
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-sans font-medium rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLatex}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-light-surface-raised dark:bg-dark-surface border border-light-border dark:border-dark-border text-xs font-sans text-light-ink dark:text-dark-ink rounded-lg hover:border-terracotta transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-bamboo" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy LaTeX'}</span>
              </button>
              <button
                onClick={handleDownloadTex}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-sans font-medium rounded-lg shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .tex</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Presentation Container */}
      <div className="w-full relative">
        {activeTab === 'pdf' ? (
          /* PDF Viewer Tab */
          <div className="interactive-card group relative bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl overflow-hidden shadow-akari dark:shadow-night-glow classical-card-frame">
            <CornerBrackets size="lg" />
            {/* Top Bar for PDF Viewer */}
            <div className="px-4 py-2.5 bg-light-surface-muted/90 dark:bg-dark-surface-muted border-b border-light-border dark:border-dark-border flex items-center justify-between text-xs text-light-ink-muted dark:text-dark-ink-muted">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-terracotta/70 inline-block" />
                <span className="font-mono">Vincent_Yuan_Resume.pdf</span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={supabasePdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open in New Window</span>
                </a>
              </div>
            </div>

            {/* Embedded PDF View */}
            <div className="w-full h-[780px] bg-light-canvas/40 dark:bg-dark-canvas/60 relative flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden">
              <object
                data={`${supabasePdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                type="application/pdf"
                className="w-full h-full rounded-lg border border-light-border/60 dark:border-dark-border"
              >
                {/* Fallback if browser cannot embed PDF */}
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-md mx-auto">
                  <FileText className="w-12 h-12 text-terracotta opacity-80" />
                  <h3 className="font-serif text-lg text-light-ink dark:text-dark-ink">
                    Resume Document Available
                  </h3>
                  <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed">
                    Your browser does not support inline PDF streaming. You can download the full PDF document directly or inspect the LaTeX source code.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDownloadPdf}
                      className="px-4 py-2 bg-terracotta text-white text-xs font-sans rounded-md shadow-xs"
                    >
                      Download Resume PDF
                    </button>
                    <button
                      onClick={() => setActiveTab('latex')}
                      className="px-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-xs font-sans text-light-ink dark:text-dark-ink rounded-md"
                    >
                      View LaTeX Source
                    </button>
                  </div>
                </div>
              </object>
            </div>
          </div>
        ) : (
          /* LaTeX Source Tab */
          <div className="interactive-card group relative bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl overflow-hidden shadow-akari dark:shadow-night-glow classical-card-frame">
            <CornerBrackets size="lg" />
            {/* Header with quick stats */}
            <div className="px-4 py-2.5 bg-light-surface-muted/90 dark:bg-dark-surface-muted border-b border-light-border dark:border-dark-border flex items-center justify-between text-xs text-light-ink-muted dark:text-dark-ink-muted">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-bamboo/70 inline-block" />
                <span className="font-mono">resume.tex (TeX / LaTeX 2e)</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span>{latexSource.split('\n').length} Lines</span>
                <span>•</span>
                <span>UTF-8</span>
              </div>
            </div>

            {/* Syntax Highlighted Code Viewer */}
            <div className="w-full max-h-[780px] overflow-auto p-4 sm:p-6 font-mono text-xs leading-relaxed bg-[#FDFCFA] dark:bg-[#0E0F12]">
              <pre className="table w-full">
                {latexSource.split('\n').map((line, idx) => {
                  const tokens = tokenizeLatexLine(line);
                  return (
                    <div key={idx} className="table-row hover:bg-light-surface-muted/40 dark:hover:bg-dark-surface-muted/30">
                      <span className="table-cell select-none pr-4 text-right opacity-30 text-[10px] w-10 align-top">
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
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
