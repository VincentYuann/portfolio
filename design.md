---
version: 2.1.0
name: Vincent Yuan - Akari Craft & Editorial Design System
description: >-
  A restrained, museum-grade portfolio design system combining a warm Akari washi paper
  day mode with a quiet charred cedar charcoal night mode. Grounded in Japanese craft,
  tactile materiality, and editorial typography, embodying Ma (negative space), Shokunin
  (artisan precision), and Wabi-Sabi (organic harmony), free from cyberpunk or SaaS clichés.
colors:
  # Shared brand / identity
  identity-accent: "#B5482E"
  identity-accent-hover: "#9E3D27"
  identity-accent-soft: "#F0D7C7"
  terracotta: "#B5482E"
  ochre: "#D49B6A"
  bamboo: "#526D57"
  akari-glow: "rgba(232, 162, 86, 0.08)"

  # Light theme: Washi & Akari Paper (Canonical Reference Spec)
  light-canvas: "#F2E9DA"
  light-surface: "#F7F0E3"
  light-surface-card: "#F7F0E3"
  light-surface-raised: "#FBF6EC"
  light-surface-muted: "#EDE1CE"
  light-ink: "#282E3A"
  light-ink-muted: "#686559"
  light-ink-subtle: "#8B8375"
  light-border: "#D9C9AE"
  light-border-strong: "#BDAA89"
  light-button-dark: "#26262E"
  light-on-dark: "#F7F0E3"
  light-focus: "#B5482E"

  # Dark theme: Sumi & Charred Cedar (Canonical 4-Tier Reference Spec)
  dark-canvas: "#1E1F24"
  dark-panel: "#2A2C32"
  dark-surface: "#2A2C32"
  dark-card: "#2A2C32"
  dark-surface-card: "#2A2C32"
  dark-surface-raised: "#353842"
  dark-surface-muted: "#18191D"
  dark-ink: "#E8E6DF"
  dark-ink-muted: "#A7A398"
  dark-ink-subtle: "#76736A"
  dark-border: "#3A3D44"
  dark-border-strong: "#4E525D"
  dark-border-subtle: "rgba(182, 175, 162, 0.18)"
  dark-button-light: "#E8E6DF"
  dark-on-light: "#1E1F24"
  dark-focus: "#B5482E"

typography:
  display-xl:
    fontFamily: "Zen Old Mincho, Noto Serif JP, Georgia, serif"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  display-lg:
    fontFamily: "Zen Old Mincho, Noto Serif JP, Georgia, serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: "Zen Old Mincho, Noto Serif JP, Georgia, serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  headline-md:
    fontFamily: "Zen Old Mincho, Noto Serif JP, Georgia, serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  headline-sm:
    fontFamily: "Chakra Petch, Mulish, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0.02em"
  body-lg:
    fontFamily: "Mulish, Inter, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0em"
  body-md:
    fontFamily: "Mulish, Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  body-sm:
    fontFamily: "Mulish, Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.01em"
  code-md:
    fontFamily: "Azeret Mono, JetBrains Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  code-sm:
    fontFamily: "Azeret Mono, JetBrains Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.02em"
  label-xs:
    fontFamily: "Azeret Mono, JetBrains Mono, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.03em"
  stamp-xs:
    fontFamily: "Zen Old Mincho, Noto Serif JP, Georgia, serif"
    fontSize: "9px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0em"

rounded:
  none: "0px"
  xs: "2px"
  sm: "2px"
  md: "3px"
  lg: "3px"
  xl: "3px"
  2xl: "3px"
  3xl: "3px"
  pill: "3px"
  full: "9999px"

spacing:
  page-gutter-mobile: "20px"
  page-gutter-tablet: "32px"
  page-gutter-desktop: "48px"
  section-gap-mobile: "64px"
  section-gap-desktop: "112px"
  content-max: "1440px"
  content-reading-max: "720px"

