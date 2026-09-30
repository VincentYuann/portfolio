import React from 'react';

export interface StatusBadgeProps {
  isActive?: boolean;
  activeLabel?: string;
  completedLabel?: string;
  size?: 'sm' | 'md';
  customClass?: string;
  themePrimary?: string;
  badgeBg?: string;
  badgeBorder?: string;
  badgeText?: string;
  nodeActiveBg?: string;
  activeBgClass?: string;
  activeBorderClass?: string;
  activeTextClass?: string;
  activeDotBgClass?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  isActive = false,
  activeLabel = 'ACTIVE / 稼働中',
  completedLabel = 'COMPLETED / 完了',
  size = 'md',
  customClass = '',
  badgeBg,
  badgeBorder,
  badgeText,
  nodeActiveBg,
  activeBgClass,
  activeBorderClass,
  activeTextClass,
  activeDotBgClass,
}) => {
  const isSm = size === 'sm';
  const label = isActive ? activeLabel : completedLabel;

  const bg = activeBgClass || badgeBg;
  const border = activeBorderClass || badgeBorder;
  const text = activeTextClass || badgeText;
  const dotBg = activeDotBgClass || nodeActiveBg;

  // Custom theme overrides from experience milestones
  const activeClass = bg && border && text
    ? `${bg} ${border} ${text} border`
    : 'bg-bamboo/10 dark:bg-bamboo/20 border border-bamboo/30 dark:border-bamboo/40 text-bamboo-dark dark:text-bamboo-light';

  const completedClass =
    'bg-light-surface-muted border border-light-border text-light-ink-muted dark:bg-dark-surface-muted dark:border-dark-border dark:text-dark-ink-muted';

  const dotActiveClass = dotBg || 'bg-bamboo dark:bg-bamboo-light';

  return (
    <span
      className={`inline-flex items-center font-mono font-bold uppercase tracking-wider transition-colors select-none ${
        isSm ? 'gap-1 px-2 py-0.5 text-2xs rounded-[2px]' : 'gap-1.5 px-2.5 py-0.5 text-xs rounded-[2px]'
      } ${isActive ? activeClass : completedClass} ${customClass}`}
    >
      <span
        className={`rounded-full shrink-0 ${isSm ? 'w-1 h-1' : 'w-1.5 h-1.5'} ${
          isActive ? dotActiveClass : 'bg-light-ink-subtle/40 dark:bg-dark-ink-subtle/40'
        }`}
      />
      <span>{label}</span>
    </span>
  );
};
