import React, { useState } from 'react';
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

  // The active or temporarily previewed variant
  const activeVariantId = hoveredVariant || variant;
  const activeInfo = TYPOGRAPHY_VARIANTS[activeVariantId] || TYPOGRAPHY_VARIANTS.v4;

  const handleApplyVariant = (id: TypographyVariantId) => {
    setVariant(id);
    toast.success(`Activated ${TYPOGRAPHY_VARIANTS[id]?.name || id}`, {
      duration: 1800,
    });
  };

  const handleResetDefaults = () => {
    setVariant('v4');
    setTheme('day');
    toast.info('Reset to Default Design System (Neo-Grotesque & Day Mode)');
  };

  return (
    <div className="relative min-h-screen bg-light-canvas dark:bg-dark-canvas text-light-ink dark:text-dark-ink pt-24 lg:pt-28 pb-24 transition-colors duration-300 overflow-x-hidden">
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
        {/* Studio Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 sm:mb-10 border-b border-light-border/70 dark:border-dark-border/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <button
                onClick={() => onNavigate('home')}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta dark:hover:text-ochre transition-colors cursor-pointer mr-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Portfolio</span>
              </button>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-light-surface-raised dark:bg-dark-surface border border-light-border dark:border-dark-border text-terracotta dark:text-ochre uppercase tracking-wider font-bold">
                [体系 · Visual System Studio]
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-light-ink dark:text-dark-ink tracking-tight">
              Design System &amp; Typographic Voices
            </h1>
            <p className="text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted mt-1.5 max-w-2xl leading-relaxed">
              Explore and customize the real-time design tokens, theme lighting, and 7 curated Japanese-Scandinavian typographic voices across the entire portfolio.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] text-xs font-mono border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink hover:border-light-border-strong dark:hover:border-dark-border-strong transition-colors cursor-pointer shadow-2xs"
              title="Reset to default settings"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[2px] text-xs font-sans font-semibold bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              <span>Apply &amp; Return</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Split Studio Layout: Left Controls + Right Live Interactive Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ── LEFT COLUMN: CONTROL SUITE (5 Cols) ── */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Control Pack 1: Lighting Atmosphere & Theme Pack */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-5 shadow-2xs craft-card double-hairline">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-light-border/50 dark:border-dark-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">[01]</span>
                  <h2 className="text-sm font-semibold text-light-ink dark:text-dark-ink">
                    Lighting Atmosphere &amp; Canvas Mode
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle">
                  Active: {theme.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Day Mode Button */}
                <button
                  onClick={() => setTheme('day')}
                  className={`p-3.5 rounded-[2px] border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                    theme === 'day'
                      ? 'border-terracotta bg-light-surface-raised shadow-xs ring-1 ring-terracotta/30'
                      : 'border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface hover:border-light-border-strong'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-light-ink">
                      <Sun className="w-4 h-4 text-ochre" />
                      <span>Akari Day</span>
                    </div>
                    {theme === 'day' && <Check className="w-3.5 h-3.5 text-terracotta" />}
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="w-4 h-4 rounded-full bg-[#EAE0CE] border border-stone-300" title="Canvas: #EAE0CE" />
                    <span className="w-4 h-4 rounded-full bg-[#FAF6EE] border border-stone-300" title="Surface: #FAF6EE" />
                    <span className="w-4 h-4 rounded-full bg-[#B5482E]" title="Accent Terracotta: #B5482E" />
                    <span className="w-4 h-4 rounded-full bg-[#282E3A]" title="Ink: #282E3A" />
                  </div>
                  <span className="text-[10px] text-light-ink-muted leading-tight">
                    Natural Wabi-Sabi cream paper with warm terracotta brushstrokes.
                  </span>
                </button>

                {/* Night Mode Button */}
                <button
                  onClick={() => setTheme('night')}
                  className={`p-3.5 rounded-[2px] border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                    theme === 'night'
                      ? 'border-ochre bg-dark-surface-raised shadow-xs ring-1 ring-ochre/30'
                      : 'border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface hover:border-dark-border-strong'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-dark-ink">
                      <Moon className="w-4 h-4 text-ochre" />
                      <span>Charred Cedar</span>
                    </div>
                    {theme === 'night' && <Check className="w-3.5 h-3.5 text-ochre" />}
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="w-4 h-4 rounded-full bg-[#121316] border border-stone-700" title="Canvas: #121316" />
                    <span className="w-4 h-4 rounded-full bg-[#23262F] border border-stone-700" title="Surface: #23262F" />
                    <span className="w-4 h-4 rounded-full bg-[#D4A853]" title="Accent Ochre Gold: #D4A853" />
                    <span className="w-4 h-4 rounded-full bg-[#E8E6DF]" title="Ink: #E8E6DF" />
                  </div>
                  <span className="text-[10px] text-dark-ink-muted leading-tight">
                    Charred Japanese cedar wood with luminous gold lantern highlights.
                  </span>
                </button>
              </div>
            </div>

            {/* Control Pack 2: All 7 Typographic Voices Matrix */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-5 shadow-2xs craft-card double-hairline">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-light-border/50 dark:border-dark-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">[02]</span>
                  <h2 className="text-sm font-semibold text-light-ink dark:text-dark-ink">
                    Typographic Identity Voices (7)
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle">
                  1-Click Select
                </span>
              </div>

              <div className="space-y-2.5">
                {variantsList.map((v) => {
                  const isSelected = v.id === variant;
                  return (
                    <div
                      key={v.id}
                      onMouseEnter={() => setHoveredVariant(v.id)}
                      onMouseLeave={() => setHoveredVariant(null)}
                      onClick={() => handleApplyVariant(v.id)}
                      className={`p-3 rounded-[2px] border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'border-terracotta dark:border-ochre bg-terracotta/10 dark:bg-ochre/10 shadow-2xs ring-1 ring-terracotta/30 dark:ring-ochre/30'
                          : 'border-light-border/70 dark:border-dark-border/70 bg-light-surface dark:bg-dark-surface hover:border-light-border-strong dark:hover:border-dark-border-strong hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">
                            0{v.numericKey}
                          </span>
                          <span className="text-xs font-semibold text-light-ink dark:text-dark-ink truncate">
                            {v.name}
                          </span>
                          <span className="w-4 h-4 rounded-[2px] bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border/60 dark:border-dark-border/60 flex items-center justify-center text-[10px] font-serif text-light-ink-subtle dark:text-dark-ink-subtle select-none">
                            {v.kanji}
                          </span>
                        </div>
                        <div className="text-[11px] text-light-ink-muted dark:text-dark-ink-muted mt-0.5 truncate">
                          <span className="font-medium text-light-ink dark:text-dark-ink">{v.displayFont}</span> · {v.bodyFont} · {v.monoFont}
                        </div>
                        <div className="text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle mt-0.5 italic truncate">
                          {v.tagline}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {isSelected ? (
                          <div className="flex items-center gap-1 px-2 py-1 bg-terracotta dark:bg-ochre text-white dark:text-dark-canvas text-[10px] font-mono font-bold rounded-xs uppercase">
                            <Check className="w-3 h-3" />
                            <span>Active</span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle group-hover:text-terracotta dark:group-hover:text-ochre flex items-center gap-0.5">
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
          <div className="lg:col-span-7 flex flex-col gap-6 lg:sticky lg:top-28">
            
            {/* Live Interactive Specimen Stage */}
            <div className="bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-6 sm:p-8 shadow-sm craft-card double-hairline relative">
              <CornerBrackets size="md" />

              {/* Stage Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-light-border/50 dark:border-dark-border/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-terracotta dark:text-ochre" />
                  <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre uppercase tracking-wider">
                    [Live Component Stage]
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-light-ink-muted dark:text-dark-ink-muted">Rendering Voice:</span>
                  <span className="font-bold text-terracotta dark:text-ochre">
                    0{activeInfo.numericKey} · {activeInfo.name}
                  </span>
                </div>
              </div>

              {/* Exhibit 1: Display Headline & Subtitle */}
              <div className="space-y-3 pb-6 border-b border-light-border/40 dark:border-dark-border/50">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                    Exhibit A · Hero Display Headline ({activeInfo.displayFont})
                  </span>
                </div>
                <h3
                  className="text-2xl sm:text-3xl lg:text-4xl text-light-ink dark:text-dark-ink font-normal leading-tight tracking-tight"
                  style={{ fontFamily: activeInfo.displayFont }}
                >
                  Crafting thoughtful digital experiences with algorithmic clarity.
                </h3>
                <p
                  className="text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted leading-relaxed max-w-xl"
                  style={{ fontFamily: activeInfo.bodyFont }}
                >
                  Rooted in the Japanese aesthetics of <strong className="text-light-ink dark:text-dark-ink">Akari</strong> (illumination) and <strong className="text-light-ink dark:text-dark-ink">Wabi-Sabi</strong> (organic simplicity). Systems engineered with mathematical balance and human empathy.
                </p>
              </div>

              {/* Exhibit 2: Card Architecture Mockup */}
              <div className="py-6 border-b border-light-border/40 dark:border-dark-border/50 space-y-3">
                <span className="font-mono text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest block">
                  Exhibit B · Project Card Simulation ({activeInfo.displayFont} + {activeInfo.bodyFont})
                </span>

                <div className="p-4 sm:p-5 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border shadow-2xs relative">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-[2px] bg-light-surface-muted dark:bg-dark-canvas text-light-ink-muted dark:text-dark-ink-muted border border-light-border/60 dark:border-dark-border/60">
                        #01
                      </span>
                      <StatusBadge isActive={true} activeLabel="ACTIVE / 現職" />
                    </div>
                    <span className="text-xs font-mono text-light-ink-subtle dark:text-dark-ink-subtle" style={{ fontFamily: activeInfo.monoFont }}>
                      2024 — Present
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 mb-1">
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
                    className="text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed"
                    style={{ fontFamily: activeInfo.bodyFont }}
                  >
                    High-performance portfolio engine typeset with dynamic typography variants, Supabase integration, and real-time AI assistant telemetry.
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-3">
                    <TechTag tag="React 19" size="sm" />
                    <TechTag tag="TypeScript" size="sm" />
                    <TechTag tag="Tailwind CSS" size="sm" />
                    <TechTag tag="Supabase" size="sm" />
                  </div>
                </div>
              </div>

              {/* Exhibit 3: Monospace Telemetry & Code Craft */}
              <div className="pt-6 space-y-3">
                <span className="font-mono text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest block">
                  Exhibit C · Telemetry &amp; Monospace Coordinates ({activeInfo.monoFont})
                </span>

                <div className="p-3.5 rounded-[2px] bg-light-canvas/70 dark:bg-dark-canvas border border-light-border/60 dark:border-dark-border/60 text-xs font-mono space-y-1.5 overflow-x-auto" style={{ fontFamily: activeInfo.monoFont }}>
                  <div className="text-terracotta dark:text-ochre">
                    {`// [LAT: 43.6532° N · LON: 79.3832° W · ELEVATION: 76m]`}
                  </div>
                  <div className="text-light-ink dark:text-dark-ink">
                    {`SYS_TOKENS: { display: "${activeInfo.displayFont}", body: "${activeInfo.bodyFont}", mono: "${activeInfo.monoFont}" }`}
                  </div>
                  <div className="text-light-ink-muted dark:text-dark-ink-muted text-[11px]">
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
                      className="px-4 py-2 bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light font-sans text-xs font-semibold rounded-[2px] shadow-2xs hover:opacity-95 transition-opacity"
                    >
                      Explore Selected Works
                    </a>
                    <a
                      href="#resume"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('resume');
                      }}
                      className="px-4 py-2 bg-light-surface-raised dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink font-sans text-xs font-medium rounded-[2px] shadow-2xs hover:border-light-border-strong dark:hover:border-dark-border-strong transition-colors"
                    >
                      Technical CV
                    </a>
                  </div>

                  <span className="text-[11px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle">
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
