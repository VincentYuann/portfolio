import * as React from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface MessageScrollerContextValue {
  isAtBottom: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  viewportRef: React.MutableRefObject<HTMLDivElement | null>;
}

const MessageScrollerContext = React.createContext<MessageScrollerContextValue | null>(null);

export const useMessageScroller = () => {
  const context = React.useContext(MessageScrollerContext);
  if (!context) {
    throw new Error('useMessageScroller must be used within a MessageScrollerProvider');
  }
  return context;
};

interface MessageScrollerProviderProps {
  children: React.ReactNode;
  autoScroll?: boolean;
}

export const MessageScrollerProvider: React.FC<MessageScrollerProviderProps> = ({
  children,
  autoScroll = true,
}) => {
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const userHasScrolledUpRef = React.useRef(false);

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior,
      });
      userHasScrolledUpRef.current = false;
      setIsAtBottom(true);
    }
  }, []);

  const handleScroll = React.useCallback(() => {
    if (!viewportRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    const atBottom = distanceToBottom < 40;

    setIsAtBottom(atBottom);
    if (!atBottom) {
      userHasScrolledUpRef.current = true;
    } else {
      userHasScrolledUpRef.current = false;
    }
  }, []);

  // Set up scroll listener
  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Auto-scroll when children change, only if user hasn't scrolled up
  React.useEffect(() => {
    if (autoScroll && !userHasScrolledUpRef.current) {
      scrollToBottom('smooth');
    }
  });

  return (
    <MessageScrollerContext.Provider value={{ isAtBottom, scrollToBottom, viewportRef }}>
      {children}
    </MessageScrollerContext.Provider>
  );
};

export const MessageScroller = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative flex flex-col flex-1 min-h-0 overflow-hidden', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageScroller.displayName = 'MessageScroller';

export const MessageScrollerViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { viewportRef } = useMessageScroller();

  const handleCombinedRef = (node: HTMLDivElement | null) => {
    viewportRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  return (
    <div
      ref={handleCombinedRef}
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic="false"
      className={cn('flex-1 overflow-y-auto scrollbar-none washi-pattern', className)}
      {...props}
    >
      {children}
    </div>
  );
});
MessageScrollerViewport.displayName = 'MessageScrollerViewport';

export const MessageScrollerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('flex flex-col gap-4 p-4', className)} {...props}>
      {children}
    </div>
  );
});
MessageScrollerContent.displayName = 'MessageScrollerContent';

export interface MessageScrollerItemProps extends React.HTMLAttributes<HTMLDivElement> {
  messageId?: string;
  scrollAnchor?: boolean;
}

export const MessageScrollerItem = React.forwardRef<HTMLDivElement, MessageScrollerItemProps>(
  ({ className, messageId, scrollAnchor, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        id={messageId ? `msg-${messageId}` : undefined}
        data-scroll-anchor={scrollAnchor ? 'true' : undefined}
        className={cn('w-full', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageScrollerItem.displayName = 'MessageScrollerItem';

export interface MessageScrollerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction?: 'start' | 'end';
}

export const MessageScrollerButton = React.forwardRef<
  HTMLButtonElement,
  MessageScrollerButtonProps
>(({ className, direction = 'end', onClick, ...props }, ref) => {
  const { isAtBottom, scrollToBottom } = useMessageScroller();

  if (isAtBottom && direction === 'end') {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      scrollToBottom('smooth');
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={cn(
        'absolute bottom-3 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-terracotta/40 bg-light-surface-card dark:bg-dark-surface-card hover:bg-light-surface-raised dark:hover:bg-dark-surface text-light-ink dark:text-dark-ink text-xs font-mono shadow-md hover:shadow-lg transition-all animate-in fade-in zoom-in-95 duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-1',
        className
      )}
      aria-label="Scroll to newest messages"
      {...props}
    >
      <ArrowDown className="size-3.5 text-terracotta" />
      <span className="font-sans text-[11px] font-medium text-light-ink dark:text-dark-ink">
        Latest
      </span>
    </button>
  );
});
MessageScrollerButton.displayName = 'MessageScrollerButton';
