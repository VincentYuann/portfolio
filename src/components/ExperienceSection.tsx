import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  ArrowRight,
  MapPin,
  Calendar,
  Layers,
  ListChecks,
} from 'lucide-react';
import { CornerBrackets } from './CornerBrackets';
import { EnsoOrbital } from './EnsoOrbital';
import { VerticalMarginWidget } from './VerticalMarginWidget';
import { useSiteData } from '../context/SiteDataContext';
import { TechTag } from './TechTag';
import { Badge } from './ui/badge';

interface ExperienceSectionProps {
  onNavigate?: (view: 'home' | 'projects' | 'resume', sectionId?: string) => void;
}

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
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        {/* Left Margin Flank Bamboo */}
        <div className="absolute -left-6 xl:left-2 bottom-12 top-24 w-32 xl:w-48 pointer-events-none z-0 hidden lg:block">
          <img
            src="./images/sumie-tall-vertical-bamboo.jpg"
            alt="Sumi-e bamboo margin accent"
            className="w-full h-full object-contain object-bottom opacity-30 dark:opacity-15 mix-blend-multiply dark:mix-blend-screen dark:invert animate-bamboo-sway"
            style={{
              maskImage: 'radial-gradient(ellipse 85% 85% at 30% 60%, black 35%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 30% 60%, black 35%, transparent 85%)',
            }}
          />
        </div>

        {/* Right Margin Flank Bamboo */}
        <div className="absolute -right-6 xl:right-2 bottom-12 top-24 w-32 xl:w-48 pointer-events-none z-0 hidden lg:block">
          <img
            src="./images/sumie-tall-vertical-bamboo.jpg"
            alt="Sumi-e bamboo margin accent"
            className="w-full h-full object-contain object-bottom opacity-30 dark:opacity-15 mix-blend-multiply dark:mix-blend-screen dark:invert scale-x-[-1]"
            style={{
              maskImage: 'radial-gradient(ellipse 85% 85% at 70% 60%, black 35%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 70% 60%, black 35%, transparent 85%)',
            }}
          />
        </div>

        {/* Top and Bottom Fades */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-light-canvas via-light-canvas/70 to-transparent dark:from-dark-canvas dark:via-dark-canvas/70 z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-light-canvas via-light-canvas/70 to-transparent dark:from-dark-canvas dark:via-dark-canvas/70 z-10 pointer-events-none" />
      </div>

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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-light-border/70 dark:border-[#2D3039]/80 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-serif text-terracotta text-sm">02 //</span>
              <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                CAREER TRAJECTORY
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal">
              Work &amp; Milestones{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
                職歴
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Global Expand All / Collapse All */}
            <button
              type="button"
              onClick={toggleAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-light-surface-card dark:bg-[#181920] border border-light-border dark:border-[#2D3039] hover:border-terracotta/50 text-light-ink dark:text-[#EDEAE4] font-sans text-xs uppercase tracking-widest shadow-xs transition-all duration-200 cursor-pointer"
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
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-light-surface-card dark:bg-[#181920] border border-light-border dark:border-[#2D3039] hover:border-terracotta/50 text-light-ink dark:text-[#EDEAE4] font-sans text-xs uppercase tracking-widest shadow-xs transition-all duration-200"
            >
              <Briefcase className="w-3.5 h-3.5 text-terracotta" />
              <span className="hidden sm:inline">Curriculum Vitae</span>
              <span className="sm:hidden">CV</span>
              <ArrowRight className="w-3.5 h-3.5 text-terracotta transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative timeline-container">
          {/* Vertical Joinery Axis Line */}
          <div className="absolute left-3.5 sm:left-5 top-8 bottom-10 w-[2px] bg-gradient-to-b from-terracotta/70 via-ochre/40 to-ochre/20 -translate-x-1/2 pointer-events-none z-0" />

          {/* Milestone Cards Stack */}
          <div className="space-y-8 sm:space-y-12">
            {list.map((exp, idx) => {
              const cardKey = exp.id || idx;
              const isCardActive = String(activeCardId) === String(cardKey);
              const isExpanded = !!expandedCards[cardKey];
              const isCurrent = typeof exp.isActive === 'boolean' ? exp.isActive : idx === 0;

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
                        ? 'border-terracotta bg-terracotta shadow-[0_0_12px_2px_rgba(200,60,35,0.6)] scale-110'
                        : 'border-ochre/70 bg-light-canvas dark:bg-dark-canvas group-hover:border-terracotta group-hover:scale-110'
                    }`}
                  />

                  {/* Milestone Card Frame (overflow-visible to let Ensō ring bleed smoothly) */}
                  <div
                    className={`relative rounded-xl sm:rounded-2xl border p-4 sm:p-7 overflow-visible transition-all duration-200 classical-card-frame shadow-akari dark:shadow-night-glow ${
                      isCardActive
                        ? 'border-terracotta/50 bg-light-surface-card dark:bg-[#181920] ring-1 ring-terracotta/20 shadow-[0_12px_40px_-8px_rgba(200,60,35,0.2),0_0_24px_-4px_rgba(212,155,106,0.12)]'
                        : 'border-light-border dark:border-dark-border bg-light-surface-card dark:bg-[#181920] hover:border-ochre/50 hover:bg-light-surface dark:hover:bg-[#1f2028]'
                    }`}
                  >
                    {/* Celestial Ensō Orbital Circle: Placed at the top-left corner of the card frame */}
                    <EnsoOrbital
                      placement="top-left"
                      size={96}
                      hoverOnly={!isCardActive}
                      className={
                        isCardActive
                          ? '!opacity-100 !scale-100 transition-all duration-500'
                          : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500'
                      }
                    />

                    {/* Corner Hairline Brackets */}
                    <CornerBrackets size="sm" />

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                      {/* Left: Clean Square Emblem (Custom Logo Image or Default Japanese Hanko Seal) */}
                      <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-terracotta/70 dark:border-terracotta/80 bg-light-surface dark:bg-[#16171d] shadow-[0_0_8px_rgba(200,60,35,0.25)] flex items-center justify-center overflow-hidden shrink-0 mx-auto sm:mx-0">
                        {exp.logoUrl ? (
                          <img
                            src={exp.logoUrl}
                            alt={`${exp.company} emblem`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-1 select-none bg-light-surface/40 dark:bg-[#181920]/40">
                            <span className="font-serif font-black text-terracotta text-2xl sm:text-3xl leading-none tracking-normal">
                              {exp.kanji || (idx === 0 ? '木' : idx === 1 ? '墨' : idx === 2 ? '明' : '原')}
                            </span>
                            <span className="text-[10px] font-mono tracking-wider text-ochre uppercase font-bold leading-none mt-1">
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

                          {/* Date Range */}
                          <span className="font-mono text-xs text-terracotta font-semibold tracking-wider uppercase flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-terracotta" />
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </span>

                          {/* High-Contrast Themed Status Badge (Active vs Completed) */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors ${
                              isCurrent
                                ? 'bg-terracotta/15 border border-terracotta/50 text-terracotta dark:text-[#ff7d63] dark:shadow-[0_0_10px_rgba(200,60,35,0.25)]'
                                : 'bg-stone-100 border border-stone-300 text-stone-600 dark:bg-[#20222a] dark:border-[#383b47] dark:text-stone-400'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isCurrent
                                  ? 'bg-terracotta shadow-[0_0_6px_rgba(200,60,35,0.8)] animate-pulse'
                                  : 'bg-stone-400 dark:bg-neutral-500'
                              }`}
                            />
                            <span>{isCurrent ? 'ACTIVE / 現職' : '歴任 / COMPLETED'}</span>
                          </span>
                        </div>

                        {/* Title & Company */}
                        <h3 className="font-serif text-lg sm:text-2xl font-medium text-light-ink dark:text-dark-ink group-hover:text-terracotta transition-colors leading-snug">
                          {exp.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs sm:text-sm text-terracotta font-medium mt-1">
                          <span>{exp.company}</span>
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
                                  ? 'bg-terracotta/10 text-terracotta border-terracotta/40 font-medium'
                                  : 'bg-light-surface dark:bg-[#181920] text-light-ink-muted dark:text-neutral-300 border-light-border dark:border-[#282a36] hover:border-terracotta/60 hover:text-terracotta'
                              }`}
                            >
                              <Layers className="w-3.5 h-3.5 text-terracotta" />
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
                                <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-ochre font-semibold mb-2.5 flex items-center gap-1.5">
                                  <ListChecks className="w-3.5 h-3.5 text-terracotta" />
                                  Engineering Contributions &amp; Quantified Impact
                                </div>
                                <ul className="space-y-2.5">
                                  {bullets.map((pt, pIdx) => (
                                    <li
                                      key={pIdx}
                                      className="p-3 sm:p-3.5 rounded-lg border border-light-border/80 dark:border-dark-border/80 bg-light-surface-raised/60 dark:bg-dark-surface-card/60 hover:border-terracotta/40 hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised transition-all duration-200 flex items-start gap-3 shadow-2xs group/bullet"
                                    >
                                      <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-terracotta dark:text-[#ff7d63] bg-terracotta/10 dark:bg-terracotta/15 border border-terracotta/30 rounded px-1.5 py-0.5 shrink-0 select-none shadow-[0_0_8px_rgba(200,60,35,0.15)] mt-0.5">
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
