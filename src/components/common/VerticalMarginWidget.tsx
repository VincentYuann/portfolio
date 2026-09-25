import React from 'react';

export type MarginWidgetType = 'full' | 'minimal' | 'calligraphy';
export type MarginPulseColor = 'terracotta' | 'bamboo' | 'ochre';

export interface VerticalMarginWidgetProps {
  side?: 'left' | 'right';
  top?: string;
  type?: MarginWidgetType;
  motto?: string;
  submotto?: string;
  coordinate?: string;
  pulseColor?: MarginPulseColor;
  stampChar?: string;
  className?: string;
  fixed?: boolean;
}

export const MARGIN_PRESETS = {
  maWabi: {
    motto: '空間の美学',
    submotto: 'MA & WABI',
    coordinate: "35°41'N · 139°46'E",
    pulseColor: 'terracotta' as MarginPulseColor,
    stampChar: '原',
  },
  craftSpec: {
    motto: '職人の規矩',
    submotto: 'CRAFT SPEC',
    coordinate: 'KYOTO · HEIAN ARCHIVE',
    pulseColor: 'bamboo' as MarginPulseColor,
    stampChar: '寂',
  },
  seiJaku: {
    motto: '沈黙と静寂',
    submotto: 'SEI & JAKU',
    coordinate: "35°00'N · 135°46'E",
    pulseColor: 'ochre' as MarginPulseColor,
    stampChar: '侘',
  },
  inkHarmony: {
    motto: '余白の調和',
    submotto: 'HARMONY',
    coordinate: 'TOKYO ARCHIVE',
    pulseColor: 'terracotta' as MarginPulseColor,
    stampChar: '墨',
  },
  shokuninCraft: {
    motto: '匠の精緻',
    submotto: 'SHOKUNIN',
    coordinate: "WATERLOO · 43°28'N",
    pulseColor: 'bamboo' as MarginPulseColor,
    stampChar: '匠',
  },
  akariSimplicity: {
    motto: '簡素の極み',
    submotto: 'SIMPLICITY',
    coordinate: 'AKARI STUDIO',
    pulseColor: 'ochre' as MarginPulseColor,
    stampChar: '明',
  },
  codeSoul: {
    motto: 'コードの魂',
    submotto: 'DIGITAL CRAFT',
    coordinate: 'SYSTEMS ARCHIVE',
    pulseColor: 'terracotta' as MarginPulseColor,
    stampChar: '道',
  },
};

export const VerticalMarginWidget: React.FC<VerticalMarginWidgetProps> = ({
  side = 'left',
  top = 'top-1/2 -translate-y-1/2',
  type = 'full',
  motto,
  submotto,
  coordinate,
  pulseColor = 'terracotta',
  stampChar = '原',
  className = '',
  fixed = false,
}) => {
  const sideClass =
    side === 'left'
      ? 'left-3 xl:left-7 2xl:left-10'
      : 'right-3 xl:right-7 2xl:right-10';

  const positionClass = fixed ? 'fixed' : 'absolute';

  const pulseDotClass =
    pulseColor === 'bamboo'
      ? 'bg-bamboo/80 animate-status-glow origin-center'
      : pulseColor === 'ochre'
      ? 'bg-ochre/80 animate-status-glow origin-center'
      : 'bg-terracotta/80 animate-ruby-pulse origin-center';

  const topHairlineGradient =
    side === 'left'
      ? 'bg-gradient-to-b from-transparent via-terracotta/40 to-ochre/40'
      : 'bg-gradient-to-b from-transparent via-bamboo/40 to-ochre/40';

  const bottomHairlineGradient =
    side === 'left'
      ? 'bg-gradient-to-b from-ochre/40 via-terracotta/30 to-transparent'
      : 'bg-gradient-to-b from-ochre/40 via-bamboo/30 to-transparent';

  return (
    <aside
      aria-hidden="true"
      className={`${positionClass} ${sideClass} ${top} hidden 2xl:flex flex-col items-center gap-3 text-light-ink-muted/70 dark:text-dark-ink-muted/60 pointer-events-none select-none z-20 ${className}`}
    >
      {type === 'minimal' ? (
        <>
          {/* Minimalist vertical line with Hanko seal box at bottom */}
          <div className="w-px h-28 sm:h-36 bg-gradient-to-b from-transparent via-ochre/40 to-terracotta/40" />
          <div className="w-5 h-5 border border-terracotta/70 dark:border-terracotta/80 rounded-xs flex items-center justify-center font-serif text-[10px] text-terracotta shadow-2xs">
            {stampChar}
          </div>
        </>
      ) : type === 'calligraphy' ? (
        <>
          {/* Top Hairline */}
          <div className={`w-px h-16 ${topHairlineGradient}`} />
          {/* Vertical Text */}
          {motto && (
            <div className="writing-vertical-rl font-mono text-[10px] tracking-[0.28em] uppercase opacity-90">
              {motto} {submotto && `// ${submotto}`}
            </div>
          )}
          {/* Center Pulse Dot */}
          <div className={`w-2 h-2 rounded-full ${pulseDotClass}`} />
          {/* Bottom Hairline */}
          <div className={`w-px h-16 ${bottomHairlineGradient}`} />
          {/* Stamp Box */}
          <div className="w-5 h-5 border border-terracotta/70 dark:border-terracotta/80 rounded-xs flex items-center justify-center font-serif text-[10px] text-terracotta shadow-2xs">
            {stampChar}
          </div>
        </>
      ) : (
        <>
          {/* Full Japanese Architectural Margin Accent */}
          <div className={`w-px h-20 ${topHairlineGradient}`} />
          {motto && (
            <div className="writing-vertical-rl font-mono text-[10px] tracking-[0.3em] uppercase opacity-90">
              {motto} {submotto && `// ${submotto}`}
            </div>
          )}
          <div className={`w-2 h-2 rounded-full ${pulseDotClass}`} />
          {coordinate && (
            <div className="writing-vertical-rl font-mono text-[10px] tracking-widest opacity-75">
              {coordinate}
            </div>
          )}
          <div className={`w-px h-16 ${bottomHairlineGradient}`} />
          <div className="w-5 h-5 border border-terracotta/70 dark:border-terracotta/80 rounded-xs flex items-center justify-center font-serif text-[10px] text-terracotta shadow-2xs">
            {stampChar}
          </div>
        </>
      )}
    </aside>
  );
};
