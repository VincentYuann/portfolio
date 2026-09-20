import React, { useState, useEffect, useCallback } from 'react';
import { IntroEditor } from './sections/IntroEditor';
import { ExperienceEditor } from './sections/ExperienceEditor';
import { ProjectsEditor } from './sections/ProjectsEditor';
import { ResumeEditor } from './sections/ResumeEditor';
import { PhilosophyEditor } from './sections/PhilosophyEditor';
import { VerticalMarginWidget, MARGIN_PRESETS } from '../VerticalMarginWidget';
import { ArrowLeft, Layers, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type EditSection = 'intro' | 'experience' | 'projects' | 'philosophy' | 'resume';

interface EditPageProps {
  onNavigate: (view: 'home' | 'projects' | 'resume' | 'login' | 'edit') => void;
}

const SECTIONS: { id: EditSection; label: string; num: string; shortLabel?: string }[] = [
  { id: 'intro', label: 'Intro & Profile', shortLabel: 'Intro', num: '01' },
  { id: 'experience', label: 'Experience', shortLabel: 'Experience', num: '02' },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects', num: '03' },
  { id: 'philosophy', label: 'Philosophy', shortLabel: 'Philosophy', num: '04' },
  { id: 'resume', label: 'Resume', shortLabel: 'Resume', num: '05' },
];

export const EditPage: React.FC<EditPageProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState<EditSection>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_admin_section') as EditSection | null;
      if (saved && SECTIONS.some((s) => s.id === saved)) {
        return saved;
      }
    }
    return 'projects';
  });

  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Listen for dirty state changes from child editors
  useEffect(() => {
    const handleDirty = (e: Event) => {
      const customEvent = e as CustomEvent<{ dirty?: boolean }>;
      setIsDirty(customEvent.detail?.dirty ?? true);
    };
    const handleClean = () => setIsDirty(false);

    window.addEventListener('portfolio-admin-dirty', handleDirty);
    window.addEventListener('portfolio-admin-clean', handleClean);

    return () => {
      window.removeEventListener('portfolio-admin-dirty', handleDirty);
      window.removeEventListener('portfolio-admin-clean', handleClean);
    };
  }, []);

  // Protect against accidental tab close when unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSelectSection = useCallback((sec: EditSection) => {
    setActiveSection(sec);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_admin_section', sec);
    }
  }, []);

  // Keyboard accelerators: Cmd+S / Ctrl+S to save, 1-5 to switch sections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save Shortcut: Cmd+S or Ctrl+S
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('portfolio-admin-save'));
        return;
      }

      // Section Switching: 1-5 keys when NOT typing in input or textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.tagName === 'SELECT';

      if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= SECTIONS.length) {
          e.preventDefault();
          const targetSection = SECTIONS[num - 1].id;
          handleSelectSection(targetSection);
          toast.info(`Switched to ${SECTIONS[num - 1].label} (Key ${num})`, {
            duration: 1500,
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectSection]);

  const handleExit = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave the editor?');
      if (!confirmed) return;
    }
    onNavigate('home');
  };

  return (
    <div className="relative min-h-screen bg-light-canvas dark:bg-dark-canvas text-light-ink dark:text-dark-ink pt-20">
      {/* Floating Vertical Margins */}
      <VerticalMarginWidget
        side="left"
        top="top-64"
        {...MARGIN_PRESETS.shokuninCraft}
      />
      <VerticalMarginWidget
        side="right"
        top="top-80"
        {...MARGIN_PRESETS.akariSimplicity}
      />
      <VerticalMarginWidget
        side="right"
        top="top-[65%]"
        type="minimal"
        stampChar="整"
      />

      {/* Sub Navbar — sticks just below main header with smooth horizontal scrolling */}
      <div className="sticky top-20 z-40 bg-light-surface/95 dark:bg-dark-surface/95 backdrop-blur-md border-b border-light-border dark:border-dark-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div
            role="tablist"
            aria-label="Editor sections"
            className="flex items-center gap-1.5 sm:gap-2 shrink-0"
          >
            {/* Badge */}
            <span className="font-mono text-[10px] text-terracotta border border-terracotta/40 rounded px-2 py-0.5 uppercase tracking-widest shrink-0 select-none flex items-center gap-1.5 font-semibold">
              <Layers className="w-3 h-3" />
              EDITOR
            </span>

            {/* Section toggles */}
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                role="tab"
                id={`tab-${s.id}`}
                aria-controls={`panel-${s.id}`}
                aria-selected={activeSection === s.id}
                onClick={() => handleSelectSection(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-lg font-sans text-xs whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer ${
                  activeSection === s.id
                    ? 'bg-terracotta/15 text-terracotta border border-terracotta/40 font-semibold shadow-xs'
                    : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised border border-transparent'
                }`}
              >
                <span className="font-mono text-[10px] opacity-60">{s.num}</span>
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.shortLabel || s.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0 pl-2">
            {isDirty && (
              <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full animate-pulse">
                <AlertCircle className="w-3 h-3" />
                Unsaved edits
              </span>
            )}

            <button
              onClick={handleExit}
              className="inline-flex items-center gap-1 font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors whitespace-nowrap cursor-pointer py-1.5 px-3 min-h-[34px] rounded-md hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Portfolio</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div role="tabpanel" id={`panel-${activeSection}`} aria-labelledby={`tab-${activeSection}`}>
          {activeSection === 'intro' && <IntroEditor />}
          {activeSection === 'experience' && <ExperienceEditor />}
          {activeSection === 'projects' && <ProjectsEditor />}
          {activeSection === 'philosophy' && <PhilosophyEditor />}
          {activeSection === 'resume' && <ResumeEditor />}
        </div>
      </div>
    </div>
  );
};
