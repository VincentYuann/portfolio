import React from 'react';
import { useSiteData } from '../../../context/SiteDataContext';
import { ArrowRight, Layers } from 'lucide-react';
import { ViewMode } from '../../../App';
import { HobbyCard } from './HobbyCard';
import { SectionHeading } from '../../common/SectionHeading';

interface HobbiesSectionProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
}

export const HobbiesSection: React.FC<HobbiesSectionProps> = ({ onNavigate }) => {
  const { profile } = useSiteData();
  const hobbies = Array.isArray(profile.hobbies) ? profile.hobbies : [];

  if (hobbies.length === 0) return null;

  // Display top 2 hobbies on homepage, hide remaining in hobbies archive page
  const displayedHobbies = hobbies.slice(0, 2);

  const archiveAction = hobbies.length > 2 ? (
    <a
      href="#all-hobbies"
      onClick={(e) => {
        if (onNavigate) {
          e.preventDefault();
          onNavigate('hobbies');
        }
      }}
      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:border-terracotta/50 text-light-ink dark:text-dark-ink font-sans text-xs uppercase tracking-widest shadow-xs transition-all duration-200 cursor-pointer"
    >
      <Layers className="w-3.5 h-3.5 text-terracotta" />
      <span className="sm:hidden">All Hobbies ({hobbies.length})</span>
      <span className="hidden sm:inline">View All Hobbies ({hobbies.length})</span>
      <ArrowRight className="w-3.5 h-3.5 text-terracotta transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  ) : null;

  return (
    <section id="hobbies" className="relative w-full py-16 lg:py-24">
      {/* Architectural Background Chamber for Hobbies */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-light-surface/25 to-transparent dark:via-[#0f1013]/60 pointer-events-none z-0 border-y border-light-border/40 dark:border-dark-border/40" />
      <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-radial-[at_center] from-bamboo/[0.035] dark:from-bamboo/[0.02] to-transparent pointer-events-none z-0" />

      {/* Full-Bleed Atmospheric Background Behind Hobbies Cards */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        <img
          src="./images/hero-sumie-landscape-banner.jpg"
          alt="Sumi-e landscape behind hobbies section"
          className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen dark:invert"
          loading="lazy"
          decoding="async"
          style={{
            maskImage: 'radial-gradient(ellipse 90% 75% at 50% 50%, black 25%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 75% at 50% 50%, black 25%, transparent 85%)',
          }}
        />

        {/* Top & Bottom seamless gradient transitions */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-light-canvas via-light-canvas/80 to-transparent dark:from-dark-canvas dark:via-dark-canvas/80 z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-light-canvas via-light-canvas/80 to-transparent dark:from-dark-canvas dark:via-dark-canvas/80 z-10 pointer-events-none" />
      </div>

      {/* Main Hobbies Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <SectionHeading
          numeral="05 //"
          categoryTag="HOBBIES & INTERESTS · 趣味と日常"
          title="Hobbies & Interests"
          kanjiSubtitle="趣味と日常"
          description="What I enjoy doing when I'm away from the keyboard: watching anime, gaming with friends, fitness, day trading, and discovering great food."
          action={archiveAction}
        />

        {/* 2-Column Responsive Hobbies Grid (Top 2 on Homepage) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {displayedHobbies.map((hobby, idx) => (
            <HobbyCard
              key={hobby.id || idx}
              hobby={hobby}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
