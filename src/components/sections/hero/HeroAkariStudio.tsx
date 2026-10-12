import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Mail,
  Download,
  Github,
  Linkedin,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import { useSiteData, parsePillarTags } from '../../../context/SiteDataContext';
import { useTheme } from '../../../context/ThemeContext';
import { HankoStamp } from '../../common/HankoStamp';
import { TechTag } from '../../common/TechTag';
import { getResumePdfUrl, fetchResumeData } from '../../../lib/supabase';
import { ViewMode } from '../../../App';

const normalizeUrl = (url?: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
};

const formatHeadline = (text: string) => {
  if (!text) return '';
  // Replace standard hyphens in compound words like full-stack with a non-breaking hyphen (\u2011)
  // to prevent clumsy breaks across lines (e.g. "full-" on line 1 and "stack" on line 2)
  return text.replace(/(\b\w+)-(\w+\b)/g, '$1\u2011$2');
};

interface HeroAkariStudioProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
}

export const HeroAkariStudio: React.FC<HeroAkariStudioProps> = ({ onNavigate }) => {
  const { profile } = useSiteData();
  const { theme } = useTheme();

  const headline = profile?.headline || '';
  const displayName = profile?.name || '';
  const displayRole = profile?.role || '';
  const githubUrl = normalizeUrl(profile?.github) || 'https://github.com/VincentYuann';
  const linkedinUrl = normalizeUrl(profile?.linkedin) || 'https://www.linkedin.com/in/yuanvincent';

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
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex flex-col gap-4 sm:gap-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
          
          {/* 
            LEFT MAIN WORKSPACE (Akari Canvas - 7 Columns)
            Display headline in Zen Old Mincho, Action buttons,
            and Dynamic Tech Domains Ribbon mapped directly from the DB profile.
          */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-4 sm:gap-6 order-1 lg:order-1">
            <div className="space-y-3 sm:space-y-4 max-w-3xl">
              {/* Bold Serif Editorial Display Headline - United compound words with non-breaking hyphens */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-normal text-light-ink dark:text-dark-ink leading-[1.18] tracking-tight max-w-3xl">
                {formatHeadline(headline) || 'Software & AI Systems Engineer'}
              </h1>

              {/* Action Buttons: 2 decisive recruiter & hiring manager CTAs */}
              <div className="pt-2 sm:pt-3 flex flex-row flex-wrap items-center gap-3 sm:gap-3.5">
                <a
                  href="#featured-works"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('home', 'featured-works');
                    }
                  }}
                  className="group inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-light-button-dark dark:bg-white text-light-on-dark dark:text-[#121316] font-sans text-xs sm:text-sm font-semibold rounded-[2px] shadow-2xs hover:opacity-95 dark:hover:opacity-100 dark:hover:bg-white transition-all cursor-pointer min-h-[44px] sm:min-h-0"
                >
                  <span>Explore Selected Works</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>

                {/* 1-Click Hard Resume PDF Download */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="group inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-5 sm:py-2.5 lg:px-5 lg:py-3 bg-terracotta/10 dark:bg-ochre/15 hover:bg-terracotta/20 dark:hover:bg-ochre/25 border border-terracotta/40 dark:border-ochre/40 text-terracotta dark:text-ochre font-sans text-xs sm:text-sm font-semibold rounded-[2px] shadow-2xs transition-all cursor-pointer min-h-[44px] sm:min-h-0"
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
              Fine-tuned into a balanced, elegant stationery shelf to preserve lake scenery
            */}
            {capabilityPillars.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5 items-stretch pt-3 sm:pt-5 border-t border-light-border/50 dark:border-dark-border/50 max-w-3xl">
                {capabilityPillars.map((pillar, idx) => {
                  const tags = parsePillarTags(pillar);

                  return (
                    <div
                      key={pillar.label || idx}
                      className="flex flex-col justify-between gap-2 sm:gap-2.5 p-3 sm:p-3.5 rounded-[3px] bg-light-surface-card/20 dark:bg-dark-surface-card/25 backdrop-blur-md border border-light-border/50 dark:border-dark-border/50 hover:border-terracotta/40 dark:hover:border-ochre/40 hover:bg-light-surface-card/30 dark:hover:bg-dark-surface-card/35 transition-all duration-300 shadow-2xs group h-full"
                    >
                      <div className="pb-1.5 border-b border-light-border/40 dark:border-dark-border/40">
                        <span className="font-mono text-xs uppercase tracking-wider font-semibold text-light-ink dark:text-dark-ink block truncate">
                          {pillar.label}
                        </span>
                      </div>

                      {/* Dynamic official technology tags from DB */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {tags.map((tag) => (
                            <TechTag
                              key={tag}
                              tag={tag}
                              size="sm"
                              className="bg-light-surface/40 dark:bg-dark-surface/40 border-light-border/50 dark:border-dark-border/50 text-xs py-1 px-2.5 font-medium backdrop-blur-xs"
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
            RIGHT COLUMN: RECRUITER IDENTITY PLAQUE (Atelier Washi Stationery Plaque)
            Yamato-hi (Silver Ratio) Proportions: ~1 : 1.35 vertical elegance.
            Neither overly horizontal nor overly vertical — balanced, dignified, and perfectly spaced.
          */}
          <aside className="lg:col-span-5 xl:col-span-5 flex flex-col items-center lg:items-end justify-center order-2 lg:order-2 relative w-full mt-4 lg:mt-0">
            <div className="double-frame-simple bg-light-surface dark:bg-dark-surface rounded-[3px] p-6 sm:p-7 flex flex-col justify-between gap-5 sm:gap-6 w-full max-w-[400px] sm:max-w-[420px] relative group z-10 transition-all duration-300">

              {/* Box Top Header: Credential & Geographic Anchor clearly displayed without truncation */}
              <div className="w-full flex flex-col gap-1.5 pb-4 border-b border-light-border dark:border-dark-border relative z-10">
                <div className="flex items-center gap-2 font-serif text-sm sm:text-base font-semibold text-light-ink dark:text-dark-ink">
                  <GraduationCap className="w-4 h-4 text-terracotta dark:text-ochre shrink-0" />
                  <span className="truncate inline-flex items-center gap-1.5 flex-wrap">
                    {(hanko?.headerLabel || 'Drexel University · CS & Math')
                      .replace(/[\uFFFD\u00C2\u00A0]+/g, ' · ')
                      .split(/\s*[·•/]\s*/)
                      .filter(Boolean)
                      .map((seg, idx, arr) => (
                        <React.Fragment key={idx}>
                          <span>{seg}</span>
                          {idx < arr.length - 1 && (
                            <span className="text-light-border-strong dark:text-dark-border-strong font-sans select-none opacity-80">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-light-ink/90 dark:text-dark-ink/90">
                  <MapPin className="w-3.5 h-3.5 text-terracotta dark:text-ochre shrink-0" />
                  <span>{hanko?.locationArchive || 'Philadelphia, PA'}</span>
                </div>
              </div>

              {/* Core Profile Stack: Hanko Seal + Name + Role + Live Availability Status */}
              <div className="w-full flex items-center gap-4 py-1 relative z-10">
                {/* Red Seal Mark: Authentic Hanko Stamp with Breathing Pulse */}
                <div className="relative p-0.5 flex items-center justify-center animate-seal-breathe shrink-0">
                  <HankoStamp
                    char={
                      hanko?.stampCharacter && hanko.stampCharacter !== '?' && !hanko.stampCharacter.includes('\uFFFD')
                        ? hanko.stampCharacter
                        : (displayName?.slice(0, 1) || '原')
                    }
                    className="w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Identity & Status */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-light-ink dark:text-dark-ink tracking-tight leading-tight">
                    {displayName || 'Vincent Yuan'}
                  </h2>
                  <p className="font-mono text-xs font-semibold text-terracotta dark:text-ochre tracking-wide leading-tight uppercase">
                    {displayRole || 'Full-Stack AI & Software Engineer'}
                  </p>
                  {hanko?.statusBadge && (
                    <div className="mt-1.5 inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-bamboo/10 dark:bg-bamboo/20 border border-bamboo/40 dark:border-bamboo/50 text-xs font-mono font-bold tracking-wider text-bamboo dark:text-[#76A88B] uppercase w-fit">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bamboo opacity-40 dark:bg-[#76A88B]" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-bamboo dark:bg-[#76A88B]" />
                      </span>
                      <span>{hanko.statusBadge}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Direct Channels Dock: Normalized GitHub, LinkedIn & Bold Contact CTA */}
              <div className="w-full pt-4 border-t border-light-border dark:border-dark-border grid grid-cols-3 gap-2.5 relative z-10">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[2px] bg-light-surface-raised dark:bg-dark-surface-raised hover:bg-light-surface-card dark:hover:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-ochre/60 text-light-ink dark:text-dark-ink hover:text-terracotta dark:hover:text-ochre text-xs font-mono font-semibold transition-all shadow-2xs group/gh cursor-pointer min-h-[44px]"
                  title="Inspect GitHub Repositories"
                >
                  <Github className="w-3.5 h-3.5 text-light-ink-muted dark:text-dark-ink-muted group-hover/gh:text-terracotta dark:group-hover/gh:text-ochre transition-transform duration-200 group-hover/gh:scale-110" />
                  <span>GitHub</span>
                </a>

                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[2px] bg-light-surface-raised dark:bg-dark-surface-raised hover:bg-light-surface-card dark:hover:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-ochre/60 text-light-ink dark:text-dark-ink hover:text-terracotta dark:hover:text-ochre text-xs font-mono font-semibold transition-all shadow-2xs group/li cursor-pointer min-h-[44px]"
                  title="Open LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5 text-light-ink-muted dark:text-dark-ink-muted group-hover/li:text-terracotta dark:group-hover/li:text-ochre transition-transform duration-200 group-hover/li:scale-110" />
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
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[2px] bg-terracotta hover:bg-[#9E3D27] text-white dark:bg-ochre dark:hover:bg-[#C29845] dark:text-[#121316] border border-terracotta dark:border-ochre text-xs font-mono font-bold tracking-wide transition-all shadow-xs group/mail cursor-pointer min-h-[44px]"
                  title="Direct Message / Get in Touch"
                >
                  <Mail className="w-3.5 h-3.5 transition-transform duration-200 group-hover/mail:scale-110" />
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
