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
  'hanging-vertical': './decorators/akari-lantern.png',
  'standing-tripod': './decorators/akari-lamp-standing.png',
  'hanging-round': './decorators/akari-lantern-round.png',
  'hanging-elliptical': './decorators/akari-lantern-elliptical.png',
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
  sizeClassName = 'w-32 sm:w-40 lg:w-48 xl:w-56',
  glowSizeClassName = 'w-64 sm:w-80 lg:w-[24rem] h-64 sm:h-80 lg:h-[24rem]',
  priority = false,
}) => {
  const src = LANTERN_SOURCES[variant];
  const glowCenter = GLOW_CENTER_BY_VARIANT[variant];

  return (
    <div
      className={`absolute pointer-events-none z-0 select-none overflow-visible hidden md:block ${className}`}
      aria-hidden="true"
    >
      {/* Outer Expansive Warm Candlelight Halo (Blends organically into Day/Night Canvas) */}
      <div
        className={`absolute ${glowCenter} left-1/2 -translate-x-1/2 -translate-y-1/2 ${glowSizeClassName} rounded-full bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.26)_0%,_rgba(234,88,12,0.11)_36%,_rgba(217,119,6,0.03)_60%,_transparent_74%)] dark:bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.22)_0%,_rgba(245,158,11,0.10)_38%,_rgba(217,119,6,0.03)_62%,_transparent_78%)] blur-2xl sm:blur-3xl animate-lantern-faint pointer-events-none`}
      />

      {/* Inner Concentrated Warm Amber Core for Gentle Luminous Warmth */}
      <div
        className={`absolute ${glowCenter} left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-36 lg:w-44 h-28 sm:h-36 lg:h-44 rounded-full bg-amber-500/18 dark:bg-amber-400/15 blur-xl animate-lantern-faint pointer-events-none`}
      />

      <img
        src={src}
        alt=""
        className={`relative z-10 ${sizeClassName} h-auto object-contain opacity-50 dark:opacity-60 drop-shadow-[0_6px_28px_rgba(245,158,11,0.22)] dark:drop-shadow-[0_0_28px_rgba(251,191,36,0.25)] transition-all duration-700 ease-out`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
};
