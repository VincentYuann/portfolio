import React, { useState } from 'react';
import { ArrowLeft, Search, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useSiteData, HobbyItem } from '../context/SiteDataContext';
import { EnsoOrbital } from './EnsoOrbital';
import { CornerBrackets } from './CornerBrackets';
import { VerticalMarginWidget, MARGIN_PRESETS } from './VerticalMarginWidget';
import { ViewMode } from '../App';

interface HobbiesPageProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
}

export const HobbyCardItem: React.FC<{ hobby: HobbyItem; index: number }> = ({ hobby, index }) => {
  const images = Array.isArray(hobby.images) && hobby.images.length > 0 ? hobby.images : [];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const heroImage = images[activeImageIndex] || images[0] || '';

  // Get other images for side thumbnails (all images except the currently active one, up to 4 thumbnails)
  const sideThumbnails = images.map((img, idx) => ({ img, idx })).filter((item) => item.idx !== activeImageIndex).slice(0, 4);

  return (
    <article className="bg-light-surface-card/95 dark:bg-dark-surface/95 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-7 shadow-sm relative overflow-visible classical-card-frame group hover:border-terracotta/40 dark:hover:border-terracotta/40 transition-all duration-300 flex flex-col justify-between">
      {/* Top-Left Celestial Ensō Orbital Circle on Hover */}
      <EnsoOrbital placement="top-left" size={96} hoverOnly={true} />
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
              <div className="flex flex-col md:grid md:grid-cols-3 gap-2 md:aspect-[16/10] overflow-hidden rounded-lg bg-light-surface-raised dark:bg-dark-surface-raised border border-light-border/60 dark:border-dark-border/60 p-1.5">
                {/* 1 Big Main Display Photo (Spans 2 columns on desktop, aspect-[16/10] on mobile) */}
                <div className="relative aspect-[16/10] md:aspect-auto md:col-span-2 md:h-full overflow-hidden rounded bg-light-surface dark:bg-dark-surface group/hero">
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
              <span className="text-[10px] opacity-70">Click side thumbnails to display in main frame</span>
              <span className="text-[10px] text-terracotta font-medium">{images.length} photos</span>
            </div>
          </div>
        )}

        {/* Why I Do This Narrative Reflection Block */}
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

      {/* Metadata Details & Specs */}
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

export const HobbiesPage: React.FC<HobbiesPageProps> = ({ onNavigate }) => {
  const { hobbies: rawHobbies } = useSiteData();
  const hobbies = Array.isArray(rawHobbies) ? rawHobbies : [];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHobbies = hobbies.filter((hobby) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      hobby.title.toLowerCase().includes(q) ||
      (hobby.subtitle && hobby.subtitle.toLowerCase().includes(q)) ||
      (hobby.category && hobby.category.toLowerCase().includes(q)) ||
      (hobby.whyDescription && hobby.whyDescription.toLowerCase().includes(q))
    );
  });

  return (
    <div className="relative w-full min-h-screen overflow-x-clip">
      {/* Floating Vertical Margins in Left & Right Empty Spaces */}
      <VerticalMarginWidget
        side="left"
        top="top-72"
        {...MARGIN_PRESETS.shokuninCraft}
      />
      <VerticalMarginWidget
        side="right"
        top="top-96"
        {...MARGIN_PRESETS.akariSimplicity}
      />

      <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back navigation button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => onNavigate?.('home', 'hobbies')}
            className="inline-flex items-center gap-2 font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio Overview</span>
          </button>
        </div>

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-light-border/70 dark:border-[#2D3039]/80 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-serif text-terracotta text-sm">ARCHIVE //</span>
              <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                PURSUITS &amp; CRAFTS · 余白と手仕事
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal">
              Pursuits Beyond the Terminal{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
                余白と手仕事
              </span>
            </h1>
            <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 font-light leading-relaxed max-w-3xl">
              A collection of offline disciplines, creative storytelling, physical training, and quantitative execution that shape how I approach software architecture.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pursuits..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink focus:outline-none focus:border-terracotta/60"
            />
          </div>
        </div>

        {/* Pursuits Grid */}
        {filteredHobbies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {filteredHobbies.map((hobby, idx) => (
              <HobbyCardItem key={hobby.id || idx} hobby={hobby} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-light-border dark:border-dark-border rounded-xl">
            <p className="font-serif text-lg text-light-ink dark:text-dark-ink mb-1">
              No pursuits found matching your search.
            </p>
            <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted">
              Try a different keyword or return to the main overview.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
