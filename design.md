---
version: 3.0.0
name: Vincent Yuan - Akari Craft & Editorial Design System
description: >-
  A restrained, museum-grade portfolio design system combining a warm Akari washi paper
  day mode with a quiet charred cedar charcoal night mode. Grounded in Japanese craft,
  tactile materiality, and editorial typography, embodying Ma (negative space), Shokunin
  (artisan precision), and Wabi-Sabi (organic harmony), free from cyberpunk or SaaS clichés.
colors:
  # Brand & Accent Roles
  terracotta: "#B5482E"          # Sacred Red: Vermilion Hanko Seal [原], [問] & Live Status Beacon
  ochre: "#D4A853"               # Warm Gold Accent: Akari Lantern Glow, Emblems & Dark Mode Buttons
  bamboo: "#526D57"              # Verdant Accent for Active Roles, Success Badges & Bamboo Foliage
  akari-glow: "rgba(212, 168, 83, 0.08)" # Diffused Candlelight through Shoji Washi

  # Light theme: Washi & Akari Paper (Sunlight on Parchment)
  light-canvas: "#EAE0CE"        # Calibrated warm natural cream canvas
  light-surface: "#FAF6EE"       # Clean warm washi paper surface
  light-surface-card: "#FAF6EE"  # Solid non-transparent washi card surface
  light-surface-raised: "#FFFFFF" # Pure crisp raised surface
  light-surface-muted: "#E4D8C3" # Muted well / thumbnail track
  light-ink: "#282E3A"           # Traditional deep sumi ink
  light-ink-muted: "#686559"     # Earthy charcoal-stone
  light-ink-subtle: "#8B8375"    # Subtle coordinate / timestamp ink
  light-border: "#D4C4AA"        # Delicate warm washi hairline border (Refined, never harsh)
  light-border-channel: "transparent"
  light-border-inner: "transparent"
  light-border-strong: "#BDAB8F" # Active / hover border state
  light-button-dark: "#26262E"   # Primary High-Contrast Button (Dark Charcoal on Cream Canvas)
  light-on-dark: "#FAF6EE"
  light-focus: "#B5482E"

  # Dark theme: Warm Charred Cedar / 焼杉 Yakisugi (Lantern Light on Dark Wood)
  dark-canvas: "#121316"         # Deep warm charred cedar ground (Never cold OLED #000000)
  dark-panel: "#23262F"          # Solid charred slate surface (Lighter than canvas)
  dark-surface: "#23262F"
  dark-card: "#23262F"
  dark-surface-card: "#23262F"   # Solid non-transparent card surface
  dark-surface-raised: "#2C303B" # Raised dialog / interactive element
  dark-surface-muted: "#0E0F12"  # Deep recessed track
  dark-ink: "#E8E6DF"            # Warm off-white
  dark-ink-muted: "#9E9A8E"      # Soft gray stone
  dark-ink-subtle: "#736F64"     # Subtle coordinate / timestamp ink
  dark-border: "#383B44"         # Outer hairline border
  dark-border-channel: "#18191E" # Inlaid recessed channel fill
  dark-border-inner: "#2E313A"   # Inner hairline border
  dark-border-strong: "#4E5362"  # Active / hover border state
  dark-button-light: "#D4A853"   # Warm brushed gold primary button
  dark-on-light: "#121316"
  dark-focus: "#D4A853"          # Warm Gold Focus (Prevents Red Alert Glare on Dark Surfaces)

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

# Vincent Yuan: Akari Craft & Editorial Design System (v3.0)

## Overview

The Vincent Yuan portfolio visual system is an homage to traditional Japanese material craft and fine editorial book design. It intentionally rejects the ubiquitous dark-mode cyberpunk tropes (neon glows, HUD targeting brackets, cyan/orange terminal styling, sci-fi fonts) in favor of quiet confidence, intentional negative space (_Ma_ 間), and artisan joinery (_Shokunin_ 職人).

### The Dual-Theme Equilibrium

- **Akari Day Mode (Washi & Akari Paper)**:
  - Base canvas: `#EAE0CE` (unbleached warm cream base mimicking raw washi fibers)
  - Card & panel surfaces: `#FAF6EE` (solid, non-transparent washi sheet surface)
  - Raised elements: `#FFFFFF` (crisp white raised controls & tooltips)
  - Primary text: `#282E3A` (_sumi_ ink wash, soft yet commanding)
  - Muted metadata: `#686559` (earthy charcoal-stone)
  - Inlaid hairline borders: `#C4A272` outer / `#E6D3B1` channel fill
  - Primary button: `#26262E` with `#FAF6EE` text
  - Identity accent: `#B5482E` (_shu-iro_ vermilion seal stamp)

