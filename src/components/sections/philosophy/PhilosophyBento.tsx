import React from 'react';
import { Compass, Feather, ShieldCheck } from 'lucide-react';
import { BambooArt } from '../../common/BambooArt';
import { CornerBrackets } from '../../common/CornerBrackets';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { useSiteData } from '../../../context/SiteDataContext';
import { SectionSideBackdrop } from '../../common/SectionSideBackdrop';
import { SectionDivider } from '../../common/SectionDivider';

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
    <section id="philosophy" className="relative w-full pt-8 sm:pt-12 pb-24 lg:pb-32 scroll-mt-12 overflow-hidden">
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

      {/* Section Divider on Top of Section */}
      <div className="relative z-10 w-full mb-10 sm:mb-14">
        <SectionDivider label="ORIGIN & PHILOSOPHY · 原点と哲学" shortLabel="PHILOSOPHY · 哲学" />
      </div>

      {/* Main Philosophy Bento Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="relative mb-12 sm:mb-16 pb-6 border-b border-light-border/70 dark:border-dark-border/80">
          <div className="max-w-3xl relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-serif text-terracotta dark:text-ochre text-sm">04 //</span>
              <span className="font-mono text-xs font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                ORIGIN &amp; PHILOSOPHY · 原点と哲学
              </span>
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-[2px] bg-terracotta/10 dark:bg-ochre/10 text-terracotta dark:text-ochre text-[9px] font-serif border border-terracotta/30 dark:border-ochre/30 select-none ml-1"
                title="Hanko Seal: 哲 (Philosophy)"
              >
                哲
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink font-normal tracking-tight">
              Origin &amp; Philosophy{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
                原点と哲学
              </span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 font-normal leading-relaxed max-w-xl">
              Rooted in the Japanese aesthetics of <span className="font-medium text-light-ink dark:text-dark-ink">Akari</span> (illumination) and <span className="font-medium text-light-ink dark:text-dark-ink">Wabi-Sabi</span> (organic simplicity and evolutionary resilience). Software is not merely mechanical logic; it is a spatial architecture shaped by deliberate negative space (<em>Ma</em> 間), system balance, and human empathy.
            </p>
          </div>
        </div>

        {/* 04.1 Origin Trajectory Bento Box */}
        {hasOriginStory && (
          <div
            className="group mb-10 sm:mb-12 bg-light-surface-card dark:bg-dark-surface-card craft-card border border-light-border dark:border-dark-border rounded-[3px] p-5 sm:p-8 shadow-sm relative overflow-visible classical-card-frame hover:border-light-border-strong dark:hover:border-dark-border-strong transition-colors duration-300"
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
                              <span className={`font-mono text-[11px] font-bold ${tTheme.eraColor} tracking-wider uppercase`}>
                                {m.era}
                              </span>
                            )}
                            {m.tag && (
                              <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded-[2px] border ${tTheme.tagBg} tracking-wider uppercase`}>
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
          </div>
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
              <div
                key={pillar.position || idx}
                className="interactive-card bg-light-surface-card dark:bg-dark-surface-card craft-card border border-light-border dark:border-dark-border rounded-[3px] p-5 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-visible group hover:bg-light-surface dark:hover:bg-dark-surface hover:border-light-border-strong dark:hover:border-dark-border-strong transition-all duration-300 classical-card-frame min-h-[280px]"
              >
                {/* Celestial Ensō Orbital Circle with Brushstroke (Appears strictly on card hover) */}
                <EnsoOrbital
                  placement="top-left"
                  size={100}
                  hoverOnly={true}
                />

                {/* Corner Hairline Brackets (Subtle) */}
                <CornerBrackets size="md" />

                {/* Top Accent Kanji & Icon */}
                <div className="flex flex-col gap-3 sm:gap-4 relative z-10">
                  <div className="flex items-center justify-between border-b border-light-border/60 dark:border-dark-border/60 pb-3 sm:pb-4">
                    <span className="pillar-kanji font-serif text-4xl sm:text-6xl text-light-ink dark:text-dark-ink font-light leading-none inline-block pl-1 sm:pl-2 select-none transition-colors">
                      {pillar.kanji}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                        {num}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-light-surface dark:bg-dark-surface-raised border border-light-border dark:border-dark-border flex items-center justify-center">
                        <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg sm:text-2xl text-light-ink dark:text-dark-ink font-normal tracking-tight group-hover:text-terracotta dark:group-hover:text-ochre transition-colors break-words">
                      {pillar.romaji}
                      {pillar.title && (
                        <span className="font-sans text-xs sm:text-sm font-light text-light-ink-muted dark:text-dark-ink-muted ml-2 block sm:inline">
                          · {pillar.title}
                        </span>
                      )}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted mt-2 sm:mt-3 leading-relaxed font-normal break-words">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Tag */}
                {pillar.tag && (
                  <div className="relative z-10 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-light-border/40 dark:border-dark-border/40 flex items-center gap-2 text-light-ink-muted dark:text-dark-ink-muted">
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                    <span className="font-mono text-xs uppercase tracking-wider font-medium truncate">
                      {pillar.tag}
                    </span>
                  </div>
                )}

                {/* Thematic Watermark Motif behind card content */}
                <div className="absolute inset-0 pointer-events-none rounded-[3px]">
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
