---
version: 1.2.0
name: Vincent Yuan: Akari Day & Night Portfolio Design System
description: >-
  A two-theme portfolio design system combining a warm Akari-inspired
  editorial day mode with a quiet charcoal night mode. The visual language is
  Japanese-influenced, tactile, precise, and deliberately sparse, embodying Ma (negative space),
  Shokunin (artisan precision), and Wabi-Sabi (subtle organic harmony).
colors:
  # Shared brand / identity
  identity-accent: "#B5482E"
  identity-accent-hover: "#9E3D27"
  identity-accent-soft: "#F0D7C7"
  terracotta: "#C83C23"
  ochre: "#D49B6A"
  bamboo: "#526D57"

  # Light theme: canonical Akari palette
  light-canvas: "#F2E9DA"
  light-surface: "#F7F0E3"
  light-surface-card: "#F7F0E3"
  light-surface-raised: "#FBF6EC"
  light-surface-muted: "#EDE1CE"
  light-ink: "#2B2E3A"
  light-ink-muted: "#6B6559"
  light-ink-subtle: "#8B8375"
  light-border: "#D9C9AE"
  light-border-strong: "#BDAA89"
  light-button-dark: "#26262E"
  light-on-dark: "#F7F0E3"
  light-focus: "#B5482E"
  light-success: "#526D57"
  light-warning: "#9A6B2E"
  light-error: "#B5482E"

  # Dark theme: blue-charcoal night counterpart
  dark-canvas: "#1E1F24"
  dark-surface: "#2A2C32"
  dark-surface-card: "#1B1C22"
  dark-surface-raised: "#32343B"
  dark-surface-muted: "#24262C"
  dark-ink: "#E8E6DF"
  dark-ink-muted: "#A7A398"
  dark-ink-subtle: "#797A7E"
  dark-border: "#3A3D44"
  dark-border-strong: "#565A63"
  dark-button-light: "#E8E6DF"
  dark-on-light: "#1E1F24"
  dark-focus: "#C65B42"
  dark-success: "#87A889"
  dark-warning: "#D3A45B"
  dark-error: "#D86A50"

typography:
  display-xl:
    fontFamily: "Canela, Iowan Old Style, Georgia, serif"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  display-lg:
    fontFamily: "Canela, Iowan Old Style, Georgia, serif"
    fontSize: "52px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline-lg:
    fontFamily: "Canela, Iowan Old Style, Georgia, serif"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: "Canela, Iowan Old Style, Georgia, serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  headline-sm:
    fontFamily: "Montserrat, Inter, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.01em"
  body-lg:
    fontFamily: "Montserrat, Inter, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  body-md:
    fontFamily: "Montserrat, Inter, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  body-sm:
    fontFamily: "Montserrat, Inter, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0.005em"
  label-lg:
    fontFamily: "Montserrat, Inter, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0.08em"
  label-md:
    fontFamily: "Montserrat, Inter, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.12em"
  label-caps:
    fontFamily: "Montserrat, Inter, Arial, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.16em"
  code-md:
    fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  code-sm:
    fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"

spacing:
  px: "1px"
  0: "0px"
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
  20: "80px"
  24: "96px"
  32: "128px"
  page-gutter-mobile: "20px"
  page-gutter-tablet: "32px"
  page-gutter-desktop: "48px"
  content-max: "1440px"
  content-reading-max: "720px"
  sidebar-width: "240px"
  grid-gap: "24px"

rounded:
  none: "0px"
  hairline: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  pill: "9999px"
---

# Vincent Yuan: Akari Day & Night Portfolio Design System

## 1. Overview & Architectural POV

This is the canonical design system specification for **Vincent Yuan, Full-Stack Software Engineer (Systems Architecture & AI concentrations)** based in **Philadelphia, PA**. 

The design combines the restraint of Japanese architectural philosophies (*Ma* — negative space, *Wabi-Sabi* — organic elegance, and *Shokunin* — disciplined artisan precision) with the clarity and robustness of modern full-stack systems engineering.

