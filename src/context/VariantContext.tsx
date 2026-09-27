import React, { createContext, useContext, useState, useEffect } from 'react';

export type TypographyVariantId = 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7';

export interface TypographyVariantInfo {
  id: TypographyVariantId;
  numericKey: '1' | '2' | '3' | '4' | '5' | '6' | '7';
  name: string;
  kanji: string;
  tagline: string;
  displayFont: string;
  bodyFont: string;
  monoFont: string;
  accentFont: string;
  vibe: string;
  description: string;
}

export const TYPOGRAPHY_VARIANTS: Record<TypographyVariantId, TypographyVariantInfo> = {
  v1: {
    id: 'v1',
    numericKey: '1',
    name: 'Kyoto Wabi-Sabi Monograph',
    kanji: '雅 · 典雅',
    tagline: 'Literary Mincho & Humanist Warmth',
    displayFont: 'Zen Old Mincho',
    bodyFont: 'Mulish',
    monoFont: 'Azeret Mono',
    accentFont: 'Chakra Petch',
    vibe: 'Poetic, tactile stationery craft, museum editorial, authentic Kyoto literary rhythm.',
    description: 'Delicate Mincho serif titles with brush terminals paired with soft humanist sans body copy and geometric monospace coordinates.',
  },
  v2: {
    id: 'v2',
    numericKey: '2',
    name: 'Tokyo Structural Brutalist',
    kanji: '構 · 構造',
    tagline: 'Sculptural Avant-Garde & High-Velocity Engineering',
    displayFont: 'Syne',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'Space Mono',
    accentFont: 'Chakra Petch',
    vibe: 'Architectural joinery, algorithmic constructivism, modern Tokyo creative tech studio.',
    description: 'Bold, wide sculptural display typography (Syne) paired with crisp modern neo-grotesque sans (Plus Jakarta) and raw blueprint telemetry monospace (Space Mono).',
  },
  v3: {
    id: 'v3',
    numericKey: '3',
    name: 'Editorial Broadside & Haute Horlogerie',
    kanji: '銘 · 銘文',
    tagline: 'High-Contrast Transitional Serif & Curatorial Typewriter',
    displayFont: 'Cormorant Garamond',
    bodyFont: 'Source Serif 4',
    monoFont: 'IBM Plex Mono',
    accentFont: 'Playfair Display',
    vibe: 'High-fashion monograph, timeless luxury journal, prestigious academic research publication.',
    description: 'Graceful high-contrast Garamond headlines with sweeping italics, warm editorial book serif body text (Source Serif 4), and archival typewriter indexing (IBM Plex Mono).',
  },
  v4: {
    id: 'v4',
    numericKey: '4',
    name: 'Kyoto Neo-Grotesque & Algorithmic Minimal',
    kanji: '簡 · 簡素',
    tagline: 'Contemporary Ink-Trap Grotesque & Developer Craft',
    displayFont: 'Bricolage Grotesque',
    bodyFont: 'DM Sans',
    monoFont: 'JetBrains Mono',
    accentFont: 'Space Grotesk',
    vibe: 'Silicon Valley AI founder meets Scandinavian-Japanese functional minimalism.',
    description: 'Punchy neo-grotesque titles with contemporary ink-traps (Bricolage Grotesque) paired with airy, calm DM Sans body prose and IDE-grade JetBrains Mono.',
  },
  v5: {
    id: 'v5',
    numericKey: '5',
    name: 'Neo-Tokyo Cyber-Joinery',
    kanji: '斬 · 削角',
    tagline: 'Chamfered Cyber-Constructivism & High-Tech Joinery',
    displayFont: 'Chakra Petch',
    bodyFont: 'Mulish',
    monoFont: 'Azeret Mono',
    accentFont: 'Chakra Petch',
    vibe: 'Japanese mecha joinery, aerospace telemetry, high-precision engineering portfolio.',
    description: 'Striking 45-degree chamfered mechanical titles (Chakra Petch) paired with crystalline geometric sans body prose (Mulish) and dense architectural monospace telemetry (Azeret Mono).',
  },
  v6: {
    id: 'v6',
    numericKey: '6',
    name: 'Avant-Garde Hyper-Scale',
    kanji: '極 · 尖端',
    tagline: 'Expansive Ultra-Wide Grotesque & Spatial Architecture',
    displayFont: 'Unbounded',
    bodyFont: 'Plus Jakarta Sans',
    monoFont: 'JetBrains Mono',
    accentFont: 'Space Grotesk',
    vibe: 'Spatial computing, high-concept European creative agency, boundary-pushing contemporary AI studio.',
    description: 'Audacious, ultra-wide contemporary geometric display headlines (Unbounded) with expansive letterforms, paired with high-velocity modern sans (Plus Jakarta) and razor-sharp IDE monospace.',
  },
  v7: {
    id: 'v7',
    numericKey: '7',
    name: 'Algorithmic Monospace Poster',
    kanji: '符 · 暗号',
    tagline: 'Raw Monospace Titling & Algorithmic Blueprint Grid',
    displayFont: 'Azeret Mono',
    bodyFont: 'DM Sans',
    monoFont: 'Space Mono',
    accentFont: 'Bricolage Grotesque',
    vibe: 'Code-as-art, terminal constructivism, algorithmic systems engineer manifesto.',
    description: 'Bold code-first brutalist poster headlines typeset in tight, characterful monospace (Azeret Mono), contrasted with airy humanized sans body prose (DM Sans) and vintage lab telemetry (Space Mono).',
  },
};

