import React from 'react';
import { MapPin, Github, Linkedin, Mail } from 'lucide-react';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { Card } from '../../ui/card';
import { useSiteData, AboutMenuItem } from '../../../context/SiteDataContext';
import { SectionDivider } from '../../common/SectionDivider';
import { SectionHeading } from '../../common/SectionHeading';
import { handleImageError, DEFAULT_ABOUT_MENU } from '../../../lib/constants';

/**
 * AboutMeSection
 * Pure, distilled editorial menu layout.
 * Equal per-course balance, zero nested cards, no redundant headers or complex string filtering.
 */
export const AboutMeSection: React.FC = () => {
  const { profile } = useSiteData();

  const photoSrc = profile?.about_image_url || profile?.avatar_url || './images/photo.png';
  const location = profile?.location || 'Philadelphia, PA';

  // Customizable about_menu from CMS/database if present, otherwise centralized default
  const menuItems: AboutMenuItem[] =
    Array.isArray(profile?.about_menu) && profile.about_menu.length > 0
      ? profile.about_menu
      : DEFAULT_ABOUT_MENU;

  return (
    <section
      id="about"
      className="relative w-full pt-12 sm:pt-16 pb-24 sm:pb-32 scroll-mt-12 overflow-hidden bg-light-canvas dark:bg-dark-canvas"
    >
      {/* Backward-compatibility anchor for legacy #philosophy hash links */}
      <span id="philosophy" className="sr-only" aria-hidden="true" />

      {/* Background ambient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-canvas via-light-surface/30 to-light-canvas dark:from-dark-canvas dark:via-dark-surface-card/30 dark:to-dark-canvas pointer-events-none z-0" />

      {/* Rainbow Section Divider with Chapter Index */}
      <div className="relative z-10 w-full mb-10 sm:mb-14">
        <SectionDivider label="04 // ABOUT ME · 自己紹介" shortLabel="04 // ABOUT · 自己紹介" />
      </div>

      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title={
            <>
              About{' '}
              <span className="font-serif font-black italic tracking-tight text-terracotta dark:text-ochre relative inline-block underline decoration-terracotta/40 dark:decoration-ochre/40 decoration-2 underline-offset-8">
                Me
              </span>
            </>
          }
          kanjiSubtitle="自己紹介"
          description={
            profile?.about_description ||
            'Education, engineering background, and future aspirations.'
          }
        />

        {/* ── Two-Column Layout: Vertical Portrait on Left + Editorial Tasting Menu Card on Right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Left Column (5 cols): Vertical Portrait Plaque */}
          <div className="lg:col-span-5 flex flex-col">
            <Card variant="craft" className="relative w-full h-full min-h-[500px] sm:min-h-[580px] overflow-hidden p-0 group">
              <img
                src={photoSrc}
                alt={profile?.name || 'Vincent Yuan'}
                className="w-full h-full object-cover object-top sm:object-center group-hover:scale-[1.015] transition-transform duration-500"
                loading="lazy"
                onError={handleImageError()}
              />
              {/* Identity plaque at base of vertical rectangle */}
              <div className="absolute inset-x-0 bottom-0 pt-20 pb-5 px-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none flex flex-col justify-end text-white">
                <span className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-white">
                  {profile?.name || 'Vincent Yuan'}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-ochre/90 mt-0.5">
                  {profile?.role || 'Full-Stack Software Engineer'}
                </span>
              </div>
            </Card>
          </div>

          {/* Right Column (7 cols): Editorial Tasting Menu Card */}
          <div className="lg:col-span-7 flex flex-col">
            <Card variant="craft" className="p-6 sm:p-8 lg:p-9 flex flex-col justify-between h-full relative overflow-visible group">
              {/* Ensō brush placed on top-left vertex */}
              <EnsoOrbital placement="top-left" size={84} hoverOnly={false} />

              {/* ── Four Balanced Courses (Equal Structure & Rhythm) ── */}
              <div className="space-y-6 sm:space-y-7 my-auto">
                {menuItems.map((course, idx) => {
                  const courseNumber = String(idx + 1).padStart(2, '0');

                  return (
                    <div
                      key={course.id || idx}
                      className="pb-5 sm:pb-6 border-b border-light-border/40 dark:border-dark-border/40 last:border-b-0 last:pb-0"
                    >
                      {/* Course Header: Clean course number + serif title with subtle dotted leader */}
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs sm:text-sm font-semibold text-terracotta dark:text-ochre tracking-wider">
                            #{courseNumber}
                          </span>
                          <span className="text-light-border-strong dark:text-dark-border select-none text-xs">
                            /
                          </span>
                          <h4 className="font-serif text-base sm:text-lg text-light-ink dark:text-dark-ink font-semibold tracking-tight">
                            {course.title}
                          </h4>
                        </div>

                        {/* Subtle Dotted Leader Line */}
                        <div className="hidden sm:block flex-1 border-b border-dotted border-light-border/60 dark:border-dark-border/50 mx-2 select-none" />
                      </div>

                      {/* Ingredients / Narrative Prose Items */}
                      <div className="space-y-2 pl-5 sm:pl-6 border-l border-light-border/60 dark:border-dark-border/60 ml-1.5">
                        {course.items.map((itemText, iIdx) => (
                          <div
                            key={iIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-light-ink/90 dark:text-dark-ink/90 leading-relaxed font-sans font-normal"
                          >
                            <span className="text-terracotta/80 dark:text-ochre/80 select-none mt-1 text-xs shrink-0">
                              ✦
                            </span>
                            <span className="flex-1 whitespace-pre-line">
                              {itemText}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Bottom Credentials & Social Contacts Bar (Bill Footer) ── */}
              <div className="pt-4 mt-6 border-t border-light-border/80 dark:border-dark-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-light-ink-muted dark:text-dark-ink-muted font-sans text-xs sm:text-sm">
                  <MapPin className="w-3.5 h-3.5 text-terracotta dark:text-ochre shrink-0" />
                  <span>{location}</span>
                </div>

                {/* Profile Links */}
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

            </Card>
          </div>

        </div>

      </div>
    </section>
  );
};
