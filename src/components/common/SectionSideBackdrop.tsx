import React from 'react';

export interface SectionSideBackdropProps {
  /** Day theme 16:9 texture background image URL */
  textureDay: string;
  /** Night theme 16:9 texture background image URL */
  textureNight: string;
  /** Sumi-e painting decoration image URL placed on top of the texture */
  painting?: string;
  /** Accessible alt description for the painting decoration */
  paintingAlt?: string;
  /** Asymmetric placement of the artwork: 'right' | 'left' | 'bottom-right' | 'bottom-left' | 'full' (default: 'right') */
  placement?: 'right' | 'left' | 'bottom-right' | 'bottom-left' | 'full';
  /** Custom width for the artwork container (default: responsive 50-60%) */
  artworkWidth?: string;
  /** Opacity for the 16:9 texture layer in day mode (default: 0.65) */
  textureOpacityDay?: number;
  /** Opacity for the 16:9 texture layer in night mode (default: 0.45) */
  textureOpacityNight?: number;
  /** Opacity for the painting decoration layer in day mode (default: 0.35) */
  paintingOpacityDay?: number;
  /** Opacity for the painting decoration layer in night mode (default: 0.14) */
  paintingOpacityNight?: number;
  /** Center coordinates for the radial fade mask (e.g. 'at 30% 50%' or 'at 70% 50%') */
  maskCenter?: string;
  /** Optional secondary accent painting decoration (e.g. pine branch, bamboo leaf) */
  secondaryPainting?: string;
  secondaryAlt?: string;
  secondaryPlacement?: 'left' | 'right';
  secondaryWidth?: string;
  secondaryOpacityDay?: number;
  secondaryOpacityNight?: number;
  /** Optional custom class for the outer backdrop container */
  className?: string;
}

/**
 * SectionSideBackdrop / SectionIntegratedBackdrop
 * 
 * Traditional Japanese Composition (Fukinsei / Asymmetry):
 * - Spans the 16:9 tactile texture (linen, wood, washi) across 100% of the section.
 * - Alternates visual weight organically across sections (Left vs Right).
 * - Pairs with translucent (.card-akari-translucent) cards so art flows seamlessly.
 */
export const SectionSideBackdrop: React.FC<SectionSideBackdropProps> = ({
  textureDay,
  textureNight,
  painting,
  paintingAlt = 'Sumi-e ink wash painting decoration',
  placement = 'right',
  artworkWidth,
  textureOpacityDay = 0.65,
  textureOpacityNight = 0.45,
  paintingOpacityDay = 0.35,
  paintingOpacityNight = 0.14,
  maskCenter,
  secondaryPainting,
  secondaryAlt = 'Sumi-e accent motif',
  secondaryPlacement = 'left',
  secondaryWidth = 'w-64 lg:w-80 h-72 lg:h-80',
  secondaryOpacityDay = 0.25,
  secondaryOpacityNight = 0.12,
  className = '',
}) => {
  // Compute default width and positioning classes based on asymmetric placement
  const isLeft = placement === 'left' || placement === 'bottom-left';
  const computedArtworkWidth = artworkWidth || (isLeft ? 'w-full lg:w-[50%]' : 'w-full lg:w-[55%]');

  const placementClasses =
    placement === 'bottom-right'
      ? 'right-0 bottom-0 top-auto h-[85%]'
      : placement === 'bottom-left'
      ? 'left-0 bottom-0 top-auto h-[85%]'
      : placement === 'left'
      ? 'left-0 top-0 bottom-0 h-full'
      : placement === 'full'
      ? 'inset-0 w-full h-full'
      : 'right-0 top-0 bottom-0 h-full';

  const objectPositionClass =
    placement === 'bottom-right'
      ? 'object-bottom-right'
      : placement === 'bottom-left'
      ? 'object-bottom-left'
      : placement === 'left'
      ? 'object-left'
      : placement === 'full'
      ? 'object-center'
      : 'object-right';

  const computedMaskCenter =
    maskCenter ||
    (placement === 'bottom-right'
      ? 'at 75% 65%'
      : placement === 'bottom-left'
      ? 'at 25% 65%'
      : placement === 'left'
      ? 'at 30% 50%'
      : 'at 70% 50%');

  return (
    <div
      className={`section-art-canvas pointer-events-none absolute inset-0 z-0 overflow-hidden select-none ${className}`}
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      {/* =========================================================================
          LAYER 1: FULL-BLEED 16:9 TACTILE TEXTURE BACKGROUND (Linen / Wood / Paper)
          Spans across the entire section under the translucent cards
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Day Mode Texture */}
        <img
          src={textureDay}
          alt=""
          className="absolute inset-0 w-full h-full object-cover dark:hidden mix-blend-multiply transition-opacity duration-500"
          style={{ opacity: textureOpacityDay }}
          loading="lazy"
          decoding="async"
        />

        {/* Night Mode Texture */}
        <img
          src={textureNight}
          alt=""
          className="absolute inset-0 w-full h-full object-cover hidden dark:block mix-blend-screen transition-opacity duration-500"
          style={{ opacity: textureOpacityNight }}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* =========================================================================
          LAYER 2: ASYMMETRIC SUMI-E INTEGRATED ARTWORK (Fukinsei Balance)
          ========================================================================= */}
      {painting && (
        <div
          className={`absolute ${placementClasses} ${computedArtworkWidth} pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-500`}
          style={{
            maskImage: `radial-gradient(ellipse 90% 75% ${computedMaskCenter}, black 35%, transparent 95%)`,
            WebkitMaskImage: `radial-gradient(ellipse 90% 75% ${computedMaskCenter}, black 35%, transparent 95%)`,
          }}
        >
          {/* Day Mode: Ink absorbs directly into paper fibers */}
          <img
            src={painting}
            alt={paintingAlt}
            className={`w-full h-full object-cover sm:object-contain ${objectPositionClass} dark:hidden mix-blend-multiply transition-opacity duration-500`}
            style={{ opacity: paintingOpacityDay }}
            loading="lazy"
            decoding="async"
          />

          {/* Night Mode: Inverts painting into ethereal silver-ash mist */}
          <img
            src={painting}
            alt={paintingAlt}
            className={`w-full h-full object-cover sm:object-contain ${objectPositionClass} hidden dark:block mix-blend-screen dark:filter dark:invert dark:contrast-110 dark:brightness-85 transition-opacity duration-500`}
            style={{ opacity: paintingOpacityNight }}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      {/* =========================================================================
          LAYER 3: OPTIONAL SECONDARY ACCENT MOTIF (Pine / Bamboo Leaf)
          ========================================================================= */}
      {secondaryPainting && (
        <div
          className={`absolute ${
            secondaryPlacement === 'left'
              ? '-left-6 top-1/3'
              : '-right-6 top-1/4'
          } ${secondaryWidth} pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-500`}
          style={{
            maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 25%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 25%, transparent 85%)',
          }}
        >
          <img
            src={secondaryPainting}
            alt={secondaryAlt}
            className="w-full h-full object-contain dark:hidden mix-blend-multiply"
            style={{ opacity: secondaryOpacityDay }}
            loading="lazy"
            decoding="async"
          />
          <img
            src={secondaryPainting}
            alt={secondaryAlt}
            className="w-full h-full object-contain hidden dark:block mix-blend-screen filter invert contrast-110 brightness-85"
            style={{ opacity: secondaryOpacityNight }}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
    </div>
  );
};
