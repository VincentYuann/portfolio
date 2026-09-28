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
    setProportionalRoughness,
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

        {/* Header Title Section: High contrast, optimal line length */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 sm:pb-8 border-b border-light-border/70 dark:border-dark-border/80 mb-5 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium">Archive //</span>
              <span className="font-mono text-xs font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                Visual System · 設定
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal leading-tight">
              Design System &amp; Voices{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-lg sm:text-2xl lg:text-3xl ml-1.5 sm:ml-2 whitespace-nowrap inline-block">
                設計系統
              </span>
            </h1>
            <p className="font-sans text-xs sm:text-base text-light-ink/90 dark:text-dark-ink/90 mt-2 sm:mt-3 font-normal leading-relaxed max-w-[55ch]">
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
                      : 'border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface hover:border-light-border-strong dark:hover:border-dark-border-strong opacity-80 hover:opacity-100'
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
                      : 'border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface hover:border-light-border-strong dark:hover:border-dark-border-strong opacity-80 hover:opacity-100'
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

            {/* Desktop Control Pack 2: Typographic Voices List (Hairline-divided flat rows, zero nested card boxes) */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-5 sm:p-6 shadow-2xs craft-card double-hairline">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-light-border/50 dark:border-dark-border/60">
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

              <div className="divide-y divide-light-border/40 dark:divide-dark-border/50">
                {variantsList.map((v) => {
                  const isSelected = v.id === variant;
                  return (
                    <div
                      key={v.id}
                      onMouseEnter={() => handleHoverEnter(v.id)}
                      onMouseLeave={handleHoverLeave}
                      onClick={() => handleApplyVariant(v.id)}
                      className={`py-3 px-2 rounded-[2px] transition-colors duration-150 cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'bg-terracotta/10 dark:bg-ochre/15'
                          : 'hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised'
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
                          <span className="w-4 h-4 rounded-[2px] bg-light-surface-muted dark:bg-dark-canvas border border-light-border/60 dark:border-dark-border/60 flex items-center justify-center text-[11px] font-serif text-light-ink dark:text-dark-ink select-none shrink-0">
                            {v.kanji}
                          </span>
                        </div>
                        <div className="text-xs text-light-ink/90 dark:text-dark-ink/90 font-mono truncate">
                          <span className="font-semibold text-terracotta dark:text-ochre">{v.displayFont}</span>
                          <span className="opacity-70"> · {v.bodyFont}</span>
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

            {/* Desktop Control Pack 3: Paper Texture */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-5 sm:p-6 shadow-2xs craft-card double-hairline">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-light-border/50 dark:border-dark-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">03</span>
                  <h2 className="text-sm font-semibold text-light-ink dark:text-dark-ink">
                    Paper Texture
                  </h2>
                </div>
                <span className="text-xs font-mono font-semibold text-terracotta dark:text-ochre">
                  {preset === 'custom' ? 'CUSTOM · 調整' : preset.toUpperCase()}
                </span>
              </div>

              {/* 3 Texture Presets: Clean Hairline-Divided Rows */}
              <div className="divide-y divide-light-border/40 dark:divide-dark-border/50 mb-3 border-t border-b border-light-border/40 dark:border-dark-border/50">
                {presetsList.map((p) => {
                  const isSelected = preset === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setPreset(p.id as 'silk' | 'kozo' | 'raw');
                        toast.success(`Applied ${p.name}`);
                      }}
                      className={`py-3 px-2 rounded-[2px] transition-colors duration-150 cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'bg-terracotta/10 dark:bg-ochre/15'
                          : 'hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised'
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
                          {p.id === 'kozo' && (
                            <span className="text-[10px] font-mono text-terracotta dark:text-ochre uppercase font-medium">
                              (Default)
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-light-ink-muted dark:text-dark-ink-muted leading-tight truncate">
                          {p.subtitle}
                        </p>
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

              {/* Collapsible Fine-Tune Sliders Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowDesktopSliders(!showDesktopSliders)}
                  className="w-full py-2 px-3 rounded-[2px] border border-light-border/60 dark:border-dark-border/60 bg-light-surface/40 dark:bg-dark-surface/40 hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised transition-colors flex items-center justify-between text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 font-medium text-light-ink dark:text-dark-ink">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />
                    <span>Fine-Tune Sliders</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="text-light-ink-muted dark:text-dark-ink-muted font-medium">
                      {showDesktopSliders ? 'Hide' : `${dayRoughness}% · ${nightRoughness}%`}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showDesktopSliders ? 'rotate-180 text-terracotta dark:text-ochre' : ''}`} />
                  </span>
                </button>

                {/* Flat Sliders Stack (Zero nested card boxes) */}
                {showDesktopSliders && (
                  <div className="mt-3 divide-y divide-light-border/40 dark:divide-dark-border/40 pt-1 animate-view-enter">
                    
                    {/* Slider 1: Day Paper Roughness */}
                    <div className="py-2.5 first:pt-1 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-1.5 text-light-ink dark:text-dark-ink font-medium">
                          <Sun className="w-3.5 h-3.5 text-terracotta" />
                          <span>Day Paper Texture:</span>
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
                        className="w-full accent-terracotta cursor-pointer h-1.5 bg-light-surface-muted dark:bg-dark-surface rounded-[2px]"
                      />
                      <div className="flex justify-between text-[11px] font-mono text-light-ink-muted dark:text-dark-ink-muted pt-0.5">
                        <span>Fine (4%)</span>
                        <span className="text-terracotta font-medium">Default (16%)</span>
                        <span>Coarse (35%)</span>
                      </div>
                    </div>

                    {/* Slider 2: Night Cedar Roughness */}
                    <div className="py-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-1.5 text-light-ink dark:text-dark-ink font-medium">
                          <Moon className="w-3.5 h-3.5 text-ochre" />
                          <span>Night Cedar Texture:</span>
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
                        className="w-full accent-ochre cursor-pointer h-1.5 bg-light-surface-muted dark:bg-dark-surface rounded-[2px]"
                      />
                      <div className="flex justify-between text-[11px] font-mono text-light-ink-muted dark:text-dark-ink-muted pt-0.5">
                        <span>Fine (2%)</span>
                        <span className="text-ochre font-medium">Default (6.5%)</span>
                        <span>Coarse (20%)</span>
                      </div>
                    </div>

                    {/* Slider 3: Grain Density */}
                    <div className="py-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-1.5 text-light-ink dark:text-dark-ink font-medium">
                          <Layers className="w-3.5 h-3.5 text-bamboo" />
                          <span>Grain Density:</span>
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
                        className="w-full accent-bamboo cursor-pointer h-1.5 bg-light-surface-muted dark:bg-dark-surface rounded-[2px]"
                      />
                      <div className="flex justify-between text-[11px] font-mono text-light-ink-muted dark:text-dark-ink-muted pt-0.5">
                        <span>Coarse (0.45)</span>
                        <span className="font-medium">Balanced (0.90)</span>
                        <span>Fine (1.05)</span>
                      </div>
                    </div>

                    {/* Quick Reset */}
                    {preset === 'custom' && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            resetWashiDefaults();
                            toast.info('Reset texture to Natural default (16% Day / 6.5% Night)');
                          }}
                          className="text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta dark:hover:text-ochre transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset to Default</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT / PRIMARY COLUMN: LIVE SPECIMEN STAGE WITH COMPACT MOBILE CONTROLS ── */}
          <div className="w-full lg:col-span-7 flex flex-col gap-4 sm:gap-5 lg:sticky lg:top-24">
            
            {/* ── MOBILE ULTRA-COMPACT QUICK SWITCHER BAR ── */}
            <div className="lg:hidden bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-2 sm:p-2.5 shadow-xs craft-card double-hairline flex flex-col gap-2">
              
              {/* Row 1: Active Voice Indicator + Texture Pill + Day/Night Toggle */}
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-terracotta dark:text-ochre truncate">
                    0{activeInfo.numericKey} · {activeInfo.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Texture Drawer Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowMobileWashi(!showMobileWashi)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-xs font-mono transition-all cursor-pointer border min-h-[30px] ${
                      showMobileWashi
                        ? 'border-terracotta dark:border-ochre bg-terracotta/15 dark:bg-ochre/15 text-terracotta dark:text-ochre font-bold shadow-2xs'
                        : 'border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink'
                    }`}
                    title="Adjust paper texture"
                    aria-expanded={showMobileWashi}
                  >
                    <Layers className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />
                    <span>Texture</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showMobileWashi ? 'rotate-180 text-terracotta dark:text-ochre' : ''}`} />
                  </button>

                  {/* Day / Night Toggle */}
                  <div className="inline-flex p-0.5 rounded-[2px] bg-light-surface-raised dark:bg-dark-surface border border-light-border dark:border-dark-border">
                    <button
                      onClick={() => setTheme('day')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 min-h-[30px] rounded-[2px] text-xs font-mono transition-all cursor-pointer ${
                        theme === 'day'
                          ? 'bg-light-surface-card dark:bg-dark-surface-raised text-terracotta font-bold shadow-2xs'
                          : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink'
                      }`}
                    >
                      <Sun className="w-3 h-3 text-terracotta dark:text-ochre" />
                      <span>Day</span>
                    </button>
                    <button
                      onClick={() => setTheme('night')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 min-h-[30px] rounded-[2px] text-xs font-mono transition-all cursor-pointer ${
                        theme === 'night'
                          ? 'bg-light-surface-card dark:bg-dark-surface-raised text-terracotta dark:text-ochre font-bold shadow-2xs'
                          : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink'
                      }`}
                    >
                      <Moon className="w-3 h-3 text-terracotta dark:text-ochre" />
                      <span>Night</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Progressive Disclosure: Mobile Texture Drawer with Clean Presets and Proportional Slider */}
              {showMobileWashi && (
                <div className="pt-2 border-t border-light-border/50 dark:border-dark-border/60 space-y-2.5 animate-view-enter">
                  {/* 3 Preset Segmented Buttons: Smooth, Natural, Coarse */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {presetsList.map((p) => {
                      const isSelected = preset === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setPreset(p.id as 'silk' | 'kozo' | 'raw');
                            toast.success(`Applied ${p.name}`);
                          }}
                          className={`py-1.5 px-1 rounded-[2px] text-center transition-all cursor-pointer border flex flex-col items-center justify-center min-h-[36px] ${
                            isSelected
                              ? 'border-terracotta dark:border-ochre bg-terracotta dark:bg-ochre text-white dark:text-dark-canvas font-bold shadow-2xs'
                              : 'border-light-border/70 dark:border-dark-border/70 bg-light-surface/60 dark:bg-dark-surface/60 text-light-ink dark:text-dark-ink hover:border-terracotta/50'
                          }`}
                        >
                          <span className="text-xs font-mono font-bold leading-tight">
                            {p.id === 'silk' ? 'Smooth · 絹' : p.id === 'kozo' ? 'Natural · 楮' : 'Coarse · 生'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Single Proportional Texture Slider */}
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-light-ink-muted dark:text-dark-ink-muted flex items-center gap-1 font-medium">
                        <Layers className="w-3 h-3 text-terracotta dark:text-ochre" />
                        <span>Roughness:</span>
                      </span>
                      <span className="font-bold text-terracotta dark:text-ochre">
                        {dayRoughness}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={35}
                      step={1}
                      value={dayRoughness}
                      onChange={(e) => setProportionalRoughness(Number(e.target.value))}
                      className="w-full cursor-pointer h-1.5 bg-light-surface-muted dark:bg-dark-canvas rounded-[2px] accent-terracotta dark:accent-ochre"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-light-ink-muted dark:text-dark-ink-muted">
                      <span>Smooth</span>
                      <span className="text-terracotta dark:text-ochre font-medium">Natural</span>
                      <span>Coarse</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Row 2: Horizontal scrollable voice strip with smooth auto-scroll */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const curIdx = variantsList.findIndex((v) => v.id === variant);
                    const prevIdx = (curIdx - 1 + variantsList.length) % variantsList.length;
                    handleApplyVariant(variantsList[prevIdx].id);
                  }}
                  className="p-1 min-w-[32px] sm:min-w-[36px] min-h-[34px] flex items-center justify-center rounded-[2px] border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-ink dark:text-dark-ink hover:border-terracotta dark:hover:border-ochre transition-colors cursor-pointer shrink-0"
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
                          className={`flex flex-col items-center justify-center w-full min-h-[34px] px-1 py-0.5 rounded-[2px] border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-terracotta dark:border-ochre bg-terracotta dark:bg-ochre text-white dark:text-dark-canvas font-bold shadow-xs'
                              : 'border-light-border/70 dark:border-dark-border/70 bg-light-surface/60 dark:bg-dark-surface/60 text-light-ink dark:text-dark-ink hover:border-terracotta/50 dark:hover:border-ochre/50'
                          }`}
                          title={v.name}
                          aria-label={`Select voice 0${v.numericKey}: ${v.name}`}
                        >
                          <span className="text-[11px] font-mono font-bold leading-none">0{v.numericKey}</span>
                          <span className={`text-[11px] font-serif leading-none mt-0.5 ${isSelected ? 'opacity-95' : 'opacity-65'}`}>
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
                  className="p-1 min-w-[32px] sm:min-w-[36px] min-h-[34px] flex items-center justify-center rounded-[2px] border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-ink dark:text-dark-ink hover:border-terracotta dark:hover:border-ochre transition-colors cursor-pointer shrink-0"
                  aria-label="Next voice"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Row 3: Active Font Specifier & Voice Archetype */}
              <div className="flex items-center justify-between text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted pt-1 px-0.5 border-t border-light-border/40 dark:border-dark-border/40 min-w-0 overflow-hidden">
                <span className="truncate flex-1 min-w-0 pr-2">
                  <span className="font-semibold text-terracotta dark:text-ochre">{activeInfo.displayFont}</span>
                  <span className="opacity-70"> + {activeInfo.bodyFont}</span>
                </span>
                <span className="text-[11px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle shrink-0">
                  {activeInfo.kanji} Archetype
                </span>
              </div>
            </div>

            {/* Live Interactive Specimen Stage Card: Flattened layout, zero nested cards, high contrast */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-4 sm:p-6 lg:p-7 shadow-xs craft-card double-hairline relative">
              <CornerBrackets size="md" />

              {/* Stage Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 sm:mb-5 border-b border-light-border/50 dark:border-dark-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre uppercase tracking-wider">
                    [LIVE SPECIMEN // 標本]
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-light-ink-muted dark:text-dark-ink-muted">Voice:</span>
                  <span className="font-bold text-terracotta dark:text-ochre">
                    0{activeInfo.numericKey} · {activeInfo.name}
                  </span>
                  <span className="text-light-ink-muted dark:text-dark-ink-muted hidden sm:inline">|</span>
                  <span className="text-light-ink-muted dark:text-dark-ink-muted hidden sm:inline">
                    Tooth: <strong className="text-light-ink dark:text-dark-ink">{theme === 'night' ? `${nightRoughness}%` : `${dayRoughness}%`}</strong>
                  </span>
                </div>
              </div>

              {/* 1. Display & Body Typography Sample */}
              <div className="space-y-2 pb-4 sm:pb-5 border-b border-light-border/40 dark:border-dark-border/50">
                <h3
                  className="text-xl sm:text-2xl lg:text-3xl text-light-ink dark:text-dark-ink font-normal leading-snug tracking-tight"
                  style={{ fontFamily: activeInfo.displayFont }}
                >
                  Crafting thoughtful digital experiences with algorithmic clarity.
                </h3>
                <p
                  className="text-xs sm:text-sm text-light-ink/90 dark:text-dark-ink/90 leading-relaxed max-w-xl"
                  style={{ fontFamily: activeInfo.bodyFont }}
                >
                  Focused on building robust, well-structured software with clean design and attention to detail. Systems engineered with balance, reliability, and usability in mind.
                </p>
              </div>

              {/* 2. Interactive UI Component Simulation (Borderless, integrated directly on specimen surface) */}
              <div className="py-4 sm:py-5 border-b border-light-border/40 dark:border-dark-border/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono rounded-[2px] bg-light-surface-muted dark:bg-dark-canvas text-light-ink dark:text-dark-ink border border-light-border/60 dark:border-dark-border/60 font-medium">
                      #01
                    </span>
                    <StatusBadge isActive={true} activeLabel="ACTIVE / 現職" />
                  </div>
                  <span className="text-xs font-mono text-light-ink/90 dark:text-dark-ink/90 font-medium" style={{ fontFamily: activeInfo.monoFont }}>
                    2024 - Present
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <h4
                    className="text-lg sm:text-xl text-light-ink dark:text-dark-ink font-medium tracking-tight"
                    style={{ fontFamily: activeInfo.displayFont }}
                  >
                    Personal Portfolio &amp; Agentic Lab
                  </h4>
                  <span className="text-base font-serif text-light-ink-muted dark:text-dark-ink-muted shrink-0">
                    作品
                  </span>
                </div>

                <p
                  className="text-xs sm:text-sm text-light-ink/80 dark:text-dark-ink/90 leading-relaxed max-w-xl"
                  style={{ fontFamily: activeInfo.bodyFont }}
                >
                  High-performance portfolio engine typeset with dynamic typography variants, Supabase integration, and real-time AI assistant telemetry.
                </p>

                <div className="flex flex-wrap gap-2 pt-1 pb-2">
                  <TechTag tag="React 19" size="md" />
                  <TechTag tag="TypeScript" size="md" />
                  <TechTag tag="Tailwind CSS" size="md" />
                  <TechTag tag="Supabase" size="md" />
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <a
                    href="#featured-works"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('home', 'featured-works');
                    }}
                    className="px-3.5 py-2 bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light font-sans text-xs font-semibold rounded-[2px] shadow-2xs hover:opacity-95 transition-opacity min-h-[40px] inline-flex items-center cursor-pointer"
                  >
                    Explore Selected Works
                  </a>
                  <a
                    href="#resume"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('resume');
                    }}
                    className="px-3.5 py-2 bg-light-surface-raised dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink font-sans text-xs font-medium rounded-[2px] shadow-2xs hover:border-light-border-strong dark:hover:border-dark-border-strong transition-colors min-h-[40px] inline-flex items-center cursor-pointer"
                  >
                    Technical CV
                  </a>
                </div>
              </div>

              {/* 3. Monospace Code & Materiality Telemetry: High contrast, borderless callout */}
              <div className="py-4 sm:py-5 border-b border-light-border/40 dark:border-dark-border/50 space-y-2">
                <div className="border-l-2 border-terracotta/70 dark:border-ochre/70 pl-3 py-1 text-xs font-mono space-y-1 overflow-x-auto" style={{ fontFamily: activeInfo.monoFont }}>
                  <div className="text-terracotta dark:text-ochre font-semibold">
                    {`// SYS_TOKENS: { display: "${activeInfo.displayFont}", body: "${activeInfo.bodyFont}", mono: "${activeInfo.monoFont}" }`}
                  </div>
                  <div className="text-light-ink dark:text-dark-ink font-medium">
                    {`// LIVE_STATE: { theme: "${theme.toUpperCase()}", texture: "${preset.toUpperCase()}", day: "${dayRoughness}%", night: "${nightRoughness}%", scale: "${grainFrequency.toFixed(2)}" }`}
                  </div>
                </div>
              </div>

              {/* 4. Tiny Day / Night Live Impact Simulation Blocks */}
              <div className="pt-4 sm:pt-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-light-ink font-semibold dark:text-dark-ink">
                    Live Theme Materiality Simulation
                  </span>
                  <span className="text-[11px] text-terracotta dark:text-ochre font-semibold">
                    Day ⇄ Night Fiber Contrast
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Tiny Day Simulation Block */}
                  <div className="p-3 rounded-[2px] bg-[#FAF6EE] text-[#282E3A] border border-[#D4C4AA] shadow-2xs relative overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-terracotta flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5" />
                        <span>Akari Day Paper</span>
                      </span>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-[2px] bg-[#EAE0CE] border border-[#D4C4AA] font-bold text-[#282E3A]">
                        {dayRoughness}% Texture
                      </span>
                    </div>
                    <p
                      className="text-sm font-medium tracking-tight truncate my-1.5"
                      style={{ fontFamily: activeInfo.displayFont }}
                    >
                      Thoughtful digital craft
                    </p>
                    <div className="text-[10px] font-mono text-[#686559] flex items-center justify-between pt-1 border-t border-[#D4C4AA]/50 font-medium">
                      <span>#FAF6EE Cream Paper</span>
                      <span>Multiply Blend</span>
                    </div>
                  </div>

                  {/* Tiny Night Simulation Block */}
                  <div className="p-3 rounded-[2px] bg-[#23262F] text-[#E8E6DF] border border-[#383B44] shadow-2xs relative overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-ochre flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5" />
                        <span>Charred Cedar Wood</span>
                      </span>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-[2px] bg-[#121316] border border-[#383B44] font-bold text-[#E8E6DF]">
                        {nightRoughness}% Texture
                      </span>
                    </div>
                    <p
                      className="text-sm font-medium tracking-tight truncate my-1.5"
                      style={{ fontFamily: activeInfo.displayFont }}
                    >
                      Thoughtful digital craft
                    </p>
                    <div className="text-[10px] font-mono text-[#9E9A8E] flex items-center justify-between pt-1 border-t border-[#383B44]/70 font-medium">
                      <span>#23262F Charred Cedar</span>
                      <span>Screen Blend</span>
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
