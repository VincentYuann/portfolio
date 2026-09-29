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
import { useSiteData } from '../../../context/SiteDataContext';
import { TechTag } from '../../common/TechTag';
import { Badge } from '../../ui/badge';
import { Card } from '../../ui/card';
import { SectionHeading } from '../../common/SectionHeading';
import { StatusBadge } from '../../common/StatusBadge';
import { handleImageError } from '../../../lib/constants';
import { SectionSideBackdrop } from '../../common/SectionSideBackdrop';
import { SectionDivider } from '../../common/SectionDivider';

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
}

// Quiet architectural milestone theme strictly adhering to editorial discipline
const CANONICAL_MILESTONE_THEME: MilestoneTheme = {
  primary: '#B5482E',
  textClass: 'text-light-ink dark:text-dark-ink',
  badgeBg: 'bg-bamboo/10 dark:bg-bamboo/15',
  badgeBorder: 'border-bamboo/25 dark:border-bamboo/35',
  badgeText: 'text-bamboo-dark dark:text-bamboo-light',
  emblemBorder: 'border-light-border dark:border-dark-border',
  emblemShadow: 'shadow-2xs',
  cardActiveBorder: 'border-light-border-strong dark:border-dark-border-strong',
  cardActiveRing: '',
  cardActiveGlow: 'shadow-sm',
  nodeActiveBg: 'bg-bamboo dark:bg-bamboo-light',
  nodeActiveBorder: 'border-bamboo dark:border-bamboo-light',
  nodeActiveShadow: '',
  bulletOrdinalClass: 'text-light-ink-muted dark:text-dark-ink-muted bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border',
};

