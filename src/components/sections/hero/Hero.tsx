import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { BambooArt } from '../../common/BambooArt';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { HankoStamp } from '../../common/HankoStamp';
import { TechTag } from '../../common/TechTag';
import { useSiteData, parsePillarTags } from '../../../context/SiteDataContext';

interface HeroProps {
  onNavigate?: (view: 'home' | 'projects' | 'resume', sectionId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { profile } = useSiteData();

  const headline = profile?.headline || '';
  const tagline = profile?.tagline || '';
  const displayName = profile?.name || 'Vincent Yuan';
  const displayRole = profile?.role || 'Software Engineer';
  const capabilityPillars =
    Array.isArray(profile?.capability_pillars) && profile.capability_pillars.length > 0
      ? profile.capability_pillars
      : [];
  const hanko = profile?.hanko_card;
  const hankoLines = (hanko?.lines && Array.isArray(hanko.lines)) ? hanko.lines : [];

  return (
    <section id="home" className="relative w-full overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24">
      {/* Full-Bleed Stretched Landscape Hero Banner with Sumi-e Mountains & Bamboo Art */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        {/* Stretched Panoramic Sumi-e Landscape & Bamboo Masterpiece Banner */}
        <img
          src="./images/hero-sumie-landscape-bamboo-banner.jpg"
          alt="Panoramic sumi-e landscape and bamboo ink wash painting backdrop"
          className="absolute inset-0 w-full h-full object-cover object-left sm:object-center opacity-85 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen dark:invert animate-gentle-drift"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{
            maskImage: 'radial-gradient(ellipse 98% 90% at 50% 50%, black 50%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(ellipse 98% 90% at 50% 50%, black 50%, transparent 95%)',
          }}
        />

        {/* Dedicated Japanese Sumi-e Pine Tree (Matsu 松) prominently anchoring the left */}
        <div className="absolute left-0 sm:left-2 lg:left-6 bottom-0 h-4/5 max-h-[720px] w-auto max-w-lg hidden sm:block pointer-events-none z-0">
          <img
            src="./images/sumie-pine-tree-left.jpg"
            alt="Sumi-e pine tree art"
            className="w-full h-full object-contain object-bottom-left opacity-80 dark:opacity-55 mix-blend-multiply dark:mix-blend-screen dark:invert transition-opacity duration-300"
            loading="lazy"
            decoding="async"
            style={{
              maskImage: 'radial-gradient(ellipse 92% 90% at 35% 65%, black 50%, transparent 90%)',
              WebkitMaskImage: 'radial-gradient(ellipse 92% 90% at 35% 65%, black 50%, transparent 90%)',
            }}
          />
        </div>

        {/* Dedicated Sumi-e Bamboo Art rising in the background behind the seal area */}
        <div className="absolute right-4 sm:right-12 lg:right-28 bottom-6 h-4/5 max-h-[700px] w-auto max-w-md hidden sm:block animate-bamboo-sway pointer-events-none z-0">
          <img
            src="./images/sumie-bamboo-bg.jpg"
            alt="Sumi-e bamboo background"
            className="w-full h-full object-contain object-bottom opacity-55 dark:opacity-35 mix-blend-multiply dark:mix-blend-screen dark:invert"
            loading="lazy"
            decoding="async"
            style={{
              maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 85%)',
            }}
          />
        </div>

        {/* Subtle Japanese Washi Dot Texture Layer */}
        <div className="absolute inset-0 bg-transparent washi-pattern opacity-40 dark:opacity-20 pointer-events-none" />

        {/* Soft atmospheric gradient for crisp typography legibility without washing out the pine tree */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-1/2 lg:w-2/5 bg-gradient-to-r from-light-canvas/75 via-light-canvas/30 to-transparent dark:from-dark-canvas/70 dark:via-dark-canvas/25 to-transparent z-10 pointer-events-none" />

        {/* Top atmospheric fade under fixed appbar */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-light-canvas via-light-canvas/70 to-transparent dark:from-dark-canvas dark:via-dark-canvas/70 z-10 pointer-events-none" />

        {/* Bottom atmospheric fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-light-canvas via-light-canvas/90 to-transparent dark:from-dark-canvas dark:via-dark-canvas/90 z-10 pointer-events-none" />

        {/* Subtle Celestial Orbiting Dust Particles */}
        <div className="absolute left-1/4 top-1/3 w-1.5 h-1.5 rounded-full bg-ochre/40 mote-1 blur-[0.5px] z-20" />
        <div className="absolute right-1/3 bottom-28 w-2 h-2 rounded-full bg-ochre/30 mote-2 blur-[0.5px] z-20" />
        <div className="absolute right-1/2 bottom-12 w-1 h-1 rounded-full bg-light-ink-muted/30 dark:bg-[#edeae4]/35 mote-3 blur-[0.5px] z-20" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-5 sm:space-y-6 pt-1 sm:pt-2">
            {/* Display Headline: Bold Editorial Serifs with High Contrast */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-light-ink dark:text-dark-ink leading-[1.14] sm:leading-[1.12] tracking-tight font-bold text-balance">
              {headline}
            </h1>

            {/* Narrative Paragraph */}
            <p className="font-sans text-sm sm:text-base lg:text-lg text-light-ink-muted dark:text-dark-ink-muted max-w-2xl leading-relaxed font-light">
              {tagline}
            </p>

            {/* CTA Action Buttons */}
            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#featured-works"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('home', 'featured-works');
                  }
                }}
                className="btn-bloom group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light font-sans text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
              >
                <span className="sm:hidden">Explore Works</span>
                <span className="hidden sm:inline">Explore Selected Works</span>
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
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-[#2D3039] hover:border-terracotta/40 text-light-ink dark:text-dark-ink font-sans text-xs sm:text-sm font-medium rounded-lg shadow-xs transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
              >
                <span className="sm:hidden">View Resume</span>
                <span className="hidden sm:inline">View Resume & CV</span>
                <FileText className="w-3.5 h-3.5 text-terracotta transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* Tech Capabilities Ribbon: Bold Monospace Categories + Wrap on Mobile so Nothing is Hidden */}
            {capabilityPillars.length > 0 && (
              <div className="pt-2 sm:pt-3 w-full">
                <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-light-ink-subtle dark:text-dark-ink-subtle">
                    CORE DOMAINS · 専門領域
                  </span>
                </div>

                {/* Clean Wrapping Ribbon on all screen sizes */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  {capabilityPillars.map((pillar) => {
                    const tags = parsePillarTags(pillar);

                    return (
                      <div
                        key={pillar.label}
                        className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-light-surface-card/95 dark:bg-dark-surface/95 backdrop-blur-xs border border-light-border/80 dark:border-[#2D3039] hover:border-terracotta/40 transition-colors shadow-2xs"
                      >
                        <span className="font-mono text-[10px] sm:text-[11px] font-bold text-terracotta uppercase tracking-wider shrink-0">
                          {pillar.label}
                        </span>
                        <span className="text-light-ink-subtle/50 dark:text-dark-ink-subtle/50 text-xs shrink-0 font-mono">/</span>
                        {tags.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                            {tags.map((tag) => (
                              <TechTag
                                key={tag}
                                tag={tag}
                                size="sm"
                                className="border-light-border/40 dark:border-dark-border/40 bg-light-surface dark:bg-[#16171D] text-[10px]"
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="font-sans text-[11px] sm:text-xs text-light-ink dark:text-dark-ink font-medium">
                            {pillar.items}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Classical Seal Showcase Box (4 cols) with Double Hairline Frame & Ensō Background */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-between self-stretch pt-2 sm:pt-4 lg:pt-0 relative">
            {/* Authentic Sumi-e Bamboo Art Floating Beside Seal Box with Gentle Sway */}
            <div className="absolute -left-14 -top-12 hidden lg:block pointer-events-none -z-0">
              <BambooArt className="w-40 h-56" sway={true} opacity={0.75} />
            </div>

            <div className="relative z-10 w-full max-w-sm bg-light-surface-card/95 dark:bg-dark-surface/95 backdrop-blur-md border border-light-border dark:border-dark-border classical-card-frame p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm hover:shadow-akari dark:hover:shadow-night-glow hover:border-terracotta/40 dark:hover:border-terracotta/40 flex flex-col items-center text-center transition-all duration-300 group overflow-visible">
              {/* Celestial Ensō Orbital Circle */}
              <EnsoOrbital placement="top-left" size={136} interactive={true} />

              {/* Box Header */}
              <div className="w-full flex items-center justify-between pb-2 mb-3 sm:mb-4 border-b border-light-border/60 dark:border-dark-border/60 relative z-10">
                <span className="font-sans font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase text-[10px] tracking-wider">
                  {hanko?.headerLabel || 'SEAL / 認印'}
                </span>
                <span className="font-sans text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest text-[10px] font-mono">
                  {hanko?.locationArchive || 'PHILADELPHIA, PA'}
                </span>
              </div>

              {/* Hanko Seal Mark with Breathing Pulse */}
              <div className="relative p-1.5 sm:p-2 flex flex-col items-center justify-center animate-seal-breathe z-10">
                <HankoStamp char={hanko?.stampCharacter || '原'} className="w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300 group-hover:scale-105" />
                {hanko?.statusBadge && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-light-surface/90 dark:bg-dark-surface-raised border border-light-border/80 dark:border-dark-border text-[10px] font-mono font-medium text-terracotta tracking-wider uppercase shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
                    <span>{hanko.statusBadge}</span>
                  </div>
                )}
              </div>

              <div className="mt-2 sm:mt-3 text-center relative z-10">
                <h3 className="font-serif text-lg sm:text-xl font-medium text-light-ink dark:text-dark-ink">
                  {displayName}
                </h3>
                <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mt-0.5">
                  {displayRole}
                </p>
              </div>

              {/* Vertical Tategaki Japanese Prose snippet */}
              {hankoLines.length > 0 && (
                <div className="w-full mt-3 sm:mt-4 pt-3 sm:pt-4 bg-light-surface-raised dark:bg-dark-surface-muted border border-light-border/70 dark:border-dark-border/70 rounded-md p-3 sm:p-4 flex flex-col items-center justify-center group-hover:border-terracotta/30 transition-colors duration-300 relative z-10">
                  <div className="flex items-center justify-center gap-5 sm:gap-6 w-full">
                    {hankoLines.map((line, lIdx) => (
                      <div
                        key={lIdx}
                        title={line.tooltip || line.label}
                        className={`writing-vertical-rl font-vertical text-xs sm:text-[13px] tracking-[0.25em] sm:tracking-[0.3em] min-h-[128px] sm:min-h-[148px] leading-relaxed transition-all cursor-default whitespace-nowrap select-none ${
                          lIdx === 1
                            ? 'text-terracotta font-medium hover:scale-105'
                            : 'text-light-ink-muted dark:text-dark-ink-muted opacity-80 hover:opacity-100'
                        }`}
                      >
                        {line.text}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-light-border/40 dark:border-dark-border/40 w-full flex items-center justify-between text-[10px] font-mono tracking-widest text-light-ink-subtle dark:text-dark-ink-subtle uppercase px-1">
                    {hankoLines.map((line, lIdx) => (
                      <span key={lIdx}>{line.label}</span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};
