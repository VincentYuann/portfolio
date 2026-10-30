import React from 'react';
import { Compass, Feather, ShieldCheck, MapPin, GraduationCap, Github, Linkedin, Mail } from 'lucide-react';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { Card } from '../../ui/card';
import { useSiteData } from '../../../context/SiteDataContext';
import { SectionDivider } from '../../common/SectionDivider';
import { SectionHeading } from '../../common/SectionHeading';
import { handleImageError } from '../../../lib/constants';

const PILLAR_CONFIGS = [
  {
    icon: Compass,
    num: '01',
    label: 'ARCH',
    fallbackTitle: 'Intentional Architecture',
    fallbackDesc: 'Clean system boundaries, deterministic state machines, and low-latency frontend-to-backend data flows.',
  },
  {
    icon: Feather,
    num: '02',
    label: 'RESILIENCE',
    fallbackTitle: 'Resilient by Design',
    fallbackDesc: 'Systems that fail gracefully with robust error handling, reliable fallbacks, and honest user feedback.',
  },
  {
    icon: ShieldCheck,
    num: '03',
    label: 'CRAFT',
    fallbackTitle: 'Code Integrity',
    fallbackDesc: 'Rigorous test coverage, type-safe API contracts, and clean, readable code that teammates can easily maintain.',
  },
];

