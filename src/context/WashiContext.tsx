import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export type WashiPresetId = 'silk' | 'kozo' | 'raw' | 'custom';

export interface WashiPresetInfo {
  id: WashiPresetId;
  numericKey: '1' | '2' | '3';
  name: string;
  kanji: string;
  subtitle: string;
  dayRoughness: number;    // Percentage (e.g. 8 = 8% opacity)
  nightRoughness: number;  // Percentage (e.g. 4.5 = 4.5% opacity)
  grainFrequency: number;  // Base frequency for SVG turbulence
  vibe: string;
  description: string;
}

export const WASHI_PRESETS: Record<'silk' | 'kozo' | 'raw', WashiPresetInfo> = {
  silk: {
    id: 'silk',
    numericKey: '1',
    name: 'Silk Washi · 絹紙',
    kanji: '絹',
    subtitle: 'Fine Micro-Grain / Minimalist Smoothness',
    dayRoughness: 8,
    nightRoughness: 4.5,
    grainFrequency: 0.92,
    vibe: 'Delicate, whisper-quiet silk-pressed stationery',
    description: 'Polished fine-fiber finish with micro-tooth texture for ultra-clean digital reading and subtle tactile warmth.',
  },
  kozo: {
    id: 'kozo',
    numericKey: '2',
    name: 'Artisan Kozo · 楮紙',
    kanji: '楮',
    subtitle: 'Handcrafted Mulberry / Balanced Tooth',
    dayRoughness: 16,
    nightRoughness: 6.5,
    grainFrequency: 0.90,
    vibe: 'Authentic Kyoto stationery, calibrated organic tooth',
    description: 'Traditional handmade mulberry paper with visible fiber weave and tactile tooth, bringing tactile warmth to Day and Night.',
  },
  raw: {
    id: 'raw',
    numericKey: '3',
    name: 'Raw Heritage · 生漉',
    kanji: '生',
    subtitle: 'Unbleached Coarse Pulp / Deep Tactile Tooth',
    dayRoughness: 25,
    nightRoughness: 12,
    grainFrequency: 0.52,
    vibe: 'Rustic artisanal pulp, deep organic fiber presence',
    description: 'Unbleached, heavy-grain washi with bold fiber tooth and tactile materiality that celebrates raw natural paper imperfections.',
  },
};

export const createWashiSvgDataUri = (frequency: number) => {
  return `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${frequency.toFixed(2)}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperGrain)'/%3E%3C/svg%3E")`;
};

interface WashiContextType {
  preset: WashiPresetId;
  dayRoughness: number;
  nightRoughness: number;
  grainFrequency: number;
  presetsList: WashiPresetInfo[];
  currentPresetInfo: WashiPresetInfo | null;
  setPreset: (presetId: 'silk' | 'kozo' | 'raw') => void;
  setDayRoughness: (value: number) => void;
  setNightRoughness: (value: number) => void;
  setGrainFrequency: (value: number) => void;
  resetWashiDefaults: () => void;
}

const WashiContext = createContext<WashiContextType | undefined>(undefined);

export const WashiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default to 'kozo' (15% day, 7.5% night, 0.72 freq)
  const [preset, setPresetState] = useState<WashiPresetId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profolio-washi-preset');
      if (saved === 'silk' || saved === 'kozo' || saved === 'raw' || saved === 'custom') {
        return saved;
      }
    }
    return 'kozo';
  });

  const [dayRoughness, setDayRoughnessState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profolio-washi-day');
      if (saved && !isNaN(Number(saved))) return Number(saved);
    }
    return WASHI_PRESETS.kozo.dayRoughness;
  });

  const [nightRoughness, setNightRoughnessState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profolio-washi-night');
      if (saved && !isNaN(Number(saved))) return Number(saved);
    }
    return WASHI_PRESETS.kozo.nightRoughness;
  });

  const [grainFrequency, setGrainFrequencyState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profolio-washi-freq');
      if (saved && !isNaN(Number(saved))) return Number(saved);
    }
    return WASHI_PRESETS.kozo.grainFrequency;
  });

  // Apply CSS custom properties to documentElement
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const dayOpacityVal = (dayRoughness / 100).toFixed(3);
    const nightOpacityVal = (nightRoughness / 100).toFixed(3);
    const textureUri = createWashiSvgDataUri(grainFrequency);

    root.style.setProperty('--washi-custom-day-opacity', dayOpacityVal);
    root.style.setProperty('--washi-custom-night-opacity', nightOpacityVal);
    root.style.setProperty('--washi-texture', textureUri);
    root.setAttribute('data-washi-preset', preset);

    if (typeof window !== 'undefined') {
      localStorage.setItem('profolio-washi-preset', preset);
      localStorage.setItem('profolio-washi-day', dayRoughness.toString());
      localStorage.setItem('profolio-washi-night', nightRoughness.toString());
      localStorage.setItem('profolio-washi-freq', grainFrequency.toString());
    }
  }, [preset, dayRoughness, nightRoughness, grainFrequency]);

  const setPreset = useCallback((presetId: 'silk' | 'kozo' | 'raw') => {
    const config = WASHI_PRESETS[presetId];
    if (!config) return;
    setPresetState(presetId);
    setDayRoughnessState(config.dayRoughness);
    setNightRoughnessState(config.nightRoughness);
    setGrainFrequencyState(config.grainFrequency);
  }, []);

  const setDayRoughness = useCallback((val: number) => {
    setDayRoughnessState(val);
    setPresetState('custom');
  }, []);

  const setNightRoughness = useCallback((val: number) => {
    setNightRoughnessState(val);
    setPresetState('custom');
  }, []);

  const setGrainFrequency = useCallback((val: number) => {
    setGrainFrequencyState(val);
    setPresetState('custom');
  }, []);

  const resetWashiDefaults = useCallback(() => {
    setPreset('kozo');
  }, [setPreset]);

  const presetsList = useMemo(() => Object.values(WASHI_PRESETS), []);
  const currentPresetInfo = preset !== 'custom' ? WASHI_PRESETS[preset] : null;

  return (
    <WashiContext.Provider
      value={{
        preset,
        dayRoughness,
        nightRoughness,
        grainFrequency,
        presetsList,
        currentPresetInfo,
        setPreset,
        setDayRoughness,
        setNightRoughness,
        setGrainFrequency,
        resetWashiDefaults,
      }}
    >
      {children}
    </WashiContext.Provider>
  );
};

export const useWashi = () => {
  const context = useContext(WashiContext);
  if (!context) {
    throw new Error('useWashi must be used within a WashiProvider');
  }
  return context;
};
