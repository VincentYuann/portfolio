import React from 'react';

interface EnsoOrbitalProps {
  className?: string;
  size?: number; // Size in px (default 128)
  placement?: 'top-left' | 'top-right' | 'center' | 'custom';
  interactive?: boolean;
  hoverOnly?: boolean;
  active?: boolean;
}

/**
 * EnsoOrbital
 * Authentic Japanese sumi-e Ensō brush circle featuring:
 * - Expressive organic calligraphic brushwork with ink bleed
 * - Single live brush drawing animation on hover (no spinning dots or orbiting tracks)
 */
export const EnsoOrbital: React.FC<EnsoOrbitalProps> = ({
  className = '',
  size = 120,
  placement = 'top-left',
  interactive = true,
  hoverOnly = true,
  active,
}) => {
  const placementClasses = {
    'top-left': '-top-6 -left-6 sm:-top-7 sm:-left-7',
    'top-right': '-top-6 -right-6 sm:-top-7 sm:-right-7',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    custom: '',
  }[placement];

  const hoverClasses = typeof active === 'boolean'
    ? (active
        ? 'opacity-100 scale-100 transition-all duration-300 ease-out'
        : 'opacity-0 scale-90 pointer-events-none transition-all duration-300 ease-out')
    : hoverOnly
      ? 'opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out'
      : 'opacity-100 transition-transform duration-300';

  return (
    <div
      className={`absolute ${placementClasses} pointer-events-none select-none z-20 ${hoverClasses} ${
        interactive ? 'group-hover:scale-102' : ''
      } ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Subtle sumi ink bleed filter */}
          <filter id="enso-ink-bleed" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* 1. LAYER: Organic Calligraphic Brushstroke Ensō */}
        <g className="origin-center transition-opacity duration-300">
          {/* Thick calligraphic sumi ink stroke */}
          <path
            d="M 100,24
               C 138,23 172,46 182,82
               C 192,120 174,160 142,178
               C 106,198 62,192 36,162
               C 10,132 14,84 46,52
               C 60,38 78,28 100,24
               C 92,30 76,40 66,54
               C 38,90 44,136 78,160
               C 112,182 152,158 162,126
               C 170,98 152,58 116,42
               C 104,36 94,33 86,30
               Z"
            className="fill-light-ink/40 dark:fill-dark-ink/35 transition-colors duration-300"
            filter="url(#enso-ink-bleed)"
          />

          {/* Live Brush Drawing Accent: sweeps smoothly once on hover */}
          <path
            d="M 100,28
               C 130,28 164,48 174,80
               C 182,112 168,148 140,166
               C 110,184 72,180 50,154
               C 32,130 36,88 64,58"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            className="text-terracotta/70 dark:text-ochre/70 animate-enso-draw"
          />

          {/* Subtle inner dry brush hairline */}
          <path
            d="M 104,34
               C 128,34 156,52 164,80
               C 172,108 158,138 136,154"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
            className="text-light-ink-muted/30 dark:text-dark-ink-muted/30"
          />
        </g>
      </svg>
    </div>
  );
};
