import React from 'react';

/**
 * Global fallback and asset paths
 */
export const DEFAULT_FALLBACK_IMAGES = {
  projectWorkspace: './images/sumi-os-workspace.jpg',
  komorebiSpatial: './images/komorebi-spatial.jpg',
  akariCommerce: './images/akari-commerce.jpg',
  bambooArtDay: './images/bamboo-art-day.png',
  bambooArtNight: './images/bamboo-art-night.png',
  verticalBamboo: './images/sumie-tall-vertical-bamboo.jpg',
} as const;

/**
 * Standard image onError handler to safely set fallback without infinite loop
 */
export function handleImageError(
  fallbackOrEvent?: string | React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = DEFAULT_FALLBACK_IMAGES.projectWorkspace
) {
  if (fallbackOrEvent && typeof fallbackOrEvent === 'object' && 'currentTarget' in fallbackOrEvent) {
    // Used directly as onError={handleImageError}
    const target = (fallbackOrEvent as React.SyntheticEvent<HTMLImageElement, Event>).currentTarget;
    if (target.src !== fallbackSrc && !target.src.endsWith(fallbackSrc.replace(/^\.\//, ''))) {
      target.src = fallbackSrc;
    }
    return;
  }
  const customFallback = typeof fallbackOrEvent === 'string' ? fallbackOrEvent : fallbackSrc;
  return (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src !== customFallback && !target.src.endsWith(customFallback.replace(/^\.\//, ''))) {
      target.src = customFallback;
    }
  };
}