### Dual-Theme Equilibrium
- **Akari Day Mode**: Warm washi-paper canvas (`#F2E9DA`), parchment surfaces (`#F7F0E3`), delicate tan borders (`#D9C9AE`), and softened sumi charcoal text (`#2B2E3A`). Evokes daylight through shoji screens, studio paper, bamboo, and warm cedar.
- **Charcoal Night Mode**: Deep blue-charcoal canvas (`#1E1F24`), obsidian surfaces (`#1B1C22`), graphite borders (`#3A3D44`), and warm off-white typography (`#E8E6DF`). Evokes a focused evening workbench rather than a neon cyber aesthetic.

### Accent Color Discipline
**Terracotta Cinnabar (`#C83C23` / `#B5482E`)** is the sole deliberate brand accent in both themes. Like an authentic Japanese Hanko seal impression, it carries weight through rarity and intentionality. It is never used as a generic background flood or decorative distraction.

---

## 2. Punctuation & Typography Standards

### Absolute Elimination of Em & En Dashes
To maintain crisp, distraction-free typographic rhythm and avoid visual collisions:
- **Never use em dashes (`—`) or en dashes (`–`) anywhere in user-facing copy, headers, date ranges, or code comments.**
- **Use standard clean punctuation**: Colons (`:`), commas (`,`), standard hyphens (`-`), or centered middle dots (`·`).
- **Examples**:
  - *Incorrect*: `Origin & Trajectory — Phase 01`
  - *Correct*: `Origin & Trajectory · Phase 01` or `Origin & Trajectory: Phase 01`
  - *Incorrect*: `Sept 2021 — Present`
  - *Correct*: `Sept 2021 - Present`

### Type Hierarchy & Families
1. **Canela / Serif** (`font-serif`): Expressive editorial serif used for display headlines, section numbers (`01 //`, `02 //`), and Kanji title watermarks (`原点と哲学`, `職歴`, `主な作品`).
2. **Montserrat / Sans** (`font-sans`): Clear operational sans-serif used for body text, navigation links, descriptions, tooltips, and buttons.
3. **JetBrains Mono / Monospace** (`font-mono`): Technical annotations, date ranges, index tags (`#01`), uppercase subtitle ribbons, and code blocks.
4. **Vertical Tategaki** (`writing-vertical-rl font-vertical`): Traditional Japanese vertical prose layout used in the Hanko Showcase Card and floating margin widgets.

---

## 3. Standardized Section Header Design Pattern

Every major section across the portfolio follows an identical 5-tier structural pattern:

```tsx
<div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-light-border/70 dark:border-[#2D3039]/80 gap-6">
  <div className="max-w-3xl">
    {/* 1. Numerals & Uppercase Eyebrow */}
    <div className="flex items-center gap-2 mb-2">
      <span className="font-serif text-terracotta text-sm">0X //</span>
      <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
        SECTION TITLE · 日本語
      </span>
    </div>

    {/* 2. Main Title with Inline Kanji Accent */}
    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal">
      English Title{' '}
      <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
        漢字
      </span>
    </h2>

    {/* 3. Explanatory Context Subtitle */}
    <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 font-light leading-relaxed">
      One to two concise sentences establishing the purpose and scope of the section.
    </p>
  </div>

  {/* 4. Optional Right-Side Controls / Action Links */}
  <div className="flex items-center gap-3 shrink-0">
    ...
  </div>
</div>
```

### Section Breakdown on Home Page:
- **01 // Home & Hero** (`#home`): Hanko seal card, introductory narrative, and technical domain pills.
- **02 // CAREER TRAJECTORY · 職歴** (`#experience`): Engineering chronology, timeline rail, active status pill, and `Expand All / Collapse All` toggle.
- **03 // SELECTED PORTFOLIO · 作品** (`#featured-works`): Featured project showcase cards, architecture deep-dive modals, and `View All Projects (N)` link.
- **04 // ORIGIN & ARCHITECTURAL PHILOSOPHY · 原点と哲学** (`#philosophy`): 04.1 Origin & Trajectory 4-phase framework + 04.2 Three Architectural Pillars (`間`, `調和`, `職人`).
- **05 // DIALOGUE & CORRESPONDENCE · 対話と通信** (`#contact`): Inquiry form, verified direct mail link, and 1-click **Copy Email** button with checkmark feedback.

---

## 4. Reusable Widgets & Components Catalog

