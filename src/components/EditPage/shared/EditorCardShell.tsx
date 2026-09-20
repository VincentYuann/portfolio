import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Trash2,
  GripVertical,
  AlertTriangle,
} from 'lucide-react';
import { CornerBrackets } from '../../CornerBrackets';
import { Badge } from '../../ui/badge';

interface EditorCardShellProps {
  ordinal: number;
  title: string;
  subtitle?: string;
  emblem?: React.ReactNode;
  badge?: React.ReactNode;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onDelete: () => void;
  children: React.ReactNode;
  className?: string;
}

export const EditorCardShell: React.FC<EditorCardShellProps> = ({
  ordinal,
  title,
  subtitle,
  emblem,
  badge,
  isExpanded,
  onToggleExpand,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  onDelete,
  children,
  className = '',
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, []);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      setIsDeleting(false);
      onDelete();
    } else {
      setIsDeleting(true);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = setTimeout(() => {
        setIsDeleting(false);
      }, 3500);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    setIsDeleting(false);
  };

  return (
    <div
      className={`relative rounded-xl border bg-light-surface-card dark:bg-[#181920] transition-all duration-200 classical-card-frame shadow-xs ${
        isExpanded
          ? 'border-terracotta/40 dark:border-terracotta/40 ring-1 ring-terracotta/10 shadow-sm'
          : 'border-light-border dark:border-dark-border hover:border-ochre/40'
      } ${className}`}
    >
      <CornerBrackets size="sm" />

      {/* Accordion Header / Scannable Bar */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleExpand}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleExpand();
          }
        }}
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-5 gap-3 cursor-pointer select-none group"
      >
        {/* Left: Drag Handle, Ordinal Badge, Emblem & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          <div className="text-light-ink-subtle/50 dark:text-dark-ink-subtle/50 group-hover:text-terracotta transition-colors hidden sm:block shrink-0">
            <GripVertical className="w-4 h-4" />
          </div>

          <Badge variant="terracotta" className="font-mono text-xs px-2 py-0.5 shrink-0">
            #{String(ordinal).padStart(2, '0')}
          </Badge>

          {emblem && <div className="shrink-0">{emblem}</div>}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif text-base sm:text-lg font-medium text-light-ink dark:text-dark-ink truncate group-hover:text-terracotta transition-colors">
                {title || <span className="italic text-light-ink-subtle font-sans text-sm">Untitled Entry</span>}
              </h3>
              {badge}
            </div>
            {subtitle && (
              <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions Toolbar */}
        <div
          className="flex items-center gap-1 shrink-0 sm:self-center self-end"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Move Up */}
          {onMoveUp && (
            <button
              type="button"
              disabled={!canMoveUp}
              onClick={onMoveUp}
              title="Move item up in display order"
              aria-label="Move item up"
              className="min-w-[34px] min-h-[34px] sm:min-w-[30px] sm:min-h-[30px] flex items-center justify-center text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta disabled:opacity-20 disabled:pointer-events-none rounded-md hover:bg-light-surface dark:hover:bg-[#20222a] transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Move Down */}
          {onMoveDown && (
            <button
              type="button"
              disabled={!canMoveDown}
              onClick={onMoveDown}
              title="Move item down in display order"
              aria-label="Move item down"
              className="min-w-[34px] min-h-[34px] sm:min-w-[30px] sm:min-h-[30px] flex items-center justify-center text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta disabled:opacity-20 disabled:pointer-events-none rounded-md hover:bg-light-surface dark:hover:bg-[#20222a] transition-colors cursor-pointer"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}

          {/* 2-Step Deletion Button */}
          {isDeleting ? (
            <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={handleDeleteClick}
                className="px-2.5 py-1 text-xs font-mono font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md shadow-xs transition-colors flex items-center gap-1 cursor-pointer min-h-[34px]"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-2 py-1 text-xs font-mono text-light-ink-muted hover:text-light-ink dark:text-dark-ink-muted dark:hover:text-dark-ink rounded-md transition-colors cursor-pointer min-h-[34px]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDeleteClick}
              title="Delete item"
              aria-label="Delete item"
              className="min-w-[34px] min-h-[34px] sm:min-w-[30px] sm:min-h-[30px] flex items-center justify-center text-light-ink-muted dark:text-dark-ink-muted hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Expand / Collapse Indicator */}
          <button
            type="button"
            onClick={onToggleExpand}
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
            className="min-w-[34px] min-h-[34px] sm:min-w-[30px] sm:min-h-[30px] flex items-center justify-center text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta rounded-md hover:bg-light-surface dark:hover:bg-[#20222a] transition-colors cursor-pointer ml-0.5"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content Drawer */}
      {isExpanded && (
        <div className="p-3.5 sm:p-6 pt-2 sm:pt-3 border-t border-light-border/60 dark:border-dark-border/60 space-y-5 animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};
