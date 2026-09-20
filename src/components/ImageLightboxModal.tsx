import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange?: (index: number) => void;
  title?: string;
  kanji?: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  title,
  kanji,
}) => {
  const currentImage = images[currentIndex] || images[0];

  const handlePrev = useCallback(() => {
    if (!onIndexChange || images.length <= 1) return;
    const nextIdx = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onIndexChange(nextIdx);
  }, [currentIndex, images.length, onIndexChange]);

  const handleNext = useCallback(() => {
    if (!onIndexChange || images.length <= 1) return;
    const nextIdx = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onIndexChange(nextIdx);
  }, [currentIndex, images.length, onIndexChange]);

  // Keyboard navigation: Escape to close, Left/Right arrow keys to navigate
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll while open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} full image` : 'Full size image viewer'}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/40 border-b border-white/10 z-10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {kanji && (
            <span className="font-serif font-bold text-terracotta text-lg sm:text-xl leading-none shrink-0">
              {kanji}
            </span>
          )}
          <div className="min-w-0">
            {title && (
              <h3 className="font-serif text-sm sm:text-base font-medium text-white truncate">
                {title}
              </h3>
            )}
            {images.length > 1 && (
              <p className="font-mono text-[11px] text-white/60">
                Photo {currentIndex + 1} of {images.length}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Open original in new tab */}
          <a
            href={currentImage}
            target="_blank"
            rel="noopener noreferrer"
            title="Open original image in new tab"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            title="Close viewer (Esc)"
            aria-label="Close full size image viewer"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 flex items-center justify-center p-3 sm:p-6 min-h-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 hover:border-terracotta transition-all cursor-pointer z-10 min-w-[44px] min-h-[44px] flex items-center justify-center shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Full Image Display */}
        <div className="relative max-h-[75vh] max-w-[92vw] flex items-center justify-center">
          <img
            src={currentImage}
            alt={title ? `${title} full view` : 'Full size photo'}
            className="max-h-[75vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 hover:border-terracotta transition-all cursor-pointer z-10 min-w-[44px] min-h-[44px] flex items-center justify-center shadow-lg"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnails Strip (when multiple images exist) */}
      {images.length > 1 && (
        <div
          className="flex items-center justify-center gap-2 p-3 bg-black/40 border-t border-white/10 shrink-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onIndexChange?.(idx)}
              aria-label={`Jump to photo ${idx + 1}`}
              className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden border transition-all cursor-pointer shrink-0 ${
                currentIndex === idx
                  ? 'border-terracotta ring-2 ring-terracotta/60 scale-105 opacity-100'
                  : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/60'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
