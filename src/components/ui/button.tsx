import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 dark:focus-visible:ring-[#D4A853]/50 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light shadow-xs hover:opacity-95 dark:hover:bg-[#DE9E36]',
        terracotta: 'bg-terracotta dark:bg-dark-button-light text-white dark:text-dark-on-light shadow-xs hover:bg-terracotta-hover dark:hover:bg-[#DE9E36]',
        destructive: 'bg-red-500 text-white shadow-xs hover:bg-red-600',
        outline:
          'border border-light-border dark:border-dark-border bg-transparent text-light-ink dark:text-dark-ink hover:border-light-border-strong dark:hover:border-dark-border-strong hover:text-terracotta dark:hover:text-[#D4A853]',
        secondary:
          'bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink hover:border-light-border-strong dark:hover:border-dark-border-strong',
        ghost: 'hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised text-light-ink dark:text-dark-ink hover:text-terracotta dark:hover:text-[#D4A853]',
        link: 'text-terracotta dark:text-[#D4A853] underline-offset-4 hover:underline normal-case',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-[11px]',
        lg: 'h-10 rounded-lg px-6 text-xs',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
