import React from 'react';
import {
  ArrowRight,
  FileText,
  Code2,
  Cpu,
  Sparkles,
  Mail,
} from 'lucide-react';
import { useSiteData, parsePillarTags } from '../../../context/SiteDataContext';
import { HankoStamp } from '../../common/HankoStamp';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { TechTag } from '../../common/TechTag';
import { ViewMode } from '../../../App';

interface HeroAkariStudioProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
}

const PILLAR_ICON_MATCHERS: Array<{ keywords: string[]; icon: typeof Sparkles }> = [
  { keywords: ['ai', 'intelligence', 'rag', 'agent'], icon: Sparkles },
  { keywords: ['front', 'ui', 'craft', 'web', 'lang', 'code'], icon: Code2 },
  { keywords: ['system', 'cloud', 'tool', 'back'], icon: Cpu },
];

const DEFAULT_PILLAR_ICONS = [Cpu, Sparkles, Code2];

const getPillarIcon = (label: string, idx: number) => {
  const norm = (label || '').toLowerCase();
  const matched = PILLAR_ICON_MATCHERS.find(({ keywords }) => keywords.some((k) => norm.includes(k)));
  return matched ? matched.icon : (DEFAULT_PILLAR_ICONS[idx] || Code2);
};

export const HeroAkariStudio: React.FC<HeroAkariStudioProps> = ({ onNavigate }) => {
  const { profile } = useSiteData();

  const headline = profile?.headline || '';
  const tagline = profile?.tagline || '';
  const displayName = profile?.name || '';
  const displayRole = profile?.role || '';

  // Dynamic Hanko Card Configuration (from DB profile.hanko_card)
  const hanko = profile?.hanko_card;
  const hankoLines = Array.isArray(hanko?.lines) ? hanko.lines : [];

  // Dynamic Technical Domains (synced directly with DB profile.capability_pillars)
  const capabilityPillars = Array.isArray(profile?.capability_pillars)
    ? profile.capability_pillars
    : [];

  return (
    <section
      id="home"
      className="relative w-full min-h-screen pt-28 sm:pt-32 lg:pt-36 pb-24 sm:pb-28 lg:pb-32 flex flex-col justify-center overflow-hidden"
    >
      {/* Full-Bleed Panoramic Sumi-e Dual Day/Night Masterpiece Banner */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none flex items-center justify-center">
        {/* Day Theme Backdrop (Panoramic Sumi-e Dawn Lake - 2752x1536 Full View) */}
        <img
          src="/images/day-hero.webp"
          alt="Panoramic sumi-e day lake with blossoms painting backdrop"
          className="absolute inset-0 w-full h-full object-cover object-center dark:hidden opacity-95 transition-opacity duration-700 pointer-events-none select-none"
          loading="eager"
          decoding="async"
        />

        {/* Night Theme Backdrop (Midnight Sumi-e Lake with Lantern Boat - 2752x1536 Full View) */}
        <img
          src="/images/night-hero.webp"
          alt="Panoramic sumi-e midnight lake with lantern boat painting backdrop"
          className="absolute inset-0 w-full h-full object-cover object-center hidden dark:block opacity-90 transition-opacity duration-700 pointer-events-none select-none"
          loading="eager"
          decoding="async"
        />

        {/* Delicate non-intrusive legibility backplate for typography */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-2/5 bg-gradient-to-r from-light-canvas/20 via-light-canvas/5 to-transparent dark:from-dark-canvas/25 dark:via-dark-canvas/5 to-transparent pointer-events-none z-0" />

        {/* Ambient Ink Dust Motes floating gently */}
        <div className="absolute right-1/4 bottom-16 w-1.5 h-1.5 rounded-full bg-terracotta/40 mote-1 blur-[0.5px] z-10" />
        <div className="absolute right-1/3 bottom-28 w-2 h-2 rounded-full bg-ochre/30 mote-2 blur-[0.5px] z-10" />
        <div className="absolute right-1/2 bottom-12 w-1 h-1 rounded-full bg-light-ink-muted/30 dark:bg-[#edeae4]/35 mote-3 blur-[0.5px] z-10" />
      </div>

      {/* Main Studio Frame Layout: Left Workspace + Right Hanko Card */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-6 flex flex-col gap-6 sm:gap-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start">
          
          {/* 
            LEFT MAIN WORKSPACE (Akari Canvas - 8 Columns)
            Display headline in Zen Old Mincho, body copy in Mulish, Action buttons,
            and Dynamic Tech Domains Ribbon mapped directly from the DB profile.
          */}
          <main className="lg:col-span-8 xl:col-span-8 flex flex-col gap-6 sm:gap-8 order-1 lg:order-1">
            <div className="space-y-4 sm:space-y-6 max-w-4xl">
              {/* Bold Serif Editorial Display Headline in Dynamic Display Font */}
              {headline && (
                <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.25rem] font-normal text-light-ink dark:text-dark-ink leading-[1.06] tracking-tight text-balance">
                  {headline}
                </h1>
              )}

              {/* Subtitle Paragraph in Dynamic Body Font */}
              {tagline && (
                <p className="font-sans text-base sm:text-xl text-light-ink-muted dark:text-dark-ink-muted max-w-2xl leading-relaxed font-normal">
                  {tagline}
                </p>
              )}

              {/* Action Buttons with 2px corners */}
              <div className="pt-2 sm:pt-4 flex flex-row flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href="#featured-works"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('home', 'featured-works');
                    }
                  }}
                  className="group inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-7 sm:py-4 bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light font-sans text-xs sm:text-sm font-semibold rounded-[2px] shadow-2xs hover:opacity-95 transition-all cursor-pointer"
                >
                  <span>Explore Selected Works</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>

                <a
                  href="#resume"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('resume');
                    }
                  }}
                  className="group inline-flex items-center justify-center gap-1.5 px-5 py-3 sm:px-7 sm:py-4 bg-light-surface-card/40 dark:bg-dark-surface-card/40 backdrop-blur-xs border border-light-border dark:border-dark-border hover:border-light-border-strong dark:hover:border-dark-border-strong text-light-ink dark:text-dark-ink font-sans text-xs sm:text-sm font-medium rounded-[2px] shadow-2xs transition-all cursor-pointer"
                >
                  <span>Technical CV</span>
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-light-ink-muted dark:text-dark-ink-muted transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            {/* 
              3 TECH STACK CORE PILLARS (Rendered dynamically from DB profile.capability_pillars)
              Synchronized seamlessly with the edit profile page
            */}
            {capabilityPillars.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3.5 pt-4 sm:pt-6 border-t border-light-border/60 dark:border-dark-border/60">
                {capabilityPillars.map((pillar, idx) => {
                  const tags = parsePillarTags(pillar);
                  const Icon = getPillarIcon(pillar.label, idx);

                  return (
                    <div
                      key={pillar.label || idx}
                      className="flex flex-col justify-between gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-[2px] bg-light-surface-card/15 dark:bg-dark-surface-card/20 backdrop-blur-md border border-light-border/50 dark:border-dark-border/50 hover:border-light-border-strong dark:hover:border-dark-border-strong hover:bg-light-surface-card/25 dark:hover:bg-dark-surface-card/30 transition-all duration-300 shadow-2xs group"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-light-ink dark:text-dark-ink">
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-terracotta dark:text-[#D4A853] shrink-0" />
                          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest font-medium text-light-ink dark:text-dark-ink truncate">
                            {pillar.label}
                          </span>
                        </div>
                      </div>

                      {/* Dynamic official technology tags from DB */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5">
                          {tags.map((tag) => (
                            <TechTag
                              key={tag}
                              tag={tag}
                              size="sm"
                              className="bg-light-surface/30 dark:bg-dark-surface/30 border-light-border/40 dark:border-dark-border/40 text-[10px] sm:text-[11px] py-0.5 px-2 backdrop-blur-xs"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </main>

          {/* 
            RIGHT COLUMN: CLASSICAL HANKO SHOWCASE CARD (4 Columns)
            Framed with Blueprint Double Hairline Frame, Breathing Stamp Seal,
            Ensō Background, Vertical Tategaki Prose, and Direct Telemetry Channels.
            Fully synchronized with DB profile.hanko_card & profile contacts.
          */}
          <aside className="lg:col-span-4 xl:col-span-4 flex flex-col items-center lg:items-end justify-start order-2 lg:order-2 relative w-full">
            <div className="double-frame-simple bg-light-surface-card/15 dark:bg-dark-surface-card/20 backdrop-blur-md hover:bg-light-surface-card dark:hover:bg-dark-surface-card hover:backdrop-blur-none transition-all duration-300 border border-light-border/60 dark:border-dark-border/60 hover:border-light-border-strong dark:hover:border-dark-border-strong rounded-[3px] p-4 sm:p-7 flex flex-col justify-between gap-3.5 sm:gap-5 shadow-2xs hover:shadow-md w-full max-w-md relative group z-10">
              
              {/* Celestial Ensō Orbital Circle: interactive hover & aura */}
              <EnsoOrbital placement="top-left" size={132} interactive={true} />

              {/* Box Header: Header Label & Archive Coordinate from DB */}
              {(hanko?.headerLabel || hanko?.locationArchive) && (
                <div className="w-full flex items-start justify-between gap-3 sm:gap-4 pb-2.5 border-b border-light-border/60 dark:border-dark-border/60 relative z-10">
                  {hanko?.headerLabel ? (
                    <div className="flex items-start gap-1.5 font-mono uppercase text-[11px] sm:text-xs tracking-wider text-light-ink dark:text-dark-ink font-semibold min-w-0 flex-1">
                      <span className="w-1.5 h-1.5 rounded-[1px] bg-terracotta dark:bg-ochre inline-block mt-1 shrink-0" />
                      <span className="leading-snug break-words">{hanko.headerLabel}</span>
                    </div>
                  ) : <div />}
                  {hanko?.locationArchive && (
                    <span className="font-mono text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider text-[10px] sm:text-[11px] font-medium shrink-0 text-right whitespace-nowrap pt-0.5">
                      {hanko.locationArchive}
                    </span>
                  )}
                </div>
              )}

              {/* Red Seal Mark: Authentic Hanko Stamp with Breathing Pulse */}
              <div className="relative p-1 flex flex-col items-center justify-center z-10">
                <div className="relative p-1 flex items-center justify-center animate-seal-breathe">
                  <HankoStamp
                    char={hanko?.stampCharacter || displayName.slice(0, 1) || ''}
                    className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {hanko?.statusBadge && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] bg-light-surface/35 dark:bg-dark-surface/35 backdrop-blur-xs border border-light-border/50 dark:border-dark-border/50 text-2xs font-mono font-medium text-terracotta dark:text-ochre tracking-wider uppercase shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta dark:bg-ochre animate-pulse" />
                    <span>{hanko.statusBadge}</span>
                  </div>
                )}
              </div>

              {/* Identity & Role Block */}
              {(displayName || displayRole) && (
                <div className="text-center relative z-10">
                  {displayName && (
                    <h2 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-light-ink dark:text-dark-ink">
                      {displayName}
                    </h2>
                  )}
                  {displayRole && (
                    <p className="font-sans text-xs uppercase tracking-widest text-light-ink-muted dark:text-dark-ink-muted font-medium mt-1">
                      {displayRole}
                    </p>
                  )}
                </div>
              )}

              {/* Vertical Tategaki Japanese Prose (Synced dynamically from DB hanko_card.lines) */}
              {hankoLines.length > 0 && (
                <div className="w-full pt-3.5 border-t border-light-border/60 dark:border-dark-border/60 flex flex-col items-center justify-center relative z-10">
                  <div className="flex items-center justify-center gap-6 sm:gap-7 w-full">
                    {hankoLines.map((line, lIdx) => (
                      <div
                        key={lIdx}
                        title={line.tooltip || line.label}
                        className={`writing-vertical-rl font-vertical text-xs sm:text-[13px] tracking-[0.25em] min-h-[96px] sm:min-h-[110px] leading-relaxed transition-all cursor-default whitespace-nowrap select-none ${
                          lIdx === 1
                            ? 'text-terracotta dark:text-[#D4A853] font-medium hover:scale-105'
                            : 'text-light-ink dark:text-dark-ink hover:opacity-100'
                        }`}
                      >
                        {line.text}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-light-border/40 dark:border-dark-border/40 w-full flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-wider text-light-ink-muted dark:text-dark-ink-muted uppercase px-1 font-medium">
                    {hankoLines.map((line, lIdx) => (
                      <span key={lIdx}>{line.label}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Channel: Navigate to Contact Form */}
              <div className="w-full pt-3.5 border-t border-light-border/60 dark:border-dark-border/60 relative z-10">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) {
                      onNavigate('home', 'contact');
                    }
                    const el = document.getElementById('contact');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                      setTimeout(() => {
                        const nameInput = document.getElementById('contact-name') as HTMLInputElement | null;
                        if (nameInput) {
                          nameInput.focus({ preventScroll: true });
                        }
                      }, 400);
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[2px] bg-light-surface/30 dark:bg-dark-surface/30 backdrop-blur-xs border border-light-border/50 dark:border-dark-border/50 hover:border-terracotta/60 dark:hover:border-[#D4A853]/60 text-light-ink dark:text-dark-ink hover:text-terracotta dark:hover:text-[#D4A853] text-xs font-mono transition-colors shadow-2xs group/btn cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-terracotta dark:text-[#D4A853] transition-transform duration-200 group-hover/btn:scale-110" />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
