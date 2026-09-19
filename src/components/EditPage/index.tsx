import React, { useState } from 'react';
import { IntroEditor } from './sections/IntroEditor';
import { ExperienceEditor } from './sections/ExperienceEditor';
import { ProjectsEditor } from './sections/ProjectsEditor';
import { ResumeEditor } from './sections/ResumeEditor';
import { PhilosophyEditor } from './sections/PhilosophyEditor';
import { VerticalMarginWidget, MARGIN_PRESETS } from '../VerticalMarginWidget';
import { ArrowLeft } from 'lucide-react';

type EditSection = 'intro' | 'experience' | 'projects' | 'resume' | 'philosophy';

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
    return 'projects'; // default to projects since it is the primary editing tool
  });

  const handleSelectSection = (sec: EditSection) => {
    setActiveSection(sec);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_admin_section', sec);
    }
  };

  return (
    // pt-20 clears the fixed main header (h-20)
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
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Badge */}
            <span className="font-mono text-[10px] text-terracotta border border-terracotta/40 rounded px-1.5 py-0.5 uppercase tracking-widest shrink-0 select-none">
              EDIT
            </span>

            {/* Section toggles */}
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSection(s.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-sans text-xs whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer ${
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

          <div className="shrink-0 pl-2">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1 font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors whitespace-nowrap cursor-pointer py-1 px-2 rounded-md hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Back to Portfolio</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section Content — extra top padding so sticky sub-bar never overlaps content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {activeSection === 'intro' && <IntroEditor />}
        {activeSection === 'experience' && <ExperienceEditor />}
        {activeSection === 'projects' && <ProjectsEditor />}
        {activeSection === 'philosophy' && <PhilosophyEditor />}
        {activeSection === 'resume' && <ResumeEditor />}
      </div>
    </div>
  );
};