// Aliases for backwards compatibility
export type DesignVariant = TypographyVariantId | 'tokonoma' | 'akari' | 'shokunin';

interface VariantContextType {
  variant: TypographyVariantId;
  currentVariantInfo: TypographyVariantInfo;
  setVariant: (v: TypographyVariantId) => void;
  toggleVariant: () => void;
  variantsList: TypographyVariantInfo[];
}

const VariantContext = createContext<VariantContextType | undefined>(undefined);

const normalizeVariant = (val: string | null): TypographyVariantId => {
  if (!val) return 'v4';
  if (val === 'v1' || val === '1' || val === 'tokonoma') return 'v1';
  if (val === 'v2' || val === '2' || val === 'akari') return 'v2';
  if (val === 'v3' || val === '3' || val === 'shokunin') return 'v3';
  if (val === 'v4' || val === '4') return 'v4';
  if (val === 'v5' || val === '5') return 'v5';
  if (val === 'v6' || val === '6') return 'v6';
  if (val === 'v7' || val === '7') return 'v7';
  return 'v4';
};

export const VariantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [variant, setVariantState] = useState<TypographyVariantId>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlVar = urlParams.get('variant') || urlParams.get('font');
      if (urlVar) {
        const normalized = normalizeVariant(urlVar);
        localStorage.setItem('profolio-typography-variant', normalized);
        return normalized;
      }
      const saved = localStorage.getItem('profolio-typography-variant') || localStorage.getItem('profolio-design-variant');
      return normalizeVariant(saved);
    }
    return 'v4';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-font-variant', variant);
      document.body.className = document.body.className
        .replace(/\bfont-variant-v[1-7]\b/g, '')
        .trim();
      document.body.classList.add(`font-variant-${variant}`);
    }
  }, [variant]);

  const setVariant = (v: TypographyVariantId) => {
    setVariantState(v);
    if (typeof window !== 'undefined') {
      localStorage.setItem('profolio-typography-variant', v);
      localStorage.setItem('profolio-design-variant', v);
      const url = new URL(window.location.href);
      url.searchParams.set('font', v);
      url.searchParams.set('variant', v.replace('v', ''));
      window.history.replaceState(null, '', url.toString());
    }
  };

  const toggleVariant = () => {
    const order: TypographyVariantId[] = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7'];
    const nextIndex = (order.indexOf(variant) + 1) % order.length;
    setVariant(order[nextIndex]);
  };

  const variantsList = Object.values(TYPOGRAPHY_VARIANTS);
  const currentVariantInfo = TYPOGRAPHY_VARIANTS[variant] || TYPOGRAPHY_VARIANTS.v1;

  return (
    <VariantContext.Provider
      value={{
        variant,
        currentVariantInfo,
        setVariant,
        toggleVariant,
        variantsList,
      }}
    >
      {children}
    </VariantContext.Provider>
  );
};

export const useVariant = () => {
  const context = useContext(VariantContext);
  if (!context) {
    throw new Error('useVariant must be used within a VariantProvider');
  }
  return context;
};
