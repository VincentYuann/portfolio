import React from 'react';
import { DEFAULT_FALLBACK_IMAGES } from '../../lib/constants';

interface MarginBambooFlanksProps {
  imageSrc?: string;
  className?: string;
}

export const MarginBambooFlanks: React.FC<MarginBambooFlanksProps> = ({
  imageSrc = DEFAULT_FALLBACK_IMAGES.verticalBamboo,
  className = '',
}) => {
  return (
    <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden select-none ${className}`}>
      {/* Left Margin Flank Bamboo */}
      <div className="absolute -left-6 xl:left-2 bottom-12 top-24 w-32 xl:w-48 pointer-events-none z-0 hidden lg:block">
        <img
          src={imageSrc}
          alt="Sumi-e bamboo margin accent"
          className="w-full h-full object-contain object-bottom opacity-30 dark:opacity-15 mix-blend-multiply dark:mix-blend-screen dark:invert animate-bamboo-sway"
          style={{
            maskImage: 'radial-gradient(ellipse 85% 85% at 30% 60%, black 35%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 30% 60%, black 35%, transparent 85%)',
          }}
        />
      </div>

      {/* Right Margin Flank Bamboo */}
      <div className="absolute -right-6 xl:right-2 bottom-12 top-24 w-32 xl:w-48 pointer-events-none z-0 hidden lg:block">
        <img
          src={imageSrc}
          alt="Sumi-e bamboo margin accent"
          className="w-full h-full object-contain object-bottom opacity-30 dark:opacity-15 mix-blend-multiply dark:mix-blend-screen dark:invert scale-x-[-1]"
          style={{
            maskImage: 'radial-gradient(ellipse 85% 85% at 70% 60%, black 35%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 70% 60%, black 35%, transparent 85%)',
          }}
        />
      </div>

      {/* Top and Bottom Ambient Canvas Fades */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-light-canvas via-light-canvas/70 to-transparent dark:from-dark-canvas dark:via-dark-canvas/70 z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-light-canvas via-light-canvas/70 to-transparent dark:from-dark-canvas dark:via-dark-canvas/70 z-10 pointer-events-none" />
    </div>
  );
};