components:
  button-primary:
    backgroundColor: "{colors.light-button-dark}"
    textColor: "{colors.light-on-dark}"
    rounded: "{rounded.xs}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.identity-accent}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.light-ink}"
    rounded: "{rounded.xs}"
    padding: "10px 20px"
  card-resting:
    backgroundColor: "{colors.light-surface-card}"
    rounded: "{rounded.md}"
    padding: "24px 32px"
  card-featured:
    backgroundColor: "{colors.light-surface-card}"
    rounded: "{rounded.md}"
    padding: "32px 48px"
  tag-pill:
    backgroundColor: "{colors.light-surface-raised}"
    textColor: "{colors.light-ink-muted}"
    rounded: "{rounded.xs}"
    padding: "2px 8px"
---

# Vincent Yuan: Akari Craft & Editorial Design System (v2.1)

## Overview

The Vincent Yuan portfolio visual system is an homage to traditional Japanese material craft and fine editorial book design. It intentionally rejects the ubiquitous dark-mode cyberpunk tropes (neon glows, HUD targeting brackets, cyan/orange terminal styling, sci-fi fonts) in favor of quiet confidence, intentional negative space (_Ma_ 間), and artisan joinery (_Shokunin_ 職人).

### The Dual-Theme Equilibrium

- **Akari Day Mode (Washi & Akari Paper)**:
  - Base canvas: `#F2E9DA` (unbleached warm cream base mimicking raw washi fibers)
  - Card & panel surfaces: `#F7F0E3` (elevated, readable washi surface)
  - Primary text: `#282E3A` (_sumi_ ink wash, soft yet commanding)
  - Muted metadata: `#686559` (earthy charcoal-stone)
  - Hairline borders: `#D9C9AE` (muted bamboo tone)
  - Primary button: `#26262E` with `#F7F0E3` text
  - Identity accent: `#B5482E` (_shu-iro_ vermilion seal stamp)
- **Charred Cedar Night Mode (Sumi & Charred Cedar)**:
  - Base canvas: `#1E1F24` (deep blue-charcoal wash, never cold OLED `#000000`)
  - Card & panel surfaces: `#2A2C32` (elevated charred cedar wood tone)
  - Primary text: `#E8E6DF` (warm off-white)
  - Muted metadata: `#A7A398` (soft gray stone)
  - Hairline borders: `#3A3D44` (`rgba(58, 61, 68, 0.75)` subtle warm-gray outlines)
  - Primary button: `#E8E6DF` with `#1E1F24` text
  - Identity accent: `#B5482E` (_shu-iro_ vermilion)

---

## Colors

### Canonical Color Matrix

| Token Role               | Light (Washi)              | Dark (Sumi & Cedar)        | Usage / Intent                                |
| ------------------------ | -------------------------- | -------------------------- | --------------------------------------------- |
| **Canvas Ground**        | `#F2E9DA`                  | `#1E1F24`                  | Root viewport background                      |
| **Card / Panel Surface** | `#F7F0E3`                  | `#2A2C32`                  | Content cards, milestone cards, project tiles |
| **Elevated Surface**     | `#FBF6EC`                  | `#353842`                  | Raised tooltips, input fields, popovers       |
| **Muted Surface**        | `#EDE1CE`                  | `#18191D`                  | Thumbnail track, image preview wells          |
| **Primary Ink**          | `#282E3A`                  | `#E8E6DF`                  | Display titles, main headings, primary text   |
| **Muted Ink**            | `#686559`                  | `#A7A398`                  | Subtitles, body descriptions, narrative text  |
| **Subtle Ink**           | `#8B8375`                  | `#76736A`                  | Coordinates, timestamps, category tags        |
| **Hairline Border**      | `#D9C9AE`                  | `#3A3D44`                  | 1px delicate structural framing               |
| **Strong Border**        | `#BDAA89`                  | `#4E525D`                  | Hover states, active tabs, focused elements   |
| **Interactive Primary**  | `#26262E`                  | `#E8E6DF`                  | Primary CTA buttons, active segmented switch  |
| **Interactive Text**     | `#F7F0E3`                  | `#1E1F24`                  | High-contrast label on primary button         |
| **Identity Accent**      | `#B5482E`                  | `#B5482E`                  | Hanko seal stamps, active dots, selected tags |
| **Atmospheric Glow**     | `rgba(232, 162, 86, 0.08)` | `rgba(232, 162, 86, 0.04)` | Akari paper lantern radial warmth             |
| **Pine Accent**          | `#526D57`                  | `#526D57`                  | Subtle bamboo / botanical foliage cues        |
| **Ochre Accent**         | `#D49B6A`                  | `#D49B6A`                  | Geometric crests, watermark accents           |