### 1. Ensō Orbital Circle (`<EnsoOrbital />`)
- **File**: `src/components/EnsoOrbital.tsx`
- **Visual Anatomy**:
  1. Calligraphic sumi-e brush body with ink bleed displacement filter (`filter="url(#enso-ink-bleed)"`).
  2. Rotating golden orbit arc (`animate-orbital-spin` 22s, `#D59E66`).
  3. Incandescent pulsing vermilion bead at golden arc apex (`animate-ruby-pulse` 2.6s, `#C83C23`).
  4. Concentric dashed red orbit trail (`animate-dash-flow`).
  5. Orbiting celestial dust particles.
- **Props**:
  - `placement`: `'top-left'` (standard) | `'top-right'` | `'center'` | `'custom'`
  - `size`: `80` (archive card), `88` (milestone card), `96` (showcase card), `112` (pillar card), `120` (contact card), `128` (origin bento), `136` (hero seal box).
  - `hoverOnly`: `true` (default) | `false`
  - `active`: Optional `boolean` for state-driven visibility overrides.
- **Mutually-Exclusive Hover Rule**: In composite card structures (e.g. Section 04 Origin Trajectory containing 4 milestone cards), strictly **one Ensō circle blooms at any given time**. Hovering the container triggers the container circle; hovering a child milestone transfers the bloom exclusively to that milestone's circle.

### 2. Vertical Floating Margin Widgets (`<VerticalMarginWidget />`)
- **File**: `src/components/VerticalMarginWidget.tsx`
- **Purpose**: Balances widescreen desktop margins (`hidden xl:flex` / `hidden lg:flex`) with architectural *tategaki* Japanese marginalia, telemetry coordinates, pulsing jewel dots, and Hanko seal stamps.
- **Preset Dictionary (`MARGIN_PRESETS`)**:
  - `inkHarmony`: Motto `余白の調和` // `HARMONY`, Stamp `墨` (Projects Archive left flank).
  - `codeSoul`: Motto `コードの魂` // `DIGITAL CRAFT`, Stamp `道` (Projects Archive right flank).
  - `maWabi`: Motto `空間の美学` // `MA & WABI`, Stamp `原` (Philosophy Bento left flank).
  - `craftSpec`: Motto `職人の規矩` // `CRAFT SPEC`, Stamp `寂` (Philosophy Bento right flank).
  - `seiJaku`: Motto `沈黙と静寂` // `SEI & JAKU`, Stamp `侘` (Resume page left flank).
  - `rekiTimeline`: Motto `歩みの軌跡` // `TIMELINE`, Stamp `歴` (Experience timeline left flank).

### 3. Hanko Seal Stamp (`<HankoStamp />`)
- **File**: `src/components/HankoStamp.tsx`
- **Purpose**: Authentic cinnabar vermilion seal script mark (`原` - Haru/Origin by default) enclosed in a double square hairline border with breathing pulse animation (`animate-seal-breathe` 6s).
- **Hero Showcase Card**: Houses the seal, live coordinate header (`PHILADELPHIA, PA`), availability pill (`OPEN TO ROLES · FULL-STACK`), and a 3-column vertical tategaki prose widget:
  1. `間と余白の美学` (`MA · 間` — Aesthetics of Negative Space)
  2. `静寂と簡素な調和` (`WA · 調和` — Silence and Simple Harmony)
  3. `職人の精緻な組手` (`CRAFT · 職人` — Artisan Precision and Joinery)

### 4. Technical Domain Badges (`<TechTag />`)
- **File**: `src/components/TechTag.tsx`
- **Purpose**: Clean, monochrome technology tags with Lucide domain icons (Terminal, Code2, Database, Box, Workflow, Server, Sparkles).
- **Strict Rule**: Anti-rainbow rule. Tags must never use randomized pastel green, blue, or yellow fills. They remain strictly monochromatic with subtle terracotta hover transitions.
- **Sizes**: `sm` (10px text, 3px icon), `md` (11px text, 3.5px icon), `lg` (12px text, 4px icon).

### 5. Corner Hairline Brackets (`<CornerBrackets />`)
- **File**: `src/components/CornerBrackets.tsx`
- **Purpose**: Four subtle L-brackets positioned in card corners.
- **Behavior**: On card hover, brackets shift outward by 2px (`transform: translate(±2px, ±2px)`) and transition to terracotta cinnabar.
- **Sizes**: `sm` (10px), `md` (12px), `lg` (16px).

