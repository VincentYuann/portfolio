/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Akari Day tokens (Canonical Washi & Akari Paper palette)
        light: {
          canvas: '#F2E9DA',
          surface: '#F7F0E3',
          'surface-raised': '#FBF6EC',
          'surface-muted': '#EDE1CE',
          'surface-card': 'rgba(247, 240, 227, 0.82)',
          ink: '#282E3A',
          'ink-muted': '#686559',
          'ink-subtle': '#8B8375',
          border: '#D9C9AE',
          'border-strong': '#BDAA89',
          'button-dark': '#26262E',
          'on-dark': '#F7F0E3',
        },
        // Dark Palette (Sumi & Charred Cedar: Canvas #1E1F24, Panel #2A2C32, Text #E8E6DF, Border #3A3D44)
        dark: {
          canvas: '#1E1F24',
          panel: '#2A2C32',
          surface: '#2A2C32',
          card: 'rgba(42, 44, 50, 0.85)',
          'surface-card': 'rgba(42, 44, 50, 0.85)',
          'surface-raised': '#32353C',
          'surface-muted': '#18191D',
          ink: '#E8E6DF',
          'ink-muted': '#A7A398',
          'ink-subtle': '#787368',
          border: '#3A3D44',
          'border-strong': '#4E525D',
          'button-light': '#E8E6DF',
          'on-light': '#1E1F24',
        },
        // Brand & Accent tokens
        terracotta: {
          DEFAULT: '#B5482E',
          hover: '#9E3D27',
          soft: '#F0D7C7',
          glow: 'rgba(181, 72, 46, 0.2)',
        },
        bamboo: {
          DEFAULT: '#526D57',
          light: '#658B7B',
          dark: '#2D4D40',
        },
        ochre: {
          DEFAULT: '#D49B6A',
          light: '#E5B88F',
          dark: '#936600',
        },
      },
      fontFamily: {
        serif: ['Zen Old Mincho', 'Noto Serif JP', 'Noto Serif', 'Georgia', 'serif'],
        sans: ['Mulish', 'Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Azeret Mono', 'JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
        vertical: ['Zen Old Mincho', 'Noto Serif JP', 'Noto Serif', 'serif'],
        display: ['Zen Old Mincho', 'Noto Serif JP', 'Noto Serif', 'serif'],
        chamfer: ['Chakra Petch', 'Azeret Mono', 'sans-serif'],
        chakra: ['Chakra Petch', 'sans-serif'],
        zen: ['Zen Old Mincho', 'Noto Serif JP', 'serif'],
        mulish: ['Mulish', 'sans-serif'],
        azeret: ['Azeret Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'display-lg': ['4rem', { lineHeight: '1.08' }],
      },
      spacing: {
        gutter: '1.5rem',
        'space-xs': '0.375rem',
        'space-sm': '0.75rem',
        'space-md': '1.25rem',
        'space-lg': '2rem',
        'space-xl': '3.5rem',
      },
      boxShadow: {
        akari: '0 4px 16px rgba(43, 46, 58, 0.04)',
        'akari-raised': '0 8px 24px rgba(43, 46, 58, 0.08)',
        'night-glow': '0 8px 24px -4px rgba(0, 0, 0, 0.5)',
        'hanko-glow': '0 0 12px rgba(181, 72, 46, 0.35)',
      },
      // Deliberate Border Radii: 0px to 3px for architectural structure & stationery craft
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '2px',
        md: '3px',
        lg: '3px',
        xl: '3px',
        '2xl': '3px',
        '3xl': '3px',
        pill: '3px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
