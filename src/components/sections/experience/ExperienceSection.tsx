import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  ArrowRight,
  MapPin,
  Calendar,
  Layers,
  ListChecks,
} from 'lucide-react';
import { CornerBrackets } from '../../common/CornerBrackets';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { VerticalMarginWidget } from '../../common/VerticalMarginWidget';
import { useSiteData } from '../../../context/SiteDataContext';
import { TechTag } from '../../common/TechTag';
import { Badge } from '../../ui/badge';
import { MarginBambooFlanks } from '../../common/MarginBambooFlanks';
import { SectionHeading } from '../../common/SectionHeading';
import { StatusBadge } from '../../common/StatusBadge';
import { handleImageError } from '../../../lib/constants';

interface ExperienceSectionProps {
  onNavigate?: (view: 'home' | 'projects' | 'resume', sectionId?: string) => void;
}

interface MilestoneTheme {
  primary: string;
  textClass: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  emblemBorder: string;
  emblemShadow: string;
  cardActiveBorder: string;
  cardActiveRing: string;
  cardActiveGlow: string;
  nodeActiveBg: string;
  nodeActiveBorder: string;
  nodeActiveShadow: string;
  bulletOrdinalClass: string;
  accentBarClass: string;
}

const MILESTONE_THEMES: MilestoneTheme[] = [
  // 0: Active / Systems Architecture & AI (朱) - Cinnabar Terracotta Primary
  {
    primary: '#C83C23',
    textClass: 'text-terracotta dark:text-terracotta',
    badgeBg: 'bg-terracotta/15 dark:bg-terracotta/20',
    badgeBorder: 'border-terracotta/50 dark:border-terracotta/60',
    badgeText: 'text-terracotta dark:text-terracotta',
    emblemBorder: 'border-terracotta/70 dark:border-terracotta/80',
    emblemShadow: 'shadow-[0_0_12px_rgba(200,60,35,0.3)]',
    cardActiveBorder: 'border-terracotta/60 dark:border-terracotta/60',
    cardActiveRing: 'ring-1 ring-terracotta/25',
    cardActiveGlow: 'shadow-[0_12px_40px_-8px_rgba(200,60,35,0.25),0_0_24px_-4px_rgba(212,155,106,0.12)]',
    nodeActiveBg: 'bg-terracotta',
    nodeActiveBorder: 'border-terracotta',
    nodeActiveShadow: 'shadow-[0_0_12px_2px_rgba(200,60,35,0.7)]',
    bulletOrdinalClass: 'text-terracotta dark:text-terracotta bg-terracotta/10 dark:bg-terracotta/20 border-terracotta/30 shadow-[0_0_8px_rgba(200,60,35,0.15)]',
    accentBarClass: 'border-l-2 border-l-terracotta/70 dark:border-l-terracotta/70',
  },
  // 1: Craft & Operations / Joinery (明) - Warm Ochre Amber
  {
    primary: '#D49B6A',
    textClass: 'text-ochre dark:text-ochre',
    badgeBg: 'bg-ochre/15 dark:bg-ochre/20',
    badgeBorder: 'border-ochre/50 dark:border-ochre/60',
    badgeText: 'text-ochre dark:text-ochre',
    emblemBorder: 'border-ochre/70 dark:border-ochre/80',
    emblemShadow: 'shadow-[0_0_12px_rgba(212,155,106,0.3)]',
    cardActiveBorder: 'border-ochre/60 dark:border-ochre/60',
    cardActiveRing: 'ring-1 ring-ochre/25',
    cardActiveGlow: 'shadow-[0_12px_40px_-8px_rgba(212,155,106,0.25),0_0_24px_-4px_rgba(200,60,35,0.1)]',
    nodeActiveBg: 'bg-ochre',
    nodeActiveBorder: 'border-ochre',
    nodeActiveShadow: 'shadow-[0_0_12px_2px_rgba(212,155,106,0.7)]',
    bulletOrdinalClass: 'text-ochre dark:text-ochre bg-ochre/10 dark:bg-ochre/20 border-ochre/30 shadow-[0_0_8px_rgba(212,155,106,0.15)]',
    accentBarClass: 'border-l-2 border-l-ochre/70 dark:border-l-ochre/70',
  },
  // 2: Full-Stack Systems & Discipline (木) - Bamboo Green
  {
    primary: '#526D57',
    textClass: 'text-bamboo dark:text-bamboo',
    badgeBg: 'bg-bamboo/15 dark:bg-bamboo/20',
    badgeBorder: 'border-bamboo/50 dark:border-bamboo/60',
    badgeText: 'text-bamboo dark:text-bamboo',
    emblemBorder: 'border-bamboo/70 dark:border-bamboo/80',
    emblemShadow: 'shadow-[0_0_12px_rgba(82,109,87,0.3)]',
    cardActiveBorder: 'border-bamboo/60 dark:border-bamboo/60',
    cardActiveRing: 'ring-1 ring-bamboo/25',
    cardActiveGlow: 'shadow-[0_12px_40px_-8px_rgba(82,109,87,0.22),0_0_24px_-4px_rgba(212,155,106,0.1)]',
    nodeActiveBg: 'bg-bamboo',
    nodeActiveBorder: 'border-bamboo',
    nodeActiveShadow: 'shadow-[0_0_12px_2px_rgba(82,109,87,0.7)]',
    bulletOrdinalClass: 'text-bamboo dark:text-bamboo bg-bamboo/10 dark:bg-bamboo/20 border-bamboo/30 shadow-[0_0_8px_rgba(82,109,87,0.15)]',
    accentBarClass: 'border-l-2 border-l-bamboo/70 dark:border-l-bamboo/70',
  },
  // 3: Foundation & Roots (原) - Terracotta Heritage
  {
    primary: '#B5482E',
    textClass: 'text-terracotta dark:text-terracotta',
    badgeBg: 'bg-terracotta/15 dark:bg-terracotta/20',
    badgeBorder: 'border-terracotta/50 dark:border-terracotta/60',
    badgeText: 'text-terracotta dark:text-terracotta',
    emblemBorder: 'border-terracotta/70 dark:border-terracotta/80',
    emblemShadow: 'shadow-[0_0_12px_rgba(181,72,46,0.3)]',
    cardActiveBorder: 'border-terracotta/60 dark:border-terracotta/60',
    cardActiveRing: 'ring-1 ring-terracotta/25',
    cardActiveGlow: 'shadow-[0_12px_40px_-8px_rgba(181,72,46,0.25),0_0_24px_-4px_rgba(212,155,106,0.1)]',
    nodeActiveBg: 'bg-terracotta',
    nodeActiveBorder: 'border-terracotta',
    nodeActiveShadow: 'shadow-[0_0_12px_2px_rgba(181,72,46,0.7)]',
    bulletOrdinalClass: 'text-terracotta dark:text-terracotta bg-terracotta/10 dark:bg-terracotta/20 border-terracotta/30 shadow-[0_0_8px_rgba(181,72,46,0.15)]',
    accentBarClass: 'border-l-2 border-l-terracotta/70 dark:border-l-terracotta/70',
  },
];

