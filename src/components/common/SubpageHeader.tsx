import React from 'react';

export interface SubpageHeaderProps {
  archiveKicker?: string;
  categoryTag?: string;
  title: string;
  kanjiSubtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Standardized Subpage Header matching editorial Akari typography and layout grid.
 * Used across ProjectsPage, HobbiesPage, ResumePage, and VisualSystemPage.
 */
export const SubpageHeader: React.FC<SubpageHeaderProps> = ({
  archiveKicker,
  categoryTag,
  title,
  kanjiSubtitle,
  description,
  actions,
  action,
  className = '',
}) => {
  const rightSlot = actions || action;

  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 sm:pb-8 border-b border-light-border/70 dark:border-dark-border/80 mb-6 sm:mb-10 ${className}`}
    >
      <div>
        {(archiveKicker || categoryTag) && (
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            {archiveKicker && (
              <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium">
                {archiveKicker}
              </span>
            )}
            {categoryTag && (
              <span className="font-mono text-xs font-semibold text-terracotta dark:text-ochre uppercase tracking-wider">
                {categoryTag}
              </span>
            )}
          </div>
        )}
        <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal leading-tight">
          {title}{' '}
          {kanjiSubtitle && (
            <span
              aria-hidden="true"
              className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-lg sm:text-2xl lg:text-3xl ml-1.5 sm:ml-2 whitespace-nowrap inline-block select-none opacity-80"
            >
              {kanjiSubtitle}
            </span>
          )}
        </h1>
        {description && (
          <p className="font-sans text-xs sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-2 sm:mt-3 font-normal leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  );
};