- **Charred Cedar Night Mode (Sumi & Charred Cedar 焼杉)**:
  - Base canvas: `#121316` (deep warm charred cedar ground, never cold OLED `#000000`)
  - Card & panel surfaces: `#23262F` (solid charred slate surface, lighter than canvas)
  - Raised elements: `#2C303B` (raised dialogs & interactive controls)
  - Primary text: `#E8E6DF` (warm off-white)
  - Muted metadata: `#9E9A8E` (soft gray stone)
  - Inlaid hairline borders: `#383B44` outer / `#18191E` channel / `#2E313A` inner
  - Primary button: `#D4A853` with `#121316` text (brushed warm gold)
  - Identity accent: `#B5482E` (_shu-iro_ vermilion seal stamp)

---

## Colors

### Canonical Color Matrix

| Token Role               | Light (Washi)              | Dark (Sumi & Cedar)        | Usage / Intent                                |
| ------------------------ | -------------------------- | -------------------------- | --------------------------------------------- |
| **Canvas Ground**        | `#EAE0CE`                  | `#121316`                  | Root viewport background                      |
| **Card / Panel Surface** | `#FAF6EE`                  | `#23262F`                  | Solid content cards, milestones, project tiles |
| **Elevated Surface**     | `#FFFFFF`                  | `#2C303B`                  | Raised tooltips, input fields, popovers       |
| **Muted Surface**        | `#E4D8C3`                  | `#0E0F12`                  | Thumbnail track, image preview wells          |
| **Primary Ink**          | `#282E3A`                  | `#E8E6DF`                  | Display titles, main headings, primary text   |
| **Muted Ink**            | `#686559`                  | `#9E9A8E`                  | Subtitles, body descriptions, narrative text  |
| **Subtle Ink**           | `#8B8375`                  | `#736F64`                  | Coordinates, timestamps, category tags        |
| **Hairline Border**      | `#C4A272`                  | `#383B44`                  | 1px delicate structural framing               |
| **Border Channel Fill**  | `#E6D3B1`                  | `#18191E`                  | Inlaid double-border recessed channel         |
| **Strong Border**        | `#B28F5E`                  | `#4E5362`                  | Hover states, active tabs, focused elements   |
| **Interactive Primary**  | `#26262E`                  | `#D4A853`                  | Primary CTA buttons, active segmented switch  |
| **Interactive Text**     | `#FAF6EE`                  | `#121316`                  | High-contrast label on primary button         |
| **Identity Accent**      | `#B5482E`                  | `#B5482E`                  | Hanko seal stamps, active dots, selected tags |
| **Atmospheric Glow**     | `rgba(212, 168, 83, 0.08)` | `rgba(212, 168, 83, 0.04)` | Akari paper lantern radial warmth             |
| **Bamboo Accent**        | `#526D57`                  | `#526D57`                  | Verdant status pills & botanical foliage cues |
| **Ochre / Gold Accent**  | `#D4A853`                  | `#D4A853`                  | Warm gold emblems, waves & Night CTAs         |

### Accent Restraint & Materiality

- **Terracotta Cinnabar (`#B5482E`)**: Reserved strictly for authentic Hanko seals (`[原]`, `[問]`) and the pulsing availability beacon. Never used as structural resting card outlines.
- **Warm Gold / Amber Ochre (`#D4A853`)**: Serves as the primary night accent for buttons, focus rings, and decorative emblems, providing ambient lantern warmth without harsh neon glare.
- **Continuous Washi Grain**: Global fixed `body::before` viewport overlay (`z-index: 9999; pointer-events: none; opacity: 0.055` / `0.045`) uniformly casts tactile Japanese paper tooth over all solid surfaces without text bleed-through.

---

## Typography

### The 4-Font Architectural Hierarchy

1. **Display & Major Headings** (`font-serif`):
   - **Zen Old Mincho** (`font-family: "Zen Old Mincho", Noto Serif JP, Georgia, serif;`)
   - Weights: 400 (Regular), 500 (Medium), 600 (Semi-bold).
   - Roles: Hero display titles, section titles (`01 //`, `02 //`), company names in career timeline, and Kanji watermarks.

2. **Body & Operational Copy** (`font-sans`):
   - **Mulish** (`font-family: Mulish, Inter, system-ui, sans-serif;`)
   - Weights: 200 to 900.
   - Roles: Project narratives, overview text, and UI copy.

3. **Technical Specs & Monospace** (`font-mono`):
   - **Azeret Mono** (`font-family: "Azeret Mono", JetBrains Mono, monospace;`)
   - Roles: Code blocks, timestamps, coordinates, and technical badges.

