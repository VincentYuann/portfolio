import React, { useState } from 'react';
import { Plus, X, Tag, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { TechTag } from '../../common/TechTag';
import { TechTagModal } from '../modals/TechTagModal';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';

interface TechTagSelectorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  className?: string;
}

export const TechTagSelector: React.FC<TechTagSelectorProps> = ({
  tags,
  onChange,
  label = 'Tech Stack & Substrates',
  className = '',
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Clean and filter out corrupt Unicode replacement characters (U+FFFD), empty tokens, or punctuation
  const cleanTags = tags.filter(
    (t) => Boolean(t && t.trim() && !t.includes('\uFFFD') && !/^[\s·,・•|/]+$/.test(t))
  );

  const handleRemove = (indexToRemove: number) => {
    onChange(cleanTags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= cleanTags.length || fromIndex === toIndex) return;
    const next = [...cleanTags];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  };

  const handleDragStart = (idx: number) => (e: React.DragEvent<HTMLSpanElement>) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const handleDragOver = (idx: number) => (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== idx) {
      setDragOverIdx(idx);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDrop = (targetIdx: number) => (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (draggedIdx !== null && draggedIdx !== targetIdx) {
      handleMove(draggedIdx, targetIdx);
    }
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-light-ink dark:text-dark-ink flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-ochre" />
          <span>{label}</span>
          {cleanTags.length > 1 && (
            <span className="font-mono text-2xs text-light-ink-subtle font-normal">
              (drag or click arrows to reorder)
            </span>
          )}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="text-terracotta dark:text-[#D4A853] hover:text-terracotta dark:hover:text-[#D4A853] hover:bg-terracotta/10 dark:hover:bg-[#D4A853]/10 text-xs h-7 px-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Tag
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5 min-h-[36px] py-1.5 items-center">
        {cleanTags.map((tag, idx) => {
          const isDragging = draggedIdx === idx;
          const isOver = dragOverIdx === idx;

          return (
            <span
              key={`${tag}-${idx}`}
              draggable
              onDragStart={handleDragStart(idx)}
              onDragOver={handleDragOver(idx)}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop(idx)}
              title="Drag to reposition or use arrows"
              className={`inline-flex items-center gap-1 group bg-light-surface dark:bg-dark-surface border rounded-md shadow-2xs transition-all select-none cursor-grab active:cursor-grabbing pl-1.5 pr-1 py-0.5 ${
                isDragging
                  ? 'opacity-40 scale-95 border-dashed border-terracotta dark:border-ochre'
                  : isOver
                  ? 'border-terracotta dark:border-ochre ring-1 ring-terracotta/40 dark:ring-ochre/40 scale-[1.02]'
                  : 'border-light-border dark:border-dark-border hover:border-terracotta/50 dark:hover:border-[#D4A853]/50'
              }`}
            >
              {/* Grip Indicator */}
              <GripVertical className="w-3.5 h-3.5 text-light-ink-subtle/50 group-hover:text-light-ink-muted dark:group-hover:text-dark-ink-muted transition-colors shrink-0" />

              {/* Tag Component */}
              <TechTag tag={tag} size="sm" className="border-0 shadow-none bg-transparent dark:bg-transparent pointer-events-none p-0" />

              {/* Position Nudge Controls (visible on hover for precision & accessibility) */}
              {cleanTags.length > 1 && (
                <span className="hidden sm:inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5 ml-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(idx, idx - 1);
                    }}
                    className="text-light-ink-subtle hover:text-light-ink dark:hover:text-dark-ink disabled:opacity-20 disabled:hover:text-light-ink-subtle p-0.5 rounded cursor-pointer"
                    aria-label={`Move ${tag} left`}
                    title="Move left"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === cleanTags.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(idx, idx + 1);
                    }}
                    className="text-light-ink-subtle hover:text-light-ink dark:hover:text-dark-ink disabled:opacity-20 disabled:hover:text-light-ink-subtle p-0.5 rounded cursor-pointer"
                    aria-label={`Move ${tag} right`}
                    title="Move right"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className="text-light-ink-subtle hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer ml-0.5"
                aria-label={`Remove ${tag}`}
                title={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}

        {cleanTags.length === 0 && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="font-sans text-xs text-light-ink-subtle dark:text-dark-ink-subtle italic hover:text-terracotta dark:hover:text-[#D4A853] transition-colors cursor-pointer py-0.5"
          >
            + Click to select official technology logo tags…
          </button>
        )}
      </div>

      <TechTagModal
        isOpen={modalOpen}
        selectedTags={tags}
        onChange={onChange}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
