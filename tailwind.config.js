/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Akari Day tokens (Canonical DESIGN.md specification)
        light: {
          canvas: '#F2E9DA',
          surface: '#F7F0E3',
          'surface-raised': '#FBF6EC',
          'surface-muted': '#EDE1CE',
          'surface-card': '#F7F0E3',
          ink: '#2B2E3A',
          'ink-muted': '#6B6559',
          'ink-subtle': '#8B8375',
          border: '#D9C9AE',
          'border-strong': '#BDAA89',
          'button-dark': '#26262E',
          'on-dark': '#F7F0E3',
        },
        // Charcoal Night tokens (Canonical DESIGN.md specification)
        dark: {
          canvas: '#1E1F24',
          surface: '#2A2C32',
          'surface-raised': '#32343B',
          'surface-muted': '#24262C',
          'surface-card': '#1B1C22',
          ink: '#E8E6DF',
          'ink-muted': '#A7A398',
          'ink-subtle': '#797A7E',
          border: '#3A3D44',
          'border-strong': '#565A63',
          'button-light': '#E8E6DF',
          'on-light': '#1E1F24',
        },
        // Brand & Accent tokens
        terracotta: {
          DEFAULT: '#C83C23',
          hover: '#B12C14',
          soft: '#FFDAD3',
          glow: 'rgba(200, 60, 35, 0.35)',
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
        serif: ['Noto Serif', 'Canela', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
        vertical: ['Noto Serif JP', 'Noto Serif', 'Songti TC', 'serif'],
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
        akari: '0 8px 24px rgba(43, 46, 58, 0.06)',
        'akari-raised': '0 16px 40px rgba(43, 46, 58, 0.1)',
        'night-glow': '0 10px 30px rgba(0, 0, 0, 0.45)',
        'hanko-glow': '0 0 16px rgba(200, 60, 35, 0.4)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
