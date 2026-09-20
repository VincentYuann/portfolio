import React from 'react';
import { Plus, X, ListChecks } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
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

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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

      <div className="space-y-2">
        {safeBullets.map((bullet, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            <span className="font-mono text-[11px] text-terracotta/70 select-none w-5 text-right shrink-0">
              {idx + 1}.
            </span>
            <Input
              value={bullet}
              onChange={(e) => updateBullet(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              placeholder={placeholder}
              className="text-xs h-8.5 font-sans"
            />
            <button
              type="button"
              onClick={() => removeBullet(idx)}
              className="text-light-ink-subtle hover:text-red-500 p-1 rounded hover:bg-light-surface dark:hover:bg-[#20222a] transition-colors cursor-pointer shrink-0"
              title="Remove this point"
              aria-label={`Remove point ${idx + 1}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <p className="font-sans text-[11px] text-light-ink-subtle dark:text-dark-ink-subtle">
        Tip: Press <kbd className="font-mono px-1 py-0.5 bg-light-surface dark:bg-dark-surface border rounded text-[10px]">Enter</kbd> to add a new point, or <kbd className="font-mono px-1 py-0.5 bg-light-surface dark:bg-dark-surface border rounded text-[10px]">Backspace</kbd> on an empty line to remove.
      </p>
    </div>
  );
};
