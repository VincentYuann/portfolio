import React, { useState } from 'react';
import { Compass, Feather, ShieldCheck } from 'lucide-react';
import { BambooArt } from './BambooArt';
import { EnsoOrbital } from './EnsoOrbital';
import { CornerBrackets } from './CornerBrackets';
import { VerticalMarginWidget, MARGIN_PRESETS } from './VerticalMarginWidget';
import { useSiteData, DEFAULT_ORIGIN_STORY } from '../context/SiteDataContext';

const TRAJECTORY_THEMES = [
  {
    eraColor: 'text-ochre dark:text-[#E5B88F]',
    tagBg: 'bg-ochre/10 dark:bg-ochre/20 text-ochre dark:text-[#E5B88F] border-ochre/30',
    borderHover: 'hover:border-ochre/50',
    accentBar: 'border-l-2 border-l-ochre/70 dark:border-l-ochre/70',
    glow: 'hover:shadow-[0_4px_20px_rgba(212,155,106,0.12)]',
  },
  {
    eraColor: 'text-[#4A6B82] dark:text-[#8EA8C3]',
    tagBg: 'bg-[#4A6B82]/10 dark:bg-[#4A6B82]/20 text-[#4A6B82] dark:text-[#8EA8C3] border-[#4A6B82]/30',
    borderHover: 'hover:border-[#4A6B82]/50',
    accentBar: 'border-l-2 border-l-[#4A6B82]/70 dark:border-l-[#4A6B82]/70',
    glow: 'hover:shadow-[0_4px_20px_rgba(74,107,130,0.12)]',
  },
  {
    eraColor: 'text-terracotta dark:text-[#ff7d63]',
    tagBg: 'bg-terracotta/10 dark:bg-terracotta/20 text-terracotta dark:text-[#ff7d63] border-terracotta/30',
    borderHover: 'hover:border-terracotta/50',
    accentBar: 'border-l-2 border-l-terracotta/70 dark:border-l-terracotta/70',
    glow: 'hover:shadow-[0_4px_20px_rgba(200,60,35,0.12)]',
  },
  {
    eraColor: 'text-bamboo dark:text-[#658B7B]',
    tagBg: 'bg-bamboo/10 dark:bg-bamboo/20 text-bamboo dark:text-[#87A889] border-bamboo/30',
    borderHover: 'hover:border-bamboo/50',
    accentBar: 'border-l-2 border-l-bamboo/70 dark:border-l-bamboo/70',
    glow: 'hover:shadow-[0_4px_20px_rgba(68,101,87,0.12)]',
  },
];

