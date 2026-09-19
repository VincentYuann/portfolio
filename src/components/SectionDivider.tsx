import React from 'react';

interface SectionDividerProps {
  label?: string;
  shortLabel?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  label = 'MA · WABI-SABI · CRAFT',
  shortLabel,
}) => {
  const displayShort = shortLabel || label;
  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 my-8 sm:my-14 flex items-center justify-center select-none">
      <div className="relative w-full flex items-center justify-center">
        {/* Hairline rules with warm gold/amber tone */}
        <div className="w-full absolute inset-x-0 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-ochre/30 dark:via-[#8B7355]/40 to-transparent" />
        </div>

        {/* Inline SVG Hairline Motif & Seigaiha Wave Crest */}
        <div className="w-full absolute inset-x-0 flex items-center justify-center pointer-events-none opacity-65 dark:opacity-45">
          <svg viewBox="0 0 800 60" className="w-full max-w-3xl text-light-border-strong dark:text-[#565A63]" fill="none">
            <path d="M 40,28 L 330,28 M 470,28 L 760,28" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <path d="M 40,32 L 330,32 M 470,32 L 760,32" stroke="currentColor" strokeWidth="0.7" opacity="0.22" />
            <g transform="translate(400, 30)">
              <path d="M -18,6 C -18,-6 -9,-14 0,-14 C 9,-14 18,-6 18,6" stroke="#C83C23" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M -11,6 C -11,-2 -5,-8 0,-8 C 5,-8 11,-2 11,6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
              <circle cx="0" cy="4" r="1.8" fill="#C83C23" />
            </g>
          </svg>
        </div>

        {/* Center Label Pill */}
        <div className="relative z-10 inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full bg-light-surface dark:bg-[#181920] border border-light-border dark:border-[#3A332A] shadow-xs backdrop-blur-sm hover:border-ochre/50 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
          <span className="font-sans font-semibold tracking-[0.2em] sm:tracking-[0.24em] text-light-ink-muted dark:text-[#B8A892] uppercase text-[9px] sm:text-[10px]">
            <span className="sm:hidden">{displayShort}</span>
            <span className="hidden sm:inline">{label}</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
        </div>
      </div>
    </div>
  );
};