4. **Category Eyebrows & Dossier Accents** (`font-chakra`):
   - **Chakra Petch** (`font-family: "Chakra Petch", Mulish, sans-serif;`)
   - Roles: Category eyebrow chips (`[ ATELIER DOSSIER · 工匠の記録 ]`), sub-section dividers.

---

## Layout

### Spatial Cadence: Negative Space (_Ma_ 間)

- **Section Spacing**: Full `py-24 lg:py-32` (`8rem`–`12rem` / `96px`–`128px`) vertical rhythm between major sections.
- **Page Gutters**: `px-4 sm:px-6 lg:px-12` across viewports.
- **Maximum Width**: Container max-width constrained to `max-w-7xl` (`1280px`–`1440px`), with narrative reading widths capped at `max-w-xl` (`576px`) or `max-w-3xl` (`768px`).

---

## Elevation & Depth

### The Inlaid Craft Double Hairline Frame

Rather than standard drop shadows or thick borders, cards and modal windows utilize a Japanese architectural joinery frame:

- **Day Mode**: Outer 1px `#C4A272` + 1px `#E6D3B1` recessed channel fill + 1px `#C4A272` inner hairline.
- **Night Mode**: Outer 1px `#383B44` + 1px `#18191E` recessed channel fill + 1px `#2E313A` inner hairline.
- **Information Hierarchy Rule**: The inlaid double frame belongs to **outer cards and modal windows**. Inner bullet items, highlights, and metrics maintain clean visual hierarchy with subtle single hairlines and raised solid backgrounds, preventing nested box fatigue.

---

## Shapes

### Deliberate 0px to 3px Corner Radii

- **Cards & Bento Boxes**: `rounded-[3px]` (`md: 3px`, `lg: 3px`).
- **Buttons, Inputs, Badges, Chips**: `rounded-[2px]` (`xs: 2px`, `sm: 2px`).
- **Circular Radii (`rounded-full` / `9999px`)**: Exclusively permitted for Enso orbital rings, status dot indicators, and circular Hanko launcher marks.
- **Strict Prohibition**: Bubbly `12px`/`16px`/`24px` rounded cards are banned.

---

## Components

### Core Architectural Components

1. **`HeroAkariStudio` (`src/components/sections/hero/HeroAkariStudio.tsx`)**:
   - Studio Frame layout with Atelier Dossier (`[ ATELIER DOSSIER · 工匠の記録 ]`), Philly coordinates, Drexel CS degree, availability status dot, and 3-pillar technical substrate cards.

2. **`ProjectDetailModal` (`src/components/sections/projects/ProjectDetailModal.tsx`)**:
   - Solid, non-transparent modal container with double-hairline inlaid frame and Kumiko corner brackets.
   - Clean single-hairline architectural highlights list on solid raised surfaces.

3. **`AiChatWidget` (`src/components/common/AiChatWidget.tsx`)**:
   - Hanko trigger with `問` mark.
   - Distilled opening greeting: *"Welcome. I'm Vincent's AI assistant. I can walk you through his portfolio if you have any questions about him."*
   - Streamlined topic pills, clean timestamps, no badge clutter.
   - Viewport-safe draggable window constraints.

4. **`EnsoOrbital` (`src/components/common/EnsoOrbital.tsx`)**:
   - 5-layer calligraphic sumi-e Enso ring formulated on milestone/project card hover.

---

## Do's and Don'ts

| Category       | Do (Enforced)                                                                   | Don't (Strictly Banned)                                              |
| -------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Corners**    | Use `rounded-[2px]` for buttons/chips and `rounded-[3px]` for cards.            | Never use bubbly `12px`/`16px`/`24px` rounded cards.                 |
| **Palette**    | Use washi `#EAE0CE` / `#FAF6EE` (Day) and charred cedar `#121316` / `#23262F` (Night). | Never use cold OLED pitch black (`#000000`).                         |
| **Transparency** | Keep cards and modals solid and non-transparent to prevent background bleed-through. | Never use translucent card bodies where background text shows.       |
| **Texture**    | Preserve tactile washi paper fiber grain across the full viewport overlay.      | Never remove washi grain or rely on dotted grid noise patterns.       |
| **Borders**    | Use thin inlaid double-hairline frames on outer cards and single hairlines inside. | Never apply heavy double frames to inner bullet points.              |
| **Accent**     | Reserve terracotta cinnabar (`#B5482E`) for seals and active status dots.       | Never use orange/terracotta as structural resting card outlines.     |
| **Typography** | Use Zen Old Mincho for headings, Mulish for body, Azeret Mono for code.         | Never use futuristic HUD or sci-fi fonts.                            |
| **Imagery**    | Apply feathered `radial-gradient` masks so photos fade organically into paper.   | Never display harsh, hard-cropped rectangular photos.                |
