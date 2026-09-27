import React, { useState, useRef, useCallback } from 'react';
import { useVariant, TYPOGRAPHY_VARIANTS, TypographyVariantId } from '../../../context/VariantContext';
import { useTheme } from '../../../context/ThemeContext';
import { ViewMode } from '../../../App';
import {
  ArrowLeft,
  Check,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { TechTag } from '../../common/TechTag';
import { StatusBadge } from '../../common/StatusBadge';
import { CornerBrackets } from '../../common/CornerBrackets';
import { toast } from 'sonner';

interface VisualSystemPageProps {
  onNavigate: (view: ViewMode, sectionId?: string) => void;
}

export const VisualSystemPage: React.FC<VisualSystemPageProps> = ({ onNavigate }) => {
  const { variant, setVariant, variantsList } = useVariant();
  const { theme, setTheme } = useTheme();
  const [hoveredVariant, setHoveredVariant] = useState<TypographyVariantId | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // The active or temporarily previewed variant
  const activeVariantId = hoveredVariant || variant;
  const activeInfo = TYPOGRAPHY_VARIANTS[activeVariantId] || TYPOGRAPHY_VARIANTS.v4;

  const handleApplyVariant = (id: TypographyVariantId) => {
    setVariant(id);
    toast.success(`Activated ${TYPOGRAPHY_VARIANTS[id]?.name || id}`, {
      duration: 1800,
    });
  };

  const handleHoverEnter = useCallback((id: TypographyVariantId) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredVariant(id);
  }, []);

  const handleHoverLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredVariant(null);
      hoverTimeoutRef.current = null;
    }, 500);
  }, []);

  // Carousel navigation for mobile
  const scrollCarousel = useCallback((direction: 'prev' | 'next') => {
    const el = carouselRef.current;
    if (!el) return;
    const newIndex = direction === 'next'
      ? Math.min(carouselIndex + 1, variantsList.length - 1)
      : Math.max(carouselIndex - 1, 0);
    const child = el.children[newIndex] as HTMLElement | undefined;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    setCarouselIndex(newIndex);
    // Auto-preview the navigated-to archetype
    const targetVariant = variantsList[newIndex];
    if (targetVariant) {
      setHoveredVariant(targetVariant.id);
    }
  }, [carouselIndex, variantsList]);

  // Sync carousel scroll position and auto-preview the visible archetype
  const handleCarouselScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.scrollWidth / variantsList.length;
    const index = Math.round(scrollLeft / cardWidth);
    setCarouselIndex(index);
    // Auto-preview: show the swiped-to archetype in the specimen stage
    const visibleVariant = variantsList[index];
    if (visibleVariant) {
      setHoveredVariant(visibleVariant.id);
    }
  }, [variantsList]);

  const handleResetDefaults = () => {
    setVariant('v4');
    setTheme('day');
    toast.info('Reset to Default Design System (Neo-Grotesque & Day Mode)');
  };

  return (
    <div className="relative min-h-screen bg-light-canvas dark:bg-dark-canvas text-light-ink dark:text-dark-ink pt-24 lg:pt-28 pb-24 transition-colors duration-300">
      {/* Subtle Japanese Paper Texture Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
        <img
          src="./background/white wood.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover dark:hidden mix-blend-multiply opacity-40"
        />
        <img
          src="./background/black wood.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover hidden dark:block mix-blend-screen opacity-30"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Navigation — matches Hobbies/Resume pattern */}
        <div className="mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="group inline-flex items-center gap-1.5 text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta dark:hover:text-ochre transition-colors cursor-pointer py-2 whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Return to Portfolio</span>
          </button>
        </div>

        {/* Header Title Section — consistent with Hobbies & Resume */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-light-border/70 dark:border-dark-border/80 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium">Archive //</span>
              <span className="font-mono text-xs font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                Visual System · 設定
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal">
              Design System &amp; Typographic Voices{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
                設計系統
              </span>
            </h1>
            <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 font-normal leading-relaxed max-w-prose">
              Explore and customize the real-time design tokens, theme lighting, and 7 curated Japanese-Scandinavian typographic voices across the portfolio.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-[2px] text-xs font-mono border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface text-light-ink dark:text-dark-ink hover:border-light-border-strong dark:hover:border-dark-border-strong transition-colors cursor-pointer shadow-2xs min-h-[44px]"
              title="Reset to default settings"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] text-xs font-sans font-semibold bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light hover:opacity-90 transition-opacity cursor-pointer shadow-xs min-h-[44px]"
            >
              <span>Apply &amp; Return</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Split Studio Layout: Left Controls + Right Live Interactive Preview */}
        {/* On mobile: Preview FIRST (order-first), Controls SECOND (order-last) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ── LEFT COLUMN: CONTROL SUITE (5 Cols) ── */}
          <div className="lg:col-span-5 flex flex-col gap-6 order-last lg:order-first">
            
            {/* Control Pack 1: Lighting Atmosphere & Theme Pack — Desktop: first, Mobile: second (below archetypes) */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-5 sm:p-6 shadow-2xs craft-card double-hairline order-last lg:order-first">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-light-border/50 dark:border-dark-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">01</span>
                  <h2 className="text-sm font-semibold text-light-ink dark:text-dark-ink">
                    Lighting Atmosphere &amp; Canvas Mode
                  </h2>
                </div>
                <span className="text-xs font-mono font-semibold text-terracotta dark:text-ochre">
                  Active: {theme.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Day Mode Button */}
                <button
                  onClick={() => setTheme('day')}
                  className={`p-4 rounded-[2px] border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                    theme === 'day'
                      ? 'border-terracotta bg-light-surface-raised dark:bg-dark-surface-raised shadow-xs ring-1 ring-terracotta/40'
                      : 'border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface hover:border-light-border-strong dark:hover:border-dark-border-strong opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-light-ink dark:text-dark-ink">
                      <Sun className="w-4 h-4 text-terracotta dark:text-ochre" />
                      <span>Akari Day</span>
                    </div>
                    {theme === 'day' && <Check className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />}
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="w-4 h-4 rounded-full bg-[#EAE0CE] border border-stone-400/60 shadow-2xs" title="Canvas: #EAE0CE" />
                    <span className="w-4 h-4 rounded-full bg-[#FAF6EE] border border-stone-400/60 shadow-2xs" title="Surface: #FAF6EE" />
                    <span className="w-4 h-4 rounded-full bg-[#B5482E] border border-black/10 dark:border-white/10 shadow-2xs" title="Accent Terracotta: #B5482E" />
                    <span className="w-4 h-4 rounded-full bg-[#282E3A] border border-black/10 dark:border-white/10 shadow-2xs" title="Ink: #282E3A" />
                  </div>
                  <span className="text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed">
                    Natural Wabi-Sabi cream paper with warm terracotta brushstrokes.
                  </span>
                </button>

                {/* Night Mode Button */}
                <button
                  onClick={() => setTheme('night')}
                  className={`p-4 rounded-[2px] border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                    theme === 'night'
                      ? 'border-terracotta dark:border-ochre bg-dark-surface-raised dark:bg-dark-surface-raised shadow-xs ring-1 ring-terracotta/40 dark:ring-ochre/40'
                      : 'border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface hover:border-light-border-strong dark:hover:border-dark-border-strong opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-light-ink dark:text-dark-ink">
                      <Moon className="w-4 h-4 text-terracotta dark:text-ochre" />
                      <span>Charred Cedar</span>
                    </div>
                    {theme === 'night' && <Check className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />}
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="w-4 h-4 rounded-full bg-[#121316] border border-stone-600/80 shadow-2xs" title="Canvas: #121316" />
                    <span className="w-4 h-4 rounded-full bg-[#23262F] border border-stone-600/80 shadow-2xs" title="Surface: #23262F" />
                    <span className="w-4 h-4 rounded-full bg-[#D4A853] border border-black/10 dark:border-white/10 shadow-2xs" title="Accent Ochre Gold: #D4A853" />
                    <span className="w-4 h-4 rounded-full bg-[#E8E6DF] border border-stone-400/60 shadow-2xs" title="Ink: #E8E6DF" />
                  </div>
                  <span className="text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed">
                    Charred Japanese cedar wood with luminous gold lantern highlights.
                  </span>
                </button>
              </div>
            </div>

            {/* Control Pack 2: Typographic Voices — Desktop: vertical list, Mobile: horizontal carousel (shown FIRST on mobile) */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-5 sm:p-6 shadow-2xs craft-card double-hairline order-first lg:order-last">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-light-border/50 dark:border-dark-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">02</span>
                  <h2 className="text-sm font-semibold text-light-ink dark:text-dark-ink">
                    Typographic Archetypes (7)
                  </h2>
                </div>
                <span className="text-xs font-mono font-medium text-light-ink-muted dark:text-dark-ink-muted">
                  Select to Activate
                </span>
              </div>

              {/* ── MOBILE: Horizontal Swipeable Carousel ── */}
              <div className="lg:hidden">
                {/* Carousel Navigation Header */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => scrollCarousel('prev')}
                    disabled={carouselIndex === 0}
                    className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[2px] border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-ink dark:text-dark-ink disabled:opacity-30 hover:border-light-border-strong dark:hover:border-dark-border-strong transition-colors cursor-pointer disabled:cursor-default"
                    aria-label="Previous archetype"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted">
                    {carouselIndex + 1} / {variantsList.length}
                  </span>
                  <button
                    onClick={() => scrollCarousel('next')}
                    disabled={carouselIndex === variantsList.length - 1}
                    className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[2px] border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-ink dark:text-dark-ink disabled:opacity-30 hover:border-light-border-strong dark:hover:border-dark-border-strong transition-colors cursor-pointer disabled:cursor-default"
                    aria-label="Next archetype"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Swipeable Carousel Container */}
                <div
                  ref={carouselRef}
                  onScroll={handleCarouselScroll}
                  className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-1 px-1"
                  style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  {variantsList.map((v) => {
                    const isSelected = v.id === variant;
                    return (
                      <div
                        key={v.id}
                        onClick={() => handleApplyVariant(v.id)}
                        className={`snap-center shrink-0 w-[calc(100%-8px)] p-4 rounded-[2px] transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? 'border-terracotta dark:border-ochre bg-terracotta/10 dark:bg-ochre/10 shadow-2xs ring-1 ring-terracotta/30 dark:ring-ochre/30'
                            : 'border-light-border/50 dark:border-dark-border/50 bg-light-surface/40 dark:bg-dark-surface/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">
                              0{v.numericKey}
                            </span>
                            <span className="text-sm font-semibold text-light-ink dark:text-dark-ink">
                              {v.name}
                            </span>
                            <span className="w-5 h-5 rounded-[2px] bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border/60 dark:border-dark-border/60 flex items-center justify-center text-[11px] font-serif text-light-ink dark:text-dark-ink select-none shrink-0">
                              {v.kanji}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-1 px-2.5 py-1 bg-terracotta dark:bg-ochre text-white dark:text-dark-canvas text-xs font-mono font-bold rounded-xs">
                              <Check className="w-3.5 h-3.5" />
                              <span>Active</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-light-ink/90 dark:text-dark-ink/90 font-mono mb-1">
                          <span className="font-semibold text-terracotta dark:text-ochre">{v.displayFont}</span>
                          <span className="opacity-60"> · {v.bodyFont}</span>
                        </div>
                        <div className="text-xs text-light-ink-muted dark:text-dark-ink-muted italic">
                          {v.tagline}
                        </div>
                        {!isSelected && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleApplyVariant(v.id); }}
                            className="mt-3 w-full py-2.5 text-xs font-mono font-medium rounded-[2px] border border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-raised text-terracotta dark:text-ochre hover:bg-terracotta/10 dark:hover:bg-ochre/10 transition-colors cursor-pointer"
                          >
                            Apply This Voice →
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Dot Indicators */}
                <div className="flex items-center justify-center gap-0.5 pt-2">
                  {variantsList.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setCarouselIndex(i);
                        setHoveredVariant(v.id);
                        carouselRef.current?.children[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                      }}
                      className="flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer"
                      aria-label={`Go to ${v.name}`}
                    >
                      <span className={`block rounded-full transition-all duration-200 ${
                        i === carouselIndex
                          ? 'w-5 h-2 bg-terracotta dark:bg-ochre'
                          : v.id === variant
                            ? 'w-2 h-2 bg-terracotta/50 dark:bg-ochre/50'
                            : 'w-2 h-2 bg-light-border dark:bg-dark-border'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* ── DESKTOP: Vertical List (unchanged) ── */}
              <div className="hidden lg:block space-y-2.5">
                {variantsList.map((v) => {
                  const isSelected = v.id === variant;
                  return (
                    <div
                      key={v.id}
                      onMouseEnter={() => handleHoverEnter(v.id)}
                      onMouseLeave={handleHoverLeave}
                      onClick={() => handleApplyVariant(v.id)}
                      className={`p-3.5 rounded-[2px] transition-all duration-200 cursor-pointer flex items-center justify-between group border ${
                        isSelected
                          ? 'border-terracotta dark:border-ochre bg-terracotta/10 dark:bg-ochre/10 shadow-2xs ring-1 ring-terracotta/30 dark:ring-ochre/30'
                          : 'border-light-border/50 dark:border-dark-border/50 bg-light-surface/40 dark:bg-dark-surface/40 hover:border-light-border-strong dark:hover:border-dark-border-strong hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">
                            0{v.numericKey}
                          </span>
                          <span className="text-xs font-semibold text-light-ink dark:text-dark-ink truncate">
                            {v.name}
                          </span>
                          <span className="w-4 h-4 rounded-[2px] bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border/60 dark:border-dark-border/60 flex items-center justify-center text-[10px] font-serif text-light-ink dark:text-dark-ink select-none shrink-0">
                            {v.kanji}
                          </span>
                        </div>
                        <div className="text-xs text-light-ink/90 dark:text-dark-ink/90 font-mono truncate">
                          <span className="font-semibold text-terracotta dark:text-ochre">{v.displayFont}</span>
                          <span className="opacity-60"> · {v.bodyFont}</span>
                        </div>
                        <div className="text-xs text-light-ink-muted dark:text-dark-ink-muted mt-0.5 italic truncate">
                          {v.tagline}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {isSelected ? (
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-terracotta dark:bg-ochre text-white dark:text-dark-canvas text-xs font-mono font-bold rounded-xs">
                            <Check className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted group-hover:text-terracotta dark:group-hover:text-ochre flex items-center gap-0.5 font-medium">
                            <span>Apply</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: INTERACTIVE VISUALIZATION STUDIO (7 Cols) ── */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:sticky lg:top-28 order-first lg:order-last">
            
            {/* Live Interactive Specimen Stage */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-6 sm:p-8 shadow-sm craft-card double-hairline relative">
              <CornerBrackets size="md" />

              {/* Stage Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-light-border/50 dark:border-dark-border/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-terracotta dark:text-ochre" />
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre uppercase tracking-wider">
                    [Live Specimen &amp; Component Stage]
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
                  <span className="text-light-ink-muted dark:text-dark-ink-muted">Voice:</span>
                  <span className="font-bold text-terracotta dark:text-ochre">
                    0{activeInfo.numericKey} · {activeInfo.name}
                  </span>
                </div>
              </div>

              {/* Exhibit 1: Display Headline & Subtitle */}
              <div className="space-y-3 pb-6 border-b border-light-border/40 dark:border-dark-border/50">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium">
                    Exhibit A · Hero Display Headline ({activeInfo.displayFont})
                  </span>
                </div>
                <h3
                  className="text-2xl sm:text-3xl lg:text-4xl text-light-ink dark:text-dark-ink font-normal leading-[1.18] tracking-tight"
                  style={{ fontFamily: activeInfo.displayFont }}
                >
                  Crafting thoughtful digital experiences with algorithmic clarity.
                </h3>
                <p
                  className="text-sm sm:text-base text-light-ink/80 dark:text-dark-ink/90 leading-relaxed max-w-xl"
                  style={{ fontFamily: activeInfo.bodyFont }}
                >
                  Rooted in the Japanese aesthetics of <strong className="text-light-ink dark:text-dark-ink">Akari</strong> (illumination) and <strong className="text-light-ink dark:text-dark-ink">Wabi-Sabi</strong> (organic simplicity). Systems engineered with mathematical balance and human empathy.
                </p>
              </div>

              {/* Exhibit 2: Card Architecture Mockup */}
              <div className="py-6 border-b border-light-border/40 dark:border-dark-border/50 space-y-4">
                <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium block">
                  Exhibit B · Project Card Simulation ({activeInfo.displayFont} + {activeInfo.bodyFont})
                </span>

                <div className="p-5 sm:p-6 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border/80 dark:border-dark-border/80 shadow-2xs relative">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-mono rounded-[2px] bg-light-surface-muted dark:bg-dark-canvas text-light-ink dark:text-dark-ink border border-light-border/60 dark:border-dark-border/60 font-medium">
                        #01
                      </span>
                      <StatusBadge isActive={true} activeLabel="ACTIVE / 現職" />
                    </div>
                    <span className="text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted" style={{ fontFamily: activeInfo.monoFont }}>
                      2024 — Present
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h4
                      className="text-xl text-light-ink dark:text-dark-ink font-medium tracking-tight"
                      style={{ fontFamily: activeInfo.displayFont }}
                    >
                      Personal Portfolio &amp; Agentic Lab
                    </h4>
                    <span className="text-lg font-serif text-light-ink-muted dark:text-dark-ink-muted shrink-0">
                      作品
                    </span>
                  </div>

                  <p
                    className="text-xs sm:text-sm text-light-ink/80 dark:text-dark-ink/90 leading-relaxed max-w-xl"
                    style={{ fontFamily: activeInfo.bodyFont }}
                  >
                    High-performance portfolio engine typeset with dynamic typography variants, Supabase integration, and real-time AI assistant telemetry.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4">
                    <TechTag tag="React 19" size="sm" />
                    <TechTag tag="TypeScript" size="sm" />
                    <TechTag tag="Tailwind CSS" size="sm" />
                    <TechTag tag="Supabase" size="sm" />
                  </div>
                </div>
              </div>

              {/* Exhibit 3: Monospace Telemetry & Code Craft */}
              <div className="pt-6 space-y-4">
                <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium block">
                  Exhibit C · Telemetry &amp; Monospace Coordinates ({activeInfo.monoFont})
                </span>

                <div className="p-4 rounded-[2px] bg-light-canvas/70 dark:bg-dark-canvas border border-light-border/60 dark:border-dark-border/60 text-xs font-mono space-y-2 overflow-x-auto" style={{ fontFamily: activeInfo.monoFont }}>
                  <div className="text-terracotta dark:text-ochre font-semibold">
                    {`// [LAT: 43.6532° N · LON: 79.3832° W · ELEVATION: 76m]`}
                  </div>
                  <div className="text-light-ink dark:text-dark-ink font-medium">
                    {`SYS_TOKENS: { display: "${activeInfo.displayFont}", body: "${activeInfo.bodyFont}", mono: "${activeInfo.monoFont}" }`}
                  </div>
                  <div className="text-light-ink-muted dark:text-dark-ink-muted text-xs">
                    {`THEME_STATUS: "${theme.toUpperCase()}" · SPECIMEN_INTEGRITY: 100% · CACHE: LOCAL_STORAGE`}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <a
                      href="#featured-works"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('home', 'featured-works');
                      }}
                      className="px-4 py-2.5 bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light font-sans text-xs font-semibold rounded-[2px] shadow-2xs hover:opacity-95 transition-opacity min-h-[44px] inline-flex items-center"
                    >
                      Explore Selected Works
                    </a>
                    <a
                      href="#resume"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('resume');
                      }}
                      className="px-4 py-2.5 bg-light-surface-raised dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink font-sans text-xs font-medium rounded-[2px] shadow-2xs hover:border-light-border-strong dark:hover:border-dark-border-strong transition-colors min-h-[44px] inline-flex items-center"
                    >
                      Technical CV
                    </a>
                  </div>

                  <span className="text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted font-medium">
                    Vibe: {activeInfo.vibe.split(',')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
