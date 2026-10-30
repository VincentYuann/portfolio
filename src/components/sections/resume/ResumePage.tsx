import React, { useState, useEffect } from 'react';
import { FileText, Code2, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { LatexCodeViewer } from '../../common/LatexCodeViewer';
import { DEFAULT_RESUME_LATEX } from '../../../lib/constants';
import { getResumePdfUrl, fetchResumeData } from '../../../lib/supabase';
import { ViewMode } from '../../../App';
import { Card } from '../../ui/card';
import { PageContainer } from '../../common/PageContainer';
import { ReturnToPortfolio } from '../../common/ReturnToPortfolio';
import { SubpageHeader } from '../../common/SubpageHeader';

interface ResumePageProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
}

export const ResumePage: React.FC<ResumePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'latex'>('pdf');
  const [latexSource, setLatexSource] = useState(DEFAULT_RESUME_LATEX);
  const [copied, setCopied] = useState(false);

  // Supabase S3-backed storage bucket PDF URL (with live DB + local fallback)
  const [supabasePdfUrl, setSupabasePdfUrl] = useState(getResumePdfUrl());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch live LaTeX and S3 resume link from Supabase
    fetchResumeData().then((data) => {
      if (data?.latex) setLatexSource(data.latex);
      if (data?.resumeLink) setSupabasePdfUrl(data.resumeLink);
    });
  }, []);

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(latexSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(supabasePdfUrl, { cache: 'no-cache' });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Vincent_Yuan_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {
      window.open(supabasePdfUrl, '_blank');
    }
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
      {/* 16:9 Washi Paper Ground & Sumi-e Bamboo Art (Editorial CV Foundation) */}
      
      <PageContainer className="pt-20 sm:pt-28 pb-16 sm:pb-20 relative z-10">
        {/* Back navigation button */}
        <ReturnToPortfolio onNavigate={onNavigate} />

        {/* Top Header Section */}
        <SubpageHeader
          archiveKicker="Archive //"
          categoryTag="Curriculum Vitae · 履歴書"
          title="Curriculum Vitae"
          kanjiSubtitle="履歴書"
          description="Complete technical qualifications, research background, and systems engineering experience of Vincent Yuan."
          actions={
            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Mode Switcher */}
              <div className="bg-light-surface-muted dark:bg-dark-surface p-1 rounded-[3px] border border-light-border dark:border-dark-border flex items-center">
                <button
                  onClick={() => setActiveTab('pdf')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-sans tracking-wide transition-all ${
                    activeTab === 'pdf'
                      ? 'bg-light-surface-raised dark:bg-dark-surface-raised text-terracotta dark:text-ochre font-semibold shadow-xs'
                      : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF Document</span>
                </button>
                <button
                  onClick={() => setActiveTab('latex')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-sans tracking-wide transition-all ${
                    activeTab === 'latex'
                      ? 'bg-light-surface-raised dark:bg-dark-surface-raised text-terracotta dark:text-ochre font-semibold shadow-xs'
                      : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>LaTeX Source</span>
                </button>
              </div>

              {/* Quick Actions */}
              {activeTab === 'latex' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLatex}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-light-surface-raised dark:bg-dark-surface border border-light-border dark:border-dark-border text-xs font-sans text-light-ink dark:text-dark-ink rounded-[2px] hover:border-light-border-strong dark:hover:border-dark-border-strong transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-bamboo" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy LaTeX'}</span>
                  </button>
                  <button
                    onClick={handleDownloadTex}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-terracotta dark:bg-ochre hover:bg-terracotta-hover dark:hover:bg-[#C29845] text-white dark:text-[#121316] text-xs font-sans font-medium rounded-[2px] shadow-sm transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .tex</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta dark:bg-ochre hover:bg-terracotta-hover dark:hover:bg-[#C29845] text-white dark:text-[#121316] text-xs font-sans font-medium rounded-[2px] shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Official PDF</span>
                </button>
              )}
            </div>
          }
        />

        {/* Main Presentation Container - Balanced Proportions & Generous Desktop Vertical View */}
        <div className="w-full max-w-[1100px] 2xl:max-w-[1180px] mx-auto relative transition-all duration-300">
          {activeTab === 'pdf' && (
            /* PDF Document Tab */
            <Card variant="craft" withEnso ensoSize={120}>

              {/* Top Bar for PDF Viewer */}
              <div className="px-4 py-2.5 bg-light-surface-muted/90 dark:bg-dark-surface-muted border-b border-light-border dark:border-dark-border flex items-center justify-between text-xs text-light-ink-muted dark:text-dark-ink-muted rounded-t-[3px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-terracotta/70 dark:bg-ochre/70 inline-block" />
                  <span className="font-mono">Vincent_Yuan_Resume.pdf</span>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={supabasePdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta dark:hover:text-ochre transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open in New Window</span>
                  </a>
                </div>
              </div>

              {/* Embedded PDF View with Desktop Full Vertical View */}
              <div className="w-full h-[750px] sm:h-[880px] md:h-[1050px] lg:h-[1160px] xl:h-[1200px] bg-light-canvas/40 dark:bg-dark-canvas/60 relative flex flex-col items-center justify-center p-0 overflow-hidden">
                <object
                  data={`${supabasePdfUrl}#view=Fit&toolbar=1&navpanes=0`}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  {/* Fallback if browser cannot embed PDF */}
                  <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-md mx-auto">
                    <FileText className="w-12 h-12 text-terracotta dark:text-ochre opacity-80" />
                    <h3 className="font-serif text-lg text-light-ink dark:text-dark-ink">
                      Resume Document Available
                    </h3>
                    <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed">
                      Your browser does not support inline PDF streaming. You can download the full PDF document directly or inspect the LaTeX source code.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleDownloadPdf}
                        className="px-4 py-2 bg-terracotta dark:bg-ochre hover:bg-terracotta-hover dark:hover:bg-[#C29845] text-white dark:text-[#121316] text-xs font-sans rounded-[2px] shadow-xs cursor-pointer"
                      >
                        Download Resume PDF
                      </button>
                      <button
                        onClick={() => setActiveTab('latex')}
                        className="px-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-xs font-sans text-light-ink dark:text-dark-ink rounded-[2px] cursor-pointer"
                      >
                        View LaTeX Source
                      </button>
                    </div>
                  </div>
                </object>
              </div>
            </Card>
          )}

          {activeTab === 'latex' && (
            /* LaTeX Source Tab */
            <Card variant="craft" withEnso ensoSize={120}>

              {/* Header with quick stats */}
              <div className="px-4 py-2.5 bg-light-surface-muted/90 dark:bg-dark-surface-muted border-b border-light-border dark:border-dark-border flex items-center justify-between text-xs text-light-ink-muted dark:text-dark-ink-muted rounded-t-[3px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-bamboo/70 inline-block" />
                  <span className="font-mono">resume.tex (TeX / LaTeX 2e)</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span>{latexSource.split('\n').length} Lines</span>
                  <span>•</span>
                  <span>UTF-8</span>
                </div>
              </div>

              {/* Syntax Highlighted Code Viewer */}
              <LatexCodeViewer code={latexSource} />
            </Card>
          )}
        </div>
      </PageContainer>
    </div>
  );
};
