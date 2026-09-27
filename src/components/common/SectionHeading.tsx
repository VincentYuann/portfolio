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
      className={`relative flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-light-border/70 dark:border-dark-border/80 gap-6 overflow-hidden ${className}`}
    >
      {/* Ambient Radial Lantern Glow simulating an Akari paper lamp */}
      {/* Soft Ambient Akari Lantern Warmth: Diffused gently without tight focal spotlight */}
      <div
        className="pointer-events-none absolute -left-12 -top-10 w-full max-w-[32rem] h-64 -z-10 select-none opacity-40 dark:opacity-20"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 30% 35%, rgba(232, 162, 86, 0.04) 0%, rgba(232, 162, 86, 0.01) 70%, transparent 90%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-3xl">
        {/* Section Anchor & Rubric Seal */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <span
            className="w-5 h-5 rounded-[2px] bg-terracotta/15 dark:bg-[#D4A853]/15 border border-terracotta/60 dark:border-[#D4A853]/60 flex items-center justify-center text-[10px] font-zen text-terracotta dark:text-[#D4A853] font-medium select-none shadow-2xs"
            title="Vincent Yuan Seal · 原"
          >
            原
          </span>
          <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium">{numeral}</span>
          <span className="font-sans text-[11px] font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
            {categoryTag}
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal">
          {title}{' '}
          {kanjiSubtitle && (
            <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
              {kanjiSubtitle}
            </span>
          )}
        </h2>
        {description && (
          <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 font-normal leading-relaxed max-w-xl">
            {description}
          </p>
        )}
      </div>

      {rightAction && <div className="flex flex-wrap items-center gap-3 shrink-0">{rightAction}</div>}
    </div>
  );
};
