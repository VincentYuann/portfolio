import React from 'react';
import { MapPin, Github, Linkedin, Mail, Sparkles, Award } from 'lucide-react';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { Card } from '../../ui/card';
import { useSiteData, AboutMenuItem } from '../../../context/SiteDataContext';
import { SectionDivider } from '../../common/SectionDivider';
import { SectionHeading } from '../../common/SectionHeading';
import { handleImageError, DEFAULT_ABOUT_MENU } from '../../../lib/constants';

/**
 * AboutMeSection
 * Editorial "Tasting Menu" layout inspired by classic luncheonette and fine bistro bill of fare.
 * High cohesion: built with standard Card primitives, CardMetaStrip token conventions, and Wabi-Sabi styling.
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

  // Extract education/special highlight if present to render as a "Special Selection"
  const educationSection = menuItems.find(
    (item) => item.id === 'education' || item.title.toLowerCase().includes('education')
  );
  const remainingCourses = menuItems.filter((item) => item !== educationSection);

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

          {/* Right Column (7 cols): Editorial Bill of Fare / Tasting Menu */}
          <div className="lg:col-span-7 flex flex-col">
            <Card variant="craft" className="p-6 sm:p-8 lg:p-9 flex flex-col justify-between h-full relative overflow-visible group">
              {/* Ensō brush placed on top-left vertex */}
              <EnsoOrbital placement="top-left" size={90} hoverOnly={false} />

              <div className="space-y-6 sm:space-y-7">
                
                {/* ── Menu Masthead (Authentic Retro/Bistro Header) ── */}
                <div className="border-b-2 border-light-border/80 dark:border-dark-border/80 pb-4">
                  {/* Masthead Eyebrow */}
                  <div className="flex items-center justify-between text-2xs font-mono uppercase tracking-widest text-light-ink-muted dark:text-dark-ink-muted mb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-terracotta dark:text-ochre" />
                      TABLE D'HÔTE // VOL. 04
                    </span>
                    <span>
                      {profile?.education
                        ? `${profile.education.split('·')[0].trim().toUpperCase()} · EST. 2024`
                        : 'EST. 2024 · DREXEL UNIV'}
                    </span>
                  </div>

                  {/* Main Menu Title Frame */}
                  <div className="border-y border-dashed border-light-border dark:border-dark-border py-2.5 my-1.5 text-center">
                    <h3 className="font-serif text-2xl sm:text-3xl text-light-ink dark:text-dark-ink font-semibold tracking-tight uppercase">
                      Profile & Trajectory Menu
                    </h3>
                    <p className="font-mono text-2xs text-terracotta dark:text-ochre tracking-wider mt-0.5 uppercase">
                      自己紹介 · A curated tasting of craft, milestone & horizon
                    </p>
                  </div>
                </div>

                {/* ── Boxed "Chef's Selection / Special" (Education & Academic Foundation) ── */}
                {educationSection && (
                  <div className="rounded-[3px] border-2 border-light-border dark:border-dark-border bg-light-surface/60 dark:bg-dark-surface/50 p-4 sm:p-5 relative shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] font-mono text-2xs font-bold uppercase tracking-wider bg-terracotta/10 text-terracotta dark:bg-ochre/15 dark:text-ochre border border-terracotta/20 dark:border-ochre/25">
                          <Award className="w-3 h-3" />
                          HOUSE SPECIAL // #01
                        </span>
                        <h4 className="font-serif text-base sm:text-lg font-bold text-light-ink dark:text-dark-ink">
                          {educationSection.title}
                        </h4>
                      </div>
                      <span className="font-mono text-2xs text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                        FOUNDATION
                      </span>
                    </div>

                    <div className="space-y-1.5 pl-3 border-l-2 border-terracotta/50 dark:border-ochre/50 mt-2.5">
                      {educationSection.items.map((line, iIdx) => (
                        <p
                          key={iIdx}
                          className="font-sans text-xs sm:text-sm text-light-ink/90 dark:text-dark-ink/90 leading-relaxed"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Main Menu Courses Stack ── */}
                <div className="space-y-5 sm:space-y-6">
                  {remainingCourses.map((course, idx) => {
                    const courseNumber = String((educationSection ? idx + 2 : idx + 1)).padStart(2, '0');

                    return (
                      <div
                        key={course.id || idx}
                        className="pb-5 sm:pb-6 border-b border-light-border/50 dark:border-dark-border/50 last:border-b-0 last:pb-0"
                      >
                        {/* Course Header with Dotted Leader to Tag */}
                        <div className="flex items-center justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2.5">
                            {/* Circular / Rounded Course Badge like Menu Specials */}
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full font-mono text-2xs font-bold bg-light-surface-raised dark:bg-dark-surface border border-light-border dark:border-dark-border text-terracotta dark:text-ochre shrink-0">
                              #{courseNumber}
                            </span>
                            <h4 className="font-serif text-lg sm:text-xl text-light-ink dark:text-dark-ink font-medium tracking-tight">
                              {course.title}
                            </h4>
                          </div>

                          {/* Decorative Dotted Leader Line */}
                          <div className="hidden sm:block flex-1 border-b border-dotted border-light-border dark:border-dark-border/60 mx-2 select-none" />

                          {/* Course Category Pill */}
                          <span className="font-mono text-2xs text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider shrink-0">
                            COURSE {courseNumber}
                          </span>
                        </div>

                        {/* Ingredients / Narrative Prose Items */}
                        <div className="space-y-2 pl-7 sm:pl-8 border-l border-light-border/60 dark:border-dark-border/60 ml-3">
                          {course.items.map((itemText, iIdx) => (
                            <div
                              key={iIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-light-ink/90 dark:text-dark-ink/90 leading-relaxed font-sans font-normal"
                            >
                              <span className="text-terracotta dark:text-ochre font-mono select-none mt-1 text-2xs">
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
                <div className="pt-4 mt-2 border-t-2 border-light-border/70 dark:border-dark-border/70 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-light-ink-muted dark:text-dark-ink-muted font-sans">
                    <MapPin className="w-3.5 h-3.5 text-terracotta dark:text-ochre shrink-0" />
                    <span className="font-mono text-2xs uppercase tracking-wider">{location}</span>
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

              </div>
            </Card>
          </div>

        </div>

      </div>
    </section>
  );
};
