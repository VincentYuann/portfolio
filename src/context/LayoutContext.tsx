import React, { createContext, useContext, useState } from 'react';

export type WideLayoutVariationId = 'blueprint' | 'telemetry' | 'gallery' | 'matrix';

export interface WideLayoutVariationInfo {
  id: WideLayoutVariationId;
  numericKey: '1' | '2' | '3' | '4';
  name: string;
  kanji: string;
  subtitle: string;
  description: string;
  experienceLayout: 'split' | 'stack' | 'bleed';
  projectsLayout: 'editorial' | 'telemetry' | 'gallery';
  philosophyLayout: 'bento' | 'matrix' | 'cards';
  vibe: string;
}

export const WIDE_LAYOUT_VARIANTS: Record<WideLayoutVariationId, WideLayoutVariationInfo> = {
  blueprint: {
    id: 'blueprint',
    numericKey: '1',
    name: 'Asymmetric Blueprint',
    kanji: '構',
    subtitle: 'Dual-Rail Milestones & Editorial Case Studies',
    description: 'Golden-ratio master-detail split for career milestones paired with alternating cinematic editorial project showcases.',
    experienceLayout: 'split',
    projectsLayout: 'editorial',
    philosophyLayout: 'bento',
    vibe: 'Architectural joinery, sticky milestone dossier, zero scroll fatigue.',
  },
  telemetry: {
    id: 'telemetry',
    numericKey: '2',
    name: 'Telemetry Horizon',
    kanji: '測',
    subtitle: 'Continuous Horizontal Strips & High-Density Dossiers',
    description: 'Data-dense horizontal telemetry ribbons and expanded impact bars for immediate recruiter scannability.',
    experienceLayout: 'split',
    projectsLayout: 'telemetry',
    philosophyLayout: 'matrix',
    vibe: 'High-precision engineering flight deck, dense metrics, instant glanceability.',
  },
  gallery: {
    id: 'gallery',
    numericKey: '3',
    name: 'Edge-Bleed Ma Gallery',
    kanji: '間',
    subtitle: 'Artisanal Negative Space & Gutter Artwork Bleed',
    description: 'Wide washi canvas where media and Sumi-e motifs breathe into the margins while typography adheres to tight editorial line lengths.',
    experienceLayout: 'bleed',
    projectsLayout: 'gallery',
    philosophyLayout: 'cards',
    vibe: 'Pure Japanese Wabi-Sabi shokunin tranquility, generous negative space.',
  },
  matrix: {
    id: 'matrix',
    numericKey: '4',
    name: 'Capability Radar Matrix',
    kanji: '陣',
    subtitle: 'Domain Switcher & Dynamic Systems Dossier',
    description: 'Filters career impact and architectures dynamically across Full-Stack, AI Systems, and Distributed Cloud domains.',
    experienceLayout: 'split',
    projectsLayout: 'editorial',
    philosophyLayout: 'matrix',
    vibe: 'Interactive domain filtering for specialized AI & distributed systems recruiters.',
  },
};

interface LayoutContextValue {
  layoutVariant: WideLayoutVariationId;
  setLayoutVariant: (variant: WideLayoutVariationId) => void;
  layoutInfo: WideLayoutVariationInfo;
  layoutsList: WideLayoutVariationInfo[];
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

const STORAGE_KEY = 'portfolio_wide_layout_variant';

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layoutVariant, setLayoutVariantState] = useState<WideLayoutVariationId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as WideLayoutVariationId | null;
      if (saved && WIDE_LAYOUT_VARIANTS[saved]) return saved;
    }
    return 'blueprint';
  });

  const setLayoutVariant = (variant: WideLayoutVariationId) => {
    if (WIDE_LAYOUT_VARIANTS[variant]) {
      setLayoutVariantState(variant);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, variant);
      }
    }
  };

  const layoutInfo = WIDE_LAYOUT_VARIANTS[layoutVariant] || WIDE_LAYOUT_VARIANTS.blueprint;
  const layoutsList = Object.values(WIDE_LAYOUT_VARIANTS);

  return (
    <LayoutContext.Provider
      value={{
        layoutVariant,
        setLayoutVariant,
        layoutInfo,
        layoutsList,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutVariant = (): LayoutContextValue => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutVariant must be used within a LayoutProvider');
  }
  return context;
};
