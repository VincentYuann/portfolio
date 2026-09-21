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
  completedLabel = 'COMPLETED',
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
    ? `${bg} ${border} ${text} border shadow-xs`
    : 'bg-terracotta/15 border border-terracotta/50 text-terracotta dark:text-[#ff7d63] dark:shadow-[0_0_10px_rgba(200,60,35,0.25)]';

  const completedClass =
    'bg-stone-100 border border-stone-300 text-stone-600 dark:bg-[#20222a] dark:border-[#383b47] dark:text-stone-400';

  const dotActiveClass = dotBg || 'bg-terracotta shadow-[0_0_6px_rgba(200,60,35,0.8)]';

  return (
    <span
      className={`inline-flex items-center font-mono font-bold uppercase tracking-wider transition-colors select-none ${
        isSm ? 'gap-1 px-2 py-0.5 text-[10px] rounded-full' : 'gap-1.5 px-2.5 py-0.5 text-[10px] sm:text-[11px] rounded-full'
      } ${isActive ? activeClass : completedClass} ${customClass}`}
    >
      <span
        className={`rounded-full shrink-0 ${isSm ? 'w-1 h-1' : 'w-1.5 h-1.5'} ${
          isActive ? `${dotActiveClass} animate-pulse` : 'bg-stone-400 dark:bg-neutral-500'
        }`}
      />
      <span>{label}</span>
    </span>
  );
};
