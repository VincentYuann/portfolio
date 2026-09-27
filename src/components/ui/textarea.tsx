import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface-muted px-3 py-2 text-xs sm:text-sm text-light-ink dark:text-dark-ink placeholder:text-light-ink-subtle dark:placeholder:text-dark-ink-subtle focus-visible:outline-none focus-visible:border-terracotta dark:focus-visible:border-ochre focus-visible:ring-1 focus-visible:ring-terracotta/30 dark:focus-visible:ring-ochre/30 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
