import React, { useMemo } from 'react';

const PHRASES = [
  '未来を描く',
  '侘寂',
  '木漏れ日',
  '間',
  '一期一会',
  '花鳥風月',
  '幽玄',
  '渋い',
  '物の哀れ',
  '静寂',
  '無心',
  '風雅',
];

/**
 * A single tiny decorative Japanese accent — just a short vertical phrase
 * with a small vermilion dot. No seal image, no vertical line, minimal.
 * Purely ornamental, fully non-interactive.
 */
const SpineAccent: React.FC<{
  phrase: string;
  top: string;
  side: 'left' | 'right';
  opacity: number;
}> = ({ phrase, top, side, opacity }) => {
  const posStyle: React.CSSProperties = {
    position: 'fixed',
    top,
    ...(side === 'left' ? { left: '0.6rem' } : { right: '0.6rem' }),
    opacity,
  };

  return (
    <div
      aria-hidden="true"
      className="hidden xl:flex flex-col items-center gap-1.5 pointer-events-none select-none z-[5]"
      style={posStyle}
    >
      {/* Tiny vermilion dot */}
      <span className="w-1 h-1 rounded-full bg-terracotta/40" />

      {/* Short vertical text */}
      <div
        className="font-vertical text-[10px] tracking-[0.25em] text-light-ink-muted/30 dark:text-dark-ink-muted/20 font-light"
        style={{ writingMode: 'vertical-rl' }}
      >
        {phrase}
      </div>
    </div>
  );
};

/**
 * A standalone hanko seal stamp decoration — just the seal image
 * with proper blending against both light and dark backgrounds.
 */
const SealAccent: React.FC<{
  top: string;
  side: 'left' | 'right';
  opacity: number;
}> = ({ top, side, opacity }) => {
  const posStyle: React.CSSProperties = {
    position: 'fixed',
    top,
    ...(side === 'left' ? { left: '0.5rem' } : { right: '0.5rem' }),
    opacity,
  };

  return (
    <div
      aria-hidden="true"
      className="hidden xl:block pointer-events-none select-none z-[5]"
      style={posStyle}
    >
      <img
        src="./images/custom-hanko-seal.jpg"
        alt=""
        className="w-5 h-5 object-cover rounded-[2px] mix-blend-multiply dark:mix-blend-lighten dark:opacity-30"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

/**
 * Seeded pseudo-random number generator for deterministic but varied placement.
 * Uses a simple linear congruential generator.
 */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Renders a few scattered Japanese decorative accents along the left and right
 * viewport margins. Each element is isolated — NOT stacked in a vertical strip.
 *
 * - Only 3-4 small text accents + 1-2 seal stamps, widely spaced
 * - Positions are randomized via a seeded PRNG (stable across renders)
 * - Very low opacity so they feel like subtle watermarks, not UI elements
 * - Only visible on xl+ screens (1280px+) to avoid crowding narrower layouts
 */
export const JapaneseSpineDecorations: React.FC = () => {
  const decorations = useMemo(() => {
    const rng = seededRandom(42);

    // Pick 4 random phrases (no duplicates)
    const shuffled = [...PHRASES].sort(() => rng() - 0.5);
    const picked = shuffled.slice(0, 4);

    // Generate well-spaced vertical positions between 10% and 85%
    // Each zone gets one element, with jitter within the zone
    const zones = [
      { min: 8, max: 20 },   // top area
      { min: 30, max: 45 },  // upper-mid
      { min: 55, max: 68 },  // lower-mid
      { min: 75, max: 88 },  // bottom area
    ];

    const textAccents = zones.map((zone, i) => {
      const top = zone.min + rng() * (zone.max - zone.min);
      const side = rng() > 0.5 ? 'left' as const : 'right' as const;
      const opacity = 0.35 + rng() * 0.25; // 0.35–0.60
      return { type: 'text' as const, phrase: picked[i], top: `${top.toFixed(1)}%`, side, opacity };
    });

    // 1-2 seal stamps placed in gaps between text accents
    const sealAccents = [
      {
        type: 'seal' as const,
        top: `${(22 + rng() * 8).toFixed(1)}%`,
        side: rng() > 0.5 ? 'left' as const : 'right' as const,
        opacity: 0.5,
      },
    ];

    return [...textAccents, ...sealAccents];
  }, []);

  return (
    <>
      {decorations.map((d, i) =>
        d.type === 'text' ? (
          <SpineAccent key={`t${i}`} phrase={d.phrase} top={d.top} side={d.side} opacity={d.opacity} />
        ) : (
          <SealAccent key={`s${i}`} top={d.top} side={d.side} opacity={d.opacity} />
        )
      )}
    </>
  );
};

// Keep the named export for backwards compat with Hero import
export const JapaneseSpineArt = SpineAccent;
