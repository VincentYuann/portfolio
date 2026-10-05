import React, { useState } from 'react';
import { useLayoutVariant } from '../../context/LayoutContext';
import { LayoutGrid, Check, X } from 'lucide-react';

export const LayoutSwitcherDock: React.FC = () => {
  const { layoutVariant, setLayoutVariant, layoutInfo, layoutsList } = useLayoutVariant();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      aria-label="Layout Variations Switcher"
      className="fixed bottom-6 left-6 z-40 hidden md:block select-none"
    >
      {/* Floating Mini Trigger */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-[3px] bg-light-surface-card/90 dark:bg-dark-surface-card/90 backdrop-blur-md border border-light-border dark:border-dark-border hover:border-terracotta dark:hover:border-ochre text-light-ink dark:text-dark-ink shadow-lg transition-all duration-200 cursor-pointer"
          title="Switch wide layout variations (Blueprint, Telemetry, Ma Gallery, Radar Matrix)"
          aria-expanded="false"
        >
          <div className="w-5 h-5 rounded-[2px] bg-terracotta/15 dark:bg-ochre/15 border border-terracotta/40 dark:border-ochre/40 flex items-center justify-center text-3xs font-zen text-terracotta dark:text-ochre">
            {layoutInfo.kanji}
          </div>
          <span className="font-mono text-2xs uppercase tracking-wider font-semibold text-light-ink dark:text-dark-ink">
            Layout: {layoutInfo.name}
          </span>
          <span className="font-mono text-3xs text-terracotta dark:text-ochre px-1.5 py-0.5 rounded-[2px] bg-terracotta/10 dark:bg-ochre/10 font-bold">
            0{layoutInfo.numericKey}
          </span>
        </button>
      )}

      {/* Expanded Layout Palette Modal */}
      {isOpen && (
        <div className="w-84 sm:w-96 rounded-[3px] bg-light-surface-card/95 dark:bg-dark-surface-card/95 backdrop-blur-xl border border-light-border-strong dark:border-dark-border-strong shadow-2xl p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-light-border/70 dark:border-dark-border/70">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-terracotta dark:text-ochre" />
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-light-ink dark:text-dark-ink">
                Wide Canvas Variations
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-[2px] text-light-ink-muted hover:text-light-ink dark:text-dark-ink-muted dark:hover:text-dark-ink hover:bg-light-surface-raised dark:hover:bg-dark-surface transition-colors cursor-pointer"
              aria-label="Close layout switcher"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="font-sans text-2xs text-light-ink-muted dark:text-dark-ink-muted mb-3 leading-relaxed">
            Four centralized wide-screen architectural variations. Switch live to test each layout's scanability, information density, and shokunin aesthetics:
          </p>

          <div className="space-y-2">
            {layoutsList.map((variant) => {
              const isSelected = variant.id === layoutVariant;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setLayoutVariant(variant.id)}
                  className={`w-full text-left p-3 rounded-[2px] border transition-all duration-150 cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-light-surface-raised dark:bg-dark-surface border-terracotta dark:border-ochre shadow-xs ring-1 ring-terracotta/20 dark:ring-ochre/20'
                      : 'bg-light-surface/40 dark:bg-dark-surface/40 border-light-border dark:border-dark-border hover:border-light-border-strong dark:hover:border-dark-border-strong hover:bg-light-surface-raised/60 dark:hover:bg-dark-surface-raised/60'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-[2px] border shrink-0 flex items-center justify-center font-zen text-xs font-bold ${
                    isSelected
                      ? 'border-terracotta dark:border-ochre text-terracotta dark:text-ochre bg-terracotta/10 dark:bg-ochre/15'
                      : 'border-light-border dark:border-dark-border text-light-ink-muted dark:text-dark-ink-muted'
                  }`}>
                    {variant.kanji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-sans text-xs font-bold text-light-ink dark:text-dark-ink">
                        {variant.name}
                      </span>
                      <span className="font-mono text-3xs text-light-ink-muted dark:text-dark-ink-muted">
                        0{variant.numericKey}
                      </span>
                    </div>
                    <p className="font-sans text-3xs text-light-ink-muted dark:text-dark-ink-muted leading-tight line-clamp-2">
                      {variant.subtitle}
                    </p>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-terracotta dark:text-ochre shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3.5 pt-3 border-t border-light-border/70 dark:border-dark-border/70 flex items-center justify-between text-3xs font-mono text-light-ink-muted dark:text-dark-ink-muted">
            <span>Canvas: max-w-[1536px]</span>
            <span className="text-terracotta dark:text-ochre">Interactive Live Preview</span>
          </div>
        </div>
      )}
    </aside>
  );
};
