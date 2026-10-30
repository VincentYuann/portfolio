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
    fallbackTitle: 'Radical Simplicity',
    fallbackDesc: 'Clean system boundaries, deterministic state machines, and low-latency frontend-to-backend flows.',
  },
  {
    icon: Feather,
    num: '02',
    label: 'LEVERAGE',
    fallbackTitle: 'Smart Tooling',
    fallbackDesc: 'Automating repetitive chores with agentic systems to focus deep energy on core architecture.',
  },
  {
    icon: ShieldCheck,
    num: '03',
    label: 'CRAFT',
    fallbackTitle: 'Real-World Utility',
    fallbackDesc: 'Software is measured by whether it works dependably for real users and stands the test of time.',
  },
];

export const PhilosophyBento: React.FC = () => {
  const { profile, pillars: rawPillars } = useSiteData();
  const displayPillars = Array.isArray(rawPillars) && rawPillars.length > 0 ? rawPillars : [];

  const photoSrc = profile?.about_image_url || profile?.avatar_url || './images/sumi-os-workspace.webp';
  const education = profile?.education || 'Drexel University 2029 · CS & Math';
  const location = profile?.location || 'Philadelphia, PA';
  const careerObjective = profile?.career_objective || 'Full-Stack Software Engineer & Applied AI Developer specializing in scalable web systems and modern agentic architectures.';
  const aboutBio = profile?.about_me || 'I build modern web platforms and applied AI applications with a focus on clean architecture, fast interfaces, and resilient state. My journey in technology started with web development and real-time game systems, which grounded me in event-driven architecture and latency optimization. Years in customer-facing roles taught me deep user empathy?translating complex technical systems into intuitive, dependable software.';

  return (
    <section id="philosophy" className="relative w-full pt-12 sm:pt-16 pb-24 sm:pb-32 scroll-mt-12 overflow-hidden bg-light-canvas dark:bg-dark-canvas">
      {/* Background ambient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-canvas via-light-surface/30 to-light-canvas dark:from-dark-canvas dark:via-dark-surface-card/30 dark:to-dark-canvas pointer-events-none z-0" />

      {/* Rainbow Section Divider with Chapter Index */}
      <div className="relative z-10 w-full mb-10 sm:mb-14">
        <SectionDivider label="04 // ABOUT ME · 自己紹介" shortLabel="04 // ABOUT · 自己紹介" />
      </div>

      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="About Me"
          kanjiSubtitle="自己紹介"
          description="Career objective, engineering background, and core standards."
        />

        {/* ?? Two-Column Layout: Vertical Rectangle Image on Left + 1 Big Border on Right ?? */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Left Column (5 cols): Vertical Rectangle Portrait fitting into border */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative w-full h-full min-h-[480px] sm:min-h-[560px] rounded-[3px] overflow-hidden border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface-card shadow-sm group">
              <img
                src={photoSrc}
                alt={profile?.name || 'Vincent Yuan'}
                className="w-full h-full object-cover object-top sm:object-center group-hover:scale-[1.015] transition-transform duration-500"
                loading="lazy"
                onError={handleImageError()}
              />
              {/* Subtle identity plaque at the base of the portrait */}
              <div className="absolute inset-x-0 bottom-0 pt-20 pb-5 px-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none flex flex-col justify-end text-white">
                <span className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-white">
                  {profile?.name || 'Vincent Yuan'}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-ochre/90 mt-0.5">
                  {profile?.role || 'Full-Stack Software Engineer'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Everything else inside 1 big border */}
          <div className="lg:col-span-7 flex flex-col">
            <Card className="p-6 sm:p-8 lg:p-9 flex flex-col justify-between h-full relative overflow-hidden group shadow-sm border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface-card">
              {/* Ens? brushstroke placed inside without clipping */}
              <EnsoOrbital placement="top-right" size={90} hoverOnly={true} />

              <div className="space-y-6 sm:space-y-7">
                {/* 1. Career Objective */}
                <div>
                  <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-light-border/60 dark:border-dark-border/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta dark:bg-ochre" />
                    <span className="font-mono text-2xs uppercase tracking-widest font-semibold text-terracotta dark:text-ochre">
                      Career Objective
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-[1.65rem] text-light-ink dark:text-dark-ink font-normal leading-snug">
                    {careerObjective}
                  </h3>
                </div>

                {/* 2. Background & Biography */}
                <div>
                  <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-light-border/60 dark:border-dark-border/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-light-ink-muted dark:bg-dark-ink-muted" />
                    <span className="font-mono text-2xs uppercase tracking-widest font-semibold text-light-ink-muted dark:text-dark-ink-muted">
                      Background &amp; Philosophy
                    </span>
                  </div>
                  <p className="font-sans text-sm sm:text-base text-light-ink/90 dark:text-dark-ink/90 leading-relaxed font-normal whitespace-pre-line">
                    {aboutBio}
                  </p>
                </div>

                {/* 3. Credentials & Social Links Toolbar */}
                <div className="pt-2 pb-1 border-t border-b border-light-border/60 dark:border-dark-border/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-terracotta dark:text-ochre shrink-0" />
                      <span className="font-medium text-light-ink dark:text-dark-ink">{education}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-terracotta dark:text-ochre shrink-0" />
                      <span>{location}</span>
                    </div>
                  </div>

                  {/* Direct Profile Links */}
                  <div className="flex items-center gap-2">
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
                </div>

                {/* 4. Core Engineering Principles (Seamlessly Integrated inside this 1 Big Border) */}
                <div className="pt-2">
                  <div className="flex items-center justify-between pb-2 mb-3">
                    <span className="font-mono text-2xs uppercase tracking-widest font-semibold text-light-ink-muted dark:text-dark-ink-muted">
                      Core Engineering Standards
                    </span>
                    <span className="font-mono text-2xs text-light-ink-muted/70 dark:text-dark-ink-muted/70">
                      03 Principles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                    {PILLAR_CONFIGS.map((config, idx) => {
                      const livePillar = displayPillars[idx];
                      const Icon = config.icon;
                      const title = livePillar?.title || config.fallbackTitle;
                      const desc = livePillar?.description || config.fallbackDesc;
                      const romaji = livePillar?.romaji;
                      const kanji = livePillar?.kanji;

                      return (
                        <div
                          key={idx}
                          className="p-3.5 sm:p-4 rounded-[2px] bg-light-surface/70 dark:bg-dark-canvas/50 border border-light-border/70 dark:border-dark-border/70 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-light-border/40 dark:border-dark-border/40">
                              <span className="font-mono text-xs font-semibold text-terracotta dark:text-ochre">
                                #{config.num}
                              </span>
                              <Icon className="w-3.5 h-3.5 text-light-ink-muted dark:text-dark-ink-muted" />
                            </div>
                            <h4 className="font-serif text-sm sm:text-base text-light-ink dark:text-dark-ink font-medium tracking-tight">
                              {title}
                              {kanji && (
                                <span className="ml-1.5 font-light text-xs text-light-ink-muted dark:text-dark-ink-muted select-none">
                                  {kanji}
                                </span>
                              )}
                            </h4>
                            {romaji && (
                              <p className="font-mono text-3xs text-terracotta dark:text-ochre uppercase tracking-wider mt-0.5">
                                {romaji}
                              </p>
                            )}
                            <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed mt-2">
                              {desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </Card>
          </div>

        </div>

      </div>
    </section>
  );
};
