import React, { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';
import { TechTag } from '../../TechTag';
import { TechTagModal } from '../TechTagModal';
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

  const handleRemove = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-light-ink dark:text-dark-ink flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-ochre" />
          <span>{label}</span>
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="text-terracotta hover:text-terracotta hover:bg-terracotta/10 text-xs h-7 px-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Tag
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2.5 rounded-lg bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border dark:border-dark-border items-center">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 group bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/50 rounded-md pr-1.5 shadow-2xs transition-colors"
          >
            <TechTag tag={tag} size="sm" className="border-0 shadow-none bg-transparent dark:bg-transparent" />
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="text-light-ink-subtle hover:text-red-500 transition-colors p-0.5 cursor-pointer"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {tags.length === 0 && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="font-sans text-xs text-light-ink-subtle dark:text-dark-ink-subtle italic hover:text-terracotta transition-colors cursor-pointer py-0.5"
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
