import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Captions from 'yet-another-react-lightbox/plugins/captions';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/captions.css';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange?: (index: number) => void;
  title?: string;
  subtitle?: string;
  kanji?: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  title,
  subtitle,
  kanji,
}) => {
  if (!images || images.length === 0) return null;

  const slides = images.map((src, idx) => ({
    src,
    title: title ? `${kanji ? `${kanji} · ` : ''}${title}` : undefined,
    description: subtitle || (images.length > 1 ? `Photo ${idx + 1} of ${images.length}` : undefined),
  }));

  const hasMultiple = images.length > 1;

  return (
    <div className="portfolio-lightbox-root">
      <Lightbox
        open={isOpen}
        close={onClose}
        index={currentIndex}
        slides={slides}
        on={{
          view: ({ index }) => onIndexChange?.(index),
        }}
        plugins={hasMultiple ? [Zoom, Thumbnails, Counter, Captions] : [Zoom, Captions]}
        thumbnails={{
          position: 'bottom',
          width: 64,
          height: 48,
          border: 1,
          borderRadius: 6,
          padding: 3,
          gap: 8,
          showToggle: false,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.8,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          scrollToZoom: true,
        }}
        counter={{
          container: {
            style: {
              top: 16,
              left: 16,
              bottom: 'unset',
              right: 'unset',
            },
          },
        }}
        captions={{
          showToggle: false,
          descriptionTextAlign: 'center',
          descriptionMaxLines: 2,
        }}
        carousel={{
          finite: images.length <= 1,
          preload: 2,
          padding: '16px',
          spacing: '24px',
        }}
        animation={{
          swipe: 240,
          navigation: 260,
          easing: {
            swipe: 'cubic-bezier(0.16, 1, 0.3, 1)',
            navigation: 'cubic-bezier(0.16, 1, 0.3, 1)',
          },
        }}
        styles={{
          root: {
            zIndex: 9999,
          },
          container: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </div>
  );
};
