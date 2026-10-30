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
import { LatexCodeViewer } from '../../common/LatexCodeViewer';
import { DEFAULT_RESUME_LATEX } from '../../../lib/constants';
import { toast } from 'sonner';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { useAdminDirty } from '../shared/useAdminDirty';
import { Button } from '../../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';

type Tab = 'upload' | 'editor';

export const ResumeEditor: React.FC = () => {
  const [tab, setTab] = useState<Tab>('upload');
  const [latex, setLatex] = useState(DEFAULT_RESUME_LATEX);
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
      else setLatex(DEFAULT_RESUME_LATEX);
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

      let uploadedUrl: string | undefined = undefined;

      await withTimeout(
        (async () => {
          // 1. If a PDF is uploaded, push it to the S3-backed Supabase Storage bucket
          if (uploadedFile && uploadedFile.name.toLowerCase().endsWith('.pdf')) {
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
      toast.success(
        uploadedUrl
          ? 'New Resume PDF published! Changes are live across the website.'
          : 'Resume saved to Supabase!'
      );
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
                <Upload className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />
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

      {/* Upload & Published PDF Panel (Split-Pane Studio Workstation) */}
      {tab === 'upload' && (
        <div className="relative pt-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.tex,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Controls, Upload Dropzone & Document Specs */}
            <div className="lg:col-span-4 xl:col-span-4 space-y-5 lg:sticky lg:top-24">
              {/* Staged New Upload Card */}
              {uploadedFile && (
                <div className="flex flex-col gap-3 p-4 rounded-[3px] bg-light-surface-card dark:bg-dark-surface-card border-2 border-dashed border-bamboo/60 shadow-2xs">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-[2px] bg-bamboo/10 dark:bg-bamboo/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-bamboo" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-2xs uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] bg-bamboo/10 text-bamboo font-semibold">
                          Staged for Publishing
                        </span>
                        <p className="font-sans text-xs font-semibold text-light-ink dark:text-dark-ink truncate mt-0.5">
                          {uploadedFile.name}
                        </p>
                        <p className="font-mono text-2xs text-light-ink-muted dark:text-dark-ink-muted">
                          {(uploadedFile.size / 1024).toFixed(1)} KB · Ready to save
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearStagedFile}
                      className="h-7 px-2 text-xs text-light-ink-muted hover:text-red-500 rounded-[2px] cursor-pointer gap-1"
                      aria-label="Cancel staged upload"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </Button>
                  </div>
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
                className="w-full flex flex-col items-center gap-2 py-7 px-4 border-2 border-dashed border-light-border dark:border-dark-border rounded-[3px] hover:border-terracotta dark:hover:border-ochre hover:bg-terracotta/5 dark:hover:bg-ochre/5 transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta dark:focus:ring-ochre text-center"
              >
                <Upload className="w-7 h-7 text-light-ink-subtle dark:text-dark-ink-subtle group-hover:text-terracotta dark:group-hover:text-ochre transition-colors" />
                <div>
                  <p className="font-sans text-xs sm:text-sm text-light-ink dark:text-dark-ink font-medium">
                    {uploadedFile ? 'Select a different file' : 'Click or drop PDF / .tex here'}
                  </p>
                  <p className="font-mono text-2xs text-light-ink-muted dark:text-dark-ink-muted mt-1">
                    Accepts .pdf, .tex, .txt up to 10 MB
                  </p>
                </div>
              </div>

              {/* Live Published Document Credentials Card */}
              {currentPdfUrl && (
                <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-4 sm:p-5 shadow-2xs space-y-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-bamboo animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-widest text-bamboo font-semibold">
                      Live Document
                    </span>
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-semibold text-light-ink dark:text-dark-ink">
                      Vincent_Yuan_Resume.pdf
                    </h3>
                    <p className="font-mono text-2xs text-light-ink-muted dark:text-dark-ink-muted mt-0.5">
                      S3-backed Supabase Storage
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-light-border/60 dark:border-dark-border/60">
                    <a
                      href={currentPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-ochre/60 text-light-ink dark:text-dark-ink text-xs font-mono transition-colors shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />
                      <span>View Live</span>
                    </a>
                    <a
                      href={currentPdfUrl}
                      download="Vincent_Yuan_Resume.pdf"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-ochre/60 text-light-ink dark:text-dark-ink text-xs font-mono transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              )}

              <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed">
                Uploading a <code className="font-mono bg-light-surface dark:bg-dark-surface px-1 py-0.5 rounded-[2px] border border-light-border dark:border-dark-border">.tex</code> file will populate the LaTeX editor directly.
              </p>
            </div>

            {/* Right Column: Tall Portrait Studio PDF Viewer Stage */}
            <div className="lg:col-span-8 xl:col-span-8">
              <div className="relative bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] shadow-xs overflow-hidden classical-card-frame">
                
                {/* Viewer Header Bar */}
                <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 bg-light-surface/90 dark:bg-dark-surface/90 border-b border-light-border dark:border-dark-border flex-wrap gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-terracotta/80 dark:bg-ochre/80 inline-block" />
                    <span className="font-mono text-xs text-light-ink font-semibold dark:text-dark-ink">
                      {stagedPreviewUrl ? 'Staged PDF Document Preview' : 'Live Document Preview'}
                    </span>
                    {stagedPreviewUrl && (
                      <span className="font-mono text-2xs uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] bg-bamboo/10 text-bamboo font-semibold">
                        Unsaved Staging
                      </span>
                    )}
                  </div>

                  {(stagedPreviewUrl || currentPdfUrl) && (
                    <a
                      href={stagedPreviewUrl || currentPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink transition-colors"
                    >
                      <span>Fullscreen View</span>
                      <ExternalLink className="w-3 h-3 text-terracotta dark:text-ochre" />
                    </a>
                  )}
                </div>

                {/* PDF Viewer Frame */}
                {stagedPreviewUrl || currentPdfUrl ? (
                  <iframe
                    src={stagedPreviewUrl || currentPdfUrl}
                    title="PDF Document Preview"
                    className="w-full h-[78vh] min-h-[720px] max-h-[1000px] border-none bg-white"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                    <Upload className="w-10 h-10 text-light-ink-subtle dark:text-dark-ink-subtle mb-3" />
                    <p className="font-sans text-sm font-medium text-light-ink dark:text-dark-ink">
                      No resume document published yet
                    </p>
                    <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mt-1 max-w-sm">
                      Upload a PDF file to preview it here in portrait studio format before saving.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LaTeX Code Editor & Syntax-Highlighted Themed Viewer */}
      {tab === 'editor' && (
        <div className="relative bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] shadow-xs overflow-hidden classical-card-frame">
          
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
              <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted truncate">
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
            <LatexCodeViewer code={latex} maxHeightClass="max-h-[70vh]" />
          ) : (
            /* Live Raw Code Editor with Line Gutter */
            <div className="flex bg-[#FDFCFA] dark:bg-[#18191D] max-h-[70vh] overflow-hidden">
              <div className="select-none py-5 px-3 bg-light-surface/40 dark:bg-dark-surface/40 border-r border-light-border/40 dark:border-dark-border/40 text-right font-mono text-xs text-light-ink-muted/50 dark:text-dark-ink-muted/50 leading-relaxed min-w-[3rem] overflow-hidden">
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
                className="w-full p-5 font-mono text-sm text-light-ink dark:text-dark-ink bg-transparent resize-none focus:outline-none leading-relaxed selection:bg-terracotta/20 selection:text-terracotta overflow-y-auto"
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

