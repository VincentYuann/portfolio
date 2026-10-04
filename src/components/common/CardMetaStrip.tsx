import React from 'react';
import { Calendar } from 'lucide-react';
import { StatusBadge, StatusBadgeProps } from './StatusBadge';

export interface CardMetaStripProps {
  index?: number | string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  activeLabel?: string;
  completedLabel?: string;
  category?: string;
  categoryStyle?: string;
  statusBadgeProps?: Partial<StatusBadgeProps>;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * Universal Card Metadata Ribbon
 * Centralizes the index sequence badge (#01), category pill, date range,
 * and dynamic active/completed status badge across all card types in the portfolio.
 */
export const CardMetaStrip: React.FC<CardMetaStripProps> = ({
  index,
  startDate,
  endDate,
  isActive,
  activeLabel = 'ACTIVE / 稼働中',
  completedLabel = 'COMPLETED / 完了',
  category,
  categoryStyle = '',
  statusBadgeProps,
  className = '',
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const hasDate = Boolean(startDate || endDate);
  const formattedIndex =
    index !== undefined
      ? typeof index === 'number'
        ? `#${String(index).padStart(2, '0')}`
        : index.startsWith('#')
        ? index
        : `#${index}`
      : null;

  const dateText = hasDate
    ? `${startDate || ''}${startDate && endDate ? ' — ' : ''}${endDate || (isActive ? 'Present' : '')}`
    : null;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 font-mono text-light-ink-muted dark:text-dark-ink-muted select-none ${
        isSm ? 'text-2xs mb-2' : 'text-xs mb-2.5'
      } ${className}`}
    >
      {/* Universal Sequence Index Badge */}
      {formattedIndex && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-[2px] font-mono text-2xs font-semibold bg-light-surface-raised dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink-muted dark:text-dark-ink-muted shrink-0">
          {formattedIndex}
        </span>
      )}

      {/* Optional Category Pill */}
      {category && (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-2xs font-mono uppercase tracking-wider border font-medium ${categoryStyle}`}
        >
          {category}
        </span>
      )}

      {/* Date Range with Standardized Calendar Icon */}
      {dateText && (
        <span
          className={`inline-flex items-center gap-1.5 font-medium tracking-wider uppercase ${
            isSm ? 'text-2xs' : 'text-xs'
          }`}
        >
          <Calendar className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} opacity-75 shrink-0`} />
          <span>{dateText}</span>
        </span>
      )}

      {/* Standardized Themed Status Badge */}
      {isActive !== undefined && (
        <StatusBadge
          isActive={isActive}
          activeLabel={activeLabel}
          completedLabel={completedLabel}
          size={isSm ? 'sm' : 'md'}
          {...statusBadgeProps}
        />
      )}
    </div>
  );
};
