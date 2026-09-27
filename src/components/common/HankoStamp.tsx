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
  const chars = (char || '原').trim();
  const len = chars.length;

  return (
    <div className={`relative inline-flex items-center justify-center select-none text-terracotta dark:text-ochre transition-colors duration-300 ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Outer stamp border */}
        <rect
          x="20"
          y="20"
          width="160"
          height="160"
          rx="22"
          ry="22"
          fill="none"
          stroke="currentColor"
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
          stroke="currentColor"
          strokeWidth="2.5"
          opacity="0.65"
        />
        {/* Traditional Kanji Character rendered in bold seal-script aesthetic */}
        {len <= 1 ? (
          <text
            x="100"
            y="134"
            fontFamily="'Noto Serif JP', 'Songti TC', 'Noto Serif', serif"
            fontWeight="900"
            fontSize="98"
            fill="currentColor"
            textAnchor="middle"
          >
            {chars || '原'}
          </text>
        ) : len === 2 ? (
          <>
            <text
              x="100"
              y="90"
              fontFamily="'Noto Serif JP', 'Songti TC', 'Noto Serif', serif"
              fontWeight="900"
              fontSize="52"
              fill="currentColor"
              textAnchor="middle"
            >
              {chars[0]}
            </text>
            <text
              x="100"
              y="148"
              fontFamily="'Noto Serif JP', 'Songti TC', 'Noto Serif', serif"
              fontWeight="900"
              fontSize="52"
              fill="currentColor"
              textAnchor="middle"
            >
              {chars[1]}
            </text>
          </>
        ) : len === 3 ? (
          <>
            <text
              x="100"
              y="78"
              fontFamily="'Noto Serif JP', 'Songti TC', 'Noto Serif', serif"
              fontWeight="900"
              fontSize="36"
              fill="currentColor"
              textAnchor="middle"
            >
              {chars[0]}
            </text>
            <text
              x="100"
              y="118"
              fontFamily="'Noto Serif JP', 'Songti TC', 'Noto Serif', serif"
              fontWeight="900"
              fontSize="36"
              fill="currentColor"
              textAnchor="middle"
            >
              {chars[1]}
            </text>
            <text
              x="100"
              y="158"
              fontFamily="'Noto Serif JP', 'Songti TC', 'Noto Serif', serif"
              fontWeight="900"
              fontSize="36"
              fill="currentColor"
              textAnchor="middle"
            >
              {chars[2]}
            </text>
          </>
        ) : (
          /* 4 characters: 2x2 seal grid */
          <>
            <text
              x="72"
              y="88"
              fontFamily="'Noto Serif JP', 'Songti TC', 'Noto Serif', serif"
              fontWeight="900"
              fontSize="40"
              fill="currentColor"
              textAnchor="middle"
            >
              {chars[0]}
            </text>
            <text
              x="128"
              y="88"
              fontFamily="'Noto Serif JP', 'Songti TC', 'Noto Serif', serif"
              fontWeight="900"
              fontSize="40"
              fill="currentColor"
              textAnchor="middle"
            >
              {chars[1]}
            </text>
            <text
              x="72"
              y="144"
              fontFamily="'Noto Serif JP', 'Songti TC', 'Noto Serif', serif"
              fontWeight="900"
              fontSize="40"
              fill="currentColor"
              textAnchor="middle"
            >
              {chars[2]}
            </text>
            <text
              x="128"
              y="144"
              fontFamily="'Noto Serif JP', 'Songti TC', 'Noto Serif', serif"
              fontWeight="900"
              fontSize="40"
              fill="currentColor"
              textAnchor="middle"
            >
              {chars[3]}
            </text>
          </>
        )}
        {/* Seal authentication dot */}
        <circle cx="152" cy="48" r="4.5" fill="currentColor" />
      </svg>
    </div>
  );
};
