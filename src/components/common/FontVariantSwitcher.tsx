import React, { useState } from 'react';
import { useVariant, TYPOGRAPHY_VARIANTS } from '../../context/VariantContext';
import { Check, X, ChevronRight, Eye } from 'lucide-react';

export const FontVariantSwitcher: React.FC = () => {
  const { variant, setVariant, variantsList } = useVariant();
  const [isOpen, setIsOpen] = useState(false);
  const [showSpecimenModal, setShowSpecimenModal] = useState(false);

  const currentInfo = TYPOGRAPHY_VARIANTS[variant];

  return (
    <>
      {/* Floating Tactical Typography Dock */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2 pointer-events-auto">
        {/* Expanded Quick Switch Menu */}
        {isOpen && (
          <div
            className="w-80 p-3 bg-light-surface dark:bg-dark-panel border border-light-border dark:border-dark-border shadow-2xl rounded-sm backdrop-blur-md animate-view-enter mb-2 double-hairline"
            style={{
              boxShadow: '0 20px 48px -8px rgba(0,0,0,0.35), inset 0 0 0 1px var(--border-channel-fill)',
            }}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-light-border/40 dark:border-dark-border/60">
              <div className="flex items-center gap-1.5">
                <span className="text-terracotta dark:text-ochre text-xs font-mono font-bold tracking-wider uppercase">
                  [字 · 書体]
                </span>
                <span className="text-xs font-semibold text-light-ink dark:text-dark-ink">
                  Typography Tastes
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-light-ink-subtle dark:text-dark-ink-subtle hover:text-light-ink dark:hover:text-dark-ink transition-colors rounded-sm"
                aria-label="Close font switcher"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-light-ink-muted dark:text-dark-ink-muted mb-3 leading-relaxed">
              Experience 7 curated typographic voices across the entire portfolio in real time.
            </p>

            <div className="space-y-1.5">
              {variantsList.map((v) => {
                const isSelected = v.id === variant;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setVariant(v.id);
                    }}
                    className={`w-full text-left p-2 rounded-sm transition-all flex items-start justify-between group border ${
                      isSelected
                        ? 'bg-terracotta/10 dark:bg-ochre/10 border-terracotta/40 dark:border-ochre/40 shadow-sm'
                        : 'border-transparent hover:bg-light-canvas/60 dark:hover:bg-dark-canvas/50 hover:border-light-border/40 dark:hover:border-dark-border/40'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">
                          {v.numericKey}
                        </span>
                        <span className="text-xs font-semibold text-light-ink dark:text-dark-ink truncate">
                          {v.name}
                        </span>
                        <span className="text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle font-serif">
                          {v.kanji}
                        </span>
                      </div>
                      <div className="text-[10px] text-light-ink-muted dark:text-dark-ink-muted mt-0.5 truncate">
                        <span className="font-semibold">{v.displayFont}</span> + {v.bodyFont} + {v.monoFont}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-terracotta dark:text-ochre flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-light-border/40 dark:border-dark-border/60 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowSpecimenModal(true);
                  setIsOpen(false);
                }}
                className="text-[11px] font-mono text-terracotta dark:text-ochre hover:underline flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                Compare Specimen Sheet
              </button>
              <span className="text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle">
                Active: {currentInfo.numericKey}/7
              </span>
            </div>
          </div>
        )}

        {/* Floating Capsule Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2 px-3 py-2 bg-light-surface/95 dark:bg-dark-panel/95 backdrop-blur-md border border-light-border dark:border-dark-border rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 double-hairline text-light-ink dark:text-dark-ink"
          title="Toggle Typography System"
        >
          <div className="w-2 h-2 rounded-full bg-terracotta dark:bg-ochre animate-pulse" />
          <span className="text-[11px] font-mono font-medium tracking-wide">
            Font: <span className="font-bold text-terracotta dark:text-ochre">{currentInfo.name.split(' ')[0]}</span>
          </span>
          <span className="text-[10px] font-serif opacity-75 hidden sm:inline">
            {currentInfo.kanji}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-light-canvas dark:bg-dark-canvas text-light-ink-muted dark:text-dark-ink-muted font-mono">
            {currentInfo.numericKey}/7
          </span>
        </button>
      </div>

      {/* Comparison Specimen Modal */}
      {showSpecimenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-view-enter">
          <div
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-sm p-6 sm:p-8 double-hairline shadow-2xl relative"
            style={{
              boxShadow: '0 24px 64px -12px rgba(0,0,0,0.5), inset 0 0 0 1px var(--border-channel-fill)',
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-light-border/50 dark:border-dark-border/60 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre uppercase tracking-wider">
                    [Typography Tasting Laboratory]
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-light-canvas dark:bg-dark-canvas text-light-ink-muted dark:text-dark-ink-muted">
                    7 Distinct Aesthetics
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-light-ink dark:text-dark-ink font-normal tracking-tight">
                  Typographic Identity Comparison
                </h2>
                <p className="text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted mt-1 max-w-2xl">
                  Evaluate how each font system reshapes the tone, rhythm, and architectural hierarchy of Vincent Yuan's portfolio. Click any variant card below to activate it site-wide.
                </p>
              </div>
              <button
                onClick={() => setShowSpecimenModal(false)}
                className="p-2 text-light-ink-subtle dark:text-dark-ink-subtle hover:text-light-ink dark:hover:text-dark-ink rounded-sm transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Variant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {variantsList.map((v) => {
                const isActive = v.id === variant;
                return (
                  <div
                    key={v.id}
                    onClick={() => setVariant(v.id)}
                    className={`relative cursor-pointer p-5 rounded-sm border transition-all duration-300 ${
                      isActive
                        ? 'border-terracotta dark:border-ochre bg-light-canvas/40 dark:bg-dark-canvas/60 shadow-lg'
                        : 'border-light-border/60 dark:border-dark-border/70 bg-light-surface dark:bg-dark-panel hover:border-light-border dark:hover:border-dark-border hover:shadow-md'
                    }`}
                  >
                    {/* Active Ribbon */}
                    {isActive && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-terracotta dark:bg-ochre text-white dark:text-dark-canvas text-[10px] font-mono font-bold rounded-xs tracking-wider uppercase">
                        <Check className="w-3 h-3" />
                        Active Variant
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono font-bold text-terracotta dark:text-ochre">
                        0{v.numericKey}
                      </span>
                      <span className="text-xs font-serif font-semibold text-light-ink dark:text-dark-ink">
                        {v.kanji}
                      </span>
                      <span className="text-xs font-mono text-light-ink-subtle dark:text-dark-ink-subtle">
                        · {v.tagline}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-light-ink dark:text-dark-ink mb-1">
                      {v.name}
                    </h3>

                    {/* Font Specimen Stack */}
                    <div className="bg-light-surface-raised dark:bg-dark-canvas/80 p-3 rounded-xs border border-light-border/40 dark:border-dark-border/50 my-3 space-y-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-light-ink-subtle dark:text-dark-ink-subtle block">
                          Display Headline ({v.displayFont})
                        </span>
                        <div
                          className="text-xl sm:text-2xl text-light-ink dark:text-dark-ink leading-tight font-medium"
                          style={{ fontFamily: v.displayFont }}
                        >
                          Algorithmic Harmony & Wabi-Sabi
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-light-ink-subtle dark:text-dark-ink-subtle block">
                          Body Prose ({v.bodyFont})
                        </span>
                        <div
                          className="text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed"
                          style={{ fontFamily: v.bodyFont }}
                        >
                          Architecting resilient distributed systems and autonomous agent workflows with human-centered dignity and mathematical precision.
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-light-border/30 dark:border-dark-border/30">
                        <span className="text-[10px] font-mono text-terracotta dark:text-ochre" style={{ fontFamily: v.monoFont }}>
                          {`// [LAT: 43.6532° N · MODEL: GEMINI 2.5]`}
                        </span>
                        <span className="text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle">
                          {v.monoFont}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed">
                      {v.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle italic truncate max-w-[200px]">
                        Vibe: {v.vibe.split(',')[0]}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setVariant(v.id);
                        }}
                        className={`text-xs font-mono px-3 py-1 rounded-xs transition-colors flex items-center gap-1 ${
                          isActive
                            ? 'bg-terracotta text-white dark:bg-ochre dark:text-dark-canvas font-semibold'
                            : 'border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink hover:bg-light-canvas dark:hover:bg-dark-canvas'
                        }`}
                      >
                        {isActive ? 'Current Style' : 'Apply Style'}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary */}
            <div className="mt-8 pt-4 border-t border-light-border/40 dark:border-dark-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-light-ink-muted dark:text-dark-ink-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-bamboo" />
                <span>Selection is saved automatically to your browser and accessible via query param <code className="font-mono text-terracotta dark:text-ochre">?font=v1..v7</code></span>
              </div>
              <button
                onClick={() => setShowSpecimenModal(false)}
                className="px-4 py-1.5 bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light font-mono font-semibold rounded-xs hover:opacity-90 transition-opacity"
              >
                Close & Browse Site
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
