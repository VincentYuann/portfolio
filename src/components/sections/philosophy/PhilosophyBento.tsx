import React from 'react';
import { Compass, Feather, ShieldCheck } from 'lucide-react';
import { BambooArt } from '../../common/BambooArt';
import { CornerBrackets } from '../../common/CornerBrackets';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { Card } from '../../ui/card';
import { useSiteData } from '../../../context/SiteDataContext';
import { SectionSideBackdrop } from '../../common/SectionSideBackdrop';
import { SectionDivider } from '../../common/SectionDivider';
import { SectionHeading } from '../../common/SectionHeading';
import { AkariLanternDecorator } from '../../common/AkariLanternDecorator';

const TRAJECTORY_THEMES = [
  {
    eraColor: 'text-light-ink dark:text-dark-ink',
    tagBg: 'bg-light-surface-raised dark:bg-dark-surface-raised text-light-ink-muted dark:text-dark-ink-muted border-light-border dark:border-dark-border',
    borderHover: 'hover:border-light-border-strong dark:hover:border-dark-border-strong',
    glow: 'hover:shadow-sm',
  },
  {
    eraColor: 'text-light-ink dark:text-dark-ink',
    tagBg: 'bg-light-surface-raised dark:bg-dark-surface-raised text-light-ink-muted dark:text-dark-ink-muted border-light-border dark:border-dark-border',
    borderHover: 'hover:border-light-border-strong dark:hover:border-dark-border-strong',
    glow: 'hover:shadow-sm',
  },
  {
    eraColor: 'text-light-ink dark:text-dark-ink',
    tagBg: 'bg-light-surface-raised dark:bg-dark-surface-raised text-light-ink-muted dark:text-dark-ink-muted border-light-border dark:border-dark-border',
    borderHover: 'hover:border-light-border-strong dark:hover:border-dark-border-strong',
    glow: 'hover:shadow-sm',
  },
  {
    eraColor: 'text-light-ink dark:text-dark-ink',
    tagBg: 'bg-light-surface-raised dark:bg-dark-surface-raised text-light-ink-muted dark:text-dark-ink-muted border-light-border dark:border-dark-border',
    borderHover: 'hover:border-light-border-strong dark:hover:border-dark-border-strong',
    glow: 'hover:shadow-sm',
  },
];