const PILLAR_CONFIGS = [
  {
    icon: Compass,
    num: 'PILLAR 01',
    kanjiColor: 'text-[#3B4E6B] dark:text-[#8EA8C3]',
    iconColor: 'text-[#3B4E6B] dark:text-[#8EA8C3]',
    dotColor: 'bg-[#3B4E6B]',
    hoverBorder: 'hover:border-[#3B4E6B]/50',
    watermark: (
      <svg
        className="w-32 h-32 absolute -right-6 -bottom-6 text-[#3B4E6B]/15 dark:text-[#8EA8C3]/10 pointer-events-none"
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
    kanjiColor: 'text-terracotta dark:text-[#ff7d63]',
    iconColor: 'text-terracotta dark:text-[#ff7d63]',
    dotColor: 'bg-terracotta',
    hoverBorder: 'hover:border-terracotta/50',
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
    kanjiColor: 'text-bamboo dark:text-[#87A889]',
    iconColor: 'text-bamboo dark:text-[#87A889]',
    dotColor: 'bg-bamboo',
    hoverBorder: 'hover:border-bamboo/50',
    watermark: (
      <div className="absolute -right-4 -bottom-4 w-28 h-40 opacity-25 dark:opacity-15 pointer-events-none">
        <BambooArt className="w-full h-full" sway={false} opacity={0.8} />
      </div>
    ),
  },
];

export const PhilosophyBento: React.FC = () => {
  const { pillars: rawPillars, profile } = useSiteData();
  const [hoveredTrajectory, setHoveredTrajectory] = useState<'parent' | number | null>(null);
  const displayPillars = Array.isArray(rawPillars) ? rawPillars : [];
  const originStory = profile?.origin_story || DEFAULT_ORIGIN_STORY;
  const milestones =
    originStory.milestones && originStory.milestones.length > 0
      ? originStory.milestones
      : DEFAULT_ORIGIN_STORY.milestones!;

  if (displayPillars.length === 0 && (!originStory.milestones || originStory.milestones.length === 0)) {
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 pb-6 border-b border-light-border/70 dark:border-[#2D3039]/80">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-serif text-terracotta text-sm">04 //</span>
              <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                ORIGIN &amp; ARCHITECTURAL PHILOSOPHY
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink font-normal tracking-tight">
              Origin &amp; Philosophy{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
                原点と哲学
              </span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 font-light leading-relaxed">
              Software is not merely mechanical logic; it is a spatial environment shaped by curious exploration, system boundaries, and genuine human empathy.
            </p>
          </div>
        </div>

        {/* 04.1 Origin Trajectory Bento Box */}
        <div
          onMouseEnter={() => setHoveredTrajectory('parent')}
          onMouseLeave={() => setHoveredTrajectory(null)}
          className="mb-10 sm:mb-12 bg-light-surface-card/95 dark:bg-dark-surface/95 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-8 shadow-sm relative overflow-visible classical-card-frame group hover:border-terracotta/40 transition-colors duration-300"
        >
          {/* Celestial Ensō Orbital Circle: blooms on top-left when hovering the bigger div outside small cards */}
          <EnsoOrbital
            placement="top-left"
            size={128}
            active={hoveredTrajectory === 'parent'}
            interactive={false}
          />
          <CornerBrackets size="md" />

          {/* Card Top Sub-Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-light-border/60 dark:border-[#2D3039]/60 relative z-10">
            <span className="font-mono text-xs font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
              {originStory.badge || 'ORIGIN & TRAJECTORY · 原点と軌跡'}
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-wider">
              <span>PHILADELPHIA, PA</span>
              <span className="opacity-40">·</span>
              <span className="text-terracotta font-medium">SWE · SYSTEMS · FULL-STACK</span>
            </div>
          </div>

          {/* Headline & Lead Narrative */}
          <div className="max-w-3xl mb-6 relative z-10">
            <h3 className="font-serif text-xl sm:text-2xl text-light-ink dark:text-dark-ink font-medium tracking-tight">
              {originStory.headline || 'From Logic Puzzles to Full-Stack Systems'}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted mt-2 leading-relaxed font-light">
              {originStory.leadParagraph || DEFAULT_ORIGIN_STORY.leadParagraph}
            </p>
          </div>

          {/* 4 Milestones Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 relative z-10">
            {milestones.map((m, idx) => {
              const tTheme = TRAJECTORY_THEMES[idx % TRAJECTORY_THEMES.length];
              return (
                <div
                  key={idx}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredTrajectory(idx);
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    setHoveredTrajectory('parent');
                  }}
                  className={`p-4 sm:p-4.5 rounded-lg bg-light-surface-raised/80 dark:bg-dark-surface-raised/80 border border-light-border/70 dark:border-dark-border/70 flex flex-col justify-between ${tTheme.borderHover} ${tTheme.accentBar} ${tTheme.glow} transition-all duration-300 relative overflow-visible shadow-2xs hover:shadow-sm`}
                >
                  {/* Celestial Ensō Orbital Circle: blooms on top-left of this specific milestone card */}
                  <EnsoOrbital
                    placement="top-left"
                    size={88}
                    active={hoveredTrajectory === idx}
                    interactive={false}
                  />
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-light-border/40 dark:border-dark-border/40 relative z-10">
                      <span className={`font-mono text-[10px] font-bold ${tTheme.eraColor} tracking-wider uppercase`}>
                        {m.era || `PHASE 0${idx + 1}`}
                      </span>
                      {m.tag && (
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${tTheme.tagBg} tracking-wider uppercase`}>
                          {m.tag}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-sm sm:text-base font-medium text-light-ink dark:text-dark-ink transition-colors relative z-10">
                      {m.title}
                    </h4>
                    {m.subtitle && (
                      <p className="font-sans text-[11px] text-light-ink-muted dark:text-dark-ink-muted mt-0.5 font-normal relative z-10">
                        {m.subtitle}
                      </p>
                    )}
                    <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-light mt-2.5 relative z-10">
                      {m.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 04.2 Core Architectural Pillars Subsection Divider */}
        {displayPillars.length > 0 && (
          <div className="mb-6 pt-2 pb-3 flex items-center justify-between border-b border-light-border/60 dark:border-[#2D3039]/60">
            <div className="flex items-center gap-2">
              <span className="font-serif text-terracotta text-sm">04.2 //</span>
              <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                THREE ARCHITECTURAL PILLARS · 三つの信条
              </span>
            </div>
            <span className="font-mono text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle tracking-widest uppercase hidden sm:inline">
              PRINCIPLES &amp; SYSTEM CRAFT
            </span>
          </div>
        )}

        {/* Dynamic Philosophy Cards */}
        {displayPillars.length > 0 && (
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
                className={`interactive-card bg-light-surface-card/95 dark:bg-dark-surface/95 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-visible group hover:bg-light-surface dark:hover:bg-dark-surface-raised transition-all duration-300 ${config.hoverBorder} hover:shadow-akari dark:hover:shadow-night-glow classical-card-frame min-h-[280px]`}
              >
                {/* Celestial Ensō Orbital Circle: appears ONLY on the hovered card */}
                <EnsoOrbital placement="top-left" size={112} hoverOnly={true} />

                {/* Corner Hairline Brackets */}
                <CornerBrackets size="md" />

                {/* Top Accent Kanji & Icon */}
                <div className="space-y-3 sm:space-y-4 relative z-10">
                  <div className="flex items-center justify-between border-b border-light-border/60 dark:border-[#2D3039]/60 pb-3 sm:pb-4">
                    <span className={`pillar-kanji font-serif text-4xl sm:text-6xl ${config.kanjiColor} font-light leading-none inline-block pl-1 sm:pl-2 select-none transition-colors`}>
                      {pillar.kanji}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                        {num}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-light-surface-raised dark:bg-[#14151A] border border-light-border dark:border-[#2D3039] flex items-center justify-center">
                        <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg sm:text-2xl text-light-ink dark:text-dark-ink font-normal tracking-tight group-hover:text-terracotta transition-colors break-words">
                      {pillar.romaji}
                      {pillar.title && (
                        <span className="font-sans text-xs sm:text-sm font-light text-light-ink-muted dark:text-dark-ink-muted ml-2 block sm:inline">
                          · {pillar.title}
                        </span>
                      )}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted mt-2 sm:mt-3 leading-relaxed font-light break-words">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Tag */}
                {pillar.tag && (
                  <div className="relative z-10 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-light-border/40 dark:border-[#2D3039]/40 flex items-center gap-2 text-light-ink-subtle dark:text-dark-ink-subtle">
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-medium truncate">
                      {pillar.tag}
                    </span>
                  </div>
                )}

                {/* Thematic Watermark Motif behind card content */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
                  {config.watermark}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};