### Accent Color Restraint: Terracotta Cinnabar (`#B5482E`)

- Traditional vermilion red (_shu-iro_ / `#B5482E`) is an **accent of intention**, like an authentic Hanko seal stamp pressed onto handmade paper.
- **Strict Prohibition**: Terracotta is NEVER a structural outline color for resting cards, container boxes, or timeline tracks.
- **Permitted Uses**:
  1. The authentic Hanko square seal (`[原]`, `[哲]`, `[創]`).
  2. The active status indicator dot on the availability badge.
  3. Interactive hover/focus color on text links and secondary buttons.

### Background Vignettes & Materiality

- **Feathered Edge Vignette**: All photography and sumi-e backdrops must feather into the paper canvas using `radial-gradient(ellipse ... at 50% 50%, black 30%, transparent 88%)`. No hard rectangular photo edges.
- **Paper Fiber Texture**: Global fixed SVG noise texture applied via `body::before` at `opacity: 0.04`.

---

## Typography

### The 4-Font Architectural Hierarchy

1. **Display & Major Headings** (`font-serif`):
   - **Zen Old Mincho** (`font-family: "Zen Old Mincho", Noto Serif JP, Georgia, serif;`)
   - Weights: 400 (Regular), 500 (Medium), 600 (Semi-bold).
   - Character: Light, authentic Japanese editorial calligraphy, letterpress breathing room.
   - Roles: Hero display titles, section titles (`01 //`, `02 //`), company names in career timeline, and Kanji watermarks.

2. **Body & Operational Copy** (`font-sans`):
   - **Mulish** (`font-family: Mulish, Inter, system-ui, sans-serif;`)
   - Weights: 200 to 900.
   - Character: Neutral modernist grotesque, balanced spacing, readable cadence for project summaries and narratives.

3. **Category Eyebrows & Dossier Accents** (`font-chakra`):
   - **Chakra Petch** (`font-family: "Chakra Petch", Mulish, sans-serif;`)
   - Weights: 300, 400, 500, 600.
   - Roles: Category eyebrow chips (`[ ATELIER DOSSIER · 工匠の記録 ]`), sub-section dividers.

### Type Scale Specification

| Step          | Size | Line Height | Weight | Tracking | Primary Family |
| ------------- | ---- | ----------- | ------ | -------- | -------------- |
| `display-xl`  | 64px | 1.08        | 400    | -0.025em | Zen Old Mincho |
| `display-lg`  | 48px | 1.12        | 400    | -0.02em  | Zen Old Mincho |
| `headline-lg` | 36px | 1.18        | 400    | -0.015em | Zen Old Mincho |
| `headline-md` | 28px | 1.25        | 400    | -0.01em  | Zen Old Mincho |
| `headline-sm` | 18px | 1.35        | 500    | +0.02em  | Chakra Petch   |
| `body-lg`     | 17px | 1.70        | 400    | 0.00em   | Mulish         |
| `body-md`     | 15px | 1.65        | 400    | 0.00em   | Mulish         |
| `body-sm`     | 13px | 1.60        | 400    | +0.01em  | Mulish         |
| `code-md`     | 13px | 1.65        | 400    | 0.00em   | Azeret Mono    |
| `code-sm`     | 11px | 1.50        | 400    | +0.02em  | Azeret Mono    |
| `label-xs`    | 10px | 1.40        | 500    | +0.03em  | Azeret Mono    |
| `stamp-xs`    | 9px  | 1.00        | 500    | 0.00em   | Zen Old Mincho |

