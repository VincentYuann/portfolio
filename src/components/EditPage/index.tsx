import React, { useState, useEffect, useCallback } from 'react';
import { IntroEditor } from './sections/IntroEditor';
import { ExperienceEditor } from './sections/ExperienceEditor';
import { ProjectsEditor } from './sections/ProjectsEditor';
import { PhilosophyEditor } from './sections/PhilosophyEditor';
import { HobbiesEditor } from './sections/HobbiesEditor';
import { ResumeEditor } from './sections/ResumeEditor';
import {
  User,
  Briefcase,
  FolderGit2,
  Compass,
  Palette,
  FileText,
  ArrowLeft,
  Save,
  RotateCcw,
  LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { ViewMode } from '../../App';

type EditSection = 'intro' | 'experience' | 'projects' | 'philosophy' | 'hobbies' | 'resume';

interface EditPageProps {
  onNavigate: (view: ViewMode) => void;
}

interface SectionMeta {
  id: EditSection;
  label: string;
  shortLabel: string;
  num: string;
  icon: LucideIcon;
}

const SECTIONS: SectionMeta[] = [
  { id: 'intro', label: 'Identity & Intro', shortLabel: 'Intro', num: '01', icon: User },
  { id: 'experience', label: 'Experience', shortLabel: 'Experience', num: '02', icon: Briefcase },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects', num: '03', icon: FolderGit2 },
  { id: 'philosophy', label: 'Philosophy', shortLabel: 'Philosophy', num: '04', icon: Compass },
  { id: 'hobbies', label: 'Hobbies & Crafts', shortLabel: 'Hobbies', num: '05', icon: Palette },
  { id: 'resume', label: 'Resume & CV', shortLabel: 'Resume', num: '06', icon: FileText },
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

  // Track unsaved dirty state per individual section
  const [dirtySections, setDirtySections] = useState<Record<EditSection, boolean>>({
    intro: false,
    experience: false,
    projects: false,
    philosophy: false,
    hobbies: false,
    resume: false,
  });

  // Listen for dirty state changes from child editors
  useEffect(() => {
    const handleDirty = (e: Event) => {
      const customEvent = e as CustomEvent<{ section?: EditSection; dirty?: boolean }>;
      const targetSection = customEvent.detail?.section || activeSection;
      setDirtySections((prev) => ({
        ...prev,
        [targetSection]: customEvent.detail?.dirty ?? true,
      }));
    };

    const handleClean = (e: Event) => {
      const customEvent = e as CustomEvent<{ section?: EditSection }>;
      const targetSection = customEvent.detail?.section;
      if (targetSection) {
        setDirtySections((prev) => ({ ...prev, [targetSection]: false }));
      } else {
        setDirtySections({
          intro: false,
          experience: false,
          projects: false,
          philosophy: false,
          hobbies: false,
          resume: false,
        });
      }
    };

    window.addEventListener('portfolio-admin-dirty', handleDirty);
    window.addEventListener('portfolio-admin-clean', handleClean);

    return () => {
      window.removeEventListener('portfolio-admin-dirty', handleDirty);
      window.removeEventListener('portfolio-admin-clean', handleClean);
    };
  }, [activeSection]);

  const hasAnyDirty = Object.values(dirtySections).some(Boolean);
  const activeSectionIsDirty = Boolean(dirtySections[activeSection]);

  // Protect against accidental tab close when unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasAnyDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasAnyDirty]);

  const handleSelectSection = useCallback((sec: EditSection) => {
    setActiveSection(sec);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_admin_section', sec);
    }
  }, []);

  // Keyboard accelerators: Cmd+S / Ctrl+S to save, 1-6 to switch sections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save Shortcut: Cmd+S or Ctrl+S
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('portfolio-admin-save'));
        return;
      }

      // Section Switching: 1-6 keys when NOT typing in input or textarea
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
    onNavigate('home');
  };

  const activeSectionObj = SECTIONS.find((s) => s.id === activeSection);
  const dirtySectionKeys = (Object.keys(dirtySections) as EditSection[]).filter(
    (k) => dirtySections[k]
  );

  return (
    <div className="relative min-h-screen bg-light-canvas dark:bg-dark-canvas text-light-ink dark:text-dark-ink pt-20 pb-20">
      {/* Sub Navbar: sticks just below main header with smooth horizontal scrolling */}
      <div className="sticky top-20 z-40 bg-light-surface/95 dark:bg-dark-surface/95 backdrop-blur-md border-b border-light-border dark:border-dark-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative">
          <div
            role="tablist"
            aria-label="Editor sections"
            className="flex items-center gap-1.5 sm:gap-2 shrink-0 py-1"
          >
            {/* Section toggles with rich icons & isolated unsaved badges */}
            {SECTIONS.map((s) => {
              const isCurrent = activeSection === s.id;
              const isSectionDirty = Boolean(dirtySections[s.id]);
              const Icon = s.icon;

              return (
                <button
                  key={s.id}
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-controls={`panel-${s.id}`}
                  aria-selected={isCurrent}
                  onClick={() => handleSelectSection(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 min-h-[42px] rounded-lg font-sans text-xs whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer relative group ${
                    isCurrent
                      ? 'bg-light-surface-raised dark:bg-dark-surface-raised text-light-ink dark:text-dark-ink font-semibold border border-light-border dark:border-dark-border shadow-xs'
                      : isSectionDirty
                      ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30'
                      : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink hover:bg-light-surface-raised/60 dark:hover:bg-dark-surface-raised/60 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors shrink-0 ${
                      isCurrent
                        ? 'text-terracotta'
                        : isSectionDirty
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-light-ink-muted dark:text-dark-ink-muted group-hover:text-light-ink dark:group-hover:text-dark-ink'
                    }`}
                  />
                  <span className="font-mono text-[10px] opacity-60">{s.num}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.shortLabel}</span>

                  {/* Section-Specific Unsaved Indicator Dot */}
                  {isSectionDirty && (
                    <span
                      className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0 ml-0.5"
                      title={`${s.label} has unsaved changes`}
                      aria-label="Unsaved changes"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 pl-1 sm:pl-2">
            <button
              onClick={handleExit}
              className="inline-flex items-center gap-1.5 font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors whitespace-nowrap cursor-pointer py-1.5 px-2.5 sm:px-3 min-h-[42px] rounded-lg hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised shrink-0 border border-transparent hover:border-light-border dark:hover:border-dark-border"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Return to Portfolio</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div role="tabpanel" id={`panel-${activeSection}`} aria-labelledby={`tab-${activeSection}`}>
          {activeSection === 'intro' && <IntroEditor />}
          {activeSection === 'experience' && <ExperienceEditor />}
          {activeSection === 'projects' && <ProjectsEditor />}
          {activeSection === 'philosophy' && <PhilosophyEditor />}
          {activeSection === 'hobbies' && <HobbiesEditor />}
          {activeSection === 'resume' && <ResumeEditor />}
        </div>
      </div>

      {/* Floating Bottom Unsaved Changes Dock (Mobile-Friendly & Clear) */}
      {hasAnyDirty && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-1.5rem)] animate-in slide-in-from-bottom-5 fade-in duration-200 pointer-events-auto select-none"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-light-surface/95 dark:bg-[#181920]/95 backdrop-blur-md border border-amber-500/40 shadow-2xl text-light-ink dark:text-dark-ink">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <div className="min-w-0">
                <p className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-400 truncate">
                  {activeSectionIsDirty
                    ? `Unsaved edits in ${activeSectionObj?.shortLabel || 'Current Section'}`
                    : `Unsaved edits (${dirtySectionKeys.length} ${
                        dirtySectionKeys.length === 1 ? 'section' : 'sections'
                      })`}
                </p>
                <p className="font-sans text-[11px] text-light-ink-muted dark:text-dark-ink-muted truncate hidden sm:block">
                  {activeSectionIsDirty
                    ? 'Click save or press Ctrl+S to persist changes'
                    : `Pending edits in: ${dirtySectionKeys
                        .map((k) => SECTIONS.find((s) => s.id === k)?.shortLabel)
                        .join(', ')}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {activeSectionIsDirty && (
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('portfolio-admin-discard', { detail: { section: activeSection } }));
                    setDirtySections((prev) => ({ ...prev, [activeSection]: false }));
                    toast.info(`Discarded unsaved changes in ${activeSectionObj?.shortLabel || 'section'}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-light-surface dark:bg-dark-surface hover:bg-stone-200 dark:hover:bg-neutral-800 text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink border border-light-border dark:border-dark-border font-sans text-xs font-medium shadow-xs transition-colors cursor-pointer"
                  title="Discard changes in this section and revert to saved data"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Discard</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('portfolio-admin-save'))}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg bg-terracotta hover:bg-terracotta-hover text-white font-sans text-xs font-medium shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 shrink-0" />
                <span>Save {activeSectionObj?.shortLabel || 'Section'}</span>
                <kbd className="hidden sm:inline font-mono text-[10px] opacity-80 ml-1 bg-black/20 px-1 py-0.5 rounded">
                  Ctrl+S
                </kbd>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
