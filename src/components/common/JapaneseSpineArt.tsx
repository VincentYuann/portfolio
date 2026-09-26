import React, { useMemo } from 'react';

export interface JapaneseSpinePhrase {
  text: string;
  label?: string;
  meaning?: string;
}

export const JAPANESE_SPINE_PHRASES: JapaneseSpinePhrase[] = [
  { text: '未来を描き、共に創る。', label: 'CO-CREATION', meaning: 'Drawing the future, creating together' },
  { text: '簡潔な構造美、確固たる論理。', label: 'CLEAN ARCH', meaning: 'Beauty of concise structure, resolute logic' },
  { text: '不断の研鑽、道の探求。', label: 'SHOKUNIN', meaning: 'Continuous refinement, pursuit of the way' },
  { text: '静寂の中に、光を見出す。', label: 'SERENITY', meaning: 'Finding light within the silence' },
  { text: '虚空に宿る、無限の可能性。', label: 'VOID & POTENTIAL', meaning: 'Infinite possibilities residing in the void' },
  { text: '間と余白に宿る美意識。', label: 'MA · 間', meaning: 'Aesthetic consciousness living in negative space' },
  { text: '技を研ぎ澄まし、知を紡ぐ。', label: 'CRAFT & AI', meaning: 'Honing the craft, weaving intelligence' },
  { text: '変革の風に、帆を掲げて。', label: 'INNOVATION', meaning: 'Hoisting sails to the winds of transformation' },
  { text: '一意専心、無限の創造。', label: 'FOCUS', meaning: 'Single-minded devotion, boundless creation' },
];

export interface JapaneseSpineArtProps {
  className?: string;
  /** @deprecated Use seal image instead */
  char?: string;
  /** Which side of the viewport to pin to */
  side?: 'left' | 'right';
  /** Fixed top offset (CSS value) */
  topOffset?: string;
  /** Unique key for deterministic random phrase selection */
  seed?: number;
}

/**
 * Purely decorative Japanese calligraphy spine accent.
 * Non-interactive (pointer-events-none), no click handlers.
 * Designed to be placed on the left/right margins of the page at various heights.
 */
export const JapaneseSpineArt: React.FC<JapaneseSpineArtProps> = ({
  className = '',
  side = 'left',
  topOffset,
  seed = 0,
}) => {
  // Deterministic phrase selection based on seed
  const phrase = useMemo(() => {
    const idx = seed % JAPANESE_SPINE_PHRASES.length;
    return JAPANESE_SPINE_PHRASES[idx];
  }, [seed]);

  const sidePosition = side === 'left'
    ? { left: '0.75rem' }
    : { right: '0.75rem' };

  return (
    <aside
      aria-hidden="true"
      className={`hidden lg:flex flex-col items-center gap-2 select-none pointer-events-none z-10 absolute ${className}`}
      style={{
        top: topOffset,
        ...sidePosition,
      }}
    >
      {/* Top Vermilion Cinnabar Dot */}
      <span className="w-1.5 h-1.5 rounded-full bg-terracotta/60" />

      {/* Vertical Japanese Calligraphy Text */}
      <div
        className="writing-vertical-rl font-vertical text-[11px] tracking-[0.3em] text-light-ink-muted/50 dark:text-dark-ink-muted/40 font-medium py-1"
        style={{ writingMode: 'vertical-rl' }}
      >
        {phrase.text}
      </div>

      {/* Thin Vertical Hairline Divider */}
      <div className="w-[1px] h-14 bg-gradient-to-b from-terracotta/30 via-light-border/40 dark:via-dark-border/30 to-transparent" />

      {/* Custom Generated Hanko Seal Stamp (replaces hardcoded 原) */}
      <div className="w-7 h-7 rounded-[3px] overflow-hidden opacity-70">
        <img
          src="./images/custom-hanko-seal.jpg"
          alt=""
          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-screen dark:invert"
          loading="lazy"
          decoding="async"
        />
      </div>
    </aside>
  );
};

/**
 * Renders multiple JapaneseSpineArt decorations scattered along both sides
 * of the page at randomized heights. Drop this into App.tsx as a global overlay.
 */
export const JapaneseSpineDecorations: React.FC = () => {
  // Pre-computed decoration positions — alternating left/right at varied heights
  const decorations = useMemo(() => [
    { side: 'left' as const, top: '12%', seed: 0 },
    { side: 'right' as const, top: '22%', seed: 1 },
    { side: 'left' as const, top: '38%', seed: 2 },
    { side: 'right' as const, top: '52%', seed: 3 },
    { side: 'left' as const, top: '65%', seed: 4 },
    { side: 'right' as const, top: '78%', seed: 5 },
  ], []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden hidden lg:block"
    >
      {decorations.map((d, i) => (
        <JapaneseSpineArt
          key={i}
          side={d.side}
          topOffset={d.top}
          seed={d.seed}
        />
      ))}
    </div>
  );
};