export const PhilosophyBento: React.FC = () => {
  const { profile, pillars: rawPillars } = useSiteData();
  const displayPillars = Array.isArray(rawPillars) && rawPillars.length > 0 ? rawPillars : [];

  const photoSrc = profile?.about_image_url || profile?.avatar_url || './images/sumi-os-workspace.webp';
  const education = profile?.education || 'Drexel University 2029 · CS & Math';
  const location = profile?.location || 'Philadelphia, PA';
  const careerObjective = profile?.career_objective || 'Full-Stack Software Engineer & Applied AI Developer specializing in scalable web systems and modern agentic architectures.';
  const aboutBio = profile?.about_me || 'I build modern web platforms and applied AI applications with a focus on clean architecture, fast interfaces, and resilient state. My journey in technology started with web development and real-time game systems, which grounded me in event-driven architecture and latency optimization. Years in customer-facing roles taught me deep user empathy—translating complex technical systems into intuitive, dependable software.';

  return (
    <section id="philosophy" className="relative w-full pt-12 sm:pt-16 pb-24 sm:pb-32 scroll-mt-12 overflow-hidden bg-light-canvas dark:bg-dark-canvas">
      {/* Background ambient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-canvas via-light-surface/30 to-light-canvas dark:from-dark-canvas dark:via-dark-surface-card/30 dark:to-dark-canvas pointer-events-none z-0" />

      {/* Rainbow Section Divider */}
      <div className="relative z-10 w-full mb-10 sm:mb-14">
        <SectionDivider label="CHAPTER IV · ABOUT" shortLabel="ABOUT" />
      </div>

      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          numeral="04 //"
          title="About Me"
          kanjiSubtitle="自己紹介"
          description="Career objective, engineering background, and core architectural principles."
        />

        {/* ── Top Grid: Portrait Snapshot & Personal Narrative ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-10 sm:mb-12">
          
          {/* Left Column (5 cols): Photo & Personal Details */}
          <Card className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-sm">
            <EnsoOrbital placement="top-left" size={100} hoverOnly={true} />
            
            <div>
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-[3px] overflow-hidden bg-light-surface-muted dark:bg-dark-canvas border border-light-border dark:border-dark-border mb-6">
                <img
                  src={photoSrc}
                  alt={profile?.name || 'Vincent Yuan'}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                  onError={handleImageError()}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-mono">
                  <span className="font-semibold tracking-wider">{profile?.name || 'Vincent Yuan'}</span>
                  <span className="opacity-90">{profile?.role || 'Software Engineer'}</span>
                </div>
              </div>

              {/* Badges / Credentials */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted">
                  <GraduationCap className="w-4 h-4 text-terracotta dark:text-ochre shrink-0" />
                  <span className="font-medium text-light-ink dark:text-dark-ink">{education}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted">
                  <MapPin className="w-4 h-4 text-terracotta dark:text-ochre shrink-0" />
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Social Links Toolbar */}
            <div className="pt-6 mt-6 border-t border-light-border/60 dark:border-dark-border/60 flex items-center gap-2.5">
              {profile?.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface hover:border-terracotta dark:hover:border-ochre text-xs font-mono font-medium transition-colors cursor-pointer"
                  title="GitHub Profile"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {profile?.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface hover:border-terracotta dark:hover:border-ochre text-xs font-mono font-medium transition-colors cursor-pointer"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface hover:border-terracotta dark:hover:border-ochre text-xs font-mono font-medium transition-colors cursor-pointer"
                  title="Send Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </Card>

          {/* Right Column (7 cols): Objective & Narrative Bio */}
          <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8 justify-between">
            {/* Career Objective Card */}
            <Card className="p-6 sm:p-8 relative overflow-hidden group shadow-sm flex-1">
              <EnsoOrbital placement="top-right" size={90} hoverOnly={true} />
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-light-border/60 dark:border-dark-border/60">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta dark:text-ochre" />
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-terracotta dark:text-ochre">
                  Career Objective
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-light-ink dark:text-dark-ink font-normal leading-snug">
                {careerObjective}
              </h3>
            </Card>

            {/* About Narrative Bio Card */}
            <Card className="p-6 sm:p-8 relative overflow-hidden group shadow-sm flex-1">
              <EnsoOrbital placement="top-left" size={90} hoverOnly={true} />
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-light-border/60 dark:border-dark-border/60">
                <span className="w-1.5 h-1.5 rounded-full bg-light-ink-muted dark:bg-dark-ink-muted" />
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-light-ink-muted dark:text-dark-ink-muted">
                  Background &amp; Philosophy
                </span>
              </div>
              <p className="font-sans text-sm sm:text-base text-light-ink/90 dark:text-dark-ink/90 leading-relaxed font-normal whitespace-pre-line">
                {aboutBio}
              </p>
            </Card>
          </div>
        </div>

        {/* ── Bottom Grid: Core Engineering Principles ── */}
        <div>
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-light-border/60 dark:border-dark-border/60">
            <span className="font-mono text-xs uppercase tracking-widest font-semibold text-light-ink-muted dark:text-dark-ink-muted">
              Core Engineering Principles
            </span>
            <span className="font-mono text-xs text-light-ink-muted/70 dark:text-dark-ink-muted/70">
              03 Standards
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {PILLAR_CONFIGS.map((config, idx) => {
              const livePillar = displayPillars[idx];
              const Icon = config.icon;
              const title = livePillar?.title || config.fallbackTitle;
              const desc = livePillar?.description || config.fallbackDesc;
              const romaji = livePillar?.romaji;
              const kanji = livePillar?.kanji;

              return (
                <Card
                  key={idx}
                  className="p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 shadow-sm"
                >
                  <EnsoOrbital placement="top-left" size={90} hoverOnly={true} />
                  
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-light-border/50 dark:border-dark-border/50 mb-4">
                      <span className="font-mono text-xs font-semibold text-terracotta dark:text-ochre">
                        #{config.num}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-light-surface dark:bg-dark-surface-raised border border-light-border dark:border-dark-border flex items-center justify-center text-light-ink-muted dark:text-dark-ink-muted group-hover:text-terracotta dark:group-hover:text-ochre transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-serif text-lg sm:text-xl text-light-ink dark:text-dark-ink font-normal tracking-tight group-hover:text-terracotta dark:group-hover:text-ochre transition-colors">
                      {title}
                      {kanji && (
                        <span className="ml-2 font-light text-base text-light-ink-muted dark:text-dark-ink-muted select-none">
                          {kanji}
                        </span>
                      )}
                    </h4>

                    {romaji && (
                      <p className="font-mono text-xs text-terracotta dark:text-ochre uppercase tracking-wider mt-0.5">
                        {romaji}
                      </p>
                    )}

                    {/* Description */}
                    <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted leading-relaxed mt-3">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-5 border-t border-light-border/40 dark:border-dark-border/40 flex items-center justify-between text-2xs font-mono text-light-ink-subtle dark:text-dark-ink-subtle">
                    <span>STANDARD</span>
                    <span>{config.label}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
