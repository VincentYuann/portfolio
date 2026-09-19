import React from 'react';
import { Briefcase, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { CornerBrackets } from './CornerBrackets';
import { VerticalMarginWidget } from './VerticalMarginWidget';
import { useSiteData } from '../context/SiteDataContext';
import { Badge } from './ui/badge';

interface ExperienceSectionProps {
  onNavigate?: (view: 'home' | 'projects' | 'resume', sectionId?: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ onNavigate }) => {
  const { experiences } = useSiteData();
  const list = Array.isArray(experiences) ? experiences : [];
  const [expandedCards, setExpandedCards] = React.useState<Record<string | number, boolean>>({});

  const toggleExpand = (id: string | number) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (list.length === 0) return null;

  return (
    <section id="experience" className="relative w-full overflow-hidden py-10 sm:py-14 lg:py-20">
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

      {/* Floating Vertical Margins */}
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
        {/* Section Header with Numeral 02 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 pb-4 sm:pb-6 border-b border-light-border/70 dark:border-[#2D3039]/80 gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="font-serif text-terracotta text-xs sm:text-sm">02 //</span>
              <span className="font-sans text-[10px] sm:text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                CAREER TRAJECTORY &amp; MILESTONES
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal">
              Work Experience{' '}
              <span className="text-lg sm:text-2xl font-light text-light-ink-muted dark:text-dark-ink-muted ml-1 sm:ml-2">
                職歴
              </span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted mt-1.5 sm:mt-2 font-light max-w-xl leading-relaxed">
              Engineering contributions across high-throughput distributed microservices, low-latency applied GenAI runtimes, and serene digital user experiences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#resume"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('resume');
                }
              }}
              className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-light-surface-card dark:bg-[#181920] border border-light-border dark:border-[#2D3039] hover:border-terracotta/50 text-light-ink dark:text-[#EDEAE4] font-sans text-xs uppercase tracking-widest shadow-xs transition-all duration-200"
            >
              <Briefcase className="w-3.5 h-3.5 text-terracotta" />
              <span>Full Curriculum Vitae</span>
              <ArrowRight className="w-3.5 h-3.5 text-terracotta transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Experience Timeline Cards Stack */}
        <div className="space-y-4 sm:space-y-6">
          {experiences.map((exp, idx) => {
            const cardKey = exp.id || idx;
            const isExpanded = !!expandedCards[cardKey];

            // Split description by periods or newlines to render clean bullet points if applicable
            const points = exp.description
              ? exp.description
                  .split(/(?<=[.!?])\s+/)
                  .map((p) => p.trim())
                  .filter((p) => p.length > 0)
              : [];

            return (
              <div
                key={cardKey}
                className="group relative bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/40 rounded-xl sm:rounded-2xl p-4 sm:p-7 transition-all duration-300 classical-card-frame shadow-xs"
              >
                <CornerBrackets size="sm" />

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-light-border/60 dark:border-dark-border/60">
                  {/* Left: Role, Company, Order */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                      <Badge variant="terracotta" className="font-mono text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </Badge>
                      <h3 className="font-serif text-base sm:text-xl font-medium text-light-ink dark:text-dark-ink group-hover:text-terracotta transition-colors">
                        {exp.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-terracotta font-medium">
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
                  </div>

                  {/* Right: Date Range Badge */}
                  <div className="shrink-0 flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-light-ink-muted dark:text-dark-ink-muted px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-light-surface dark:bg-dark-surface-muted border border-light-border dark:border-dark-border w-fit">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-terracotta shrink-0" />
                    <span>
                      {exp.startDate} — {exp.endDate || 'Present'}
                    </span>
                  </div>
                </div>

                {/* Description & Impact Points */}
                <div className="mt-3.5 sm:mt-5 space-y-2 sm:space-y-2.5">
                  {points.length > 1 ? (
                    <ul className="space-y-2">
                      {points.map((pt, pIdx) => {
                        // On mobile, hide points after the first 2 unless expanded
                        const hideOnMobile = pIdx >= 2 && !isExpanded;
                        return (
                          <li
                            key={pIdx}
                            className={`flex items-start gap-2 sm:gap-2.5 font-sans text-xs sm:text-sm text-light-ink/90 dark:text-dark-ink/90 leading-relaxed font-light ${
                              hideOnMobile ? 'hidden sm:flex' : 'flex'
                            }`}
                          >
                            <span className="text-terracotta text-xs sm:text-sm select-none shrink-0 mt-0.5">
                              ⊘
                            </span>
                            <span>{pt}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="font-sans text-xs sm:text-sm text-light-ink/90 dark:text-dark-ink/90 leading-relaxed font-light">
                      {exp.description}
                    </p>
                  )}

                  {/* Mobile Progressive Disclosure Toggle */}
                  {points.length > 2 && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(cardKey)}
                      className="sm:hidden text-xs font-mono text-terracotta hover:underline mt-1.5 inline-flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <span>
                        {isExpanded
                          ? '⌃ Show fewer details'
                          : `⌄ Show ${points.length - 2} more detail${points.length - 2 === 1 ? '' : 's'}`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
