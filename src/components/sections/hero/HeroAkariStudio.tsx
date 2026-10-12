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
import { TechTag } from '../../common/TechTag';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
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
  const avatarUrl = hanko?.avatarUrl || profile?.avatar_url || '';
  const statusBadge = hanko?.statusBadge?.trim() || 'OPEN TO FULL-STACK ROLES';

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
                      className="flex flex-col justify-between gap-2 sm:gap-2.5 p-3 sm:p-3.5 rounded-[3px] bg-light-surface-card/20 dark:bg-dark-surface-card/20 backdrop-blur-sm border border-light-border/50 dark:border-dark-border/50 hover:border-light-border-strong dark:hover:border-dark-border-strong hover:bg-light-surface-card dark:hover:bg-dark-surface-card transition-all duration-300 shadow-2xs group h-full"
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
                              className="bg-light-surface/20 dark:bg-dark-surface/20 border-light-border/50 dark:border-dark-border/50 text-xs py-1 px-2.5 font-medium backdrop-blur-xs"
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
            Semi-transparent at rest to reveal ambient backdrop, solid on hover.
          */}
          <aside className="lg:col-span-5 xl:col-span-5 flex flex-col items-center lg:items-end justify-center order-2 lg:order-2 relative w-full mt-4 lg:mt-0">
            <div className="double-frame-simple bg-light-surface/20 dark:bg-dark-surface/20 backdrop-blur-sm hover:bg-light-surface/95 dark:hover:bg-dark-surface/95 rounded-[3px] p-6 sm:p-7 flex flex-col justify-between gap-5 sm:gap-6 w-full max-w-[340px] sm:max-w-[360px] relative group z-10 transition-all duration-300">

              {/* Box Top Header: Centered Credential & Geographic Anchor */}
              <div className="w-full flex flex-col items-center text-center gap-1.5 pb-4 border-b border-light-border/60 dark:border-dark-border/60 relative z-10">
                <div className="flex items-center justify-center gap-2 font-serif text-sm font-semibold text-light-ink dark:text-dark-ink">
                  <GraduationCap className="w-4 h-4 text-terracotta dark:text-ochre shrink-0" />
                  <span className="truncate">{hanko?.headerLabel || 'Drexel University · CS & Math'}</span>
                </div>
                <div className="flex items-center justify-center gap-2 font-serif text-sm font-semibold text-light-ink/90 dark:text-dark-ink/90">
                  <MapPin className="w-4 h-4 text-terracotta dark:text-ochre shrink-0" />
                  <span className="truncate">{hanko?.locationArchive || 'Philadelphia, PA'}</span>
                </div>
              </div>

              {/* Core Profile Stack: Centered Avatar */}
              <div className="w-full flex flex-col items-center text-center gap-3.5 py-1 relative z-10">
                {/* Circular Profile Picture via shadcn Avatar */}
                <div className="relative inline-block animate-seal-breathe">
                  <Avatar className="size-24 sm:size-28 border border-light-border dark:border-dark-border shadow-xs ring-2 ring-light-border/30 dark:ring-dark-border/40">
                    <AvatarImage
                      src={avatarUrl}
                      alt={displayName || 'Profile Avatar'}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[#E5E1D8] dark:bg-[#1E2027]">
                      <svg className="size-13 sm:size-16 text-[#9E9A8E] dark:text-[#736F64]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Identity: Centered Full-width Name & Title */}
                <div className="w-full flex flex-col items-center text-center gap-1">
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-light-ink dark:text-dark-ink tracking-tight leading-tight truncate max-w-full">
                    {displayName || 'Vincent Yuan'}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm font-medium text-terracotta dark:text-ochre tracking-tight leading-tight truncate max-w-full">
                    {displayRole || 'Full-Stack AI & Software Engineer'}
                  </p>
                </div>

                {/* Live Availability Status Signal */}
                {statusBadge && (
                  <div className="pt-0.5 flex items-center justify-center">
                    <div className="inline-flex items-center gap-2 py-1 px-3 rounded-[2px] bg-terracotta/[0.07] dark:bg-ochre/[0.09] border border-terracotta/30 dark:border-ochre/35 text-terracotta dark:text-ochre text-2xs font-mono font-semibold uppercase tracking-wider shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta dark:bg-ochre shrink-0 animate-pulse" />
                      <span>{statusBadge}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Channels Dock: Normalized GitHub, LinkedIn & Bold Contact CTA */}
              <div className="w-full pt-4 border-t border-light-border/60 dark:border-dark-border/60 grid grid-cols-3 gap-2 relative z-10">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-[2px] bg-light-surface-raised/20 dark:bg-dark-surface-raised/20 hover:bg-light-surface dark:hover:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-ochre/60 text-light-ink dark:text-dark-ink hover:text-terracotta dark:hover:text-ochre text-xs font-mono font-semibold transition-all shadow-2xs group/gh cursor-pointer min-h-[44px]"
                  title="Inspect GitHub Repositories"
                >
                  <Github className="w-3.5 h-3.5 text-light-ink-muted dark:text-dark-ink-muted group-hover/gh:text-terracotta dark:group-hover/gh:text-ochre transition-transform duration-200 group-hover/gh:scale-110" />
                  <span>GitHub</span>
                </a>

                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-[2px] bg-light-surface-raised/20 dark:bg-dark-surface-raised/20 hover:bg-light-surface dark:hover:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-ochre/60 text-light-ink dark:text-dark-ink hover:text-terracotta dark:hover:text-ochre text-xs font-mono font-semibold transition-all shadow-2xs group/li cursor-pointer min-h-[44px]"
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
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-[2px] bg-terracotta hover:bg-[#9E3D27] text-white dark:bg-ochre dark:hover:bg-[#C29845] dark:text-[#121316] border border-terracotta dark:border-ochre text-xs font-mono font-bold tracking-wide transition-all shadow-xs group/mail cursor-pointer min-h-[44px]"
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
