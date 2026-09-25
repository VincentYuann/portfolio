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
 * An authentic Japanese sumi-e Ensō brush circle featuring:
 * 1. Expressive calligraphic brushwork with organic taper
 * 2. Rotating golden/ochre celestial orbit arc
 * 3. Incandescent pulsing vermilion bead (Ruby apex)
 * 4. Concentric dashed red orbit trail
 * 5. Orbiting celestial dust motes
 * Directly derived from user reference media_1789779914674.png and media_1789780458624.png
 */
export const EnsoOrbital: React.FC<EnsoOrbitalProps> = ({
  className = '',
  size = 128,
  placement = 'top-left',
  interactive = true,
  hoverOnly = true,
  active,
}) => {
  const placementClasses = {
    'top-left': '-top-7 -left-7 sm:-top-8 sm:-left-8',
    'top-right': '-top-7 -right-7 sm:-top-8 sm:-right-8',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    custom: '',
  }[placement];

  const hoverClasses = typeof active === 'boolean'
    ? (active
        ? 'opacity-100 scale-100 transition-all duration-300 ease-out'
        : 'opacity-0 scale-90 pointer-events-none transition-all duration-300 ease-out')
    : hoverOnly
      ? 'opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out'
      : 'opacity-100 transition-transform duration-500';

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
          {/* Subtle sumi paper ink bleed filter */}
          <filter id="enso-ink-bleed" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Glowing ruby/vermilion bead filter */}
          <filter id="ruby-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Golden orbit arc glow */}
          <filter id="gold-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. LAYER: Organic Sumi-e Brushstroke Ensō Body with Breathing Animation */}
        <g className="animate-enso-breathe origin-center transition-opacity duration-300">
          {/* Primary thick calligraphic ink stroke (sweeps counter-clockwise / clockwise) */}
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
            className="fill-light-ink dark:fill-dark-ink opacity-35 dark:opacity-30 transition-colors duration-300"
            filter="url(#enso-ink-bleed)"
          />

          {/* Secondary inner dry-brush texture stroke with real-time draw on hover */}
          <path
            d="M 100,28
               C 130,28 164,48 174,80
               C 182,112 168,148 140,166
               C 110,184 72,180 50,154"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="text-light-ink-muted/50 dark:text-dark-ink-muted/40 animate-enso-draw"
          />
        </g>

        {/* 2. LAYER: Rotating Celestial Elements Group (Golden Arc + Apex Ruby + Dashed Trail) */}
        <g
          className="animate-orbital-spin"
          style={{ transformOrigin: '100px 100px' }}
        >
          {/* Golden Orbit Arc (sweeps top to right with real-time drawing) */}
          <path
            d="M 106,16
               A 86 86 0 0 1 184,124"
            fill="none"
            stroke="#D59E66"
            strokeWidth="3.2"
            strokeLinecap="round"
            className="opacity-95 dark:opacity-90 animate-enso-draw"
            filter="url(#gold-glow)"
          />

          {/* Inner Dashed Vermilion Orbit Trail */}
          <path
            d="M 104,24
               A 78 78 0 0 1 176,120"
            fill="none"
            stroke="#EA4A2A"
            strokeWidth="1.8"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="opacity-80 dark:opacity-85 animate-dash-flow"
          />

          {/* Outer Fine Golden Tracking Ring */}
          <circle
            cx="100"
            cy="100"
            r="86"
            fill="none"
            stroke="#D59E66"
            strokeWidth="0.6"
            strokeDasharray="1 8"
            className="opacity-30 dark:opacity-25"
          />

          {/* Glowing Ruby / Vermilion Bead at Golden Arc Apex */}
          <g className="animate-ruby-pulse" style={{ transformOrigin: '106px 16px' }}>
            {/* Ambient Aura */}
            <circle cx="106" cy="16" r="6" fill="#EA4A2A" className="opacity-40" />
            {/* Core Solid Bead */}
            <circle
              cx="106"
              cy="16"
              r="3.6"
              fill="#C83C23"
              stroke="#FFF"
              strokeWidth="0.8"
              filter="url(#ruby-glow)"
            />
          </g>

          {/* Celestial Dust Particles */}
          <circle cx="124" cy="12" r="1.6" className="fill-[#323236] dark:fill-[#797A7E] opacity-70" />
          <circle cx="138" cy="15" r="1.2" fill="#D59E66" className="opacity-85" />
          <circle cx="190" cy="80" r="1.8" className="fill-[#323236] dark:fill-[#797A7E] opacity-60" />
          <circle cx="194" cy="94" r="1.3" fill="#EA4A2A" className="opacity-80" />
        </g>
      </svg>
    </div>
  );
};
