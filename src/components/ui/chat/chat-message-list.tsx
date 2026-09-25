import * as React from 'react';
import { cn } from '../../../lib/utils';

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smoothScroll?: boolean;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, smoothScroll = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-atomic="false"
        className={cn(
          'flex-1 overflow-y-auto p-4 space-y-4 washi-pattern',
          smoothScroll && 'scroll-smooth',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatMessageList.displayName = 'ChatMessageList';

export { ChatMessageList };
