import React from 'react';
import { Plus, X, ListChecks } from 'lucide-react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';

interface BulletListEditorProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const BulletListEditor: React.FC<BulletListEditorProps> = ({
  bullets,
  onChange,
  label = 'Engineering Contributions & Quantified Impact',
  placeholder = 'Describe a technical contribution or quantified architectural metric…',
  className = '',
}) => {
  const safeBullets = bullets.length > 0 ? bullets : [''];

  const updateBullet = (idx: number, val: string) => {
    const next = [...safeBullets];
    next[idx] = val;
    onChange(next);
  };

  const addBullet = (insertAfterIdx?: number) => {
    if (typeof insertAfterIdx === 'number') {
      const next = [...safeBullets];
      next.splice(insertAfterIdx + 1, 0, '');
      onChange(next);
    } else {
      onChange([...safeBullets, '']);
    }
  };

  const removeBullet = (idx: number) => {
    if (safeBullets.length === 1) {
      onChange(['']);
    } else {
      onChange(safeBullets.filter((_, i) => i !== idx));
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBullet(idx);
    } else if (e.key === 'Backspace' && safeBullets[idx] === '' && safeBullets.length > 1) {
      e.preventDefault();
      removeBullet(idx);
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-light-ink dark:text-dark-ink flex items-center gap-1.5">
          <ListChecks className="w-3.5 h-3.5 text-ochre" />
          <span>{label}</span>
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addBullet()}
          className="text-terracotta hover:text-terracotta hover:bg-terracotta/10 text-xs h-7 px-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Point
        </Button>
      </div>

      <div className="space-y-2.5">
        {safeBullets.map((bullet, idx) => (
          <div key={idx} className="flex items-start gap-2.5 group">
            <span className="font-mono text-[10px] font-semibold text-terracotta dark:text-[#ff7d63] bg-terracotta/10 dark:bg-terracotta/15 border border-terracotta/30 rounded px-1.5 py-1 select-none shrink-0 mt-1 shadow-2xs">
              #{String(idx + 1).padStart(2, '0')}
            </span>
            <Textarea
              rows={2}
              value={bullet}
              onChange={(e) => updateBullet(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              placeholder={placeholder}
              className="text-xs font-sans resize-none py-2 px-3 leading-relaxed flex-1 min-h-[52px]"
            />
            <button
              type="button"
              onClick={() => removeBullet(idx)}
              className="text-light-ink-subtle hover:text-red-500 p-1.5 rounded hover:bg-light-surface dark:hover:bg-[#20222a] transition-colors cursor-pointer shrink-0 mt-1"
              title="Remove point"
              aria-label={`Remove point ${idx + 1}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <p className="font-sans text-[11px] text-light-ink-subtle dark:text-dark-ink-subtle flex items-center gap-1.5 flex-wrap">
        <span>Quick keys:</span>
        <kbd className="font-mono px-1 py-0.5 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded text-[10px]">Enter</kbd>
        <span>new point</span>
        <span className="opacity-40">·</span>
        <kbd className="font-mono px-1 py-0.5 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded text-[10px]">Shift+Enter</kbd>
        <span>newline</span>
        <span className="opacity-40">·</span>
        <kbd className="font-mono px-1 py-0.5 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded text-[10px]">Backspace</kbd>
        <span>delete empty</span>
      </p>
    </div>
  );
};
