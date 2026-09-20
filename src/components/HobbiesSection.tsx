import React, { useState } from 'react';
import { CornerBrackets } from './CornerBrackets';
import { EnsoOrbital } from './EnsoOrbital';
import { VerticalMarginWidget, MARGIN_PRESETS } from './VerticalMarginWidget';
import { ImageLightboxModal } from './ImageLightboxModal';
import { useSiteData, HobbyItem } from '../context/SiteDataContext';
import { Sparkles, Image as ImageIcon, ArrowRight, Layers, Maximize2 } from 'lucide-react';
import { ViewMode } from '../App';

const getCategoryStyle = (category?: string, idx: number = 0) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('food') || cat.includes('culinary') || cat.includes('tea') || cat.includes('coffee') || cat.includes('plant')) {
    return 'bg-bamboo/10 dark:bg-bamboo/20 border-bamboo/30 text-bamboo dark:text-[#87A889]';
  }
  if (cat.includes('anime') || cat.includes('visual') || cat.includes('art') || cat.includes('story')) {
    return 'bg-terracotta/10 dark:bg-terracotta/20 border-terracotta/30 text-terracotta dark:text-[#ff7d63]';
  }
  if (cat.includes('craft') || cat.includes('wood') || cat.includes('build') || cat.includes('hardware')) {
    return 'bg-ochre/10 dark:bg-ochre/20 border-ochre/30 text-ochre dark:text-[#E5B88F]';
  }
  if (cat.includes('music') || cat.includes('sound') || cat.includes('photo') || cat.includes('camera')) {
    return 'bg-[#3B4E6B]/10 dark:bg-[#3B4E6B]/25 border-[#3B4E6B]/30 text-[#3B4E6B] dark:text-[#8EA8C3]';
  }
  const fallbacks = [
    'bg-bamboo/10 dark:bg-bamboo/20 border-bamboo/30 text-bamboo dark:text-[#87A889]',
    'bg-terracotta/10 dark:bg-terracotta/20 border-terracotta/30 text-terracotta dark:text-[#ff7d63]',
    'bg-ochre/10 dark:bg-ochre/20 border-ochre/30 text-ochre dark:text-[#E5B88F]',
    'bg-[#3B4E6B]/10 dark:bg-[#3B4E6B]/25 border-[#3B4E6B]/30 text-[#3B4E6B] dark:text-[#8EA8C3]',
  ];
  return fallbacks[idx % fallbacks.length];
};

interface HobbyCardProps {
  hobby: HobbyItem;
  index: number;
}

const HobbyCard: React.FC<HobbyCardProps> = ({ hobby, index }) => {
  const images = Array.isArray(hobby.images) && hobby.images.length > 0 ? hobby.images : [];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const heroImage = images[activeImageIndex] || images[0] || '';

  // Get other images for side thumbnails (all images except the currently active one, up to 4 thumbnails)
  const sideThumbnails = images
    .map((img, idx) => ({ img, idx }))
    .filter((item) => item.idx !== activeImageIndex)
    .slice(0, 4);

  const categoryStyle = getCategoryStyle(hobby.category, index);

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

      {/* Card Header */}
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
            <span className={`font-mono text-[10px] px-2.5 py-1 rounded border uppercase tracking-wider shrink-0 select-none ${categoryStyle}`}>
              {hobby.category}
            </span>
          )}
        </div>

        {/* Discord-style Multi-Image Interactive Gallery (1 Big Picture + Up to 4 Side Pictures) */}
        {images.length > 0 && (
          <div className="relative w-full mb-5">
            {images.length === 1 ? (
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="relative aspect-[16/10] overflow-hidden rounded-lg bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border/60 dark:border-dark-border/60 cursor-zoom-in group/hero"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsLightboxOpen(true);
                  }
                }}
                aria-label={`Open full size view for ${hobby.title}`}
              >
                <img
                  src={images[0]}
                  alt={hobby.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/hero:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono flex items-center gap-1 opacity-0 group-hover/hero:opacity-100 transition-opacity pointer-events-none">
                  <Maximize2 className="w-3 h-3 text-terracotta" />
                  <span>Expand</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:grid md:grid-cols-3 gap-2 md:aspect-[16/10] overflow-hidden rounded-lg bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border/60 dark:border-dark-border/60 p-1.5">
                {/* 1 Big Main Display Photo (Spans 2 columns on desktop, aspect-[16/10] on mobile) */}
                <div
                  onClick={() => setIsLightboxOpen(true)}
                  className="relative aspect-[16/10] md:aspect-auto md:col-span-2 md:h-full overflow-hidden rounded bg-light-surface dark:bg-dark-surface group/hero cursor-zoom-in"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsLightboxOpen(true);
                    }
                  }}
                  aria-label={`Open full size view for ${hobby.title} photo ${activeImageIndex + 1}`}
                >
                  <img
                    src={heroImage}
                    alt={`${hobby.title} main view`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover/hero:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono flex items-center gap-1 opacity-0 group-hover/hero:opacity-100 transition-opacity pointer-events-none">
                    <Maximize2 className="w-3 h-3 text-terracotta" />
                    <span>Expand</span>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-sm border border-light-border/40 dark:border-dark-border/40 text-[10px] font-mono text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider flex items-center gap-1">
                    <ImageIcon className="w-2.5 h-2.5 text-terracotta" />
                    <span>Photo {activeImageIndex + 1} of {images.length}</span>
                  </div>
                </div>

                {/* Up to 4 Side/Bottom Thumbnails (Vertical stack on desktop, horizontal scrollable row on mobile) */}
                <div className="flex md:flex-col gap-1.5 md:h-full overflow-x-auto md:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-0.5 md:pt-0">
                  {sideThumbnails.map(({ img, idx }) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className="relative flex-1 min-w-[68px] h-14 sm:h-16 md:min-w-0 md:h-auto overflow-hidden rounded border border-light-border/60 dark:border-dark-border/60 opacity-80 hover:opacity-100 hover:border-terracotta transition-all duration-200 cursor-pointer group/thumb shrink-0 md:shrink"
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
              <span className="text-[10px] opacity-70">Click main photo to expand · click thumbnails to switch</span>
              <span className="text-[10px] text-terracotta font-medium">{images.length} photos</span>
            </div>
          </div>
        )}

        {/* What I Enjoy / Personal Notes Block */}
        <div className="space-y-2 pt-3 border-t border-light-border/60 dark:border-[#2D3039]/60">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-terracotta" />
            <span className="font-mono text-[10px] font-semibold text-terracotta tracking-wider uppercase">
              WHAT I ENJOY · 趣味の魅力
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

      {/* Interactive Full-Screen Image Lightbox Modal */}
      {images.length > 0 && (
        <ImageLightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={images}
          currentIndex={activeImageIndex}
          onIndexChange={setActiveImageIndex}
          title={hobby.title}
          subtitle={hobby.subtitle}
          kanji={hobby.kanji}
        />
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
          alt="Sumi-e landscape behind hobbies section"
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
                  HOBBIES &amp; INTERESTS · 趣味と日常
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink font-normal tracking-tight">
                Hobbies &amp; Interests{' '}
                <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
                  趣味と日常
                </span>
              </h2>
              <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 font-light leading-relaxed">
                What I enjoy doing when I'm away from the keyboard: watching anime, gaming with friends, fitness, day trading, and discovering great food.
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
                  <span className="sm:hidden">All Hobbies ({hobbies.length})</span>
                  <span className="hidden sm:inline">View All Hobbies ({hobbies.length})</span>
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
      </div>
    </section>
  );
};
