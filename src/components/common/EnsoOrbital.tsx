import React from 'react';

interface EnsoOrbitalProps {
  className?: string;
  size?: number; // Size in px (default 100)
  placement?: 'top-left' | 'top-right' | 'center' | 'custom';
  interactive?: boolean;
  hoverOnly?: boolean;
  active?: boolean;
}

/**
 * EnsoOrbital
 * Authentic Japanese sumi-e Ens? brush circle featuring:
 * - Single expressive organic calligraphic brushstroke with sumi ink texture
 * - Fluid live brush drawing animation on hover (no inner red wire, no orbiting dots)
 * - Safe internal placement so the brush is never clipped or hidden by overflow-hidden
 */
export const EnsoOrbital: React.FC<EnsoOrbitalProps> = ({
  className = '',
  size = 100,
  placement = 'top-right',
  interactive = true,
  hoverOnly = true,
  active,
}) => {
  const placementClasses = {
    'top-left': 'top-3 left-3 sm:top-4 sm:left-4',
    'top-right': 'top-3 right-3 sm:top-4 sm:right-4',
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
        interactive ? 'group-hover:scale-105' : ''
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
          {/* Subtle sumi ink bleed texture */}
          <filter id="enso-brush-bleed" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Unified Calligraphic Sumi-e Brushstroke Ens? */}
        <g className="origin-center" filter="url(#enso-brush-bleed)">
          {/* Live Brush Drawing Stroke: sweeps fluidly around once on card hover */}
          <path
            d="M 100,28
               C 142,28 174,56 180,96
               C 186,138 160,174 124,180
               C 86,186 38,166 26,124
               C 16,86 44,38 94,26
               C 114,21 138,25 154,36"
            fill="none"
            stroke="currentColor"
            strokeWidth="11"
            strokeLinecap="round"
            className="text-terracotta/80 dark:text-ochre/80 animate-enso-draw"
          />
        </g>
      </svg>
    </div>
  );
};