### Punctuation Standard

- Strict elimination of digital em dashes (`—`) and en dashes (`–`).
- Use standard hyphens (`-`), colons (`:`), commas (`,`), and centered middle dots (`·`).

---

## Layout

### Spatial Cadence: Negative Space (_Ma_ 間)

- **Section Spacing**: Full `py-24 lg:py-32` (`8rem`–`12rem` / `96px`–`128px`) vertical rhythm between major sections.
- **Page Gutters**: `px-4 sm:px-6 lg:px-12` across viewports.
- **Maximum Width**: Container max-width constrained to `max-w-7xl` (`1280px`–`1440px`), with narrative reading widths capped at `max-w-xl` (`576px`) or `max-w-3xl` (`768px`).

### Parallax Layering: The Division Effect

1. **Pinned Hero Canvas**:
   - Pinned atmospheric background with panoramic sumi-e landscape, pine tree (_Matsu_), and Akari paper lantern illumination.
2. **Heavy Container Mask-Sliding**:
   - Subsequent sections (Experience, Projects, Philosophy) are constructed as solid independent surface layers (`bg-light-canvas dark:bg-[#1E1F24]`).
   - As the user scrolls, the heavy surface slides smoothly over the pinned hero area.
   - The boundary edge features an understated line divider with central diamond crest (`─── ◇ ───`).

---

## Elevation & Depth

### The 4-Layer Optical Composite System

The atmospheric, tactile depth of the interface is achieved through an intentional 4-layer optical composite rather than flat digital hex values. Both themes mirror each other with authentic material physics:

#### Night Mode: Sumi & Charred Cedar (焼杉 Yakisugi)

1. **Layer 1 (Base Tone - Charred Cedar)**:
   - Canvas Ground: `#1E1F24` (warm sumi ink wash with blue-brown undertones; never cold OLED `#000000`).
   - Card Surface: `#2A2C32` (slightly elevated charred cedar _yakisugi_ wood tone).
   - Hairline Border: `#3A3D44` (`rgba(58, 61, 68, 0.75)` quiet warm-gray outline).
2. **Layer 2 (Tactile Paper Grain Overlay - Washi Tooth)**:
   - Pinned viewport pseudo-element `body::before` running procedural SVG fractal noise (`type="fractalNoise"`, `baseFrequency="0.8"`) at `opacity: 0.04`.
   - Breaks up smooth digital monitor subpixels, providing physical tooth and organic texture.
3. **Layer 3 (Atmospheric Sumi-e Ink Mist & Blend Modes)**:
   - Traditional sumi-e ink wash art embedded in section chambers (`bamboo.jpg`, `ocean.jpg`, `mountain.jpg`, `tree.jpg`).
   - Applied with `mix-blend-luminosity`, `opacity: 0.15`–`0.20`, and `filter: brightness(0.75)`.
   - Feathered seamlessly via `mask-image: radial-gradient(ellipse 90% 75% at 50% 50%, black 25%, transparent 85%)`.
4. **Layer 4 (Ambient Paper Lantern Glow - Akari Illumination)**:
   - Soft radial ochre wash: `bg-radial-[at_center] from-ochre/[0.025] to-transparent` (w-96 h-96).
   - Simulates warm candlelight from an Akari paper lantern casting subtle illumination across charred wood and slate.

#### Light Mode: Unbleached Washi & Akari Paper (和紙・明かり)

