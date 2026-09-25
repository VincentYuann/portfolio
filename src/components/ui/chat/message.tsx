import * as React from 'react';
import { cn } from '../../../lib/utils';

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end';
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, align = 'start', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-align={align}
        className={cn(
          'flex gap-2.5 w-full',
          align === 'end' ? 'justify-end' : 'justify-start',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Message.displayName = 'Message';

export const MessageAvatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('shrink-0 pt-0.5', className)} {...props}>
      {children}
    </div>
  );
});
MessageAvatar.displayName = 'MessageAvatar';

export const MessageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1 min-w-0 max-w-[88%] sm:max-w-[85%]', className)}
      {...props}
    >
      {children}
    </div>
  );
});
MessageContent.displayName = 'MessageContent';

export const MessageHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-2 px-1 text-xs font-serif font-medium text-light-ink dark:text-dark-ink',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
MessageHeader.displayName = 'MessageHeader';

export const MessageFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-2 px-1 text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
MessageFooter.displayName = 'MessageFooter';

export const MessageGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('flex flex-col gap-1.5 w-full', className)} {...props}>
      {children}
    </div>
  );
});
MessageGroup.displayName = 'MessageGroup';