const getMilestoneTheme = (_idx: number): MilestoneTheme => {
  return CANONICAL_MILESTONE_THEME;
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

  // Track hovered card so strictly ONE paint brush Ensō animation appears on hover and disappears on unhover
  const [hoveredCardId, setHoveredCardId] = useState<string | number | null>(null);

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
    <section id="experience" className="relative w-full pt-12 sm:pt-16 pb-28 lg:pb-36 scroll-mt-12 overflow-hidden bg-light-canvas dark:bg-dark-canvas">
      {/* Architectural Background Chamber for Experience */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-canvas via-light-surface/40 to-light-canvas dark:from-dark-canvas dark:via-dark-surface/40 dark:to-dark-canvas pointer-events-none z-0" />
      {/* Subtle Japanese Joinery Axis Ambient Glow */}
      <div className="absolute left-0 sm:left-24 top-1/4 w-96 h-96 bg-radial-[at_center] from-ochre/[0.04] dark:from-ochre/[0.025] to-transparent pointer-events-none z-0" />
      
      {/* 16:9 Linen Texture Ground & Asymmetric Sumi-e Bamboo Art (Anchored Left for alternating rhythm) */}
      <SectionSideBackdrop
        textureDay="./background/white linen.webp"
        textureNight="./background/black linen.webp"
        painting="./decorators/bamboo.webp"
        paintingAlt="Sumi-e bamboo ink wash painting"
        placement="left"
        artworkWidth="w-full lg:w-[48%]"
        maskCenter="at 25% 45%"
        textureOpacityDay={0.65}
        textureOpacityNight={0.45}
        paintingOpacityDay={0.35}
        paintingOpacityNight={0.14}
      />

      {/* Section Divider on Top of Section */}
      <div className="relative z-10 w-full mb-10 sm:mb-14">
        <SectionDivider label="CAREER TRAJECTORY · 職歴" shortLabel="CAREER · 職歴" />
      </div>

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
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:border-light-border-strong dark:hover:border-dark-border-strong text-light-ink dark:text-dark-ink font-sans text-xs uppercase tracking-widest shadow-2xs transition-all duration-200 cursor-pointer"
                title="Expand or collapse all career milestone details"
              >
                <Layers className="w-3.5 h-3.5 text-light-ink-muted dark:text-dark-ink-muted" />
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
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-[2px] bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:border-light-border-strong dark:hover:border-dark-border-strong text-light-ink dark:text-dark-ink font-sans text-xs uppercase tracking-widest shadow-2xs transition-all duration-200"
              >
                <Briefcase className="w-3.5 h-3.5 text-light-ink-muted dark:text-dark-ink-muted" />
                <span className="hidden sm:inline">Curriculum Vitae</span>
                <span className="sm:hidden">CV</span>
                <ArrowRight className="w-3.5 h-3.5 text-light-ink-muted dark:text-dark-ink-muted transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </>
          }
        />

        {/* Timeline Container */}
        <div className="relative timeline-container">
          {/* Vertical Joinery Axis Line: Crisp architectural spine rail */}
          <div className="absolute left-3.5 sm:left-5 top-8 bottom-10 w-[2px] bg-gradient-to-b from-[#CDB38B] via-[#CDB38B] to-[#CDB38B]/40 dark:from-[#404450] dark:via-ochre/60 dark:to-[#404450]/40 -translate-x-1/2 pointer-events-none z-0 rounded-full shadow-2xs" />

          {/* Milestone Cards Stack */}
          <div className="flex flex-col gap-10 sm:gap-14 lg:gap-16">
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
                  onMouseEnter={() => {
                    setHoveredCardId(cardKey);
                    setActiveCardId(cardKey);
                  }}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => setActiveCardId(cardKey)}
                  className={`milestone-card relative pl-8 sm:pl-14 group cursor-pointer transition-all duration-300 ${
                    isCardActive ? 'is-active opacity-100' : 'opacity-85 hover:opacity-100'
                  }`}
                  id={`milestone-${idx + 1}`}
                >
                  {/* Editorial Timeline Marker: Distinct bordered craft node */}
                  <button
                    type="button"
                    aria-label={`Jump to ${exp.company} milestone`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCardId(cardKey);
                    }}
                    className={`timeline-node absolute left-3.5 sm:left-5 top-7 sm:top-8 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 cursor-pointer shadow-xs ${
                      isCardActive
                        ? 'bg-terracotta border-2 border-[#F7F0E3] dark:border-[#23252C] ring-2 ring-terracotta dark:bg-ochre dark:ring-ochre scale-110'
                        : 'border-2 border-[#CDB38B] dark:border-[#6B7280] bg-[#F7F0E3] dark:bg-[#23252C] hover:border-terracotta dark:hover:border-ochre hover:scale-105'
                    }`}
                  >
                    {!isCardActive && (
                      <span className="block w-1 h-1 rounded-full bg-[#CDB38B] dark:bg-[#6B7280] m-auto" />
                    )}
                  </button>

                  {/* Milestone Card Frame */}
                  <Card
                    className={`group relative p-5 sm:p-8 overflow-visible transition-all duration-200 ${
                      isCardActive
                        ? 'border-light-border-strong dark:border-dark-border-strong shadow-xs'
                        : ''
                    }`}
                  >
                    {/* Celestial Ensō Orbital Circle with Brushstroke (Appears strictly on card hover; disappears when not hovered or hovered elsewhere) */}
                    <EnsoOrbital
                      placement="top-left"
                      size={112}
                      active={hoveredCardId === cardKey}
                    />

                    {/* Corner Hairline Brackets (Subtle) */}
                    <CornerBrackets size="sm" />

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                      {/* Left: Clean Square Emblem (Custom Logo Image or Default Japanese Hanko Seal) */}
                      <div className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-[2px] border ${isCardActive ? theme.emblemBorder : 'border-light-border dark:border-dark-border'} bg-light-surface dark:bg-dark-surface-raised ${theme.emblemShadow} flex items-center justify-center overflow-hidden shrink-0 mx-auto sm:mx-0 transition-shadow duration-300`}>
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
                            {exp.kanji && (
                              <span className={`font-serif font-black ${isCardActive ? theme.textClass : 'text-light-ink dark:text-dark-ink'} text-2xl sm:text-3xl leading-none tracking-normal`}>
                                {exp.kanji}
                              </span>
                            )}
                            {exp.kanjiSubtitle && (
                              <span className={`text-[11px] font-mono tracking-wider ${isCardActive ? theme.textClass : 'text-light-ink-subtle dark:text-dark-ink-subtle'} uppercase font-bold leading-none mt-1 opacity-90`}>
                                {exp.kanjiSubtitle}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Role Header & Progressive Disclosure Body */}
                      <div className="flex-1 min-w-0 w-full pr-0 sm:pr-8">
                        {/* Metadata Strip: Dates + High-Contrast Active/Completed Pill */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                          {/* Order index */}
                          <Badge variant="outline" className="font-mono text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-[2px] border-light-border dark:border-dark-border text-light-ink-muted dark:text-dark-ink-muted">
                            #{String(idx + 1).padStart(2, '0')}
                          </Badge>

                          {/* Date Range with Domain Color */}
                          {(exp.startDate || exp.endDate) && (
                            <span className={`font-mono text-xs ${isCardActive ? theme.textClass : 'text-light-ink-muted dark:text-dark-ink-muted'} font-medium tracking-wider uppercase flex items-center gap-1.5`}>
                              <Calendar className="w-3.5 h-3.5 opacity-70" />
                              {exp.startDate ? `${exp.startDate} - ` : ''}{exp.endDate || (isCurrent ? 'Present' : '')}
                            </span>
                          )}

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
                        </div>

                        {/* Title & Company */}
                        <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2rem] font-normal text-light-ink dark:text-dark-ink group-hover:text-terracotta dark:group-hover:text-ochre transition-colors leading-snug tracking-tight">
                          {exp.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium mt-1.5">
                          <span className={`font-serif text-sm sm:text-base ${isCardActive ? theme.textClass : 'text-light-ink-muted dark:text-dark-ink-muted'} font-normal`}>{exp.company}</span>
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
                          <p className="font-sans text-sm sm:text-base text-light-ink dark:text-dark-ink leading-relaxed font-normal mt-3.5 max-w-2xl">
                            {overviewText}
                          </p>
                        )}

                        {/* Inspect / Collapse Button with 2px corners */}
                        {bullets.length > 0 && (
                          <div className="pt-3.5">
                            <button
                              type="button"
                              onClick={(e) => toggleExpand(cardKey, e)}
                              className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-[2px] font-mono text-xs transition-all duration-200 border cursor-pointer ${
                                isExpanded
                                  ? 'bg-light-surface dark:bg-dark-surface text-light-ink dark:text-dark-ink border-light-border-strong dark:border-dark-border-strong font-medium'
                                  : 'bg-light-surface/60 dark:bg-dark-surface/60 text-light-ink-muted dark:text-dark-ink-muted border-light-border dark:border-dark-border hover:text-light-ink dark:hover:text-dark-ink hover:border-light-border-strong dark:hover:border-dark-border-strong'
                              }`}
                            >
                              <Layers className="w-3.5 h-3.5 text-light-ink-subtle dark:text-dark-ink-subtle" />
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
                          <div className="mt-4 pt-4 border-t border-light-border/60 dark:border-[#3A3D44]/60 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* Engineering Impact Bullets */}
                            {bullets.length > 0 && (
                              <div>
                                <div className="text-xs sm:text-[13px] font-mono tracking-wide text-light-ink dark:text-dark-ink font-semibold mb-2.5 flex items-center gap-1.5">
                                  <ListChecks className="w-3.5 h-3.5 text-light-ink-muted dark:text-dark-ink-muted" />
                                  Engineering Contributions &amp; Quantified Impact
                                </div>
                                <ul className="space-y-2">
                                  {bullets.map((pt, pIdx) => (
                                    <li
                                      key={pIdx}
                                      className="p-3 sm:p-3.5 rounded-[2px] border border-light-border/70 dark:border-dark-border bg-light-surface-raised/60 dark:bg-dark-surface-raised hover:border-light-border-strong dark:hover:border-dark-border-strong transition-all flex items-start gap-3 group"
                                    >
                                      <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-light-ink-muted dark:text-dark-ink-muted bg-light-surface-muted dark:bg-dark-canvas border border-light-border dark:border-dark-border rounded-[2px] px-1.5 py-0.5 shrink-0 select-none mt-0.5">
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
                                <div className="text-2xs font-mono uppercase tracking-widest text-light-ink-muted dark:text-dark-ink-muted font-semibold mb-2">
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
                  </Card>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