1. **Layer 1 (Base Tone - Raw Washi Paper)**:
   - Canvas Ground: `#F2E9DA` (unbleached warm cream base mimicking raw kozo/mulberry fibers).
   - Card Surface: `#F7F0E3` (elevated, readable washi sheet surface).
   - Hairline Border: `#D9C9AE` (delicate natural bamboo stalk tone).
   - Primary Ink: `#282E3A` (traditional deep sumi ink).
   - Muted Ink: `#686559` (earthy charcoal-stone).
2. **Layer 2 (Tactile Paper Grain Overlay - Washi Tooth)**:
   - Same global `body::before` fractal noise at `opacity: 0.04`.
   - On the warm cream `#F2E9DA` canvas, the micro-noise reads as authentic handmade washi paper fibers and organic paper irregularities.
3. **Layer 3 (Atmospheric Sumi-e Ink Deposition - Multiply Blend Mode)**:
   - Traditional sumi-e ink wash artwork embedded in section chambers.
   - Applied with `mix-blend-multiply` at `opacity: 0.25`–`0.30`.
   - **Physics of `mix-blend-multiply`**: In light mode, the light paper background of the artwork multiplies into `#F2E9DA` and disappears completely, depositing pure sumi ink brush strokes directly onto the canvas with zero rectangular boundaries.
   - Feathered seamlessly into negative space (_Ma_) via `mask-image: radial-gradient(...)`.
4. **Layer 4 (Ambient Warm Paper Lantern Glow - Akari Illumination)**:
   - Soft radial ochre wash: `bg-radial-[at_center] from-ochre/[0.04] to-transparent` (w-96 h-96).
   - Simulates the soft, diffused amber glow radiating through a handmade washi paper screen (_shoji_ 障子).

### 4-Tier Architectural Hierarchy

To eliminate visual claustrophobia and "box-in-a-box" clutter:

1. **Tier 0 (Canvas Ground)**: `#F2E9DA` (Day) / `#1E1F24` (Night).
2. **Tier 1 (Atmospheric Chamber)**: Subtle linear/radial gradient washes blending seamlessly into canvas.
3. **Tier 2 (Panels & Cards)**: Elevated content surfaces (`#F7F0E3` / `#2A2C32`) with 1px hairline borders (`#D9C9AE` / `#3A3D44`).
4. **Tier 3 (Raised Controls & Modals)**: `#FBF6EC` / `#353842` for active segmented controls, floating search bars, and dialog overlays.

### Shadow Philosophy

- Strictly no saturated or neon color drops (no orange/cyan glows).
- Soft natural contact shadows: `box-shadow: 0 1px 3px rgba(40, 46, 58, 0.04), 0 1px 2px rgba(40, 46, 58, 0.02)`.

---

## Shapes

### Deliberate 0px to 3px Corner Radii

- **Cards & Bento Boxes**: `rounded-[3px]` (`md: 3px`, `lg: 3px`).
- **Buttons, Inputs, Badges, Chips**: `rounded-[2px]` (`xs: 2px`, `sm: 2px`).
- **Circular Radii (`rounded-full` / `9999px`)**: Exclusively permitted for Enso orbital rings, status dot indicators, and circular avatar seals.
- **Strict Prohibition**: Bubble corners (`rounded-xl` / `12px`, `16px`, `24px`) are banned.

### Hairline Joinery & Frames

- **Single Hairline**: Standard 1px solid border (`#D9C9AE` / `#3A3D44`).
- **Double Hairline**: 1px outer border, 3px transparent gap, 1px inner hairline border (`.double-hairline`).
- **Kumiko Corner Brackets**: Subtle L-shaped tick marks at card extremities (`<CornerBrackets size="md" />`).

---

## Components

### Extracted Core Components

1. **`HeroAkariStudio` (`src/components/sections/hero/HeroAkariStudio.tsx`)**:
   - Variant 2 (Studio Frame) layout.
   - Left colophon: Dedicated **Atelier Dossier** (`[ ATELIER DOSSIER · 工匠の記録 ]`) with Philly coordinates, Drexel CS degree, availability status dot, and direct channels.
   - Right canvas: Large serif headline, dual action buttons (charcoal primary + hairline secondary), and concrete 3-pillar technical substrate cards (`Systems & Cloud`, `Frontend & UI`, `Agentic AI & RAG`).

