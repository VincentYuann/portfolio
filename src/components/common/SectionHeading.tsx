import React from 'react';

export interface SectionHeadingProps {
  numeral: string;
  categoryTag: string;
  title: string;
  kanjiSubtitle?: string;
  description?: string;
  action?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  numeral,
  categoryTag,
  title,
  kanjiSubtitle,
  description,
  action,
  actions,
  className = '',
}) => {
  const rightAction = actions || action;
  return (
    <div
      className={`relative flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-light-border dark:border-dark-border gap-6 overflow-hidden ${className}`}
    >
      {/* Ambient Radial Lantern Glow simulating an Akari paper lamp */}
      {/* Soft Ambient Akari Lantern Warmth: Diffused gently without tight focal spotlight */}
      <div
        className="pointer-events-none absolute -left-12 -top-10 w-full max-w-[36rem] h-72 -z-10 select-none opacity-45 dark:opacity-25"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 30% 35%, rgba(212, 168, 83, 0.06) 0%, rgba(212, 168, 83, 0.015) 70%, transparent 90%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl">
        {/* Section Anchor & Rubric Seal */}
        <div className="flex items-center gap-3 mb-3.5">
          <span
            className="w-6 h-6 rounded-[2px] bg-terracotta/15 dark:bg-ochre/15 border border-terracotta/60 dark:border-ochre/60 flex items-center justify-center text-[11px] font-zen text-terracotta dark:text-ochre font-medium select-none shadow-2xs"
            title="Vincent Yuan Seal · 原"
          >
            原
          </span>
          <span className="font-mono text-xs sm:text-sm text-light-ink dark:text-dark-ink font-semibold tracking-wider">{numeral}</span>
          <span className="font-chakra text-xs font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-widest">
            {categoryTag}
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-light-ink dark:text-dark-ink tracking-tight font-normal leading-[1.08]">
          {title}{' '}
          {kanjiSubtitle && (
            <span className="font-serif font-light text-light-ink-muted/80 dark:text-dark-ink-muted/80 text-2xl sm:text-3xl lg:text-4xl ml-3 whitespace-nowrap inline-block select-none">
              {kanjiSubtitle}
            </span>
          )}
        </h2>
        {description && (
          <p className="font-sans text-base sm:text-lg text-light-ink-muted dark:text-dark-ink-muted mt-4 font-normal leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {rightAction && <div className="flex flex-wrap items-center gap-3 shrink-0">{rightAction}</div>}
    </div>
  );
};
