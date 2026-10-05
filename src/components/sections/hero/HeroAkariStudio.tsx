import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  FileText,
  Mail,
  Download,
  Github,
  Linkedin,
  MapPin,
} from 'lucide-react';
import { useSiteData, parsePillarTags } from '../../../context/SiteDataContext';
import { useTheme } from '../../../context/ThemeContext';
import { HankoStamp } from '../../common/HankoStamp';
import { TechTag } from '../../common/TechTag';
import { getResumePdfUrl, fetchResumeData } from '../../../lib/supabase';
import { ViewMode } from '../../../App';

interface HeroAkariStudioProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
}

export const HeroAkariStudio: React.FC<HeroAkariStudioProps> = ({ onNavigate }) => {
  const { profile } = useSiteData();
  const { theme } = useTheme();

  const headline = profile?.headline || '';
  const tagline = profile?.tagline || '';
  const displayName = profile?.name || '';
  const displayRole = profile?.role || '';

  // Resume PDF URL with live Supabase query and fallback
  const [supabasePdfUrl, setSupabasePdfUrl] = useState(getResumePdfUrl());

  useEffect(() => {
    fetchResumeData().then((data) => {
      if (data?.resumeLink) setSupabasePdfUrl(data.resumeLink);
    });
  }, []);

  const handleDownloadPdf = () => {
    const link = document.createElement('a');
    link.href = supabasePdfUrl;
    link.download = 'Vincent_Yuan_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      className="relative w-full min-h-[100dvh] pt-20 sm:pt-24 lg:pt-26 2xl:pt-32 pb-12 sm:pb-16 lg:pb-18 2xl:pb-24 flex flex-col justify-center overflow-hidden"
    >
      {/* Full-Bleed Panoramic Sumi-e Dual Day/Night Masterpiece Banner */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none flex items-center justify-center">
        {/* Day Theme Backdrop (Panoramic Sumi-e Dawn Lake - 2752x1536 Full View) */}
        <img
          src="./images/day-hero.webp"
          alt="Panoramic sumi-e day lake with blossoms painting backdrop"
          className="absolute inset-0 w-full h-full object-cover object-[62%_center] sm:object-center dark:hidden opacity-95 transition-opacity duration-700 pointer-events-none select-none"
          loading={theme === 'day' ? 'eager' : 'lazy'}
          decoding="async"
        />

        {/* Night Theme Backdrop (Midnight Sumi-e Lake with Lantern Boat - 2752x1536 Full View) */}
        <img
          src="./images/night-hero.webp"
          alt="Panoramic sumi-e midnight lake with lantern boat painting backdrop"
          className="absolute inset-0 w-full h-full object-cover object-[62%_center] sm:object-center hidden dark:block opacity-90 transition-opacity duration-700 pointer-events-none select-none"
          loading={theme === 'night' ? 'eager' : 'lazy'}
          decoding="async"
        />

        {/* Delicate non-intrusive legibility backplate for typography */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-2/5 bg-gradient-to-r from-light-canvas/20 via-light-canvas/5 to-transparent dark:from-dark-canvas/25 dark:via-dark-canvas/5 to-transparent pointer-events-none z-0" />

      </div>

      {/* Main Studio Frame Layout: Left Workspace + Right Hanko Card */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex flex-col gap-4 sm:gap-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
          
          {/* 
            LEFT MAIN WORKSPACE (Akari Canvas - 7-8 Columns)
            Display headline in Zen Old Mincho, body copy in Mulish, Action buttons,
            and Dynamic Tech Domains Ribbon mapped directly from the DB profile.
          */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3.5 sm:gap-5 order-1 lg:order-1">
            <div className="space-y-2.5 sm:space-y-3.5 max-w-3xl">
              {/* Bold Serif Editorial Display Headline */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-light-ink dark:text-dark-ink leading-[1.08] tracking-tight text-balance">
                {headline || 'Software & AI Systems Engineer'}
              </h1>

              {/* Subtitle Paragraph in Dynamic Body Font */}
              {tagline && (
                <p className="font-sans text-xs xs:text-sm sm:text-base lg:text-lg text-light-ink-muted dark:text-dark-ink-muted max-w-xl leading-relaxed font-normal">
                  {tagline}
                </p>
              )}

              {/* Institutional & Location Byline - 5-Second Test Clarity */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-xs font-mono text-light-ink-muted dark:text-dark-ink-muted">
                <span className="flex items-center gap-1.5 font-medium text-light-ink dark:text-dark-ink">
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-terracotta dark:bg-ochre inline-block" />
                  <span>Drexel University · CS & Mathematics</span>
                </span>
                <span className="opacity-40">/</span>
                <span className="flex items-center gap-1 text-light-ink dark:text-dark-ink">
                  <MapPin className="w-3.5 h-3.5 text-terracotta dark:text-ochre shrink-0" />
                  <span>Philadelphia, PA · Open to Relocation & Remote</span>
                </span>
              </div>

              {/* Action Buttons with 2px corners */}
              <div className="pt-1 sm:pt-2 flex flex-row flex-wrap items-center gap-2 sm:gap-2.5">
                <a
                  href="#featured-works"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('home', 'featured-works');
                    }
                  }}
                  className="group inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light font-sans text-xs sm:text-sm font-semibold rounded-[2px] shadow-2xs hover:opacity-95 transition-all cursor-pointer min-h-[44px] sm:min-h-0"
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
                  className="group inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-light-surface-card/40 dark:bg-dark-surface-card/40 backdrop-blur-xs border border-light-border dark:border-dark-border hover:border-light-border-strong dark:hover:border-dark-border-strong text-light-ink dark:text-dark-ink font-sans text-xs sm:text-sm font-medium rounded-[2px] shadow-2xs transition-all cursor-pointer min-h-[44px] sm:min-h-0"
                  title="View interactive Curriculum Vitae with LaTeX source"
                >
                  <span>Curriculum Vitae</span>
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-light-ink-muted dark:text-dark-ink-muted transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>

                {/* 1-Click Hard Resume PDF Download */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="group inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-terracotta/10 dark:bg-ochre/15 hover:bg-terracotta/20 dark:hover:bg-ochre/25 border border-terracotta/40 dark:border-ochre/40 text-terracotta dark:text-ochre font-sans text-xs sm:text-sm font-semibold rounded-[2px] shadow-2xs transition-all cursor-pointer min-h-[44px] sm:min-h-0"
                  title="Direct 1-click download of official Resume PDF"
                  aria-label="Download Official Resume PDF"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* 
              3 TECH STACK CORE PILLARS (Rendered dynamically from DB profile.capability_pillars)
              Fine-tuned into a compact, elegant stationery shelf to preserve lake scenery
            */}
            {capabilityPillars.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2.5 pt-2.5 sm:pt-4 border-t border-light-border/50 dark:border-dark-border/50 max-w-3xl">
                {capabilityPillars.map((pillar, idx) => {
                  const tags = parsePillarTags(pillar);

                  return (
                    <div
                      key={pillar.label || idx}
                      className="flex flex-col justify-between gap-1 sm:gap-2 p-2 sm:p-2.5 rounded-[2px] bg-light-surface-card/15 dark:bg-dark-surface-card/20 backdrop-blur-md border border-light-border/50 dark:border-dark-border/50 hover:border-light-border-strong dark:hover:border-dark-border-strong hover:bg-light-surface-card/25 dark:hover:bg-dark-surface-card/30 transition-all duration-300 shadow-2xs group"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-light-ink dark:text-dark-ink">
                          <span className="font-mono text-xs sm:text-sm uppercase tracking-wider font-semibold text-light-ink dark:text-dark-ink truncate">
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
                              className="bg-light-surface/30 dark:bg-dark-surface/30 border-light-border/40 dark:border-dark-border/40 text-xs sm:text-sm py-1 px-2.5 font-semibold backdrop-blur-xs"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 
            RIGHT COLUMN: CLASSICAL HANKO SHOWCASE CARD (Sleek Compact Stationery Plaque)
            Sculpted dimensions (compact max-w-[335px] on mobile, max-w-[360px] on desktop)
          */}
          <aside className="lg:col-span-5 xl:col-span-4 flex flex-col items-center lg:items-end justify-center order-2 lg:order-2 relative w-full mt-3 lg:mt-0">
            <div className="double-frame-simple bg-light-surface-card/15 dark:bg-dark-surface-card/20 backdrop-blur-md hover:bg-light-surface-card dark:hover:bg-dark-surface-card hover:backdrop-blur-none transition-all duration-300 border border-light-border/60 dark:border-dark-border/60 hover:border-light-border-strong dark:hover:border-dark-border-strong rounded-[3px] p-3 sm:p-3.5 flex flex-col justify-between gap-2 sm:gap-3 shadow-2xs hover:shadow-md w-full max-w-[335px] sm:max-w-[360px] relative group z-10">

              {/* Box Header: Header Label & Archive Coordinate from DB (Crisp single-line layout) */}
              {(hanko?.headerLabel || hanko?.locationArchive) && (
                <div className="w-full flex items-center justify-between gap-2 pb-1.5 border-b border-light-border/50 dark:border-dark-border/50 relative z-10">
                  {hanko?.headerLabel ? (
                    <div className="flex items-center gap-1.5 font-mono uppercase text-xs tracking-tight text-light-ink dark:text-dark-ink font-semibold whitespace-nowrap min-w-0">
                      <span className="w-1.5 h-1.5 rounded-[1px] bg-terracotta dark:bg-ochre inline-block shrink-0" />
                      <span className="whitespace-nowrap">{hanko.headerLabel}</span>
                    </div>
                  ) : <div />}
                  {hanko?.locationArchive && (
                    <span className="font-mono text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-tight text-2xs sm:text-xs font-semibold shrink-0 text-right whitespace-nowrap pl-1">
                      {hanko.locationArchive}
                    </span>
                  )}
                </div>
              )}

              {/* Red Seal Mark: Authentic Hanko Stamp with Breathing Pulse */}
              <div className="relative p-0.5 flex flex-col items-center justify-center z-10">
                <div className="relative p-0.5 flex items-center justify-center animate-seal-breathe">
                  <HankoStamp
                    char={hanko?.stampCharacter || displayName.slice(0, 1) || ''}
                    className="w-11 h-11 sm:w-12.5 sm:h-12.5 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {hanko?.statusBadge && (
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-light-surface/40 dark:bg-dark-surface/40 backdrop-blur-xs border border-light-border/50 dark:border-dark-border/50 text-xs font-mono font-semibold text-terracotta dark:text-ochre tracking-wider uppercase shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta dark:bg-ochre animate-pulse" />
                    <span>{hanko.statusBadge}</span>
                  </div>
                )}
              </div>

              {/* Identity & Role Block */}
              {(displayName || displayRole) && (
                <div className="text-center relative z-10">
                  {displayName && (
                    <div className="font-display text-base sm:text-lg lg:text-xl font-medium tracking-tight text-light-ink dark:text-dark-ink">
                      {displayName}
                    </div>
                  )}
                  {displayRole && (
                    <p className="font-sans text-xs uppercase tracking-widest text-light-ink dark:text-dark-ink font-semibold mt-0.5">
                      {displayRole}
                    </p>
                  )}
                </div>
              )}

              {/* Vertical Tategaki Japanese Prose (Synced dynamically from DB hanko_card.lines) */}
              {hankoLines.length > 0 && (
                <div className="w-full pt-2.5 sm:pt-3 border-t border-light-border/50 dark:border-dark-border/50 flex flex-col items-center justify-center relative z-10">
                  <div className="flex items-center justify-center gap-4 sm:gap-5 w-full pb-2 sm:pb-2.5">
                    {hankoLines.map((line, lIdx) => (
                      <div
                        key={lIdx}
                        title={line.tooltip || line.label}
                        className={`writing-vertical-rl font-vertical text-xs sm:text-sm tracking-[0.22em] min-h-[64px] sm:min-h-[76px] leading-relaxed transition-all cursor-default whitespace-nowrap select-none font-semibold ${
                          lIdx === 1
                            ? 'text-[#8A2E16] dark:text-[#E2B75A] hover:scale-105'
                            : 'text-light-ink dark:text-dark-ink hover:opacity-100'
                        }`}
                      >
                        {line.text}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 pb-0.5 border-t border-light-border/40 dark:border-dark-border/40 w-full flex items-center justify-between text-xs font-mono tracking-wider text-light-ink-muted dark:text-dark-ink-muted uppercase px-1 font-semibold">
                    {hankoLines.map((line, lIdx) => (
                      <span key={lIdx}>{line.label}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Channels: GitHub, LinkedIn & Contact */}
              <div className="w-full pt-2 border-t border-light-border/50 dark:border-dark-border/50 grid grid-cols-3 gap-1 relative z-10">
                <a
                  href={profile?.github || 'https://github.com/VincentYuann'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-[2px] bg-light-surface/30 dark:bg-dark-surface/30 hover:bg-light-surface-raised dark:hover:bg-dark-surface border border-light-border/50 dark:border-dark-border/50 hover:border-terracotta/60 dark:hover:border-ochre/60 text-light-ink dark:text-dark-ink hover:text-terracotta dark:hover:text-ochre text-2xs sm:text-xs font-mono font-medium transition-colors shadow-2xs group/gh cursor-pointer min-h-[40px] sm:min-h-0"
                  title="Inspect GitHub Repositories"
                >
                  <Github className="w-3 h-3 text-light-ink-muted dark:text-dark-ink-muted group-hover/gh:text-terracotta dark:group-hover/gh:text-ochre transition-transform duration-200 group-hover/gh:scale-110" />
                  <span>GitHub</span>
                </a>

                <a
                  href={profile?.linkedin || 'https://linkedin.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-[2px] bg-light-surface/30 dark:bg-dark-surface/30 hover:bg-light-surface-raised dark:hover:bg-dark-surface border border-light-border/50 dark:border-dark-border/50 hover:border-terracotta/60 dark:hover:border-ochre/60 text-light-ink dark:text-dark-ink hover:text-terracotta dark:hover:text-ochre text-2xs sm:text-xs font-mono font-medium transition-colors shadow-2xs group/li cursor-pointer min-h-[40px] sm:min-h-0"
                  title="Open LinkedIn Profile"
                >
                  <Linkedin className="w-3 h-3 text-light-ink-muted dark:text-dark-ink-muted group-hover/li:text-terracotta dark:group-hover/li:text-ochre transition-transform duration-200 group-hover/li:scale-110" />
                  <span>LinkedIn</span>
                </a>

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
                  className="inline-flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-[2px] bg-terracotta/10 dark:bg-ochre/15 hover:bg-terracotta/20 dark:hover:bg-ochre/25 border border-terracotta/40 dark:border-ochre/40 text-terracotta dark:text-ochre text-2xs sm:text-xs font-mono font-semibold transition-colors shadow-2xs group/mail cursor-pointer min-h-[40px] sm:min-h-0"
                  title="Direct Message / Get in Touch"
                >
                  <Mail className="w-3 h-3 transition-transform duration-200 group-hover/mail:scale-110" />
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
