import * as React from 'react';
import { cn } from '../../../lib/utils';

export interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onEnterSubmit?: () => void;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, onEnterSubmit, onKeyDown, value, onChange, rows = 1, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

    // Auto-grow textarea height up to 120px
    const handleInput = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e);
        const el = internalRef.current;
        if (el) {
          el.style.height = 'auto';
          el.style.height = `${Math.min(120, Math.max(36, el.scrollHeight))}px`;
        }
      },
      [onChange]
    );

    React.useEffect(() => {
      const el = internalRef.current;
      if (el && (!value || value === '')) {
        el.style.height = '36px';
      }
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onEnterSubmit?.();
        return;
      }
      onKeyDown?.(e);
    };

    return (
      <textarea
        ref={internalRef}
        rows={rows}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex min-h-[36px] max-h-[120px] w-full resize-none bg-transparent px-3 py-2 text-xs sm:text-[13px] text-light-ink dark:text-dark-ink placeholder:text-light-ink-subtle/70 dark:placeholder:text-dark-ink-subtle/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-sans leading-relaxed transition-all',
          className
        )}
        {...props}
      />
    );
  }
);
ChatInput.displayName = 'ChatInput';

export { ChatInput };
