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
      className={`flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-light-border/70 dark:border-dark-border/80 gap-6 ${className}`}
    >
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-serif text-terracotta text-sm">{numeral}</span>
          <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
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
