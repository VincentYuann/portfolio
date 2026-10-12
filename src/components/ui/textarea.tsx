import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-[2px] border border-light-border/90 dark:border-dark-border/80 bg-light-surface-muted/65 dark:bg-[#16181D] px-3 py-2 text-xs sm:text-sm text-light-ink dark:text-dark-ink placeholder:text-light-ink-subtle/70 dark:placeholder:text-dark-ink-subtle/70 focus-visible:outline-none focus-visible:bg-light-surface dark:focus-visible:bg-[#1C1E26] focus-visible:border-terracotta dark:focus-visible:border-ochre focus-visible:ring-1 focus-visible:ring-terracotta/25 dark:focus-visible:ring-ochre/25 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y shadow-2xs',
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
