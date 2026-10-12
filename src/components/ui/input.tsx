import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-[2px] border border-light-border/90 dark:border-dark-border/80 bg-light-surface-muted/65 dark:bg-[#16181D] px-3 py-1 text-xs sm:text-sm text-light-ink dark:text-dark-ink transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-light-ink-subtle/70 dark:placeholder:text-dark-ink-subtle/70 focus-visible:outline-none focus-visible:bg-light-surface dark:focus-visible:bg-[#1C1E26] focus-visible:border-terracotta dark:focus-visible:border-ochre focus-visible:ring-1 focus-visible:ring-terracotta/25 dark:focus-visible:ring-ochre/25 disabled:cursor-not-allowed disabled:opacity-50 shadow-2xs',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
