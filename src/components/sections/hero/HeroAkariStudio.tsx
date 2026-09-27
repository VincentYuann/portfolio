import React from 'react';
import {
  ArrowRight,
  FileText,
  Code2,
  Cpu,
  Sparkles,
  Github,
  Linkedin,
  Mail,
  Compass,
} from 'lucide-react';
import { useSiteData, parsePillarTags } from '../../../context/SiteDataContext';
import { HankoStamp } from '../../common/HankoStamp';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { TechTag } from '../../common/TechTag';

interface HeroAkariStudioProps {
  onNavigate?: (view: 'home' | 'projects' | 'resume', sectionId?: string) => void;
}

const getPillarIcon = (label: string, idx: number) => {
  const norm = (label || '').toLowerCase();
  if (
    norm.includes('ai') ||
    norm.includes('intelligence') ||
    norm.includes('rag') ||
    norm.includes('agent')
  ) {
    return Sparkles;
  }
  if (
    norm.includes('front') ||
    norm.includes('ui') ||
    norm.includes('craft') ||
    norm.includes('web')
  ) {
    return Code2;
  }
  if (norm.includes('lang') || norm.includes('code')) {
    return Code2;
  }
  if (
    norm.includes('system') ||
    norm.includes('cloud') ||
    norm.includes('tool') ||
    norm.includes('back')
  ) {
    return Cpu;
  }
  return idx === 0 ? Cpu : idx === 1 ? Sparkles : Code2;
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

  // Formatted Profile Links from DB
  const githubUrl = profile?.github || '';
  const rawLinkedin = profile?.linkedin || '';
  const linkedinUrl = rawLinkedin
    ? (rawLinkedin.startsWith('http') ? rawLinkedin : `https://${rawLinkedin}`)
    : '';
  const rawEmail = profile?.email || '';
  const emailUrl = rawEmail
    ? (rawEmail.startsWith('mailto:') ? rawEmail : `mailto:${rawEmail}`)
    : '';

  return (
    <section
      id="home"
      className="relative w-full pt-28 lg:pt-36 pb-12 lg:pb-16 flex flex-col justify-start overflow-hidden"
    >
      {/* 
      {/* Background layer cleared per user request */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none" />

      {/* Main Studio Frame Layout: Left Workspace + Right Hanko Card */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex flex-col gap-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          
          {/* 
            LEFT MAIN WORKSPACE (Akari Canvas - 8 Columns)
            Display headline in Zen Old Mincho, body copy in Mulish, Action buttons,
            and Dynamic Tech Domains Ribbon mapped directly from the DB profile.
          */}
          <main className="lg:col-span-8 xl:col-span-8 flex flex-col gap-8 order-2 lg:order-1">
            <div className="space-y-6 max-w-4xl">
              {/* Bold Serif Editorial Display Headline in Zen Old Mincho */}
              {headline && (
                <h1 className="font-zen text-4xl sm:text-5xl md:text-6xl lg:text-display-lg font-normal text-light-ink dark:text-dark-ink leading-[1.08] tracking-tight text-balance">
                  {headline}
                </h1>
              )}

              {/* Subtitle Paragraph in Mulish */}
              {tagline && (
                <p className="font-mulish text-base sm:text-lg text-light-ink-muted dark:text-dark-ink-muted max-w-2xl leading-relaxed font-light">
                  {tagline}
                </p>
              )}

              {/* Action Buttons with 2px corners */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#featured-works"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('home', 'featured-works');
                    }
                  }}
                  className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light font-mulish text-xs sm:text-sm font-semibold rounded-[2px] shadow-2xs hover:opacity-95 transition-all cursor-pointer"
                >
                  <span>Explore Selected Works</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>

                <a
                  href="#resume"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('resume');
                    }
                  }}
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:border-light-border-strong dark:hover:border-dark-border-strong text-light-ink dark:text-dark-ink font-mulish text-xs sm:text-sm font-medium rounded-[2px] shadow-2xs transition-all cursor-pointer"
                >
                  <span>Technical CV</span>
                  <FileText className="w-4 h-4 text-light-ink-muted dark:text-dark-ink-muted transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            {/* 
              3 TECH STACK CORE PILLARS (Rendered dynamically from DB profile.capability_pillars)
              Synchronized seamlessly with the edit profile page
            */}
            {capabilityPillars.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-light-border/60 dark:border-dark-border/60">
                {capabilityPillars.map((pillar, idx) => {
                  const tags = parsePillarTags(pillar);
                  const Icon = getPillarIcon(pillar.label, idx);

                  return (
                    <div
                      key={pillar.label || idx}
                      className="flex flex-col justify-between gap-3 p-4 rounded-[2px] bg-light-surface-card dark:bg-dark-surface-card craft-card border border-light-border dark:border-dark-border hover:border-light-border-strong dark:hover:border-dark-border-strong transition-all duration-300 shadow-2xs group"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-light-ink dark:text-dark-ink">
                          <Icon className="w-4 h-4 text-terracotta dark:text-[#D4A853] shrink-0" />
                          <span className="font-chakra text-xs uppercase tracking-wider font-semibold truncate">
                            {pillar.label}
                          </span>
                        </div>
                      </div>

                      {/* Dynamic official technology tags from DB */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {tags.map((tag) => (
                            <TechTag
                              key={tag}
                              tag={tag}
                              size="sm"
                              className="bg-light-surface dark:bg-dark-surface border-light-border/60 dark:border-dark-border/60 text-[11px]"
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
          <aside className="lg:col-span-4 xl:col-span-4 flex flex-col items-center lg:items-end justify-start order-1 lg:order-2 relative w-full">
            <div className="craft-card double-frame-simple classical-card-frame bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-[3px] p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-2xs w-full max-w-md relative group">
              
              {/* Celestial Ensō Orbital Circle: interactive hover & aura */}
              <EnsoOrbital placement="top-left" size={132} interactive={true} />

              {/* Box Header: Header Label & Archive Coordinate from DB */}
              {(hanko?.headerLabel || hanko?.locationArchive) && (
                <div className="w-full flex items-center justify-between pb-2.5 border-b border-light-border/60 dark:border-dark-border/60 relative z-10">
                  {hanko?.headerLabel ? (
                    <div className="flex items-center gap-1.5 font-chakra uppercase text-xs tracking-wider text-light-ink dark:text-dark-ink font-semibold">
                      <span className="w-1.5 h-1.5 rounded-[1px] bg-terracotta dark:bg-[#D4A853] inline-block" />
                      <span>{hanko.headerLabel}</span>
                    </div>
                  ) : <div />}
                  {hanko?.locationArchive && (
                    <span className="font-mono text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider text-xs font-medium">
                      {hanko.locationArchive}
                    </span>
                  )}
                </div>
              )}

              {/* Red Seal Mark: Authentic Hanko Stamp with Breathing Pulse */}
              <div className="relative p-2 flex flex-col items-center justify-center z-10">
                <div className="relative p-1.5 flex items-center justify-center animate-seal-breathe">
                  <HankoStamp
                    char={hanko?.stampCharacter || displayName.slice(0, 1) || ''}
                    className="w-16 h-16 sm:w-18 sm:h-18 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {hanko?.statusBadge && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-2xs font-mono font-medium text-terracotta dark:text-[#D4A853] tracking-wider uppercase shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta dark:bg-[#D4A853] animate-pulse" />
                    <span>{hanko.statusBadge}</span>
                  </div>
                )}
              </div>

              {/* Identity & Role Block */}
              {(displayName || displayRole) && (
                <div className="text-center relative z-10">
                  {displayName && (
                    <h2 className="font-zen text-2xl font-medium tracking-tight text-light-ink dark:text-dark-ink">
                      {displayName}
                    </h2>
                  )}
                  {displayRole && (
                    <p className="font-chakra text-xs uppercase tracking-wider text-light-ink-muted dark:text-dark-ink-muted font-semibold mt-1">
                      {displayRole}
                    </p>
                  )}
                </div>
              )}

              {/* Vertical Tategaki Japanese Prose (Synced dynamically from DB hanko_card.lines) */}
              {hankoLines.length > 0 && (
                <div className="w-full pt-4 border-t border-light-border/60 dark:border-dark-border/60 flex flex-col items-center justify-center relative z-10">
                  <div className="flex items-center justify-center gap-6 sm:gap-7 w-full">
                    {hankoLines.map((line, lIdx) => (
                      <div
                        key={lIdx}
                        title={line.tooltip || line.label}
                        className={`writing-vertical-rl font-zen text-xs sm:text-[13px] tracking-[0.25em] min-h-[110px] leading-relaxed transition-all cursor-default whitespace-nowrap select-none ${
                          lIdx === 1
                            ? 'text-terracotta dark:text-[#D4A853] font-medium hover:scale-105'
                            : 'text-light-ink dark:text-dark-ink hover:opacity-100'
                        }`}
                      >
                        {line.text}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-light-border/40 dark:border-dark-border/40 w-full flex items-center justify-between text-[11px] font-mono tracking-wider text-light-ink-muted dark:text-dark-ink-muted uppercase px-1 font-medium">
                    {hankoLines.map((line, lIdx) => (
                      <span key={lIdx}>{line.label}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Telemetry & Direct Channels */}
              {(hanko?.locationArchive || githubUrl || linkedinUrl || emailUrl) && (
                <div className="w-full pt-4 border-t border-light-border/60 dark:border-dark-border/60 space-y-3 relative z-10">
                  {hanko?.locationArchive && (
                    <div className="flex items-center justify-between text-[11px] font-mono text-light-ink-muted dark:text-dark-ink-muted">
                      <span className="flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-terracotta dark:text-[#D4A853] shrink-0" />
                        <span>{hanko.locationArchive}</span>
                      </span>
                    </div>
                  )}

                  {(githubUrl || linkedinUrl || emailUrl) && (
                    <div className="flex items-center justify-center gap-2 pt-1">
                      {githubUrl && (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-[#D4A853]/60 text-light-ink dark:text-dark-ink text-xs font-mono transition-colors shadow-2xs"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {linkedinUrl && (
                        <a
                          href={linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-[#D4A853]/60 text-light-ink dark:text-dark-ink text-xs font-mono transition-colors shadow-2xs"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {emailUrl && (
                        <a
                          href={emailUrl}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 dark:hover:border-[#D4A853]/60 text-light-ink dark:text-dark-ink text-xs font-mono transition-colors shadow-2xs"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
