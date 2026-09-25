import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const bubbleVariants = cva(
  'relative rounded-2xl p-4 text-xs sm:text-[13px] leading-relaxed transition-all shadow-2xs select-text',
  {
    variants: {
      variant: {
        default:
          'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink',
        sent:
          'bg-terracotta text-white rounded-br-xs shadow-xs selection:bg-white/30 selection:text-white',
        secondary:
          'bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink',
        muted:
          'bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border/60 dark:border-dark-border/60 text-light-ink-muted dark:text-dark-ink-muted',
        tinted:
          'bg-terracotta/5 dark:bg-terracotta/10 border border-terracotta/30 text-light-ink dark:text-dark-ink',
        outline:
          'border border-light-border dark:border-dark-border bg-transparent text-light-ink dark:text-dark-ink',
        destructive:
          'bg-red-500/10 border border-red-500/40 text-red-600 dark:text-red-400',
      },
      align: {
        start: 'rounded-bl-xs',
        end: 'rounded-br-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      align: 'start',
    },
  }
);

export interface BubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bubbleVariants> {}

export const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  ({ className, variant, align, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-variant={variant}
        data-align={align}
        className={cn(bubbleVariants({ variant, align, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Bubble.displayName = 'Bubble';

export const BubbleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-2 break-words', className)} {...props}>
      {children}
    </div>
  );
});
BubbleContent.displayName = 'BubbleContent';

export interface BubbleReactionsProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom';
  align?: 'start' | 'end';
}

export const BubbleReactions = React.forwardRef<HTMLDivElement, BubbleReactionsProps>(
  ({ className, side = 'bottom', align = 'end', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-side={side}
        data-align={align}
        className={cn(
          'flex items-center gap-1 mt-1 select-none',
          align === 'end' ? 'justify-end' : 'justify-start',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BubbleReactions.displayName = 'BubbleReactions';
