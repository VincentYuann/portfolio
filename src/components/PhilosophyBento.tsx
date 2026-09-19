import React from 'react';
import { Compass, Feather, ShieldCheck } from 'lucide-react';
import { BambooArt } from './BambooArt';
import { EnsoOrbital } from './EnsoOrbital';
import { CornerBrackets } from './CornerBrackets';
import { VerticalMarginWidget, MARGIN_PRESETS } from './VerticalMarginWidget';
import { useSiteData } from '../context/SiteDataContext';

const PILLAR_CONFIGS = [
  {
    icon: Compass,
    num: 'PILLAR 01',
    watermark: (
      <svg
        className="w-32 h-32 absolute -right-6 -bottom-6 text-light-ink-muted/15 dark:text-dark-ink-muted/10 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="50" cy="50" r="15" strokeWidth="0.8" strokeDasharray="2 3" />
        <circle cx="50" cy="50" r="28" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="42" strokeWidth="0.6" strokeDasharray="3 4" />
      </svg>
    ),
  },
  {
    icon: Feather,
    num: 'PILLAR 02',
    watermark: (
      <div className="absolute -right-4 -bottom-4 w-32 h-36 opacity-20 dark:opacity-10 pointer-events-none">
        <img
          src="./images/sumie-pine-tree-left.jpg"
          alt="Pine motif"
          className="w-full h-full object-contain object-bottom-right mix-blend-multiply dark:mix-blend-screen dark:invert"
        />
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    num: 'PILLAR 03',
    watermark: (
      <div className="absolute -right-4 -bottom-4 w-28 h-40 opacity-25 dark:opacity-15 pointer-events-none">
        <BambooArt className="w-full h-full" sway={false} opacity={0.8} />
      </div>
    ),
  },
];

export const PhilosophyBento: React.FC = () => {
  const { pillars: rawPillars } = useSiteData();
  const displayPillars = Array.isArray(rawPillars) ? rawPillars : [];

  if (displayPillars.length === 0) {
    return null;
  }

  return (
    <section id="philosophy" className="relative w-full overflow-hidden py-16 lg:py-24">
      {/* Full-Bleed Atmospheric Background Behind Philosophy Cards */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        {/* Panoramic Mist Landscape backdrop spanning across the section */}
        <img
          src="./images/hero-sumie-landscape-bamboo-banner.jpg"
          alt="Sumi-e landscape behind philosophy cards"
          className="absolute inset-0 w-full h-full object-cover opacity-25 dark:opacity-15 mix-blend-multiply dark:mix-blend-screen dark:invert"
          style={{
            maskImage: 'radial-gradient(ellipse 92% 80% at 50% 50%, black 30%, transparent 88%)',
            WebkitMaskImage: 'radial-gradient(ellipse 92% 80% at 50% 50%, black 30%, transparent 88%)',
          }}
        />

        {/* Left Flank Art: Long Tall Sumi-e Bamboo Rising in Left Empty Space */}
        <div className="absolute left-0 lg:left-4 xl:left-8 bottom-0 top-12 w-36 sm:w-48 lg:w-64 pointer-events-none z-0 hidden md:block">
          <img
            src="./images/sumie-tall-vertical-bamboo.jpg"
            alt="Sumi-e bamboo art left flank"
            className="w-full h-full object-contain object-bottom opacity-40 dark:opacity-25 mix-blend-multiply dark:mix-blend-screen dark:invert animate-bamboo-sway"
            style={{
              maskImage: 'radial-gradient(ellipse 85% 85% at 40% 60%, black 40%, transparent 88%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 40% 60%, black 40%, transparent 88%)',
            }}
          />
        </div>

        {/* Right Flank Art: Long Tall Sumi-e Bamboo Rising in Right Empty Space */}
        <div className="absolute right-0 lg:right-4 xl:right-8 bottom-0 top-12 w-36 sm:w-48 lg:w-64 pointer-events-none z-0 hidden md:block">
          <img
            src="./images/sumie-tall-vertical-bamboo.jpg"
            alt="Sumi-e bamboo art right flank"
            className="w-full h-full object-contain object-bottom opacity-40 dark:opacity-25 mix-blend-multiply dark:mix-blend-screen dark:invert scale-x-[-1]"
            style={{
              maskImage: 'radial-gradient(ellipse 85% 85% at 60% 60%, black 40%, transparent 88%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 60% 60%, black 40%, transparent 88%)',
            }}
          />
        </div>

        {/* Top & Bottom seamless gradient transitions */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-light-canvas via-light-canvas/80 to-transparent dark:from-dark-canvas dark:via-dark-canvas/80 z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-light-canvas via-light-canvas/80 to-transparent dark:from-dark-canvas dark:via-dark-canvas/80 z-10 pointer-events-none" />
      </div>

      {/* Left Empty Margin Japanese Vertical Floating Widget (Visible on wide screens) */}
      <VerticalMarginWidget
        side="left"
        top="top-1/2 -translate-y-1/2"
        {...MARGIN_PRESETS.maWabi}
      />

      {/* Right Empty Margin Japanese Vertical Floating Widget (Visible on wide screens) */}
      <VerticalMarginWidget
        side="right"
        top="top-1/2 -translate-y-1/2"
        {...MARGIN_PRESETS.craftSpec}
      />

      {/* Main Philosophy Bento Content */}
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-10 border-b border-light-border/60 dark:border-[#2D3039]/60 pb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-terracotta font-serif text-sm">04 //</span>
            <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
              GUIDING PRINCIPLES
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink font-normal tracking-tight">
            Architectural Philosophy{' '}
            <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2">
              哲学
            </span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 font-light leading-relaxed">
            Software is not merely mechanical logic; it is a spatial environment where human minds dwell. I build
            systems honoring three core tenets.
          </p>
        </div>

        {/* Dynamic Philosophy Cards */}
        <div
          className={`grid grid-cols-1 ${
            displayPillars.length === 1
              ? 'max-w-xl mx-auto'
              : displayPillars.length === 2
              ? 'md:grid-cols-2 max-w-4xl mx-auto'
              : 'md:grid-cols-3'
          } gap-6 lg:gap-8`}
        >
          {displayPillars.map((pillar, idx) => {
            const config = PILLAR_CONFIGS[idx % PILLAR_CONFIGS.length];
            const Icon = config.icon;
            const num = `PILLAR ${String(pillar.position || idx + 1).padStart(2, '0')}`;

            return (
              <div
                key={pillar.position || idx}
                className="interactive-card bg-light-surface-card/95 dark:bg-dark-surface/95 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-visible group hover:bg-light-surface dark:hover:bg-dark-surface-raised transition-all duration-300 hover:shadow-akari dark:hover:shadow-night-glow classical-card-frame"
              >
                {/* Celestial Ensō Orbital Circle: appears ONLY on the hovered card */}
                <EnsoOrbital placement="top-left" size={112} hoverOnly={true} />

                {/* Corner Hairline Brackets */}
                <CornerBrackets size="md" />

                {/* Top Accent Kanji & Icon */}
                <div className="space-y-3 sm:space-y-4 relative z-10">
                  <div className="flex items-center justify-between border-b border-light-border/60 dark:border-[#2D3039]/60 pb-3 sm:pb-4">
                    <span className="pillar-kanji font-serif text-4xl sm:text-6xl text-terracotta font-light leading-none inline-block pl-1 sm:pl-2">
                      {pillar.kanji}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[10px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                        {num}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-light-surface-raised dark:bg-[#14151A] border border-light-border dark:border-[#2D3039] flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-terracotta" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg sm:text-2xl text-light-ink dark:text-dark-ink font-normal tracking-tight group-hover:text-terracotta transition-colors">
                      {pillar.romaji}
                      {pillar.title && (
                        <span className="font-sans text-xs sm:text-sm font-light text-light-ink-muted dark:text-dark-ink-muted ml-2 block sm:inline">
                          · {pillar.title}
                        </span>
                      )}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted mt-2 sm:mt-3 leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Tag */}
                {pillar.tag && (
                  <div className="relative z-10 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-light-border/40 dark:border-[#2D3039]/40 flex items-center gap-2 text-light-ink-subtle dark:text-dark-ink-subtle">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                    <span className="font-sans text-[10px] uppercase tracking-[0.18em] font-medium">
                      {pillar.tag}
                    </span>
                  </div>
                )}

                {/* Thematic Watermark Motif behind card content */}
                {config.watermark}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
