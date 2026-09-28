import React from 'react';
import { useSiteData } from '../../../context/SiteDataContext';
import { ArrowRight, Layers } from 'lucide-react';
import { ViewMode } from '../../../App';
import { HobbyCard } from './HobbyCard';
import { SectionHeading } from '../../common/SectionHeading';
import { SectionSideBackdrop } from '../../common/SectionSideBackdrop';
import { SectionDivider } from '../../common/SectionDivider';
import { AkariLanternDecorator } from '../../common/AkariLanternDecorator';

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
      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-[2px] bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:border-terracotta/50 dark:hover:border-ochre/50 text-light-ink dark:text-dark-ink font-sans text-xs uppercase tracking-widest shadow-xs transition-all duration-200 cursor-pointer"
    >
      <Layers className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />
      <span className="sm:hidden">All Hobbies ({hobbies.length})</span>
      <span className="hidden sm:inline">View All Hobbies ({hobbies.length})</span>
      <ArrowRight className="w-3.5 h-3.5 text-terracotta dark:text-ochre transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  ) : null;

  return (
    <section
      id="hobbies"
      className="section-chamber-alt relative w-full pt-12 sm:pt-16 pb-28 lg:pb-36 scroll-mt-12 overflow-hidden bg-[#FAF5EB] dark:bg-[#1E1F24]"
    >
      {/* Architectural Background Chamber for Hobbies */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-light-surface/20 to-transparent dark:via-dark-surface-card/40 pointer-events-none z-0" />
      <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-[28rem] max-w-full h-[28rem] bg-radial-[at_center] from-bamboo/[0.035] dark:from-bamboo/[0.02] to-transparent pointer-events-none z-0" />

      {/* 16:9 Linen Texture Ground & Asymmetric Sumi-e Pine Tree on Right */}
      <SectionSideBackdrop
        textureDay="./background/white linen.jpg"
        textureNight="./background/black linen.jpg"
        painting="./decorators/tree.jpg"
        paintingAlt="Sumi-e pine tree ink wash painting"
        placement="right"
        artworkWidth="w-full lg:w-[50%]"
        maskCenter="at 75% 50%"
        textureOpacityDay={0.65}
        textureOpacityNight={0.45}
        paintingOpacityDay={0.35}
        paintingOpacityNight={0.14}
      />

      {/* Ambient Elliptical Akari Lantern on Left (Asymmetry Balance against right Pine Tree) */}
      <AkariLanternDecorator
        variant="hanging-elliptical"
        className="top-2 sm:top-6 left-2 sm:left-6 lg:left-10 xl:left-14"
        sizeClassName="w-32 sm:w-40 lg:w-48 xl:w-52"
        glowSizeClassName="w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96"
      />

      {/* Section Divider on Top of Section */}
      <div className="relative z-10 w-full mb-10 sm:mb-14">
        <SectionDivider label="HOBBIES & INTERESTS · 趣味と日常" shortLabel="HOBBIES · 趣味" />
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
