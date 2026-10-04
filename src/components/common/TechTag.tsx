import React from 'react';
import { useTechIcon } from '../../lib/techIcons';

interface TechTagProps {
  tag: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_STYLES: Record<'sm' | 'md' | 'lg', { pill: string; icon: string }> = {
  sm: {
    pill: 'px-2.5 py-1 text-xs gap-1.5',
    icon: 'w-3.5 h-3.5',
  },
  md: {
    pill: 'px-3 py-1.5 text-xs sm:text-sm gap-2',
    icon: 'w-4 h-4',
  },
  lg: {
    pill: 'px-3.5 py-2 text-sm gap-2',
    icon: 'w-4 h-4',
  },
};

export const TechTag: React.FC<TechTagProps> = ({
  tag,
  size = 'md',
  showIcon = true,
  className = '',
  onClick,
}) => {
  const { IconComponent, svgString, isOfficialBrand } = useTechIcon(tag);
  const sizeStyle = SIZE_STYLES[size];

  const Comp = onClick ? 'button' : 'span';

  return (
    <Comp
      onClick={onClick}
      className={`inline-flex items-center font-mono font-medium rounded-md border tracking-tight transition-all duration-150 ease-out select-none ${sizeStyle.pill} bg-light-surface dark:bg-dark-surface-card border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink hover:border-terracotta hover:text-terracotta dark:hover:border-ochre dark:hover:text-ochre hover:-translate-y-0.5 active:translate-y-0 shadow-[0_1px_2px_rgba(43,46,58,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] ${className}`}
    >
      {showIcon && isOfficialBrand && (
        IconComponent ? (
          <IconComponent
            className={`${sizeStyle.icon} text-light-ink-muted dark:text-dark-ink-muted shrink-0 transition-colors group-hover:text-terracotta dark:group-hover:text-ochre fill-current`}
            aria-hidden="true"
          />
        ) : svgString ? (
          <span
            className={`${sizeStyle.icon} text-light-ink-muted dark:text-dark-ink-muted shrink-0 transition-colors group-hover:text-terracotta dark:group-hover:text-ochre inline-flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current`}
            dangerouslySetInnerHTML={{ __html: svgString }}
            aria-hidden="true"
          />
        ) : null
      )}
      <span>{tag}</span>
    </Comp>
  );
};
