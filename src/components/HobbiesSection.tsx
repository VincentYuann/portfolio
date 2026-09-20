import React, { useState } from 'react';
import { CornerBrackets } from './CornerBrackets';
import { EnsoOrbital } from './EnsoOrbital';
import { VerticalMarginWidget, MARGIN_PRESETS } from './VerticalMarginWidget';
import { useSiteData, HobbyItem } from '../context/SiteDataContext';
import { Sparkles, Image as ImageIcon, ArrowRight, Layers } from 'lucide-react';
import { ViewMode } from '../App';

interface HobbyCardProps {
  hobby: HobbyItem;
  index: number;
}

const HobbyCard: React.FC<HobbyCardProps> = ({ hobby, index }) => {
  const images = Array.isArray(hobby.images) && hobby.images.length > 0 ? hobby.images : [];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const heroImage = images[activeImageIndex] || images[0] || '';

  // Get other images for side thumbnails (all images except the currently active one, up to 4 thumbnails)
  const sideThumbnails = images
    .map((img, idx) => ({ img, idx }))
    .filter((item) => item.idx !== activeImageIndex)
    .slice(0, 4);

  return (
    <article
      className="bg-light-surface-card/95 dark:bg-dark-surface/95 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-7 shadow-sm relative overflow-visible classical-card-frame group hover:border-terracotta/40 dark:hover:border-terracotta/40 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top-Left Celestial Ensō Orbital Circle on Hover */}
      <EnsoOrbital
        placement="top-left"
        size={96}
        hoverOnly={true}
      />
      <CornerBrackets size="md" />

      {/* Card Header (Clean: No red dot) */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-light-border/60 dark:border-[#2D3039]/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold text-terracotta tracking-wider uppercase">
                {`0${index + 1}`} · {hobby.kanji || '工芸'}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-light-ink dark:text-dark-ink font-medium tracking-tight group-hover:text-terracotta transition-colors">
              {hobby.title}
            </h3>
            {hobby.subtitle && (
              <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted mt-0.5 font-light">
                {hobby.subtitle}
              </p>
            )}
          </div>

          {hobby.category && (
            <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border dark:border-dark-border text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-wider shrink-0 select-none">
              {hobby.category}
            </span>
          )}
        </div>

        {/* Discord-style Multi-Image Interactive Gallery (1 Big Picture + Up to 4 Side Pictures) */}
        {images.length > 0 && (
          <div className="relative w-full mb-5">
            {images.length === 1 ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border/60 dark:border-dark-border/60">
                <img
                  src={images[0]}
                  alt={hobby.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-lg bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border/60 dark:border-dark-border/60 p-1.5">
                {/* 1 Big Main Display Photo (Spans 2 columns) */}
                <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded bg-light-surface dark:bg-dark-surface group/hero h-full">
                  <img
                    src={heroImage}
                    alt={`${hobby.title} main view`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover/hero:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-sm border border-light-border/40 dark:border-dark-border/40 text-[10px] font-mono text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider flex items-center gap-1">
                    <ImageIcon className="w-2.5 h-2.5 text-terracotta" />
                    <span>Photo {activeImageIndex + 1} of {images.length}</span>
                  </div>
                </div>

                {/* Up to 4 Side Thumbnails (Spans 1 column) */}
                <div className="col-span-1 grid grid-cols-2 md:grid-cols-1 gap-1.5 h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {sideThumbnails.map(({ img, idx }) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className="relative flex-1 min-h-[44px] sm:min-h-[50px] overflow-hidden rounded border border-light-border/60 dark:border-dark-border/60 opacity-75 hover:opacity-100 hover:border-terracotta transition-all duration-200 cursor-pointer group/thumb"
                      title={`Click to show photo ${idx + 1} in main frame`}
                      aria-label={`Show photo ${idx + 1} for ${hobby.title}`}
                    >
                      <img
                        src={img}
                        alt={`${hobby.title} side thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Hint & Photo Count */}
            <div className="flex items-center justify-between text-[11px] text-light-ink-muted/80 dark:text-dark-ink-muted/80 mt-1.5 px-0.5 font-mono">
              <span className="text-[10px] opacity-70">Click side thumbnails to display in main frame</span>
              <span className="text-[10px] text-terracotta font-medium">{images.length} photos</span>
            </div>
          </div>
        )}

        {/* Why I Do This / Grounded Reflection Block */}
        <div className="space-y-2 pt-3 border-t border-light-border/60 dark:border-[#2D3039]/60">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-terracotta" />
            <span className="font-mono text-[10px] font-semibold text-terracotta tracking-wider uppercase">
              WHY I DO THIS · 余白の理由
            </span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-light">
            {hobby.whyDescription}
          </p>
        </div>
      </div>

      {/* Metadata Tags / Chips */}
      {Array.isArray(hobby.metadata) && hobby.metadata.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-light-border/40 dark:border-dark-border/40 relative z-10">
          {hobby.metadata.map((meta, mIdx) => (
            <div
              key={mIdx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border/60 dark:border-dark-border/60 text-[11px] font-sans text-light-ink-muted dark:text-dark-ink-muted"
            >
              <strong className="font-medium text-light-ink dark:text-dark-ink">{meta.label}:</strong>
              <span>{meta.value}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

interface HobbiesSectionProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
}

export const HobbiesSection: React.FC<HobbiesSectionProps> = ({ onNavigate }) => {
  const { hobbies: rawHobbies } = useSiteData();
  const hobbies = Array.isArray(rawHobbies) ? rawHobbies : [];

  if (hobbies.length === 0) {
    return null;
  }

  // Display top 2 hobbies on homepage, hide remaining in hobbies archive page
  const displayedHobbies = hobbies.slice(0, 2);

  return (
    <section id="hobbies" className="relative w-full overflow-hidden py-16 lg:py-24">
      {/* Full-Bleed Atmospheric Background Behind Hobbies Cards */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        <img
          src="./images/hero-sumie-landscape-banner.jpg"
          alt="Sumi-e landscape behind pursuits section"
          className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen dark:invert"
          style={{
            maskImage: 'radial-gradient(ellipse 90% 75% at 50% 50%, black 25%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 75% at 50% 50%, black 25%, transparent 85%)',
          }}
        />

        {/* Top & Bottom seamless gradient transitions */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-light-canvas via-light-canvas/80 to-transparent dark:from-dark-canvas dark:via-dark-canvas/80 z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-light-canvas via-light-canvas/80 to-transparent dark:from-dark-canvas dark:via-dark-canvas/80 z-10 pointer-events-none" />
      </div>

      {/* Left Empty Margin Japanese Vertical Floating Widget */}
      <VerticalMarginWidget
        side="left"
        top="top-1/2 -translate-y-1/2"
        {...MARGIN_PRESETS.shokuninCraft}
      />

      {/* Right Empty Margin Japanese Vertical Floating Widget */}
      <VerticalMarginWidget
        side="right"
        top="top-1/2 -translate-y-1/2"
        {...MARGIN_PRESETS.akariSimplicity}
      />

      {/* Main Hobbies Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 pb-6 border-b border-light-border/70 dark:border-[#2D3039]/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-serif text-terracotta text-sm">05 //</span>
                <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                  PURSUITS &amp; CRAFTS · 余白と手仕事
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink font-normal tracking-tight">
                Disciplines of Quiet Focus{' '}
                <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
                  余白と技芸
                </span>
              </h2>
              <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 font-light leading-relaxed">
                Bridging the physical and digital. Creative storytelling, interactive mechanics, athletic discipline, and quantitative execution cultivate the patience, tactile rigor, and structural humility essential to resilient software systems.
              </p>
            </div>

            {/* Complete Archive Navigation Action */}
            {hobbies.length > 2 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                <a
                  href="#all-hobbies"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('hobbies');
                    }
                  }}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-light-surface-card dark:bg-[#181920] border border-light-border dark:border-[#2D3039] hover:border-terracotta/50 text-light-ink dark:text-[#EDEAE4] font-sans text-xs uppercase tracking-widest shadow-xs transition-all duration-200 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-terracotta" />
                  <span className="sm:hidden">All Pursuits ({hobbies.length})</span>
                  <span className="hidden sm:inline">View Complete Pursuits Archive ({hobbies.length})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-terracotta transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            )}
          </div>
        </div>

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

        {/* Bottom CTA for Complete Archive */}
        {hobbies.length > 2 && (
          <div className="mt-10 sm:mt-12 text-center">
            <button
              type="button"
              onClick={() => onNavigate?.('hobbies')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface hover:border-terracotta text-light-ink dark:text-dark-ink hover:text-terracotta font-sans text-xs uppercase tracking-widest shadow-2xs transition-all duration-300 group cursor-pointer"
            >
              <span>Explore All Pursuits &amp; Crafts ({hobbies.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-terracotta transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
