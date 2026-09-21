import React from 'react';

interface HankoStampProps {
  className?: string;
  char?: string;
  size?: number;
}

export const HankoStamp: React.FC<HankoStampProps> = ({
  className = 'w-9 h-9',
  char = '原',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Weathered cinnabar outer stamp border */}
        <rect
          x="20"
          y="20"
          width="160"
          height="160"
          rx="22"
          ry="22"
          fill="none"
          stroke="#C83C23"
          strokeWidth="13"
          strokeLinecap="round"
        />
        {/* Inner fine hairline border */}
        <rect
          x="34"
          y="34"
          width="132"
          height="132"
          rx="14"
          ry="14"
          fill="none"
          stroke="#C83C23"
          strokeWidth="2.5"
          opacity="0.65"
        />
        {/* Traditional Kanji Character rendered in bold seal-script aesthetic */}
        <text
          x="100"
          y="134"
          fontFamily="'Noto Serif JP', 'Songti TC', 'Noto Serif', serif"
          fontWeight="900"
          fontSize="98"
          fill="#C83C23"
          textAnchor="middle"
        >
          {char}
        </text>
        {/* Seal authentication dot */}
        <circle cx="152" cy="48" r="4.5" fill="#C83C23" />
      </svg>
    </div>
  );
};
