import React from 'react';

export interface SectionSideBackdropProps {
  textureDay: string;
  textureNight: string;
  painting?: string;
  paintingAlt?: string;
  placement?: 'right' | 'left' | 'bottom-right' | 'bottom-left' | 'full';
  artworkWidth?: string;
  textureOpacityDay?: number;
  textureOpacityNight?: number;
  paintingOpacityDay?: number;
  paintingOpacityNight?: number;
  maskCenter?: string;
  secondaryPainting?: string;
  secondaryAlt?: string;
  secondaryPlacement?: 'left' | 'right';
  secondaryWidth?: string;
  secondaryOpacityDay?: number;
  secondaryOpacityNight?: number;
  className?: string;
}

export const SectionSideBackdrop: React.FC<SectionSideBackdropProps> = () => {
  // All section backgrounds disabled per user request (except wood on Edit & Login pages)
  return null;
};
