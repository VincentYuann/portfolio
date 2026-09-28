import React, { useState, useRef, useCallback } from 'react';
import { useVariant, TYPOGRAPHY_VARIANTS, TypographyVariantId } from '../../../context/VariantContext';
import { useTheme } from '../../../context/ThemeContext';
import { useWashi } from '../../../context/WashiContext';
import { ViewMode } from '../../../App';
import {
  ArrowLeft,
  Check,
  Sun,
  Moon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  Layers,
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
  const {
    preset,
    dayRoughness,
    nightRoughness,
    grainFrequency,
    presetsList,
    setPreset,
    setDayRoughness,
    setNightRoughness,
    setGrainFrequency,
    resetWashiDefaults,
  } = useWashi();
  const [hoveredVariant, setHoveredVariant] = useState<TypographyVariantId | null>(null);
  const [showDesktopSliders, setShowDesktopSliders] = useState<boolean>(false);
  const [showMobileWashi, setShowMobileWashi] = useState<boolean>(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The active or temporarily previewed variant
  const activeVariantId = hoveredVariant || variant;
  const activeInfo = TYPOGRAPHY_VARIANTS[activeVariantId] || TYPOGRAPHY_VARIANTS.v4;

  const handleApplyVariant = (id: TypographyVariantId) => {
    setVariant(id);
    setHoveredVariant(null);
    toast.success(`Activated ${TYPOGRAPHY_VARIANTS[id]?.name || id}`, {
      duration: 1600,
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
    }, 400);
  }, []);

  const handleResetDefaults = () => {
    setVariant('v4');
    setTheme('day');
    resetWashiDefaults();
    setShowDesktopSliders(false);
    setShowMobileWashi(false);
    toast.info('Reset to Default Design System (Neo-Grotesque, Day Mode & Artisan Kozo Washi)');
  };

  return (
    <div className="relative min-h-screen bg-light-canvas dark:bg-dark-canvas text-light-ink dark:text-dark-ink pt-20 sm:pt-24 lg:pt-28 pb-20 sm:pb-24 transition-colors duration-300">
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
        {/* Back navigation & Reset Defaults bar */}
        <div className="mt-1 sm:mt-0 mb-3 sm:mb-8 flex flex-row items-center justify-between gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta dark:hover:text-ochre transition-colors group cursor-pointer min-h-[44px] py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-[2px] text-xs font-mono border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink hover:border-light-border-strong dark:hover:border-dark-border-strong transition-colors cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            title="Reset to default settings"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Header Title Section - standardized with Projects/Hobbies/Resume pages */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 sm:pb-8 border-b border-light-border/70 dark:border-dark-border/80 mb-5 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="font-mono text-[11px] sm:text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium">Archive //</span>
              <span className="font-mono text-[11px] sm:text-xs font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                Visual System · 設定
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal leading-tight">
              Design System &amp; Voices{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-lg sm:text-2xl lg:text-3xl ml-1.5 sm:ml-2 whitespace-nowrap inline-block">
                設計系統
              </span>
            </h1>
            <p className="font-sans text-xs sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-2 sm:mt-3 font-normal leading-relaxed max-w-prose">
              Real-time design tokens, theme lighting, and curated typography voices across the portfolio.
            </p>
          </div>
        </div>

        {/* 2-Column Split Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* ── DESKTOP ONLY: LEFT COLUMN CONTROL SUITE (5 Cols) ── */}
          <div className="hidden lg:flex lg:col-span-5 flex-col gap-6">
            
            {/* Desktop Control Pack 1: Lighting Atmosphere */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-5 sm:p-6 shadow-2xs craft-card double-hairline">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-light-border/50 dark:border-dark-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">01</span>
                  <h2 className="text-sm font-semibold text-light-ink dark:text-dark-ink">
                    Lighting Atmosphere
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

            {/* Desktop Control Pack 2: Typographic Voices List */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-5 sm:p-6 shadow-2xs craft-card double-hairline">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-light-border/50 dark:border-dark-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">02</span>
                  <h2 className="text-sm font-semibold text-light-ink dark:text-dark-ink">
                    Typographic Archetypes (7)
                  </h2>
                </div>
                <span className="text-xs font-mono font-medium text-light-ink-muted dark:text-dark-ink-muted">
                  Click to Activate
                </span>
              </div>

              <div className="space-y-2.5">
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

            {/* Desktop Control Pack 3: Washi Paper Roughness & Materiality */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-5 sm:p-6 shadow-2xs craft-card double-hairline">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-light-border/50 dark:border-dark-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">03</span>
                  <h2 className="text-sm font-semibold text-light-ink dark:text-dark-ink">
                    Washi Paper Materiality · 和紙の質感
                  </h2>
                </div>
                <span className="text-xs font-mono font-semibold text-terracotta dark:text-ochre">
                  {preset === 'custom' ? 'CUSTOM · 調整' : preset.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-light-ink-muted dark:text-dark-ink-muted mb-4 leading-relaxed">
                Calibrated tactile Japanese paper grain. Select an authentic roughness archetype or sculpt the fiber tooth live across Day and Night.
              </p>

              {/* 3 Washi Roughness Archetype Cards */}
              <div className="space-y-2.5 mb-5">
                {presetsList.map((p) => {
                  const isSelected = preset === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setPreset(p.id as 'silk' | 'kozo' | 'raw');
                        toast.success(`Activated ${p.name}`);
                      }}
                      className={`p-3.5 rounded-[2px] transition-all duration-200 cursor-pointer flex items-center justify-between group border ${
                        isSelected
                          ? 'border-terracotta dark:border-ochre bg-terracotta/10 dark:bg-ochre/10 shadow-2xs ring-1 ring-terracotta/30 dark:ring-ochre/30'
                          : 'border-light-border/50 dark:border-dark-border/50 bg-light-surface/40 dark:bg-dark-surface/40 hover:border-light-border-strong dark:hover:border-dark-border-strong hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">
                            0{p.numericKey}
                          </span>
                          <span className="text-xs font-semibold text-light-ink dark:text-dark-ink truncate">
                            {p.name}
                          </span>
                          <span className="w-4 h-4 rounded-[2px] bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border/60 dark:border-dark-border/60 flex items-center justify-center text-[10px] font-serif text-light-ink dark:text-dark-ink select-none shrink-0">
                            {p.kanji}
                          </span>
                        </div>
                        <div className="text-xs text-light-ink-muted dark:text-dark-ink-muted font-sans truncate">
                          {p.subtitle}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle">
                          <span className="px-1.5 py-0.5 rounded-[2px] bg-light-canvas/70 dark:bg-dark-canvas border border-light-border/40 dark:border-dark-border/40 font-medium">
                            Day: <strong className="text-light-ink dark:text-dark-ink">{p.dayRoughness}%</strong>
                          </span>
                          <span className="px-1.5 py-0.5 rounded-[2px] bg-light-canvas/70 dark:bg-dark-canvas border border-light-border/40 dark:border-dark-border/40 font-medium">
                            Night: <strong className="text-light-ink dark:text-dark-ink">{p.nightRoughness}%</strong>
                          </span>
                          <span className="px-1.5 py-0.5 rounded-[2px] bg-light-canvas/70 dark:bg-dark-canvas border border-light-border/40 dark:border-dark-border/40 font-medium hidden sm:inline-block">
                            Scale: {p.grainFrequency.toFixed(2)}
                          </span>
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

              {/* Progressive Disclosure: Collapsible Fine-Tuning Sliders */}
              <div className="pt-3 border-t border-light-border/50 dark:border-dark-border/60">
                <button
                  type="button"
                  onClick={() => setShowDesktopSliders(!showDesktopSliders)}
                  className="w-full py-2 px-3 rounded-[2px] border border-light-border/60 dark:border-dark-border/60 bg-light-surface/40 dark:bg-dark-surface/40 hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised transition-colors flex items-center justify-between text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 font-medium text-light-ink dark:text-dark-ink">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />
                    <span>Fine-Tune Tactile Sliders · 微調整</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="text-light-ink-subtle dark:text-dark-ink-subtle">
                      {showDesktopSliders ? 'Hide' : `${dayRoughness}% · ${nightRoughness}%`}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showDesktopSliders ? 'rotate-180 text-terracotta dark:text-ochre' : ''}`} />
                  </span>
                </button>

                {showDesktopSliders && (
                  <div className="mt-3 space-y-3.5 animate-view-enter">
                    {/* Slider 1: Day Tooth */}
                    <div className="space-y-1.5 bg-light-surface/50 dark:bg-dark-surface/50 p-3 rounded-[2px] border border-light-border/40 dark:border-dark-border/40">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-1.5 text-light-ink dark:text-dark-ink font-medium">
                          <Sun className="w-3 h-3 text-terracotta" />
                          <span>Day Paper Roughness:</span>
                        </span>
                        <span className="font-bold text-terracotta">
                          {dayRoughness}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={4}
                        max={35}
                        step={1}
                        value={dayRoughness}
                        onChange={(e) => setDayRoughness(Number(e.target.value))}
                        className="w-full accent-terracotta cursor-pointer h-1.5 bg-light-surface-muted dark:bg-dark-canvas rounded-[2px]"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle pt-0.5">
                        <span>4% (Minimal)</span>
                        <span className="text-terracotta font-medium">16% (Default)</span>
                        <span>35% (Raw Pulp)</span>
                      </div>
                    </div>

                    {/* Slider 2: Night Tooth */}
                    <div className="space-y-1.5 bg-light-surface/50 dark:bg-dark-surface/50 p-3 rounded-[2px] border border-light-border/40 dark:border-dark-border/40">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-1.5 text-light-ink dark:text-dark-ink font-medium">
                          <Moon className="w-3 h-3 text-ochre" />
                          <span>Night Cedar Roughness:</span>
                        </span>
                        <span className="font-bold text-ochre">
                          {nightRoughness}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={2}
                        max={20}
                        step={0.5}
                        value={nightRoughness}
                        onChange={(e) => setNightRoughness(Number(e.target.value))}
                        className="w-full accent-ochre cursor-pointer h-1.5 bg-light-surface-muted dark:bg-dark-canvas rounded-[2px]"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle pt-0.5">
                        <span>2% (Quiet)</span>
                        <span className="text-ochre font-medium">6.5% (Default)</span>
                        <span>20% (Cosmic Timber)</span>
                      </div>
                    </div>

                    {/* Slider 3: Grain Density */}
                    <div className="space-y-1.5 bg-light-surface/50 dark:bg-dark-surface/50 p-3 rounded-[2px] border border-light-border/40 dark:border-dark-border/40">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-1.5 text-light-ink dark:text-dark-ink font-medium">
                          <Layers className="w-3 h-3 text-bamboo" />
                          <span>Fiber Grain Density:</span>
                        </span>
                        <span className="font-bold text-light-ink dark:text-dark-ink">
                          {grainFrequency.toFixed(2)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.45}
                        max={1.05}
                        step={0.05}
                        value={grainFrequency}
                        onChange={(e) => setGrainFrequency(Number(e.target.value))}
                        className="w-full accent-bamboo cursor-pointer h-1.5 bg-light-surface-muted dark:bg-dark-canvas rounded-[2px]"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle pt-0.5">
                        <span>0.45 (Chunky Raw)</span>
                        <span className="font-medium">0.90 (Default)</span>
                        <span>1.05 (Fine Micro)</span>
                      </div>
                    </div>

                    {/* Quick Reset to Kozo Default */}
                    {preset === 'custom' && (
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            resetWashiDefaults();
                            toast.info('Reset Washi tooth to Default Kozo (16% Day / 6.5% Night / 0.90 Scale)');
                          }}
                          className="text-[10px] font-mono text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta dark:hover:text-ochre transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Reset to Kozo Default</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT / PRIMARY COLUMN: LIVE SPECIMEN STAGE WITH MOBILE QUICK CONTROLS ── */}
          <div className="w-full lg:col-span-7 flex flex-col gap-5 lg:sticky lg:top-24">
            
            {/* ── MOBILE ULTRA-COMPACT QUICK SWITCHER BAR (Visible on mobile/tablet) ── */}
            <div className="lg:hidden bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-2.5 sm:p-3 shadow-sm craft-card double-hairline flex flex-col gap-2">
              
              {/* Row 1: Header Label + Inline Lighting Pill + Active Voice Badge */}
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Sparkles className="w-3.5 h-3.5 text-terracotta dark:text-ochre shrink-0" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-terracotta dark:text-ochre truncate">
                    0{activeInfo.numericKey} · {activeInfo.name}
                  </span>
                </div>

                {/* Right controls: Texture Toggle + Theme Pill */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowMobileWashi(!showMobileWashi)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] sm:text-[11px] font-mono transition-all cursor-pointer border ${
                      showMobileWashi
                        ? 'border-terracotta dark:border-ochre bg-terracotta/15 dark:bg-ochre/15 text-terracotta dark:text-ochre font-bold shadow-2xs'
                        : 'border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink'
                    }`}
                    title="Toggle washi paper texture options"
                    aria-expanded={showMobileWashi}
                  >
                    <Layers className="w-2.5 h-2.5 text-terracotta dark:text-ochre" />
                    <span>Texture</span>
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${showMobileWashi ? 'rotate-180 text-terracotta dark:text-ochre' : ''}`} />
                  </button>

                  <div className="inline-flex p-0.5 rounded-[2px] bg-light-surface-raised dark:bg-dark-surface border border-light-border dark:border-dark-border">
                    <button
                      onClick={() => setTheme('day')}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] sm:text-[11px] font-mono transition-all cursor-pointer ${
                        theme === 'day'
                          ? 'bg-light-surface-card dark:bg-dark-surface-raised text-terracotta font-bold shadow-2xs'
                          : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink'
                      }`}
                    >
                      <Sun className="w-2.5 h-2.5 text-terracotta dark:text-ochre" />
                      <span>Day</span>
                    </button>
                    <button
                      onClick={() => setTheme('night')}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] sm:text-[11px] font-mono transition-all cursor-pointer ${
                        theme === 'night'
                          ? 'bg-light-surface-card dark:bg-dark-surface-raised text-terracotta dark:text-ochre font-bold shadow-2xs'
                          : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink'
                      }`}
                    >
                      <Moon className="w-2.5 h-2.5 text-terracotta dark:text-ochre" />
                      <span>Night</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Horizontal scrollable voice strip with smooth auto-scroll */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const curIdx = variantsList.findIndex((v) => v.id === variant);
                    const prevIdx = (curIdx - 1 + variantsList.length) % variantsList.length;
                    handleApplyVariant(variantsList[prevIdx].id);
                  }}
                  className="p-1 min-w-[32px] sm:min-w-[36px] min-h-[36px] flex items-center justify-center rounded-[2px] border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-ink dark:text-dark-ink hover:border-terracotta dark:hover:border-ochre transition-colors cursor-pointer shrink-0"
                  aria-label="Previous voice"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div className="flex-1 overflow-x-auto scrollbar-none py-0.5 min-w-0">
                  <div className="grid grid-flow-col auto-cols-[minmax(38px,1fr)] sm:auto-cols-fr gap-1 sm:gap-1.5 w-full">
                    {variantsList.map((v) => {
                      const isSelected = v.id === variant;
                      return (
                        <button
                          key={v.id}
                          id={`mobile-voice-tab-${v.id}`}
                          onClick={() => {
                            handleApplyVariant(v.id);
                            const el = document.getElementById(`mobile-voice-tab-${v.id}`);
                            el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                          }}
                          className={`flex flex-col items-center justify-center w-full min-h-[36px] px-1 py-0.5 rounded-[2px] border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-terracotta dark:border-ochre bg-terracotta dark:bg-ochre text-white dark:text-dark-canvas font-bold shadow-xs'
                              : 'border-light-border/70 dark:border-dark-border/70 bg-light-surface/60 dark:bg-dark-surface/60 text-light-ink dark:text-dark-ink hover:border-terracotta/50 dark:hover:border-ochre/50'
                          }`}
                          title={v.name}
                          aria-label={`Select voice 0${v.numericKey}: ${v.name}`}
                        >
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold leading-none">0{v.numericKey}</span>
                          <span className={`text-[9px] sm:text-[10px] font-serif leading-none mt-0.5 ${isSelected ? 'opacity-95' : 'opacity-60'}`}>
                            {v.kanji}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const curIdx = variantsList.findIndex((v) => v.id === variant);
                    const nextIdx = (curIdx + 1) % variantsList.length;
                    handleApplyVariant(variantsList[nextIdx].id);
                  }}
                  className="p-1 min-w-[32px] sm:min-w-[36px] min-h-[36px] flex items-center justify-center rounded-[2px] border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-ink dark:text-dark-ink hover:border-terracotta dark:hover:border-ochre transition-colors cursor-pointer shrink-0"
                  aria-label="Next voice"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Row 3: Active Font Specifier & Tagline (Cleanly Truncated with ellipsis) */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-light-ink-muted dark:text-dark-ink-muted pt-1 px-0.5 border-t border-light-border/40 dark:border-dark-border/40 min-w-0 overflow-hidden">
                <span className="truncate flex-1 min-w-0 pr-2">
                  <span className="font-semibold text-terracotta dark:text-ochre">{activeInfo.displayFont}</span>
                  <span className="opacity-60"> + {activeInfo.bodyFont}</span>
                </span>
                <span className="text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle italic shrink-0 max-w-[120px] truncate text-right">
                  {activeInfo.vibe.split(',')[0]}
                </span>
              </div>

              {/* Progressive Disclosure: Compact Washi Texture Drawer (Mobile) */}
              {showMobileWashi && (
                <div className="pt-2 border-t border-light-border/50 dark:border-dark-border/60 space-y-2 animate-view-enter">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider font-semibold">
                      Washi Materiality (3 Levels)
                    </span>
                    <span className="text-terracotta dark:text-ochre font-bold">
                      {theme === 'night' ? `${nightRoughness}% Night` : `${dayRoughness}% Day`}
                    </span>
                  </div>

                  {/* 3 Preset Segmented Buttons: Minimal Horizontal Overhead */}
                  <div className="grid grid-cols-3 gap-1">
                    {presetsList.map((p) => {
                      const isSelected = preset === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setPreset(p.id as 'silk' | 'kozo' | 'raw');
                            toast.success(`Applied ${p.name}`);
                          }}
                          className={`py-1.5 px-1 rounded-[2px] text-center transition-all cursor-pointer border flex flex-col items-center justify-center ${
                            isSelected
                              ? 'border-terracotta dark:border-ochre bg-terracotta dark:bg-ochre text-white dark:text-dark-canvas font-bold shadow-2xs'
                              : 'border-light-border/70 dark:border-dark-border/70 bg-light-surface/60 dark:bg-dark-surface/60 text-light-ink dark:text-dark-ink hover:border-terracotta/50'
                          }`}
                        >
                          <div className="flex items-center gap-1 text-[11px] font-mono leading-none">
                            <span>0{p.numericKey}</span>
                            <span className="font-serif">{p.kanji}</span>
                          </div>
                          <span className="text-[9px] font-mono opacity-85 mt-1 leading-none">
                            {theme === 'night' ? `${p.nightRoughness}%` : `${p.dayRoughness}%`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Single Interactive Slider for Currently Visible Theme */}
                  <div className="flex items-center gap-2 pt-0.5 text-[10px] font-mono">
                    <span className="text-light-ink-muted dark:text-dark-ink-muted shrink-0 flex items-center gap-1">
                      {theme === 'night' ? <Moon className="w-2.5 h-2.5 text-ochre" /> : <Sun className="w-2.5 h-2.5 text-terracotta" />}
                      <span>Tooth:</span>
                    </span>
                    <input
                      type="range"
                      min={theme === 'night' ? 2 : 4}
                      max={theme === 'night' ? 20 : 35}
                      step={theme === 'night' ? 0.5 : 1}
                      value={theme === 'night' ? nightRoughness : dayRoughness}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (theme === 'night') {
                          setNightRoughness(val);
                        } else {
                          setDayRoughness(val);
                        }
                      }}
                      className={`flex-1 cursor-pointer h-1.5 bg-light-surface-muted dark:bg-dark-canvas rounded-[2px] ${
                        theme === 'night' ? 'accent-ochre' : 'accent-terracotta'
                      }`}
                    />
                    <span className={`font-bold shrink-0 min-w-[28px] text-right ${theme === 'night' ? 'text-ochre' : 'text-terracotta'}`}>
                      {theme === 'night' ? `${nightRoughness}%` : `${dayRoughness}%`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Live Interactive Specimen Stage Card */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-5 sm:p-7 lg:p-8 shadow-sm craft-card double-hairline relative">
              <CornerBrackets size="md" />

              {/* Stage Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 sm:mb-6 border-b border-light-border/50 dark:border-dark-border/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-terracotta dark:text-ochre" />
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre uppercase tracking-wider">
                    [Live Specimen Stage]
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
                  Focused on building robust, well-structured software with clean design and attention to detail. Systems engineered with balance, reliability, and usability in mind.
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
                      2024 - Present
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
                    {`THEME: "${theme.toUpperCase()}" · WASHI_PRESET: "${preset.toUpperCase()}" · DAY_TOOTH: "${dayRoughness}%" · NIGHT_TOOTH: "${nightRoughness}%" · CACHE: LOCAL_STORAGE`}
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

              {/* Exhibit 4: Washi Materiality & Paper Grain Specimen */}
              <div className="pt-6 border-t border-light-border/40 dark:border-dark-border/50 space-y-4">
                <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium block">
                  Exhibit D · Washi Paper Grain Specimen &amp; Fiber Tooth Comparison
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Day Preview Swatch */}
                  <div className="p-4 rounded-[2px] bg-[#FAF6EE] text-[#282E3A] border border-[#D4C4AA] relative overflow-hidden shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-terracotta flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5" />
                        <span>Akari Day Paper</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-[#EAE0CE] border border-[#D4C4AA] font-semibold text-[#282E3A]">
                        {dayRoughness}% Tooth
                      </span>
                    </div>
                    <p className="text-xs font-serif leading-relaxed text-[#282E3A]/90">
                      Natural cream washi with tactile tooth. The surface breathes organic warmth without digital harshness.
                    </p>
                    <div className="mt-2.5 text-[10px] font-mono text-[#686559] flex items-center justify-between border-t border-[#D4C4AA]/60 pt-2">
                      <span>Freq: {grainFrequency.toFixed(2)}</span>
                      <span>Blend: Multiply</span>
                    </div>
                  </div>

                  {/* Night Preview Swatch */}
                  <div className="p-4 rounded-[2px] bg-[#23262F] text-[#E8E6DF] border border-[#383B44] relative overflow-hidden shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-ochre flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5" />
                        <span>Charred Cedar</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-[#121316] border border-[#383B44] font-semibold text-[#E8E6DF]">
                        {nightRoughness}% Tooth
                      </span>
                    </div>
                    <p className="text-xs font-serif leading-relaxed text-[#E8E6DF]/90">
                      Charred timber with warm amber reflections. The micro-grain evokes night lantern glow over dark wood.
                    </p>
                    <div className="mt-2.5 text-[10px] font-mono text-[#9E9A8E] flex items-center justify-between border-t border-[#383B44]/80 pt-2">
                      <span>Freq: {grainFrequency.toFixed(2)}</span>
                      <span>Blend: Screen</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
