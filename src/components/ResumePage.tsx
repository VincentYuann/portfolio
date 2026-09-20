import React, { useState, useEffect } from 'react';
import { FileText, Code2, Download, Copy, Check, ExternalLink, ArrowLeft } from 'lucide-react';
import { tokenizeLatexLine, getTokenClassName } from '../lib/latexHighlight';
import { HankoStamp } from './HankoStamp';
import { CornerBrackets } from './CornerBrackets';
import { VerticalMarginWidget, MARGIN_PRESETS } from './VerticalMarginWidget';
import { getResumePdfUrl, fetchResumeLatex } from '../lib/supabase';

interface ResumePageProps {
  onNavigate?: (view: 'home' | 'projects' | 'resume', sectionId?: string) => void;
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
      {Drexel University}{Philadelphia, PA}
      {Bachelor of Science in Computer Science}{Sept 2021 - June 2026}
      \\resumeItemListStart
        \\resumeItem{Concentrations: Systems Architecture, Artificial Intelligence}
        \\resumeItem{Relevant Coursework: Data Structures \\& Algorithms, Systems Architecture, Web Development, Object-Oriented Programming, Database Systems}
      \\resumeItemListEnd

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubheading
      {Software Engineering Intern}{Remote}
      {Dakdan Worldwide}{June 2023 - Sept 2023}
      \\resumeItemListStart
        \\resumeItem{Collaborated in agile sprint cycles to maintain web applications, streamline data flow, and improve frontend responsiveness.}
        \\resumeItem{Assisted in backend REST API integration, debugging client-side rendering bottlenecks, and optimizing assets.}
      \\resumeItemListEnd

  \\resumeSubheading
      {Hospitality \\& Team Lead}{Philadelphia, PA}
      {Service \\& Hospitality Roots}{2021 - Present}
      \\resumeItemListStart
        \\resumeItem{Cultivated rapid active listening, cross-functional team communication, and calm operational focus during high-stress peak rushes.}
        \\resumeItem{Applied user-first empathy to anticipate customer friction points, directly translating into human-centered UI/UX design.}
      \\resumeItemListEnd

%-----------PROJECTS-----------
\\section{Featured Engineering Projects}
  \\resumeProjectHeading
      {\\textbf{AnimY} $|$ \\emph{React, TypeScript, Node.js, REST APIs, Tailwind CSS}}{}
      \\resumeItemListStart
        \\resumeItem{Engineered a modern anime tracking and discovery platform featuring dynamic search, debounced filtering, and personalized watchlists.}
        \\resumeItem{Designed responsive Japanese-aesthetic UI with persistent state management and fast caching layers.}
      \\resumeItemListEnd

  \\resumeProjectHeading
      {\\textbf{FoodFinder} $|$ \\emph{React, JavaScript, Map APIs, Node.js, CSS Modules}}{}
      \\resumeItemListStart
        \\resumeItem{Built an intuitive restaurant exploration application with location-based filtering, interactive menus, and smart food search.}
        \\resumeItem{Integrated third-party geolocation and place details APIs to deliver streamlined dining recommendations.}
      \\resumeItemListEnd

  \\resumeProjectHeading
      {\\textbf{Portfolio Website} $|$ \\emph{React, TypeScript, Supabase, Tailwind CSS, Vite}}{}
      \\resumeItemListStart
        \\resumeItem{Crafted a high-performance personal engineering platform inspired by Japanese Sumi-e brushwork and Wabi-Sabi aesthetics.}
        \\resumeItem{Implemented an administrative CMS dashboard with Supabase auth, live preview, and deterministic state sync.}
      \\resumeItemListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: TypeScript, JavaScript, Python, C/C++, HTML5, CSS3, SQL} \\\\
     \\textbf{Frameworks \\& Libraries}{: React, Next.js, Node.js, Express, Tailwind CSS, Vite} \\\\
     \\textbf{Databases \\& Cloud}{: PostgreSQL, Supabase, Docker, RESTful APIs, Git, GitHub Actions, Linux} \\\\
     \\textbf{Core Competencies}{: Systems Architecture, Full-Stack Web Development, UI/UX Design, State Management}
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
        {/* Top Breadcrumb & Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-light-border dark:border-dark-border">
        <div>
          <button
            onClick={() => onNavigate?.('home')}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio</span>
          </button>
          <div className="flex items-center gap-3">
            <HankoStamp className="h-7 w-7" />
            <h1 className="font-serif text-3xl sm:text-4xl text-light-ink dark:text-dark-ink">
              Curriculum Vitae
            </h1>
            <span className="font-serif text-sm text-terracotta dark:text-ochre">履歴書</span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted mt-1 max-w-xl">
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
