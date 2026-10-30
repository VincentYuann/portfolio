import React from 'react';

export type EnsoPlacement = 'top-left' | 'top-right' | 'center' | 'custom';

export interface EnsoOrbitalProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number; // Size in px (default 100)
  placement?: EnsoPlacement;
  interactive?: boolean;
  hoverOnly?: boolean;
  active?: boolean;
}

/**
 * EnsoOrbital
 * Authentic Japanese sumi-e Ensō calligraphic brush circle:
 * - Anchored right on the top-left or top-right corner vertex of the card
 * - Restored original organic calligraphic brushwork with ink bleed (not a stroked noodle)
 * - Ephemeral hover flourish: strictly hidden (opacity-0) when idle, organically reveals on card hover
 */
export const EnsoOrbital: React.FC<EnsoOrbitalProps> = ({
  className = '',
  style: userStyle,
  size = 100,
  placement = 'top-left',
  interactive = true,
  hoverOnly = true,
  active,
}) => {
  const half = Math.round(size * 0.5);

  const placementStyle: React.CSSProperties = React.useMemo(() => {
    switch (placement) {
      case 'top-left':
        return { top: `-${half}px`, left: `-${half}px` };
      case 'top-right':
        return { top: `-${half}px`, right: `-${half}px` };
      case 'center':
        return { top: '50%', left: '50%' };
      default:
        return {};
    }
  }, [placement, half]);

  const placementClasses = {
    'top-left': '',
    'top-right': '',
    center: 'transform -translate-x-1/2 -translate-y-1/2',
    custom: '',
  }[placement];

  // Strictly hidden (opacity-0) when idle so cards stay clean; reveals smoothly on hover or when active
  const hoverClasses = typeof active === 'boolean'
    ? (active
        ? 'opacity-35 dark:opacity-30 scale-100 transition-all duration-500 ease-out'
        : 'opacity-0 scale-95 pointer-events-none transition-all duration-500 ease-out')
    : hoverOnly
      ? 'opacity-0 scale-95 pointer-events-none group-hover:opacity-35 dark:group-hover:opacity-30 group-hover:scale-100 transition-all duration-500 ease-out'
      : 'opacity-0 scale-95 pointer-events-none group-hover:opacity-35 dark:group-hover:opacity-30 group-hover:scale-100 transition-all duration-500 ease-out';

  return (
    <div
      className={`absolute ${placementClasses} pointer-events-none select-none z-10 ${hoverClasses} ${
        interactive ? 'group-hover:scale-102' : ''
      } ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...placementStyle,
        ...userStyle,
      }}
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
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Authentic Calligraphic Sumi-e Ensō Brushstroke */}
        <g className="origin-center transition-opacity duration-300">
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
            className="fill-light-ink dark:fill-dark-ink transition-colors duration-300"
            filter="url(#enso-ink-bleed)"
          />
        </g>
      </svg>
    </div>
  );
};
