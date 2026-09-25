import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-mono font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 select-none',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-terracotta text-white shadow-2xs hover:bg-terracotta-hover',
        secondary:
          'border-transparent bg-light-surface-raised dark:bg-dark-surface-raised text-light-ink dark:text-dark-ink',
        destructive:
          'border-transparent bg-red-500 text-white shadow-2xs hover:bg-red-600',
        outline:
          'border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink bg-light-surface dark:bg-dark-surface-card',
        terracotta:
          'border-terracotta/30 bg-terracotta/10 text-terracotta dark:text-terracotta-soft',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
