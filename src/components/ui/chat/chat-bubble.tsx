import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const chatBubbleVariants = cva('flex gap-2.5 max-w-[90%] sm:max-w-[85%]', {
  variants: {
    variant: {
      sent: 'ml-auto flex-row-reverse items-end',
      received: 'mr-auto flex-row items-start',
    },
  },
  defaultVariants: {
    variant: 'received',
  },
});

interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariants> {}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(chatBubbleVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
);
ChatBubble.displayName = 'ChatBubble';

interface ChatBubbleAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  fallback?: React.ReactNode;
}

const ChatBubbleAvatar = React.forwardRef<HTMLDivElement, ChatBubbleAvatarProps>(
  ({ className, fallback, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 select-none text-xs font-serif font-bold shadow-xs',
        className
      )}
      {...props}
    >
      {children || fallback}
    </div>
  )
);
ChatBubbleAvatar.displayName = 'ChatBubbleAvatar';

const chatBubbleMessageVariants = cva(
  'relative rounded-xl p-3 sm:p-3.5 text-xs sm:text-[13px] leading-relaxed transition-colors',
  {
    variants: {
      variant: {
        sent: 'bg-light-button-dark dark:bg-dark-surface-raised text-light-on-dark dark:text-dark-ink border border-light-border dark:border-dark-border-strong rounded-br-xs shadow-xs',
        received:
          'bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink rounded-bl-xs shadow-xs',
      },
    },
    defaultVariants: {
      variant: 'received',
    },
  }
);

interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleMessageVariants> {
  isLoading?: boolean;
}

const ChatBubbleMessage = React.forwardRef<HTMLDivElement, ChatBubbleMessageProps>(
  ({ className, variant, isLoading, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(chatBubbleMessageVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
);
ChatBubbleMessage.displayName = 'ChatBubbleMessage';

const ChatBubbleTimestamp = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'font-mono text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle tracking-wider uppercase select-none',
      className
    )}
    {...props}
  />
));
ChatBubbleTimestamp.displayName = 'ChatBubbleTimestamp';

export {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  chatBubbleVariants,
  chatBubbleMessageVariants,
};