2. **`SectionHeading` (`src/components/common/SectionHeading.tsx`)**:
   - Ambient Akari lantern radial warmth (`rgba(232, 162, 86, 0.08)` to `0.02`).
   - Numeral prefix (`02 //`, `03 //`, etc.) with vermilion square Hanko stamp anchor (`[原]`, `[哲]`).
   - Bilingual title with Zen Old Mincho serif display and Japanese subtitle.

3. **`SectionDivider` (`src/components/common/SectionDivider.tsx`)**:
   - Thin horizontal hairline rule accented by central geometric diamond crest (`─── ◇ ───`).
   - Crisp `rounded-[2px]` badge container.

4. **`CornerBrackets` (`src/components/common/CornerBrackets.tsx`)**:
   - Precision Kumiko-inspired hairline brackets at top-left, top-right, bottom-left, and bottom-right corners.
   - Low-contrast styling (`border-ochre/20` / `border-dark-border/40`).

5. **`HankoStamp` (`src/components/common/HankoStamp.tsx`)**:
   - Traditional vermilion cinnabar seal (`#B5482E`) stamped with Kanji identity.

6. **`EnsoOrbital` (`src/components/common/EnsoOrbital.tsx`)**:
   - Calligraphic sumi-e Enso ring formulated on milestone hover.
   - 5 distinct layers: sumi-e bamboo twigs with cinnabar leaf, rotating golden celestial arc, dashed vermilion ring, pulsing ruby bead, and breathing sumi-e brush ring.

7. **`BambooArt` (`src/components/common/BambooArt.tsx`)**:
   - High-fidelity sumi-e ink bamboo stalk with optional organic sway animation.

8. **Buttons & Form Inputs**:
   - Primary: High-contrast charcoal `#26262E` (Day) / warm off-white `#E8E6DF` (Night), `rounded-[2px]`, uppercase tracking.
   - Secondary: Hairline border outline, `rounded-[2px]`, subtle hover lift.
   - Text inputs & textareas: `rounded-[2px]`, `#282E3A` text, `#B5482E` focus outline.

---

## Do's and Don'ts

| Category       | Do (Enforced)                                                                   | Don't (Strictly Banned)                                              |
| -------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Corners**    | Use `rounded-[2px]` for buttons/chips and `rounded-[3px]` for cards.            | Never use pill buttons or bubbly `12px`/`16px`/`24px` rounded cards. |
| **Palette**    | Use washi `#F2E9DA` (Day) and charred cedar `#1E1F24` / `#2A2C32` (Night).      | Never use cold OLED pitch black (`#000000` / `#090A0C`).             |
| **Accent**     | Reserve terracotta cinnabar (`#B5482E`) for seals, active dots, and focal tags. | Never use orange/terracotta as structural resting card outlines.     |
| **Borders**    | Use subtle warm-gray borders (`#3A3D44` / `rgba(58, 61, 68, 0.75)`).            | Never use bright white or glowing neon borders in dark mode.         |
| **Typography** | Use Zen Old Mincho for headings, Mulish for body, Azeret Mono for code.         | Never use futuristic HUD or sci-fi fonts (`Oxanium`, etc.).          |
| **Imagery**    | Apply feathered `radial-gradient` masks so photos fade into paper.              | Never display harsh, hard-cropped rectangular photos.                |
| **Whitespace** | Provide generous `8rem`–`12rem` (`py-24 lg:py-32`) spacing (_Ma_).              | Never create cramped, stacked, box-inside-box layouts.               |
| **Depth**      | Rely on subtle surface tone shifts and soft contact shadows.                    | Never use saturated neon drop-shadows or cyber glow filters.         |