const PILLAR_CONFIGS = [
  {
    icon: Compass,
    num: 'PILLAR 01',
    kanjiColor: 'text-light-ink dark:text-dark-ink',
    iconColor: 'text-light-ink-muted dark:text-dark-ink-muted',
    dotColor: 'bg-light-ink-subtle dark:bg-[#76736A]',
    hoverBorder: 'hover:border-light-border-strong dark:hover:border-[#4E525D]',
    watermark: (
      <svg
        className="w-28 h-28 absolute right-1 bottom-1 text-ochre/15 dark:text-ochre/10 pointer-events-none"
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
    kanjiColor: 'text-light-ink dark:text-dark-ink',
    iconColor: 'text-light-ink-muted dark:text-dark-ink-muted',
    dotColor: 'bg-light-ink-subtle dark:bg-[#76736A]',
    hoverBorder: 'hover:border-light-border-strong dark:hover:border-[#4E525D]',
    watermark: (
      <div className="absolute right-1 bottom-1 w-28 h-32 opacity-20 dark:opacity-10 pointer-events-none">
        <img
          src="./images/sumie-pine-tree-left.jpg"
          alt="Pine motif"
          width={112}
          height={128}
          className="w-full h-full object-contain object-bottom-right mix-blend-multiply dark:mix-blend-luminosity dark:opacity-15 dark:filter dark:brightness-75"
          loading="lazy"
          decoding="async"
        />
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    num: 'PILLAR 03',
    kanjiColor: 'text-light-ink dark:text-dark-ink',
    iconColor: 'text-light-ink-muted dark:text-dark-ink-muted',
    dotColor: 'bg-light-ink-subtle dark:bg-[#76736A]',
    hoverBorder: 'hover:border-light-border-strong dark:hover:border-[#4E525D]',
    watermark: (
      <div className="absolute right-1 bottom-1 w-24 h-36 opacity-25 dark:opacity-15 pointer-events-none">
        <BambooArt className="w-full h-full" sway={false} opacity={0.8} />
      </div>
    ),
  },
];

export const PhilosophyBento: React.FC = () => {
  const { pillars: rawPillars, profile } = useSiteData();
  const displayPillars = Array.isArray(rawPillars) ? rawPillars : [];
  const originStory = profile?.origin_story;
  const rawMilestones =
    originStory?.milestones && Array.isArray(originStory.milestones)
      ? originStory.milestones
      : [];
  const milestones = rawMilestones.filter(
    (m) => Boolean(m.title?.trim() || m.description?.trim() || m.subtitle?.trim())
  );
  const hasOriginStory = Boolean(
    originStory && (originStory.headline?.trim() || originStory.leadParagraph?.trim() || milestones.length > 0)
  );

  if (displayPillars.length === 0 && !hasOriginStory) {
    return null;
  }

  return (
    <section id="philosophy" className="relative w-full pt-12 sm:pt-16 pb-28 lg:pb-36 scroll-mt-12 overflow-hidden bg-light-canvas dark:bg-dark-canvas">
      {/* Architectural Background Chamber for Philosophy */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-canvas via-light-surface/35 to-light-canvas dark:from-dark-canvas dark:via-dark-surface-card/40 dark:to-dark-canvas pointer-events-none z-0" />
      {/* Zen Ambient Mist Radial Wash */}
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-ochre/[0.03] dark:from-ochre/[0.02] to-transparent pointer-events-none z-0" />

      {/* 16:9 Washi Paper Ground & Asymmetric Sumi-e Mountain Horizon (Anchored Left for alternating rhythm) */}
      <SectionSideBackdrop
        textureDay="./background/white paper texture.jpg"
        textureNight="./background/black paper.jpg"
        painting="./decorators/mountain.jpg"
        paintingAlt="Sumi-e misty mountain ink wash painting"
        placement="left"
        artworkWidth="w-full lg:w-[48%]"
        maskCenter="at 28% 50%"
        textureOpacityDay={0.65}
        textureOpacityNight={0.45}
        paintingOpacityDay={0.35}
        paintingOpacityNight={0.14}
      />

      {/* Ambient Standing Akari Tripod Paper Lamp on Right (Asymmetry Balance against Left Mountain) */}
      <AkariLanternDecorator
        variant="standing-tripod"
        className="top-10 right-6 lg:right-10 xl:right-16"
        sizeClassName="md:w-36 lg:w-44 xl:w-48"
        glowSizeClassName="md:w-80 lg:w-96 md:h-80 lg:h-96"
      />

      {/* Section Divider on Top of Section */}
      <div className="relative z-10 w-full mb-10 sm:mb-14">
        <SectionDivider label="ORIGIN & PHILOSOPHY · 原点と哲学" shortLabel="PHILOSOPHY · 哲学" />
      </div>

      {/* Main Philosophy Bento Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header with Standardized Component */}
        <SectionHeading
          numeral="04 //"
          categoryTag="ORIGIN & PHILOSOPHY · 原点と哲学"
          title="Origin & Philosophy"
          kanjiSubtitle="原点と哲学"
          description="Principles guiding how I design and build software: prioritizing clarity, thoughtful architecture, and resilient systems built with purpose and care."
        />

        {/* 04.1 Origin Trajectory Bento Box */}
        {hasOriginStory && (
          <Card
            className="group mb-10 sm:mb-12 p-5 sm:p-8 shadow-sm relative overflow-visible transition-colors duration-300"
          >
            {/* Celestial Ensō Orbital Circle with Brushstroke (Appears strictly on card hover) */}
            <EnsoOrbital
              placement="top-left"
              size={112}
              hoverOnly={true}
            />

            <CornerBrackets size="md" />

            {/* Card Top Sub-Header */}
            {originStory?.badge && (
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-light-border/60 dark:border-dark-border/60 relative z-10">
                <span className="font-mono text-xs font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                  {originStory.badge}
                </span>
              </div>
            )}

            {/* Headline & Lead Narrative */}
            {(originStory?.headline || originStory?.leadParagraph) && (
              <div className="max-w-3xl mb-6 relative z-10">
                {originStory?.headline && (
                  <h3 className="font-serif text-xl sm:text-2xl text-light-ink dark:text-dark-ink font-medium tracking-tight">
                    {originStory.headline}
                  </h3>
                )}
                {originStory?.leadParagraph && (
                  <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted mt-2 leading-relaxed font-normal max-w-xl">
                    {originStory.leadParagraph}
                  </p>
                )}
              </div>
            )}

            {/* Trajectory Milestones Architectural Grid - Un-nested Columns */}
            {milestones.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
                {milestones.map((m, idx) => {
                  const tTheme = TRAJECTORY_THEMES[idx % TRAJECTORY_THEMES.length];
                  return (
                    <div
                      key={idx}
                      className="group p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 relative border-t-2 border-light-border-strong/40 dark:border-dark-border hover:border-light-ink-muted dark:hover:border-dark-border-strong pt-3.5"
                    >
                      <div>
                        {(m.era || m.tag) && (
                          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-light-border/40 dark:border-dark-border/40 relative z-10">
                            {m.era && (
                              <span className={`font-mono text-xs font-bold ${tTheme.eraColor} tracking-wider uppercase`}>
                                {m.era}
                              </span>
                            )}
                            {m.tag && (
                              <span className={`font-mono text-xs px-1.5 py-0.5 rounded-[2px] border ${tTheme.tagBg} tracking-wider uppercase`}>
                                {m.tag}
                              </span>
                            )}
                          </div>
                        )}
                        {m.title && (
                          <h4 className="font-serif text-sm sm:text-base font-medium text-light-ink dark:text-dark-ink transition-colors relative z-10">
                            {m.title}
                          </h4>
                        )}
                        {m.subtitle && (
                          <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mt-1 font-normal relative z-10">
                            {m.subtitle}
                          </p>
                        )}
                        {m.description && (
                          <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-normal mt-2.5 relative z-10">
                            {m.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {/* 04.2 Core Architectural Pillars Subsection Divider */}
        {displayPillars.length > 0 && (
          <div className="mb-6 pt-2 pb-3 flex items-center justify-between border-b border-light-border/60 dark:border-dark-border/60">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium">04.2 //</span>
              <span className="font-serif text-sm sm:text-base font-medium text-light-ink dark:text-dark-ink">
                Three Architectural Pillars · 三つの信条
              </span>
            </div>
            <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted tracking-wider uppercase hidden sm:inline">
              Principles &amp; System Craft
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
              <Card
                key={pillar.position || idx}
                variant="interactive"
                className="p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-visible group transition-all duration-300 min-h-[300px]"
              >
                {/* Celestial Ensō Orbital Circle with Brushstroke (Appears strictly on card hover) */}
                <EnsoOrbital
                  placement="top-left"
                  size={100}
                  hoverOnly={true}
                />

                {/* Corner Hairline Brackets (Subtle) */}
                <CornerBrackets size="md" />

                {/* Thematic Decorative Watermark Motif */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[3px]">
                  {config.watermark}
                </div>

                {/* Main Card Content */}
                <div className="relative z-10 flex flex-col">
                  {/* Card Header: Pillar Numeral & Subtle Icon */}
                  <div className="flex items-center justify-between pb-3 sm:pb-3.5 border-b border-light-border/60 dark:border-dark-border/60">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta/75 dark:bg-ochre/75" />
                      <span className="font-mono text-xs font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-widest">
                        {num}
                      </span>
                    </div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-light-surface dark:bg-dark-surface-raised border border-light-border dark:border-dark-border flex items-center justify-center shadow-2xs group-hover:border-terracotta/40 dark:group-hover:border-ochre/40 transition-colors">
                      <Icon className={`w-3.5 h-3.5 ${config.iconColor} group-hover:text-terracotta dark:group-hover:text-ochre transition-colors`} />
                    </div>
                  </div>

                  {/* Headline & Principle: Prominent Romaji + Kanji pairing */}
                  <div className="mt-4 sm:mt-5">
                    <div className="flex items-baseline gap-2 sm:gap-2.5 flex-wrap">
                      <h3 className="font-serif text-2xl sm:text-3xl text-light-ink dark:text-dark-ink font-normal tracking-tight group-hover:text-terracotta dark:group-hover:text-ochre transition-colors">
                        {pillar.romaji}
                      </h3>
                      <span className="font-serif text-xl sm:text-2xl text-terracotta dark:text-ochre font-normal select-none">
                        {pillar.kanji}
                      </span>
                      {pillar.title && (
                        <span className="font-sans text-sm sm:text-base font-normal text-light-ink-muted dark:text-dark-ink-muted">
                          · {pillar.title}
                        </span>
                      )}
                    </div>

                    {/* The Focal Hero: Clear, readable, beautifully spaced description */}
                    <p className="font-sans text-sm sm:text-base text-light-ink/85 dark:text-dark-ink/85 mt-3 sm:mt-4 leading-relaxed sm:leading-[1.7] font-normal break-words">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Tag */}
                {pillar.tag && (
                  <div className="relative z-10 pt-4 sm:pt-5 mt-6 border-t border-light-border/40 dark:border-dark-border/40 flex items-center gap-2 text-light-ink-muted dark:text-dark-ink-muted">
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                    <span className="font-mono text-xs uppercase tracking-wider font-medium truncate">
                      {pillar.tag}
                    </span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};