### 6. Classical Card Frame (`.classical-card-frame`)
- **CSS Class**: Inset hairline border (`inset: 6px`, `rgba(212, 155, 106, 0.12)` in light / `rgba(212, 155, 106, 0.08)` in dark) creating artisan joinery framing.
- **Strict Rule**: No mouse-following radial gradients. The card surface remains pure, crisp, and undisturbed.

### 7. Section Dividers (`<SectionDivider />`)
- **File**: `src/components/SectionDivider.tsx`
- **Anatomy**: Concentric diamond crests with center dots (`<DiamondCrest />`) + layered SVG Seigaiha wave surges (`<SeigaihaMotif />`) flanking a dashed ochre rule with section annotations.

### 8. Project Detail Case Study Modal (`<ProjectDetailModal />`)
- **File**: `src/components/ProjectDetailModal.tsx`
- **Anatomy**:
  - Top header: Kanji watermark, category badge, and active status pill.
  - Left column: 16:10 showcase media, technology stack badges, and direct external links.
  - Right column: Title, subtitle, architectural narrative, key architectural highlights bullet list, and operational metrics grid.
  - Dismissal: Keyboard Escape, backdrop click, or Close button.

---

## 5. Origin Trajectory 4-Phase Framework

Section 04.1 replaces generic story blurbs with an authentic chronological narrative:
1. **Phase 01: The Spark & Logic** (Web Roots / High School): Discovering how code transforms static markup into dynamic systems with JavaScript logic.
2. **Phase 02: Mechanics & State** (System Mechanics / College OOP): Exploring game loops, collision mathematics, and state machines with Python and Pygame.
3. **Phase 03: Beyond the Iceberg** (Data Flow & APIs / Co-op): Realizing frontend is the tip of the iceberg, diving deep into API contracts, relational schemas, caching, and backend systems.
4. **Phase 04: Hospitality Empathy** (User-First Craft / Hospitality Roots): Years in the Philadelphia service industry translating into active listening, anticipating friction points, and human-centered software engineering.

---

## 6. Admin CMS Dashboard Standards (`src/components/EditPage/`)

- **Collapsible Drawers Default Closed**: All accordion panels in `IntroEditor.tsx` (`Identity`, `Social`, `Technical Domains`, `Hanko Seal`) and `PhilosophyEditor.tsx` (`Origin Trajectory`, `Architectural Pillars`) must start **closed by default** on mount to keep the interface decluttered.
- **Dirty State Tracking**: Real-time event dispatching (`portfolio-admin-dirty` / `portfolio-admin-clean`) to warn against unsaved changes.
- **Deterministic Sync**: Direct Supabase database persistence with instant toast confirmation.

---

## 7. Complete Do's and Don'ts

### Do
- **Do preserve exact canonical tokens**: `#F2E9DA` / `#F7F0E3` (Day) and `#1E1F24` / `#1B1C22` (Night).
- **Do use terracotta cinnabar (`#C83C23`) sparingly** as a single intentional focal point.
- **Do keep resting cards serene** and reveal Ensō orbital circles exclusively on active card hover (`hoverOnly={true}`).
- **Do enforce mutually-exclusive Ensō hover** in nested card structures (strictly 1 circle at a time).
- **Do make entire project cards clickable** (`cursor-pointer`) and attach `e.stopPropagation()` to outbound link buttons.
- **Do use clean punctuation**: Colons, commas, hyphens, and middle dots instead of em/en dashes.
- **Do start admin editor accordions in closed state** for clean ergonomics.
- **Do maintain WCAG AA contrast compliance** across both Day and Night modes.

### Don't
- **Don't use em dashes (`—`) or en dashes (`–`) anywhere** in copy, headers, subtitles, or comments.
- **Don't add mouse-following radial gradients** that darken or whiten card surfaces under the cursor.
- **Don't trigger multiple Ensō circles simultaneously** on nested parent/child elements.
- **Don't introduce rainbow tags** (no pastel blue, green, purple, yellow badges).
- **Don't use teal, cyan, neon green, or second competing accent colors**.
- **Don't use bubbly rounded corners (e.g. 24px+)** on standard cards; preserve the disciplined `rounded-xl` shape language.
- **Don't allow external link clicks to inadvertently open detail modals** (always attach `e.stopPropagation()`).
