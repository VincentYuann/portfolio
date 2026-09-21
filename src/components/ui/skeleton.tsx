import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  shimmer = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-light-surface-muted/70 dark:bg-dark-surface-muted/90',
        shimmer &&
          'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/5 before:to-transparent',
        'animate-pulse duration-1000',
        className
      )}
      {...props}
    />
  );
};
