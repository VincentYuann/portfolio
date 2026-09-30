import React from 'react';
import { HankoStamp } from '../common/HankoStamp';
import { Compass } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: 'home' | 'projects' | 'resume', sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-light-surface-card dark:bg-dark-surface-card border-t border-light-border dark:border-dark-border mt-16 relative">

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-light-border/70 dark:border-dark-border/70">
          {/* Brand & Identity */}
          <div className="md:col-span-5 flex flex-col items-start text-left">
            <div className="flex items-center gap-3">
              <HankoStamp className="h-7 w-7" />
              <div>
                <span className="font-serif text-lg font-medium text-light-ink dark:text-dark-ink block leading-none">
                  Vincent Yuan
                </span>
                <span className="font-serif text-2xs text-terracotta dark:text-ochre tracking-widest mt-0.5 block">
                  CRAFT & COMPUTING
                </span>
              </div>
            </div>
          </div>

          {/* DESIGN & CRAFT PHILOSOPHY */}
          <div className="md:col-span-4 flex flex-col">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Compass className="w-3.5 h-3.5 text-ochre" />
              <span className="font-sans text-xs font-semibold text-light-ink dark:text-dark-ink uppercase tracking-widest">
                INSPIRATION &amp; CRAFT
              </span>
            </div>
            <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-light">
              Inspired by captivating portfolios I came across and empowered by agentic coding, I set out to build my own unique space. The design draws from Japanese editorial aesthetics, incorporating warm washi textures, ink-wash motifs, clean typography, and intentional spacing for a calm, focused reading experience.
            </p>
          </div>

          {/* Navigation Shortcuts */}
          <div className="md:col-span-3 flex flex-col sm:items-end">
            <span className="font-sans text-xs font-semibold text-light-ink dark:text-dark-ink uppercase tracking-widest mb-3">
              INDEX &amp; ARCHIVE
            </span>
            <div className="flex flex-col sm:items-end space-y-2 text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted">
              <a
                href="#home"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('home', 'home');
                  }
                }}
                className="hover:text-terracotta dark:hover:text-ochre transition-colors"
              >
                Home Overview
              </a>
              <a
                href="#experience"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('home', 'experience');
                  }
                }}
                className="hover:text-terracotta dark:hover:text-ochre transition-colors"
              >
                Work Experience
              </a>
              <a
                href="#featured-works"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('home', 'featured-works');
                  }
                }}
                className="hover:text-terracotta dark:hover:text-ochre transition-colors"
              >
                Featured Works
              </a>
              <a
                href="#philosophy"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('home', 'philosophy');
                  }
                }}
                className="hover:text-terracotta dark:hover:text-ochre transition-colors"
              >
                Philosophy &amp; Craft
              </a>
              <a
                href="#hobbies"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('home', 'hobbies');
                  }
                }}
                className="hover:text-terracotta dark:hover:text-ochre transition-colors"
              >
                Hobbies &amp; Interests
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('home', 'contact');
                  }
                }}
                className="hover:text-terracotta dark:hover:text-ochre transition-colors"
              >
                Initiate Dialogue
              </a>
              <a
                href="#resume"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('resume');
                  }
                }}
                className="hover:text-terracotta dark:hover:text-ochre transition-colors"
              >
                Curriculum Vitae
              </a>
            </div>
          </div>
        </div>

        {/* Hairline Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-light-ink-subtle dark:text-dark-ink-subtle text-xs font-sans">
            <span className="font-serif text-terracotta dark:text-ochre">❖</span>
            <span>© {new Date().getFullYear()} Vincent Yuan.</span>
          </div>

          <div className="flex items-center gap-3 text-light-ink-subtle dark:text-dark-ink-subtle text-xs font-sans">
            <span className="uppercase tracking-widest text-2xs font-mono">Clarity · Balance · Craft</span>
            <span className="text-terracotta dark:text-ochre text-xs">✦</span>
            <span className="uppercase tracking-widest text-2xs font-mono">Solid Washi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
