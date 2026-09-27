import React, { useState, useRef, useEffect } from 'react';
import { useVariant, TYPOGRAPHY_VARIANTS, TypographyVariantId } from '../../context/VariantContext';
import { ViewMode } from '../../App';
import { Check, X, ChevronDown, Sparkles, ArrowRight, Type } from 'lucide-react';

interface FontSettingsMenuProps {
  onNavigate?: (view: ViewMode) => void;
  isMobileDrawer?: boolean;
}

// Top 3 Curated Core Aesthetics (Fixed exactly to 3)
const TOP_CURATED_IDS: TypographyVariantId[] = ['v4', 'v1', 'v5'];

export const FontSettingsMenu: React.FC<FontSettingsMenuProps> = ({
  onNavigate,
  isMobileDrawer = false,
}) => {
  const { variant, setVariant } = useVariant();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentInfo = TYPOGRAPHY_VARIANTS[variant] || TYPOGRAPHY_VARIANTS.v4;

  // Always show exactly the top 3 curated archetypes in the quick switcher
  const quickVariants = TOP_CURATED_IDS.map((id) => TYPOGRAPHY_VARIANTS[id]).filter(Boolean);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    if (!isOpen || isMobileDrawer) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isMobileDrawer]);

  const handleGoToVisualSystem = () => {
    setIsOpen(false);
    onNavigate?.('visual-system');
  };

  // Mobile Drawer Inline View
  if (isMobileDrawer) {
    return (
      <div className="pt-3 pb-2 border-t border-light-border/60 dark:border-dark-border/60">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-terracotta dark:text-ochre text-[11px] font-mono font-bold uppercase tracking-wider">
              [体系]
            </span>
            <span className="text-xs font-semibold text-light-ink dark:text-dark-ink">
              Visual System Studio
            </span>
          </div>
          <button
            onClick={handleGoToVisualSystem}
            className="text-[11px] font-mono text-terracotta dark:text-ochre hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {quickVariants.map((v) => {
            const isSelected = v.id === variant;
            return (
              <button
                key={v.id}
                onClick={() => setVariant(v.id)}
                className={`w-full text-left px-3 py-2 rounded-[2px] transition-all flex items-center justify-between border cursor-pointer ${
                  isSelected
                    ? 'bg-terracotta/10 dark:bg-ochre/10 border-terracotta/40 dark:border-ochre/40 shadow-2xs text-terracotta dark:text-ochre font-semibold'
                    : 'border-transparent text-light-ink-muted dark:text-dark-ink-muted hover:bg-light-surface-raised dark:hover:bg-dark-surface hover:text-light-ink dark:hover:text-dark-ink'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-mono font-bold opacity-80">0{v.numericKey}</span>
                  <span className="text-xs truncate">{v.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-serif opacity-70 px-1 py-0.2 rounded bg-light-canvas dark:bg-dark-canvas">
                    {v.kanji}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-terracotta dark:text-ochre shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop Navbar Segmented Popover View
  return (
    <div className="relative" ref={popoverRef}>
      {/* Navbar Trigger Button: Compact 2px corner symbol control right beside DAY/NIGHT */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-[2px] border text-[11px] select-none shadow-2xs font-sans transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'bg-light-surface-raised dark:bg-dark-surface-raised border-terracotta/60 dark:border-ochre/60 text-terracotta dark:text-ochre shadow-xs'
            : 'bg-light-surface-card dark:bg-dark-surface border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink hover:border-light-border-strong dark:hover:border-dark-border-strong hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised'
        }`}
        title={`Visual System & Typography (Active: ${currentInfo.name})`}
        aria-label="Design & Typography Settings"
        aria-expanded={isOpen}
      >
        <Type className="w-3 h-3 text-terracotta dark:text-ochre shrink-0" />
        <span className="font-semibold tracking-wider uppercase text-[10px] sm:text-[11px]">
          FONT
        </span>
        <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-light-canvas dark:bg-dark-canvas text-light-ink-muted dark:text-dark-ink-muted">
          0{currentInfo.numericKey}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-light-ink-subtle dark:text-dark-ink-subtle transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-terracotta dark:text-ochre' : ''
          }`}
        />
      </button>

      {/* Popover Quick Access Dropdown Menu (Distilled & Perfectly Positioned) */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-72 p-2.5 bg-light-surface dark:bg-dark-panel border border-light-border dark:border-dark-border shadow-2xl rounded-[2px] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 z-50 double-hairline"
          style={{
            boxShadow: '0 20px 48px -8px rgba(0,0,0,0.45), inset 0 0 0 1px var(--border-channel-fill)',
          }}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-light-border/40 dark:border-dark-border/60">
            <div className="flex items-center gap-1.5">
              <span className="text-terracotta dark:text-ochre text-[11px] font-mono font-bold tracking-wider uppercase">
                [字 · 書体]
              </span>
              <span className="text-[11px] font-semibold text-light-ink dark:text-dark-ink">
                Typography
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-light-ink-subtle dark:text-dark-ink-subtle hover:text-light-ink dark:hover:text-dark-ink transition-colors rounded-[2px] cursor-pointer"
              aria-label="Close font switcher"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Distilled Curated Options */}
          <div className="space-y-1 mb-2">
            {quickVariants.map((v) => {
              const isSelected = v.id === variant;
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setVariant(v.id);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-all flex items-center justify-between group border cursor-pointer ${
                    isSelected
                      ? 'bg-terracotta/10 dark:bg-ochre/10 border-terracotta/40 dark:border-ochre/40 shadow-2xs'
                      : 'border-transparent hover:bg-light-canvas/70 dark:hover:bg-dark-canvas/60 hover:border-light-border/40 dark:hover:border-dark-border/40'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-bold text-terracotta dark:text-ochre">
                        0{v.numericKey}
                      </span>
                      <span className="text-[11px] font-semibold text-light-ink dark:text-dark-ink truncate">
                        {v.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-light-ink-muted dark:text-dark-ink-muted leading-tight truncate">
                      <span className="font-medium text-light-ink dark:text-dark-ink">{v.displayFont}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-4 h-4 rounded-[2px] bg-light-canvas dark:bg-dark-canvas border border-light-border/60 dark:border-dark-border/60 flex items-center justify-center text-[10px] font-serif text-light-ink-subtle dark:text-dark-ink-subtle select-none">
                      {v.kanji}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Clean Distilled Entry Point to Visual System Studio */}
          <div className="pt-1.5 border-t border-light-border/40 dark:border-dark-border/60">
            <button
              onClick={handleGoToVisualSystem}
              className="w-full py-2 px-2.5 rounded-[2px] bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light text-[11px] font-sans font-semibold flex items-center justify-between hover:opacity-90 transition-opacity cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-ochre shrink-0" />
                <span>View All in Visual System Studio</span>
              </div>
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
