import React, { useState, Suspense, lazy } from 'react';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';
import { HobbyItem } from '../../../context/SiteDataContext';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { CornerBrackets } from '../../common/CornerBrackets';
import { getCategoryStyle } from '../../../lib/hobbyTheme';

// Lazy-load Lightbox module so yet-another-react-lightbox isn't in initial bundle
const ImageLightboxModal = lazy(() =>
  import('../../common/ImageLightboxModal').then((m) => ({ default: m.ImageLightboxModal }))
);

export interface HobbyCardProps {
  hobby: HobbyItem;
  index: number;
}

export const HobbyCard: React.FC<HobbyCardProps> = ({ hobby, index }) => {
  const images = Array.isArray(hobby.images) && hobby.images.length > 0 ? hobby.images : [];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const heroImage = images[activeImageIndex] || images[0] || '';

  // Other images for side thumbnails (excluding active one, up to 4)
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
        <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-light-border/60 dark:border-dark-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold text-terracotta tracking-wider uppercase">
                {`0${index + 1}`} · {hobby.kanji || '工芸'}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border font-medium ${categoryStyle}`}
              >
                {hobby.category || 'Passion'}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-light-ink dark:text-dark-ink group-hover:text-terracotta transition-colors leading-tight">
              {hobby.title}
            </h3>
          </div>

          <div className="text-right shrink-0">
            <span className="font-serif text-2xl sm:text-3xl text-terracotta/80 font-bold leading-none block">
              {hobby.kanji || '道'}
            </span>
          </div>
        </div>

        {/* Dynamic Multi-Photo Gallery Layout */}
        {images.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-12 gap-2 h-44 sm:h-52">
              {/* Primary Active Photo */}
              <div
                className={`relative rounded-lg overflow-hidden border border-light-border/80 dark:border-dark-border group/hero bg-light-surface-muted dark:bg-dark-surface-muted ${
                  sideThumbnails.length > 0 ? 'col-span-8 sm:col-span-9' : 'col-span-12'
                }`}
              >
                <img
                  src={heroImage}
                  alt={`${hobby.title} active photo`}
                  className="w-full h-full object-cover group-hover/hero:scale-103 transition-transform duration-500 cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                  loading="lazy"
                  decoding="async"
                />

                {/* Enlarge Trigger Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="absolute bottom-2 right-2 p-1.5 rounded-md bg-black/60 text-white/90 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover/hero:opacity-100 cursor-pointer"
                  title="Expand to Fullscreen Lightbox"
                  aria-label="Enlarge image"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Image Counter Pill */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white/90 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-terracotta" />
                  <span>
                    {activeImageIndex + 1} / {images.length}
                  </span>
                </div>
              </div>

              {/* Side Thumbnail Selector Column */}
              {sideThumbnails.length > 0 && (
                <div className="col-span-4 sm:col-span-3 flex flex-col gap-1.5 h-full overflow-hidden">
                  {sideThumbnails.map(({ img, idx }) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className="relative flex-1 rounded-md overflow-hidden border border-light-border dark:border-dark-border hover:border-terracotta transition-colors group/thumb cursor-pointer bg-light-surface-muted dark:bg-dark-surface-muted"
                      title={`Switch to image ${idx + 1}`}
                      aria-label={`Switch to photo ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`${hobby.title} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Narrative Description */}
        <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-light mb-4">
          {hobby.whyDescription}
        </p>

        {/* Metadata Key-Value Badges (Compact & Adaptable Horizontal Pills) */}
        {hobby.metadata && hobby.metadata.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-light-border/40 dark:border-dark-border/40">
            {hobby.metadata.map((item, mIdx) => {
              const rawLabel = (item as any).label || (item as any).key || '';
              const labelText = rawLabel.includes('(')
                ? rawLabel.split('(')[0].trim()
                : rawLabel.toUpperCase();

              return (
                <div
                  key={mIdx}
                  className="inline-flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border shadow-xs"
                >
                  <span className="font-semibold text-light-ink dark:text-dark-ink text-[11px] sm:text-xs tracking-tight">
                    {labelText}
                  </span>
                  <span className="font-normal text-light-ink-muted dark:text-dark-ink-muted text-[11px] sm:text-xs">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal (Loaded dynamically on-demand) */}
      {isLightboxOpen && (
        <Suspense fallback={null}>
          <ImageLightboxModal
            images={images}
            currentIndex={activeImageIndex}
            onIndexChange={setActiveImageIndex}
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            title={hobby.title}
            subtitle={hobby.subtitle}
            kanji={hobby.kanji}
          />
        </Suspense>
      )}
    </article>
  );
};
