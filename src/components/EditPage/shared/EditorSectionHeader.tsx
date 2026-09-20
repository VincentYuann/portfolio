import React from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2, Plus } from 'lucide-react';
import { Button } from '../../ui/button';

export type SaveState = 'idle' | 'saving' | 'success' | 'error';

interface EditorSectionHeaderProps {
  title: string;
  subtitle?: string;
  saveState: SaveState;
  onSave: () => void;
  saveLabel?: string;
  onAdd?: () => void;
  addLabel?: string;
  addDisabled?: boolean;
  extraActions?: React.ReactNode;
}

export const EditorSectionHeader: React.FC<EditorSectionHeaderProps> = ({
  title,
  subtitle,
  saveState,
  onSave,
  saveLabel = 'Save Changes',
  onAdd,
  addLabel = 'Add Item',
  addDisabled = false,
  extraActions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-light-border/70 dark:border-dark-border/70 mb-8">
      {/* Title & Description */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-light-ink dark:text-dark-ink font-normal tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 w-full md:w-auto justify-start md:justify-end">
        {extraActions && <div className="w-full sm:w-auto shrink-0">{extraActions}</div>}

        <div className="flex items-center gap-2 sm:gap-2.5 flex-1 sm:flex-initial">
          {onAdd && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAdd}
              disabled={addDisabled}
              className="text-xs h-9 px-3.5 flex-1 sm:flex-initial border-light-border dark:border-dark-border hover:border-terracotta/60 hover:text-terracotta cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5 text-terracotta shrink-0" />
              <span>{addLabel}</span>
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            onClick={onSave}
            disabled={saveState === 'saving'}
            className={`text-xs h-9 px-4 flex-1 sm:flex-initial font-medium transition-all duration-200 cursor-pointer ${
              saveState === 'success'
                ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                : saveState === 'error'
                ? 'bg-rose-600 hover:bg-rose-600 text-white'
                : 'bg-terracotta hover:bg-terracotta-hover text-white shadow-xs'
            }`}
          >
            {saveState === 'saving' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveState === 'success' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                <span>Saved</span>
              </>
            ) : saveState === 'error' ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                <span>Retry Save</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                <span>{saveLabel}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
