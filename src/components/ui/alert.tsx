import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const alertVariants = cva(
  'relative w-full rounded-xl border p-4 font-sans text-sm transition-colors select-none [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11',
  {
    variants: {
      variant: {
        default:
          'bg-light-surface-raised dark:bg-dark-surface-card text-light-ink dark:text-dark-ink border-light-border dark:border-dark-border',
        destructive:
          'border-red-500/30 text-red-700 dark:text-red-400 bg-red-500/10 dark:bg-red-950/20 [&>svg]:text-red-600 dark:[&>svg]:text-red-400',
        terracotta:
          'border-terracotta/30 text-terracotta bg-terracotta/10 dark:bg-terracotta/15 [&>svg]:text-terracotta',
        bamboo:
          'border-bamboo/30 text-bamboo bg-bamboo/10 dark:bg-bamboo/15 [&>svg]:text-bamboo',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium font-serif leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-xs leading-relaxed font-light text-light-ink-muted dark:text-dark-ink-muted', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
