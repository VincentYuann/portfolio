import React, { useState, useEffect } from 'react';

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

// Curated aesthetic placement presets along the side margins
const PLACEMENT_SPOTS = [
  { top: '16%', left: '1.25rem', right: 'auto', side: 'left' },
  { top: '22%', left: '1.75rem', right: 'auto', side: 'left' },
  { top: '28%', left: '1.25rem', right: 'auto', side: 'left' },
  { top: '34%', left: '1.5rem', right: 'auto', side: 'left' },
  { top: '20%', left: 'auto', right: '1.5rem', side: 'right' },
  { top: '28%', left: 'auto', right: '1.75rem', side: 'right' },
];

export interface JapaneseSpineArtProps {
  className?: string;
  char?: string;
}

export const JapaneseSpineArt: React.FC<JapaneseSpineArtProps> = ({
  className = '',
  char = '原',
}) => {
  const [mounted, setMounted] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [spotIdx, setSpotIdx] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    // Randomize initial phrase and placement on client mount
    const initialPhrase = Math.floor(Math.random() * JAPANESE_SPINE_PHRASES.length);
    const initialSpot = Math.floor(Math.random() * 4); // Default to left side spots for balanced hero alignment
    setPhraseIdx(initialPhrase);
    setSpotIdx(initialSpot);
    setMounted(false);
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    setIsRotating(true);
    setTimeout(() => {
      setPhraseIdx((prev) => (prev + 1) % JAPANESE_SPINE_PHRASES.length);
      setSpotIdx((prev) => (prev + 1) % PLACEMENT_SPOTS.length);
      setIsRotating(false);
    }, 200);
  };

  const currentPhrase = JAPANESE_SPINE_PHRASES[phraseIdx];
  const currentSpot = PLACEMENT_SPOTS[spotIdx];

  return (
    <aside
      aria-label="Decorative Japanese Calligraphy Accent"
      onClick={handleNext}
      title={`${currentPhrase.meaning} (Click to shuffle)`}
      className={`hidden md:flex flex-col items-center gap-2 select-none cursor-pointer group/spine z-20 transition-all duration-700 ease-out ${
        mounted ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{
        top: currentSpot.top,
        left: currentSpot.left !== 'auto' ? currentSpot.left : undefined,
        right: currentSpot.right !== 'auto' ? currentSpot.right : undefined,
      }}
    >
      {/* Top Vermilion Cinnabar Sun Dot */}
      <div className="relative flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-terracotta group-hover/spine:scale-125 transition-transform duration-300" />
        <span className="absolute w-3 h-3 rounded-full bg-terracotta/30 animate-ping pointer-events-none" />
      </div>

      {/* Vertical Japanese Calligraphy Text */}
      <div
        className={`writing-vertical-rl font-vertical text-xs tracking-[0.32em] text-light-ink-muted/80 dark:text-dark-ink-muted/80 group-hover/spine:text-terracotta font-medium transition-all duration-300 py-1.5 drop-shadow-2xs ${
          isRotating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {currentPhrase.text}
      </div>

      {/* Thin Vertical Hairline Divider */}
      <div className="w-[1px] h-16 sm:h-24 bg-gradient-to-b from-terracotta/40 via-light-border dark:via-dark-border to-terracotta/60 group-hover/spine:h-28 transition-all duration-300" />

      {/* Custom Japanese Art-Styled Logo / Hanko Seal Stamp */}
      <div className="relative group-hover/spine:scale-110 transition-transform duration-300">
        {/* Outer Stamp Frame with Double Hairline */}
        <div className="w-7 h-7 rounded-[3px] border border-terracotta/90 bg-light-canvas/90 dark:bg-dark-canvas/90 backdrop-blur-xs flex items-center justify-center shadow-2xs relative overflow-hidden">
          {/* Subtle Inner Hairline Frame */}
          <div className="absolute inset-[2px] border border-terracotta/30 rounded-[1px] pointer-events-none" />
          {/* Kanji Monogram */}
          <span className="font-serif font-bold text-xs text-terracotta leading-none relative z-10 select-none">
            {char}
          </span>
        </div>
        {/* Ambient Seal Glow on Hover */}
        <div className="absolute -inset-1 rounded-sm bg-terracotta/15 blur-[6px] opacity-0 group-hover/spine:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </aside>
  );
};
