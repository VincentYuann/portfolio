import * as React from 'react';
import { cn } from '../../../lib/utils';

export interface MarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'separator' | 'border';
}

export const Marker = React.forwardRef<HTMLDivElement, MarkerProps>(
  ({ className, variant = 'separator', children, ...props }, ref) => {
    if (variant === 'separator') {
      return (
        <div
          ref={ref}
          className={cn('flex items-center gap-3 py-2 w-full select-none', className)}
          {...props}
        >
          <div className="flex-1 h-px bg-light-border/60 dark:bg-dark-border/60" />
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle">
            {children}
          </div>
          <div className="flex-1 h-px bg-light-border/60 dark:bg-dark-border/60" />
        </div>
      );
    }

    if (variant === 'border') {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center gap-2 pb-2 border-b border-light-border/60 dark:border-dark-border/60 text-xs font-mono text-light-ink-subtle dark:text-dark-ink-subtle select-none',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-2 py-1.5 text-xs font-mono text-light-ink-subtle dark:text-dark-ink-subtle select-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Marker.displayName = 'Marker';

export const MarkerIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center justify-center shrink-0 text-terracotta', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
MarkerIcon.displayName = 'MarkerIcon';

export const MarkerContent = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn('tracking-wider uppercase', className)} {...props}>
        {children}
      </span>
    );
  }
);
MarkerContent.displayName = 'MarkerContent';
