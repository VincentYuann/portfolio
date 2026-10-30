import React from 'react';
import { MapPin, Github, Linkedin, Mail } from 'lucide-react';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { Card } from '../../ui/card';
import { useSiteData, AboutMenuItem } from '../../../context/SiteDataContext';
import { SectionDivider } from '../../common/SectionDivider';
import { SectionHeading } from '../../common/SectionHeading';
import { handleImageError } from '../../../lib/constants';

const DEFAULT_ABOUT_MENU: AboutMenuItem[] = [
  {
    id: 'education',
    title: 'Education',
    items: [
      'Drexel University — Math and Computer Science',
      'GPA: 3.52',
    ],
  },
  {
    id: 'about',
    title: 'About',
    items: [
      "Hi, my name is Vincent Yuan. I find coding interesting and fun, which is why I'm studying Computer Science. Coding expands into 2 industries I'm deeply passionate about:",
      'First is Software Engineering: when we code, we need to think about the product for customers and what problems it can solve. Being a SWE also means I build programs to solve everyday problems around me, from idea to implementation—and I find genuine enjoyment in that.',
      'Secondly, I want to get into game development.',
    ],
  },
  {
    id: 'achievement',
    title: "One Achievement I'm Proud Of",
    items: [
      "When I started stepping outside of tutorials, that's when I learned more. Copying tutorials step-by-step only brings me so far. Ever since I had my own idea, I could no longer follow along and had to complete the rest myself. With the help of AI as a personal mentor, I'm able to achieve far more than I was before.",
    ],
  },
  {
    id: 'vision',
    title: '5 Years From Now...',
    items: [
      'I want to be a full-stack engineer working on enterprise projects and solving problems that interact directly with customers. I see myself becoming a person who is really good at designing, connecting application components, and building robust distributed systems.',
    ],
  },
];

export const PhilosophyBento: React.FC = () => {
  const { profile } = useSiteData();

  const photoSrc = profile?.about_image_url || profile?.avatar_url || './images/photo.png';
  const location = profile?.location || 'Philadelphia, PA';
  
  // Use customizable about_menu from CMS/database if present, otherwise fallback
  const menuItems: AboutMenuItem[] = 
    Array.isArray(profile?.about_menu) && profile.about_menu.length > 0
      ? profile.about_menu
      : DEFAULT_ABOUT_MENU;

  return (
    <section id="philosophy" className="relative w-full pt-12 sm:pt-16 pb-24 sm:pb-32 scroll-mt-12 overflow-hidden bg-light-canvas dark:bg-dark-canvas">
      {/* Background ambient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-canvas via-light-surface/30 to-light-canvas dark:from-dark-canvas dark:via-dark-surface-card/30 dark:to-dark-canvas pointer-events-none z-0" />

      {/* Rainbow Section Divider with Chapter Index */}
      <div className="relative z-10 w-full mb-10 sm:mb-14">
        <SectionDivider label="04 // ABOUT ME" shortLabel="04 // ABOUT" />
      </div>

      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="About Me"
          description="Education, engineering background, and future aspirations."
        />

        {/* ── Two-Column Layout: Vertical Rectangle Image on Left + 1 Big Menu Card on Right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Left Column (5 cols): Vertical Rectangle Portrait fitting edge-to-edge into border */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative w-full h-full min-h-[500px] sm:min-h-[580px] rounded-[3px] overflow-hidden border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface-card shadow-sm group">
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
            </div>
          </div>

          {/* Right Column (7 cols): Editorial Menu inside 1 Big Border */}
          <div className="lg:col-span-7 flex flex-col">
            <Card className="p-6 sm:p-8 lg:p-9 flex flex-col justify-between h-full relative overflow-visible group shadow-sm border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface-card">
              {/* Ensō brush placed on top-left, subtle and atmospheric */}
              <EnsoOrbital placement="top-left" size={90} hoverOnly={true} />

              <div className="space-y-6 sm:space-y-7">
                
                {/* ── Editorial Menu Stack (Customly Configurable) ── */}
                <div className="space-y-5 sm:space-y-6">
                  {menuItems.map((section, idx) => {
                    const numString = String(idx + 1).padStart(2, '0');

                    return (
                      <div
                        key={section.id || idx}
                        className="pb-5 sm:pb-6 border-b border-light-border/50 dark:border-dark-border/50 last:border-b-0 last:pb-0"
                      >
                        {/* Section Menu Header */}
                        <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
                          <span className="font-mono text-xs font-semibold text-terracotta dark:text-ochre">
                            {numString} //
                          </span>
                          <h3 className="font-serif text-lg sm:text-xl text-light-ink dark:text-dark-ink font-medium tracking-tight">
                            {section.title}
                          </h3>
                        </div>

                        {/* Sub Contents */}
                        <div className="space-y-2 pl-6 sm:pl-7 border-l-2 border-light-border/70 dark:border-dark-border/70 ml-1.5">
                          {section.items.map((itemText, iIdx) => (
                            <div key={iIdx} className="flex items-start gap-2 text-xs sm:text-sm text-light-ink/90 dark:text-dark-ink/90 leading-relaxed font-sans font-normal">
                              <span className="text-terracotta dark:text-ochre font-mono select-none mt-0.5 text-xs">
                                —
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

                {/* ── Bottom Credentials & Social Contacts Bar ── */}
                <div className="pt-4 mt-2 border-t border-light-border/60 dark:border-dark-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-light-ink-muted dark:text-dark-ink-muted font-sans">
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

              </div>
            </Card>
          </div>

        </div>

      </div>
    </section>
  );
};
