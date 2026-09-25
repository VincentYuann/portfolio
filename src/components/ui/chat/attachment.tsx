import * as React from 'react';
import { cn } from '../../../lib/utils';

export type AttachmentState = 'idle' | 'uploading' | 'processing' | 'error' | 'done';

export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: AttachmentState;
  size?: 'default' | 'sm' | 'xs';
  orientation?: 'horizontal' | 'vertical';
}

export const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  (
    {
      className,
      state = 'done',
      size = 'default',
      orientation = 'horizontal',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-state={state}
        data-size={size}
        data-orientation={orientation}
        className={cn(
          'relative flex items-center justify-between rounded-lg border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface-card transition-all shadow-2xs group',
          size === 'default' && 'p-2.5 gap-3',
          size === 'sm' && 'p-2 gap-2',
          size === 'xs' && 'p-1.5 gap-1.5',
          state === 'error' && 'border-red-500/50 bg-red-500/5 dark:bg-red-500/10',
          (state === 'uploading' || state === 'processing') && 'border-terracotta/40 bg-terracotta/5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Attachment.displayName = 'Attachment';

export interface AttachmentMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'icon' | 'image';
}

export const AttachmentMedia = React.forwardRef<HTMLDivElement, AttachmentMediaProps>(
  ({ className, variant = 'icon', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-variant={variant}
        className={cn(
          'flex items-center justify-center shrink-0 rounded overflow-hidden',
          variant === 'icon' && 'size-9 bg-terracotta/10 text-terracotta border border-terracotta/30',
          variant === 'image' && 'size-9 object-cover border border-light-border dark:border-dark-border',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AttachmentMedia.displayName = 'AttachmentMedia';

export const AttachmentContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('flex flex-col min-w-0 flex-1', className)} {...props}>
      {children}
    </div>
  );
});
AttachmentContent.displayName = 'AttachmentContent';

export const AttachmentTitle = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'truncate text-xs font-sans font-medium text-light-ink dark:text-dark-ink',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
AttachmentTitle.displayName = 'AttachmentTitle';

export const AttachmentDescription = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn('text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle truncate', className)}
      {...props}
    >
      {children}
    </span>
  );
});
AttachmentDescription.displayName = 'AttachmentDescription';

export const AttachmentActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('flex items-center gap-1 shrink-0', className)} {...props}>
      {children}
    </div>
  );
});
AttachmentActions.displayName = 'AttachmentActions';

export const AttachmentAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'size-7 rounded-md flex items-center justify-center text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta hover:bg-terracotta/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
AttachmentAction.displayName = 'AttachmentAction';

export const AttachmentGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 overflow-x-auto scrollbar-none py-1', className)}
      {...props}
    >
      {children}
    </div>
  );
});
AttachmentGroup.displayName = 'AttachmentGroup';
