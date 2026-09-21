import React from 'react';
import { getTechBadgeIcon } from '../../lib/techIcons';

interface TechTagProps {
  tag: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_STYLES: Record<'sm' | 'md' | 'lg', { pill: string; icon: string }> = {
  sm: {
    pill: 'px-2 py-0.5 text-[10px] gap-1.5',
    icon: 'w-2.5 h-2.5',
  },
  md: {
    pill: 'px-2.5 py-1 text-[11px] gap-1.5',
    icon: 'w-3 h-3',
  },
  lg: {
    pill: 'px-3 py-1.5 text-xs gap-2',
    icon: 'w-3.5 h-3.5',
  },
};

export const TechTag: React.FC<TechTagProps> = ({
  tag,
  size = 'md',
  showIcon = true,
  className = '',
  onClick,
}) => {
  const { Icon, isOfficialBrand } = getTechBadgeIcon(tag);
  const sizeStyle = SIZE_STYLES[size];

  const Comp = onClick ? 'button' : 'span';

  return (
    <Comp
      onClick={onClick}
      className={`inline-flex items-center font-mono font-medium rounded-md border tracking-tight transition-all duration-150 ease-out select-none ${sizeStyle.pill} bg-light-surface dark:bg-[#16171D] border-light-border dark:border-[#333640] text-light-ink dark:text-dark-ink hover:border-terracotta hover:text-terracotta dark:hover:border-terracotta dark:hover:text-terracotta hover:-translate-y-0.5 active:translate-y-0 shadow-[0_1px_2px_rgba(43,46,58,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] ${className}`}
    >
      {showIcon && isOfficialBrand && Icon && (
        <Icon
          className={`${sizeStyle.icon} text-light-ink-muted dark:text-dark-ink-muted shrink-0 transition-colors group-hover:text-terracotta fill-current`}
          aria-hidden="true"
        />
      )}
      <span>{tag}</span>
    </Comp>
  );
};