const getMilestoneTheme = (idx: number): MilestoneTheme => {
  return MILESTONE_THEMES[idx % MILESTONE_THEMES.length];
};

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ onNavigate }) => {
  const { experiences } = useSiteData();
  const list = Array.isArray(experiences) ? experiences : [];

  // Track expanded cards for progressive disclosure
  const [expandedCards, setExpandedCards] = useState<Record<string | number, boolean>>(() => {
    // Top active card starts expanded for immediate impact
    return list.length > 0 ? { [list[0].id || 0]: true } : {};
  });

  // Track active/selected milestone for scroll-spy and interaction
  const [activeCardId, setActiveCardId] = useState<string | number | null>(() => {
    return list.length > 0 ? (list[0].id || 0) : null;
  });

  const cardRefs = useRef<Record<string | number, HTMLElement | null>>({});

  // Scroll spy: auto-light up milestone when user scrolls down
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window) || list.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-milestone-id');
            if (id) {
              setActiveCardId(id);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.15,
      }
    );

    list.forEach((exp, idx) => {
      const key = exp.id || idx;
      const el = cardRefs.current[key];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [list]);

  const toggleExpand = (id: string | number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const allOpen = list.every((exp, idx) => expandedCards[exp.id || idx]);
    if (allOpen) {
      setExpandedCards({});
    } else {
      const next: Record<string | number, boolean> = {};
      list.forEach((exp, idx) => {
        next[exp.id || idx] = true;
      });
      setExpandedCards(next);
    }
  };

  if (list.length === 0) return null;

  const allOpen = list.every((exp, idx) => expandedCards[exp.id || idx]);

  return (
    <section id="experience" className="relative w-full overflow-hidden py-16 lg:py-24">
      {/* Subtle Japanese Sumi-e Arts in Left & Right Empty Margins */}
      <MarginBambooFlanks />

      {/* Floating Vertical Margins on Widescreen */}
      <VerticalMarginWidget
        side="left"
        top="top-1/3"
        type="calligraphy"
        motto="歩みの軌跡"
        submotto="TIMELINE"
        coordinate="TOKYO · SF · WATERLOO"
        stampChar="歴"
        pulseColor="bamboo"
      />
      <VerticalMarginWidget
        side="right"
        top="top-2/3"
        type="minimal"
        stampChar="道"
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header with Classical Wabi-Sabi Numerals & Standardized Layout */}
        <SectionHeading
          numeral="02 //"
          categoryTag="CAREER TRAJECTORY · 職歴"
          title="Work & Milestones"
          kanjiSubtitle="職歴"
          description="A chronology of software engineering roles, full-stack systems development, and real-world impact."
          actions={
            <>
              {/* Global Expand All / Collapse All */}
              <button
                type="button"
                onClick={toggleAll}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:border-terracotta/50 text-light-ink dark:text-dark-ink font-sans text-xs uppercase tracking-widest shadow-xs transition-all duration-200 cursor-pointer"
                title="Expand or collapse all career milestone details"
              >
                <Layers className="w-3.5 h-3.5 text-terracotta" />
                <span>{allOpen ? 'Collapse All' : 'Expand All'}</span>
              </button>

              {/* Resume Link */}
              <a
                href="#resume"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('resume');
                  }
                }}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:border-terracotta/50 text-light-ink dark:text-dark-ink font-sans text-xs uppercase tracking-widest shadow-xs transition-all duration-200"
              >
                <Briefcase className="w-3.5 h-3.5 text-terracotta" />
                <span className="hidden sm:inline">Curriculum Vitae</span>
                <span className="sm:hidden">CV</span>
                <ArrowRight className="w-3.5 h-3.5 text-terracotta transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </>
          }
        />

        {/* Timeline Container */}
        <div className="relative timeline-container">
          {/* Vertical Joinery Axis Line with Subtle Terracotta-to-Neutral Hairline */}
          <div className="absolute left-3.5 sm:left-5 top-8 bottom-10 w-px bg-gradient-to-b from-terracotta via-ochre/40 to-light-border/60 dark:to-dark-border/60 -translate-x-1/2 pointer-events-none z-0" />

          {/* Milestone Cards Stack */}
          <div className="space-y-8 sm:space-y-12">
            {list.map((exp, idx) => {
              const cardKey = exp.id || idx;
              const isCardActive = String(activeCardId) === String(cardKey);
              const isExpanded = !!expandedCards[cardKey];
              const isCurrent = typeof exp.isActive === 'boolean' ? exp.isActive : idx === 0;
              const theme = getMilestoneTheme(idx);

              // Extract bullet points
              const bullets = Array.isArray(exp.bullets) && exp.bullets.length > 0
                ? exp.bullets
                : exp.description
                ? exp.description
                    .split(/(?<=[.!?])\s+/)
                    .map((p) => p.trim())
                    .filter((p) => p.length > 0)
                : [];

              const overviewText = exp.overview || exp.description;

              return (
                <article
                  key={cardKey}
                  ref={(el) => { cardRefs.current[cardKey] = el; }}
                  data-milestone-id={String(cardKey)}
                  onMouseEnter={() => setActiveCardId(cardKey)}
                  onClick={() => setActiveCardId(cardKey)}
                  className={`milestone-card relative pl-8 sm:pl-14 group cursor-pointer transition-all duration-300 ${
                    isCardActive ? 'is-active opacity-100' : 'opacity-85 hover:opacity-100'
                  }`}
                  id={`milestone-${idx + 1}`}
                >
                  {/* Rail Anchor Node Button */}
                  <button
                    type="button"
                    aria-label={`Jump to ${exp.company} milestone`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCardId(cardKey);
                    }}
                    className={`timeline-node absolute left-3.5 sm:left-5 top-7 sm:top-8 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 cursor-pointer ${
                      isCardActive
                        ? `${theme.nodeActiveBorder} ${theme.nodeActiveBg} ${theme.nodeActiveShadow} scale-115`
                        : 'border-ochre/70 bg-light-canvas dark:bg-dark-canvas group-hover:border-terracotta group-hover:scale-110'
                    }`}
                  />

                  {/* Milestone Card Frame */}
                  <div
                    className={`relative rounded-xl sm:rounded-2xl border p-4 sm:p-7 overflow-visible transition-all duration-200 classical-card-frame shadow-akari dark:shadow-night-glow ${
                      isCardActive
                        ? `${theme.cardActiveBorder} bg-light-surface-card dark:bg-dark-surface-card ${theme.cardActiveRing} ${theme.cardActiveGlow}`
                        : 'border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface-card hover:border-ochre/50 hover:bg-light-surface dark:hover:bg-dark-surface'
                    }`}
                  >
                    {/* Celestial Ensō Orbital Circle: Placed at the top-left corner of the card frame (only on hover) */}
                    <EnsoOrbital
                      placement="top-left"
                      size={96}
                      hoverOnly={true}
                    />

                    {/* Corner Hairline Brackets */}
                    <CornerBrackets size="sm" />

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                      {/* Left: Clean Square Emblem (Custom Logo Image or Default Japanese Hanko Seal) */}
                      <div className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border ${theme.emblemBorder} bg-light-surface dark:bg-dark-surface-card ${theme.emblemShadow} flex items-center justify-center overflow-hidden shrink-0 mx-auto sm:mx-0 transition-shadow duration-300`}>
                        {exp.logoUrl ? (
                          <img
                            src={exp.logoUrl}
                            alt={`${exp.company} emblem`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-1 select-none bg-light-surface/40 dark:bg-dark-surface-card/40">
                            <span className={`font-serif font-black ${theme.textClass} text-2xl sm:text-3xl leading-none tracking-normal`}>
                              {exp.kanji || (idx === 0 ? '木' : idx === 1 ? '墨' : idx === 2 ? '明' : '原')}
                            </span>
                            <span className={`text-[10px] font-mono tracking-wider ${theme.textClass} uppercase font-bold leading-none mt-1 opacity-90`}>
                              {exp.kanjiSubtitle || (idx === 0 ? 'AI' : idx === 1 ? 'SUMI' : idx === 2 ? 'CRAFT' : 'SYS')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right: Role Header & Progressive Disclosure Body */}
                      <div className="flex-1 min-w-0 w-full pr-0 sm:pr-8">
                        {/* Metadata Strip: Dates + High-Contrast Active/Completed Pill */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                          {/* Order index */}
                          <Badge variant="terracotta" className="font-mono text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                            #{String(idx + 1).padStart(2, '0')}
                          </Badge>

                          {/* Date Range with Domain Color */}
                          <span className={`font-mono text-xs ${theme.textClass} font-semibold tracking-wider uppercase flex items-center gap-1.5`}>
                            <Calendar className={`w-3.5 h-3.5 ${theme.textClass}`} />
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </span>

                          {/* High-Contrast Themed Status Badge */}
                          <StatusBadge
                            isActive={isCurrent}
                            activeLabel="ACTIVE / 現職"
                            completedLabel="歴任 / COMPLETED"
                            activeBgClass={theme.badgeBg}
                            activeBorderClass={theme.badgeBorder}
                            activeTextClass={theme.badgeText}
                            activeDotBgClass={theme.nodeActiveBg}
                          />

                          {/* Optional Domain Category Tag */}
                          {exp.domainLabel && (
                            <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText} border uppercase tracking-wider hidden sm:inline-block`}>
                              {exp.domainLabel}
                            </span>
                          )}
                        </div>

                        {/* Title & Company */}
                        <h3 className="font-serif text-lg sm:text-2xl font-medium text-light-ink dark:text-dark-ink group-hover:text-terracotta transition-colors leading-snug">
                          {exp.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium mt-1">
                          <span className={`${theme.textClass}`}>{exp.company}</span>
                          {exp.location && (
                            <>
                              <span className="text-light-ink-subtle">·</span>
                              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-light-ink-muted dark:text-dark-ink-muted font-sans">
                                <MapPin className="w-3 h-3 text-light-ink-subtle" />
                                {exp.location}
                              </span>
                            </>
                          )}
                        </div>

                        {/* High-Level Narrative Overview (Always visible) */}
                        {overviewText && (
                          <p className="font-sans text-xs sm:text-sm text-light-ink dark:text-dark-ink leading-relaxed font-normal mt-3">
                            {overviewText}
                          </p>
                        )}

                        {/* Inspect / Collapse Button */}
                        {bullets.length > 0 && (
                          <div className="pt-3.5">
                            <button
                              type="button"
                              onClick={(e) => toggleExpand(cardKey, e)}
                              className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg font-mono text-xs transition-all duration-200 border cursor-pointer ${
                                isExpanded
                                  ? `${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} font-medium`
                                  : 'bg-light-surface dark:bg-dark-surface-card text-light-ink-muted dark:text-dark-ink-muted border-light-border dark:border-dark-border hover:border-terracotta/60 hover:text-terracotta'
                              }`}
                            >
                              <Layers className={`w-3.5 h-3.5 ${theme.textClass}`} />
                              <span>
                                {isExpanded
                                  ? 'Collapse Details ↑'
                                  : `Inspect Impact & Stack (${bullets.length} Points) ↓`}
                              </span>
                            </button>
                          </div>
                        )}

                        {/* Expanded Progressive Disclosure Drawer */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-light-border/60 dark:border-dark-border/60 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* Engineering Impact Bullets */}
                            {bullets.length > 0 && (
                              <div>
                                <div className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-widest ${theme.textClass} font-semibold mb-2.5 flex items-center gap-1.5`}>
                                  <ListChecks className={`w-3.5 h-3.5 ${theme.textClass}`} />
                                  Engineering Contributions &amp; Quantified Impact
                                </div>
                                <ul className="space-y-2.5">
                                  {bullets.map((pt, pIdx) => (
                                    <li
                                      key={pIdx}
                                      className={`p-3 sm:p-3.5 rounded-lg border border-light-border/80 dark:border-dark-border/80 bg-light-surface-raised/60 dark:bg-dark-surface-card/60 ${theme.accentBarClass} hover:border-terracotta/40 hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised transition-all duration-200 flex items-start gap-3 shadow-2xs group/bullet`}
                                    >
                                      <span className={`font-mono text-[10px] sm:text-[11px] font-semibold ${theme.bulletOrdinalClass} rounded px-1.5 py-0.5 shrink-0 select-none mt-0.5`}>
                                        #{String(pIdx + 1).padStart(2, '0')}
                                      </span>
                                      <span className="font-sans text-xs sm:text-sm text-light-ink dark:text-dark-ink leading-relaxed font-normal">
                                        {pt}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Tech Stack & Substrates */}
                            {exp.tags && exp.tags.length > 0 && (
                              <div className="pt-1">
                                <div className="text-[10px] font-mono uppercase tracking-widest text-light-ink-muted dark:text-dark-ink-muted font-semibold mb-2">
                                  Substrates &amp; Core Tech Stack
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {exp.tags.map((tag) => (
                                    <TechTag key={tag} tag={tag} size="sm" />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
