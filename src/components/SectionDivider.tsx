import React from 'react';

interface SectionDividerProps {
  label?: string;
  shortLabel?: string;
  className?: string;
}

/**
 * Seigaiha (青海波) Motif from public/decorators/some motif decorators.png
 * Hand-drawn layered wave arches in terracotta (#c83c23), ochre (#d49b6a), and sumi ink.
 */
export const SeigaihaMotif: React.FC<{ className?: string }> = ({
  className = 'w-14 h-10',
}) => (
  <svg
    viewBox="0 0 280 190"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Base Cluster Center */}
    <g transform="translate(140, 120)">
      {/* Outer arch - Terracotta */}
      <path
        d="M -78,65 C -75,2 -52,-38 0,-42 C 54,-40 76,4 82,65"
        stroke="#c83c23"
        strokeWidth="3.2"
        strokeLinecap="round"
        className="opacity-90 dark:opacity-85"
      />
      {/* Mid-outer arch - Ochre */}
      <path
        d="M -60,65 C -58,15 -38,-22 0,-24 C 40,-23 58,16 62,65"
        stroke="#d49b6a"
        strokeWidth="2.8"
        strokeLinecap="round"
        className="opacity-80 dark:opacity-75"
      />
      {/* Mid arch - Sumi ink */}
      <path
        d="M -42,65 C -40,28 -24,-5 0,-8 C 26,-7 40,29 44,65"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-[#4a443e] dark:text-[#a8a29e] opacity-70"
      />
      {/* Innermost arch - Terracotta */}
      <path
        d="M -24,65 C -23,42 -12,12 0,10 C 14,11 23,43 25,65"
        stroke="#c83c23"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="opacity-90 dark:opacity-85"
      />
      {/* Core ripple center drop */}
      <ellipse cx="0" cy="42" rx="3.5" ry="5" fill="#d49b6a" className="opacity-90" />
    </g>

    {/* Offset Left Crest */}
    <g transform="translate(70, 70)">
      <path
        d="M -68,60 C -64,8 -42,-26 0,-28 C 42,-27 63,10 67,60"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        className="text-[#5a544c] dark:text-[#8c857b] opacity-65"
      />
      <path
        d="M -50,60 C -48,20 -30,-10 0,-12 C 30,-11 48,21 51,60"
        stroke="#d49b6a"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="opacity-75"
      />
      <path
        d="M -32,60 C -30,32 -18,6 0,4 C 18,5 30,33 33,60"
        stroke="#c83c23"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="opacity-85"
      />
    </g>

    {/* Offset Right Crest */}
    <g transform="translate(210, 70)">
      <path
        d="M -66,60 C -62,10 -40,-26 0,-28 C 43,-26 64,12 68,60"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        className="text-[#5a544c] dark:text-[#8c857b] opacity-65"
      />
      <path
        d="M -48,60 C -46,22 -28,-9 0,-11 C 31,-10 47,23 50,60"
        stroke="#c83c23"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="opacity-85"
      />
      <path
        d="M -30,60 C -28,34 -16,8 0,6 C 18,7 28,34 31,60"
        stroke="#d49b6a"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="opacity-75"
      />
    </g>

    {/* Top Crown Ripple Crest */}
    <g transform="translate(140, 22)">
      <path
        d="M -55,48 C -52,14 -32,-16 0,-18 C 34,-17 52,15 56,48"
        stroke="#c83c23"
        strokeWidth="2.8"
        strokeLinecap="round"
        className="opacity-90 dark:opacity-85"
      />
      <path
        d="M -38,48 C -36,24 -22,0 0,-2 C 22,-1 36,25 39,48"
        stroke="#d49b6a"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="opacity-75"
      />
      <path
        d="M -20,48 C -19,34 -10,14 0,13 C 11,14 19,35 21,48"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-[#5a544c] dark:text-[#8c857b] opacity-65"
      />
    </g>
  </svg>
);

/**
 * Concentric Diamond / Rhombus Crest Motif from the bottom divider strip of some motif decorators.png
 */
export const DiamondCrest: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4 shrink-0',
}) => (
  <svg
    viewBox="0 0 28 20"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Outer Terracotta Diamond */}
    <polygon
      points="14,1 26,10 14,19 2,10"
      fill="none"
      stroke="#c83c23"
      strokeWidth="1.8"
      strokeLinejoin="round"
      className="opacity-90 dark:opacity-85"
    />
    {/* Inner Ochre Diamond */}
    <polygon
      points="14,5 20,10 14,15 8,10"
      fill="none"
      stroke="#d49b6a"
      strokeWidth="1.2"
      strokeLinejoin="round"
      className="opacity-80 dark:opacity-75"
    />
    {/* Center Terracotta Core Dot */}
    <circle cx="14" cy="10" r="2" fill="#c83c23" className="opacity-95" />
  </svg>
);

export const SectionDivider: React.FC<SectionDividerProps> = ({
  label = 'MA · WABI-SABI · CRAFT',
  shortLabel,
  className = '',
}) => {
  const displayShort = shortLabel || label;

  return (
    <div
      className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 my-10 sm:my-16 flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Top Seigaiha Wave Arch Motif */}
      <div className="mb-2 sm:mb-2.5 flex items-center justify-center pointer-events-none">
        <SeigaihaMotif className="w-12 sm:w-16 h-8 sm:h-11 text-light-ink/70 dark:text-dark-ink/60" />
      </div>

      {/* Horizontal Divider Line with Dashed Hairlines, Diamond Crests & Center Section Description */}
      <div className="w-full flex items-center justify-center gap-2 sm:gap-3.5 max-w-4xl">
        {/* Left Dashed Hairline Line */}
        <div className="flex-1 min-w-[20px] flex items-center overflow-hidden">
          <svg className="w-full h-[2px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="#d49b6a"
              strokeWidth="1.2"
              strokeDasharray="16 4 4 4 24 4 8 4"
              className="opacity-55 dark:opacity-45"
            />
          </svg>
        </div>

        {/* Left Concentric Diamond Crest */}
        <DiamondCrest className="w-4 h-3.5 sm:w-5 sm:h-4 text-terracotta" />

        {/* Section Description in the Middle */}
        <div className="relative z-10 inline-flex items-center px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full bg-light-surface/90 dark:bg-dark-surface/90 border border-light-border/80 dark:border-dark-border/80 shadow-xs backdrop-blur-xs hover:border-ochre/50 transition-colors shrink-0">
          <span className="font-sans font-semibold tracking-[0.16em] sm:tracking-[0.2em] text-light-ink-muted dark:text-dark-ink-muted uppercase text-[10px] sm:text-[11px]">
            <span className="sm:hidden">{displayShort}</span>
            <span className="hidden sm:inline">{label}</span>
          </span>
        </div>

        {/* Right Concentric Diamond Crest */}
        <DiamondCrest className="w-4 h-3.5 sm:w-5 sm:h-4 text-terracotta" />

        {/* Right Dashed Hairline Line */}
        <div className="flex-1 min-w-[20px] flex items-center overflow-hidden">
          <svg className="w-full h-[2px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="#d49b6a"
              strokeWidth="1.2"
              strokeDasharray="16 4 4 4 24 4 8 4"
              className="opacity-55 dark:opacity-45"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
