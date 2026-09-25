import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const labelVariants = cva(
  'text-[10px] font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-widest leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none block',
);

export const RequiredStar: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    aria-hidden="true"
    className={cn('text-terracotta dark:text-terracotta-soft font-black text-sm ml-1 select-none inline-block align-middle leading-none', className)}
    title="Required field"
  >
    *
  </span>
);

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, children, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  >
    {children}
    {required && <RequiredStar />}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
