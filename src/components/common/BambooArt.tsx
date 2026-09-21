import React from 'react';

interface BambooArtProps {
  className?: string;
  sway?: boolean;
  opacity?: number;
}

export const BambooArt: React.FC<BambooArtProps> = ({
  className = 'w-32 h-44',
  sway = true,
  opacity = 0.85,
}) => {
  return (
    <div
      className={`relative inline-block pointer-events-none select-none ${
        sway ? 'animate-bamboo-sway' : ''
      } ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 250 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-light-ink dark:text-dark-ink transition-colors duration-300"
      >
        <defs>
          <filter id="bamboo-filter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Bamboo Stalk Segment 1 (Base) */}
        <path
          d="M 95,260 C 96,230 97,200 99,170"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
          filter="url(#bamboo-filter)"
        />
        {/* Node Joint 1 with Cinnabar / Vermilion Accent */}
        <path
          d="M 92,171 C 100,167 109,167 115,172"
          stroke="#C83C23"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Bamboo Stalk Segment 2 (Middle) */}
        <path
          d="M 100,168 C 102,132 104,98 107,65"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.85"
          filter="url(#bamboo-filter)"
        />
        {/* Node Joint 2 with Gold / Amber Accent */}
        <path
          d="M 99,66 C 107,63 115,63 122,67"
          stroke="#D49B6A"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Bamboo Stalk Segment 3 (Crown) */}
        <path
          d="M 108,63 C 110,38 112,20 115,6"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Branching Shoots */}
        <path
          d="M 102,169 C 74,152 50,137 32,124"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 107,67 C 80,50 60,36 46,24"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 103,169 C 128,150 154,136 176,124"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Calligraphic Bamboo Leaf Clusters (Classic 个字 & 介字 Brush Groupings) */}
        <path
          d="M 46,24 C 28,18 8,24 0,32 C 16,32 34,28 46,24 Z"
          fill="currentColor"
          opacity="0.85"
          filter="url(#bamboo-filter)"
        />
        <path d="M 46,24 C 33,9 20,2 5,0 C 18,9 33,16 46,24 Z" fill="#C83C23" opacity="0.85" />
        <path d="M 46,24 C 41,39 34,54 26,64 C 35,51 41,38 46,24 Z" fill="#D49B6A" opacity="0.8" />

        <path
          d="M 32,124 C 14,118 -2,126 -10,134 C 4,133 21,128 32,124 Z"
          fill="currentColor"
          opacity="0.8"
          filter="url(#bamboo-filter)"
        />
        <path d="M 32,124 C 20,111 9,105 -3,103 C 8,111 21,118 32,124 Z" fill="#446557" opacity="0.85" />

        <path
          d="M 176,124 C 198,108 226,102 246,104 C 226,115 201,124 176,124 Z"
          fill="currentColor"
          opacity="0.9"
          filter="url(#bamboo-filter)"
        />
        <path d="M 176,124 C 200,121 230,126 249,134 C 225,136 199,132 176,124 Z" fill="#D49B6A" opacity="0.85" />
        <path d="M 176,124 C 191,140 208,157 219,176 C 208,157 193,140 176,124 Z" fill="#C83C23" opacity="0.8" />

        <path d="M 115,6 C 127,-6 146,-8 161,-6 C 146,1 129,6 115,6 Z" fill="currentColor" opacity="0.8" />
        <path d="M 115,6 C 101,-6 84,-8 67,-4 C 86,2 103,6 115,6 Z" fill="currentColor" opacity="0.75" />
        <path d="M 109,65 C 130,58 155,62 172,70 C 153,71 130,68 109,65 Z" fill="currentColor" opacity="0.85" />

        {/* Falling Bamboo Leaf (Mono no aware / 物の哀れ) */}
        <path d="M 180,210 C 195,217 210,215 218,208 C 210,206 195,206 180,210 Z" fill="#C83C23" opacity="0.8" />
        <circle cx="188" cy="228" r="1.5" fill="#D49B6A" opacity="0.75" />
        <circle cx="204" cy="192" r="1.2" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
};
