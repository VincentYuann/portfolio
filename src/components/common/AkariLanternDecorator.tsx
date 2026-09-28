import React from 'react';

export type LanternVariant =
  | 'hanging-vertical'
  | 'hanging-round'
  | 'hanging-elliptical'
  | 'standing-tripod';

interface AkariLanternDecoratorProps {
  variant?: LanternVariant;
  className?: string;
  sizeClassName?: string;
  glowSizeClassName?: string;
  priority?: boolean;
}

const LANTERN_SOURCES: Record<LanternVariant, string> = {
  'hanging-vertical': './decorators/akari-lantern.webp',
  'standing-tripod': './decorators/akari-lamp-standing.webp',
  'hanging-round': './decorators/akari-lantern-round.webp',
  'hanging-elliptical': './decorators/akari-lantern-elliptical.webp',
};

const LANTERN_DIMENSIONS: Record<LanternVariant, { width: number; height: number }> = {
  'hanging-vertical': { width: 208, height: 420 },
  'standing-tripod': { width: 220, height: 400 },
  'hanging-round': { width: 220, height: 260 },
  'hanging-elliptical': { width: 240, height: 220 },
};

const GLOW_CENTER_BY_VARIANT: Record<LanternVariant, string> = {
  'hanging-vertical': 'top-[58%]',
  'hanging-round': 'top-[74%]',
  'hanging-elliptical': 'top-[65%]',
  'standing-tripod': 'top-[36%]',
};

export const AkariLanternDecorator: React.FC<AkariLanternDecoratorProps> = ({
  variant = 'hanging-vertical',
  className = '',
  sizeClassName = 'md:w-36 lg:w-44 xl:w-52',
  glowSizeClassName = 'md:w-72 lg:w-84 md:h-72 lg:h-84',
  priority = false,
}) => {
  const src = LANTERN_SOURCES[variant];
  const glowCenter = GLOW_CENTER_BY_VARIANT[variant];
  const dims = LANTERN_DIMENSIONS[variant];

  return (
    <div
      className={`absolute pointer-events-none z-0 select-none overflow-visible hidden md:block ${className}`}
      aria-hidden="true"
    >
      {/* Outer Expansive Warm Candlelight Halo (Blends organically into Day/Night Canvas) */}
      <div
        className={`absolute ${glowCenter} left-1/2 -translate-x-1/2 -translate-y-1/2 ${glowSizeClassName} rounded-full bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.24)_0%,_rgba(234,88,12,0.10)_36%,_rgba(217,119,6,0.03)_60%,_transparent_74%)] dark:bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.20)_0%,_rgba(245,158,11,0.09)_38%,_rgba(217,119,6,0.02)_62%,_transparent_78%)] blur-3xl animate-lantern-faint transform-gpu [transform:translateZ(0)] will-change-[transform,opacity] pointer-events-none`}
      />

      {/* Inner Concentrated Warm Amber Core for Gentle Luminous Warmth */}
      <div
        className={`absolute ${glowCenter} left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-36 lg:w-40 md:h-36 lg:h-40 rounded-full bg-amber-500/18 dark:bg-amber-400/15 blur-xl animate-lantern-faint transform-gpu [transform:translateZ(0)] will-change-[transform,opacity] pointer-events-none`}
      />

      <img
        src={src}
        alt=""
        width={dims.width}
        height={dims.height}
        className={`relative z-10 ${sizeClassName} h-auto object-contain md:opacity-50 dark:md:opacity-60 drop-shadow-[0_6px_28px_rgba(245,158,11,0.22)] dark:drop-shadow-[0_0_28px_rgba(251,191,36,0.25)] transition-all duration-700 ease-out`}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-expect-error fetchpriority standard attribute in modern browsers
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </div>
  );
};
