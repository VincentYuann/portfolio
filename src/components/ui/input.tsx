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
          'flex h-9 w-full rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface-muted px-3 py-1 text-xs sm:text-sm text-light-ink dark:text-dark-ink transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-light-ink-subtle dark:placeholder:text-dark-ink-subtle focus-visible:outline-none focus-visible:border-terracotta dark:focus-visible:border-[#D4A853] focus-visible:ring-1 focus-visible:ring-terracotta/30 dark:focus-visible:ring-[#D4A853]/30 disabled:cursor-not-allowed disabled:opacity-50',
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
