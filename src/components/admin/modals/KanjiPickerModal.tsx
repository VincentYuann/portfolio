import React, { useState, useMemo } from 'react';
import { Search, Check, BookOpen } from 'lucide-react';
import { KANJI_PRESETS, KanjiPreset, getKanjiPreset } from '../../../lib/kanjiLibrary';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

interface KanjiPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChar: string;
  onSelect: (kanji: string, preset?: KanjiPreset) => void;
  title?: string;
}

export const KanjiPickerModal: React.FC<KanjiPickerModalProps> = ({
  isOpen,
  onClose,
  selectedChar,
  onSelect,
  title = 'Select Japanese Kanji Seal Symbol',
}) => {
  const [search, setSearch] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    KANJI_PRESETS.forEach((p) => set.add(p.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredPresets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return KANJI_PRESETS.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      if (!matchCategory) return false;

      if (!q) return true;
      return (
        p.char.includes(q) ||
        p.romaji.toLowerCase().includes(q) ||
        p.meaning.toLowerCase().includes(q) ||
        p.conceptDescription.toLowerCase().includes(q)
      );
    });
  }, [search, selectedCategory]);

  const activePreset = useMemo(() => {
    return getKanjiPreset(selectedChar);
  }, [selectedChar]);

  const handlePick = (preset: KanjiPreset) => {
    onSelect(preset.char, preset);
    onClose();
  };

  const handleApplyCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const match = getKanjiPreset(trimmed);
    onSelect(trimmed, match);
    setCustomInput('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl lg:max-w-4xl xl:max-w-5xl h-[88vh] max-h-[780px] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-light-border dark:border-dark-border shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-terracotta font-semibold uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-ochre" />
              Traditional Japanese Kanji Library
            </span>
            <span className="text-light-ink-subtle text-xs">·</span>
            <Badge variant="terracotta" className="text-[10px] py-0 px-1.5 font-mono">
              {KANJI_PRESETS.length} Available
            </Badge>
          </div>
          <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Select a symbolic character representing your philosophy, role, or project architecture.
          </DialogDescription>
        </DialogHeader>

        {/* Currently Selected Banner */}
        <div className="px-4 py-2.5 sm:py-3 bg-terracotta/5 dark:bg-terracotta/10 border-b border-light-border/60 dark:border-dark-border/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-terracotta/40 bg-light-surface dark:bg-dark-surface-card flex items-center justify-center font-serif font-black text-terracotta select-none shadow-2xs shrink-0 overflow-hidden p-1">
              <span className={`text-center leading-tight tracking-tight flex items-center justify-center ${
                (selectedChar?.length || 0) > 2
                  ? 'text-[10px] tracking-tighter'
                  : (selectedChar?.length || 0) === 2
                  ? 'text-xs sm:text-sm font-bold'
                  : 'text-xl sm:text-2xl'
              }`}>
                {selectedChar || '-'}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xs sm:text-sm font-semibold text-light-ink dark:text-dark-ink truncate">
                  {activePreset ? `${activePreset.char} · ${activePreset.romaji}` : (selectedChar ? `${selectedChar} (Custom Symbol)` : 'No Kanji Selected')}
                </span>
                {activePreset && (
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono hidden xs:inline-flex">
                    {activePreset.category}
                  </Badge>
                )}
              </div>
              <p className="font-sans text-[11px] sm:text-xs text-light-ink-muted dark:text-dark-ink-muted mt-0.5 truncate">
                {activePreset ? activePreset.meaning : 'Pick from presets below or enter custom.'}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-3 sm:p-4 border-b border-light-border/60 dark:border-dark-border/60 bg-light-surface/40 dark:bg-dark-surface-muted/20 space-y-2 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-ink-subtle pointer-events-none" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 text-xs sm:text-sm w-full"
                placeholder="Search by meaning or romaji (e.g. Tree, Space, Sō, Sumi, Cloud)…"
                aria-label="Search Kanji presets"
                autoFocus
              />
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Input
                type="text"
                maxLength={4}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyCustom();
                  }
                }}
                className="w-20 text-center font-serif text-sm"
                placeholder="Custom"
                aria-label="Enter custom Kanji character"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!customInput.trim()}
                onClick={handleApplyCustom}
                className="text-xs shrink-0 cursor-pointer"
              >
                Use
              </Button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-terracotta text-white font-semibold shadow-xs'
                    : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink-muted dark:text-dark-ink-muted hover:border-terracotta/50 hover:text-light-ink dark:hover:text-dark-ink'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Kanji Cards Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
          {filteredPresets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredPresets.map((preset) => {
                const isSelected = selectedChar === preset.char;
                return (
                  <button
                    key={preset.char}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handlePick(preset)}
                    className={`group relative text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-terracotta/10 border-terracotta ring-1 ring-terracotta shadow-xs'
                        : 'bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border hover:border-terracotta/60 hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised'
                    }`}
                  >
                    {/* Big Kanji Badge */}
                    <div className="w-12 h-12 rounded-lg border border-terracotta/30 bg-light-surface-card dark:bg-dark-canvas flex flex-col items-center justify-center shrink-0 group-hover:border-terracotta transition-colors select-none shadow-2xs">
                      <span className="font-serif text-xl font-bold text-terracotta leading-none">
                        {preset.char}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ochre mt-0.5 font-semibold">
                        {preset.romaji.split('/')[0].trim()}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-serif text-xs font-semibold text-light-ink dark:text-dark-ink truncate group-hover:text-terracotta transition-colors">
                          {preset.meaning}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        )}
                      </div>
                      <p className="font-sans text-[11px] text-light-ink-muted dark:text-dark-ink-muted line-clamp-2 mt-0.5 leading-snug">
                        {preset.conceptDescription}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mb-3">
                No preset found matching &ldquo;{search}&rdquo;.
              </p>
              {search.trim() && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    onSelect(search.trim());
                    onClose();
                  }}
                  className="gap-1.5 text-xs"
                >
                  Use &ldquo;{search.trim()}&rdquo; as Custom Kanji
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-3.5 sm:p-4 border-t border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-muted flex items-center justify-between gap-2 shrink-0">
          <span className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted hidden sm:inline">
            Click any Kanji card to select and close.
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
