import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  'rounded-[3px] border transition-colors duration-200 relative overflow-visible',
  {
    variants: {
      variant: {
        craft:
          'bg-light-surface-card dark:bg-dark-surface-card craft-card border-light-border dark:border-dark-border classical-card-frame shadow-2xs hover:border-light-border-strong dark:hover:border-dark-border-strong',
        surface:
          'bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border',
        raised:
          'bg-light-surface-raised dark:bg-dark-surface-raised border-light-border dark:border-dark-border shadow-xs hover:border-light-border-strong dark:hover:border-dark-border-strong',
        muted:
          'bg-light-surface-muted dark:bg-dark-surface-muted border-light-border dark:border-dark-border',
        interactive:
          'bg-light-surface-card dark:bg-dark-surface-card craft-card border-light-border dark:border-dark-border classical-card-frame shadow-2xs hover:border-light-border-strong dark:hover:border-dark-border-strong hover:bg-light-surface dark:hover:bg-dark-surface cursor-pointer',
      },
    },
    defaultVariants: {
      variant: 'craft',
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-4 sm:p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-serif text-xl sm:text-2xl font-medium text-light-ink dark:text-dark-ink tracking-tight',
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'font-sans text-sm text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-normal',
      className,
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 sm:p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-4 sm:p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
