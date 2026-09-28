---
name: Vincent Yuan - Akari Craft & Editorial Design System
description: >-
  A restrained, museum-grade portfolio design system combining a warm Akari washi paper
  day mode with a quiet charred cedar charcoal night mode. Grounded in Japanese craft,
  tactile materiality, and editorial typography, embodying Ma (negative space), Shokunin
  (artisan precision), and Wabi-Sabi (organic harmony), free from cyberpunk or SaaS clichés.
colors:
  primary: "#B5482E"
  secondary: "#D4A853"
  tertiary: "#526D57"
  light-canvas: "#EAE0CE"
  light-canvas-soft: "#F4ECE1"
  light-surface: "#FAF6EE"
  light-surface-card: "#FAF6EE"
  light-surface-raised: "#FFFFFF"
  light-surface-muted: "#E4D8C3"
  light-ink: "#282E3A"
  light-ink-muted: "#686559"
  light-ink-subtle: "#8B8375"
  light-border: "#D4C4AA"
  light-border-strong: "#BDAB8F"
  light-button-dark: "#26262E"
  light-on-dark: "#FAF6EE"
  dark-canvas: "#121316"
  dark-canvas-soft: "#1E1F24"
  dark-panel: "#23262F"
  dark-surface: "#23262F"
  dark-surface-card: "#23262F"
  dark-surface-raised: "#2C303B"
  dark-surface-muted: "#0E0F12"
  dark-ink: "#E8E6DF"
  dark-ink-muted: "#9E9A8E"
  dark-ink-subtle: "#736F64"
  dark-border: "#383B44"
  dark-border-channel: "#18191E"
  dark-border-inner: "#2E313A"
  dark-border-strong: "#4E5362"
  dark-button-light: "#D4A853"
  dark-on-light: "#121316"
typography:
  display:
    fontFamily: "Zen Old Mincho, Noto Serif JP, Georgia, serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Zen Old Mincho, Noto Serif JP, Georgia, serif"
    fontSize: "clamp(1.75rem, 3vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Chakra Petch, Mulish, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0.02em"
  body:
    fontFamily: "Mulish, Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  label:
    fontFamily: "Azeret Mono, JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.02em"
rounded:
  none: "0px"
  xs: "2px"
  sm: "2px"
  md: "3px"
  lg: "3px"
  full: "9999px"
spacing:
  gutter: "24px"
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "56px"
components:
  button-primary:
    backgroundColor: "{colors.light-button-dark}"
    textColor: "{colors.light-on-dark}"
    rounded: "{rounded.xs}"
    padding: "8px 16px"
  button-terracotta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.light-surface-raised}"
    rounded: "{rounded.xs}"
    padding: "8px 16px"
  button-dark-primary:
    backgroundColor: "{colors.dark-button-light}"
    textColor: "{colors.dark-on-light}"
    rounded: "{rounded.xs}"
    padding: "8px 16px"
  card-resting:
    backgroundColor: "{colors.light-surface}"
    rounded: "{rounded.md}"
    padding: "24px 32px"
  tag-pill:
    backgroundColor: "{colors.light-surface-raised}"
    textColor: "{colors.light-ink-muted}"
    rounded: "{rounded.xs}"
    padding: "4px 10px"
---

# Design System: Vincent Yuan Portfolio

## Overview

**Creative North Star: "Akari Sanctuary & Yakisugi Craft"**

The Vincent Yuan portfolio visual system is an homage to traditional Japanese material craft and fine editorial book design. It intentionally rejects the ubiquitous dark-mode cyberpunk tropes (neon glows, HUD targeting brackets, cyan/orange terminal styling, sci-fi fonts) in favor of quiet confidence, intentional negative space (*Ma* 間), and artisan joinery (*Shokunin* 職人).

Every screen is treated as an architectural dossier or gallery installation. Surfaces feel physical, tactile, and grounded in authentic materiality: sunlit unbleached washi paper during the day, and charred cedar (*Yakisugi* 焼杉) lit by warm paper lanterns at night.

**Key Characteristics:**
- **Material Dual-World Equilibrium**: Warm mulberry washi paper (`#EAE0CE` / `#FAF6EE`) by day, warm charred cedar (`#121316` / `#23262F`) by night.
- **Architectural Joinery Borders**: Delicate 1px structural framing with inlaid channel depths instead of diffuse drop shadows.
- **Restrained Cinnabar & Ochre Accents**: Sacred Vermilion Hanko seals (`[原]`, `[問]`) and brushed amber lantern warmth.
- **Editorial Typography Pairing**: High-craft serif headings (*Zen Old Mincho*) anchored by crisp humanist body (*Mulish*) and technical monospace (*Azeret Mono*).
- **Tactile Washi Grain**: Organic paper fiber tooth overlay preserving continuous paper tooth across all viewports.

---

## Colors

The palette balances natural Japanese organic pigments with deep atmospheric charcoal.

### Primary
- **Sacred Cinnabar Hanko Vermilion** (`#B5482E`): Reserved exclusively for authentic Hanko seals (`[原]`, `[問]`), live availability beacons, and high-impact identity anchors.

### Secondary
- **Warm Amber Ochre** (`#D4A853`): Warm lantern glow through shoji paper; serves as Night Mode primary CTA button background, interactive focus rings, and subtle status accents.

### Tertiary
- **Kyoto Bamboo Moss** (`#526D57`): Verdant botanical accent used for active milestone status badges, verified operational pills, and foliage cues.

### Neutral
- **Raw Unbleached Washi Cream** (`#EAE0CE`): Day mode root canvas ground, calibrated to feel warm, fibrous, and organic.
- **Soft Washi Chamber Ground** (`#F4ECE1`): Alternating section ground for subtle spatial cadence.
- **Crisp Washi Surface** (`#FAF6EE`): Day mode solid card surface, milestone container, and modal ground.
- **Raised Studio White** (`#FFFFFF`): Day mode raised popovers, tooltips, and elevated surfaces.
- **Muted Fiber Well** (`#E4D8C3`): Day mode recessed tracks, thumbnail wells, and subtle divider fills.
- **Traditional Sumi Ink** (`#282E3A`): Day mode primary text and heading ink; deeply legible with warm undertones.
- **Charcoal Stone Ink** (`#686559`): Day mode body copy, descriptions, and operational narrative.
- **Subtle Timestamp Ink** (`#8B8375`): Day mode coordinates, timestamps, and secondary metadata.
- **Washi Hairline Border** (`#D4C4AA`): Day mode 1px structural card border.
- **Strong Hairline Border** (`#BDAB8F`): Day mode active, hovered, or focused border line.
- **Charred Cedar Yakisugi Ground** (`#121316`): Night mode root canvas, deep and warm (never cold OLED pitch `#000000`).
- **Soft Charred Slate Ground** (`#1E1F24`): Night mode alternating section chamber ground.
- **Charred Slate Surface** (`#23262F`): Night mode solid card surface, milestone container, and modal ground.
- **Raised Obsidian Surface** (`#2C303B`): Night mode elevated controls, dialogs, and popovers.
- **Deep Recessed Track** (`#0E0F12`): Night mode recessed track and thumbnail well.
- **Warm Off-White Ink** (`#E8E6DF`): Night mode primary text and heading ink.
- **Soft Stone Gray Ink** (`#9E9A8E`): Night mode body copy, descriptions, and operational narrative.
- **Subtle Cedar Gray Ink** (`#736F64`): Night mode timestamps, coordinates, and metadata.
- **Charred Slate Border** (`#383B44`): Night mode 1px outer hairline card border.
- **Recessed Channel Fill** (`#18191E`): Night mode inlaid double-border recessed channel.
- **Inner Slate Hairline** (`#2E313A`): Night mode inlaid inner structural border.
- **Active Slate Border** (`#4E5362`): Night mode active, hovered, or focused border line.

### Named Rules
**The Cinnabar Seal Rule.** Terracotta cinnabar (`#B5482E`) is strictly reserved for seals, beacons, and identity marks. It must never be applied as resting structural card borders or large background fills.

**The Non-OLED Rule.** The night canvas ground is warm charred cedar (`#121316`), never pitch black (`#000000`). Pitch black destroys the illusion of wood and paper materiality.

---

## Typography

**Display Font:** Zen Old Mincho (with Noto Serif JP, Georgia, serif fallback)  
**Body Font:** Mulish (with Inter, system-ui, sans-serif fallback)  
**Label/Mono Font:** Azeret Mono (with JetBrains Mono, monospace fallback)  
**Accent/Eyebrow Font:** Chakra Petch (with Mulish, sans-serif fallback)

**Character:** High-craft literary Mincho paired with humanist Mulish creates a quiet museum curatorial tone, punctuated by monospace coordinates and technical dossier accents.

### Hierarchy
- **Display** (Regular 400, `clamp(2.5rem, 5vw, 4rem)`, `1.08` line-height, `-0.025em` tracking): Hero display headline, section index numerals (`01 //`, `02 //`), and Kanji watermarks.
- **Headline** (Regular 400, `clamp(1.75rem, 3vw, 2.25rem)`, `1.18` line-height, `-0.015em` tracking): Major section headers, modal project titles, career company names.
- **Title** (Medium 500, `1.125rem` / `18px`, `1.35` line-height, `0.02em` tracking): Sub-headings, section eyebrows (`[ ATELIER DOSSIER · 工匠の記録 ]`), dossier markers.
- **Body** (Regular 400, `1rem` / `16px` to `1.0625rem` / `17px`, `1.65`–`1.7` line-height): Long-form project case studies, philosophy narrative, reading width capped at 65–75ch (`max-w-3xl`).
- **Label** (Medium 500, `0.6875rem` / `11px` to `0.75rem` / `12px`, `1.5` line-height, `0.02em` tracking, uppercase): Technical specification tags, metadata badges, timestamps, coordinates.

### Named Rules
**The Curatorial Voice Rule.** Headings use Zen Old Mincho in regular weight (400) rather than heavy bold, letting character form and negative space create emphasis rather than brute force.

---

## Layout

### Spatial Cadence: Negative Space (*Ma* 間)
- **Vertical Section Rhythm**: Full `py-24 lg:py-32` (`6rem`–`8rem` / `96px`–`128px`) vertical padding between major chambers.
- **Page Gutters**: `px-4 sm:px-6 lg:px-12` across viewports.
- **Maximum Width**: Container max-width constrained to `max-w-7xl` (`1280px`–`1440px`), with narrative reading widths capped at `max-w-xl` (`576px`) or `max-w-3xl` (`768px`).

### Named Rules
**The Chamber Separation Rule.** Sections alternate subtle ground tones (`--canvas-bg` and `--canvas-soft-bg`) rather than relying on heavy divider lines, letting space define progression.

---

## Elevation & Depth

Surfaces are tactile and planar, avoiding heavy diffuse drop shadows in favor of architectural joinery framing.

### Shadow Vocabulary
- **Akari Subtle Rest** (`0 1px 2px rgba(40, 46, 58, 0.04)`): Baseline ambient grounding for cards.
- **Akari Elevated Popover** (`0 20px 48px rgba(0, 0, 0, 0.25)` in Day, `0 20px 48px rgba(0, 0, 0, 0.6)` in Night): Modal sheets and floating dialogues.
- **Lantern Bloom Glow** (`0 8px 24px -4px rgba(212, 168, 83, 0.35)`): Ambient warm hover state for primary buttons.
- **Hanko Seal Glow** (`0 0 12px rgba(181, 72, 46, 0.35)`): Subtle vermilion resonance around active stamp icons.

### Named Rules
**The Inlaid Joinery Rule.** Cards and modal windows use Japanese joinery framing: 1px outer hairline, 1px recessed channel, and 1px inner hairline, conveying tangible depth without generic drop shadows.

**The Level-1 Depth Rule.** The inlaid double frame belongs exclusively to outer cards and modal containers. Inner list items and bullet highlights use single subtle hairlines on solid raised backgrounds to prevent nested box fatigue.

---

## Shapes

Form language is architectural, disciplined, and crisp.

- **Interactive Elements (Buttons, Inputs, Badges, Chips)**: `rounded-[2px]` (`xs: 2px`).
- **Cards, Panels & Bento Containers**: `rounded-[3px]` (`md: 3px`).
- **Circular Radii (`rounded-full` / `9999px`)**: Exclusively reserved for Enso orbital rings, status beacon dots, and Hanko trigger stamps.
- **Strict Prohibition**: Bubbly `12px`/`16px`/`24px` rounded cards are strictly banned.

### Named Rules
**The Shokunin Radius Rule.** Interactive controls remain sharply defined between `0px` and `3px`. Curvature is a subtle hand-planed bevel, not an inflatable SaaS pill.

---

## Components

### Buttons
- **Shape:** Hand-planed architectural radius (`2px`).
- **Day Primary:** High-contrast dark charcoal (`#26262E`) background with cream text (`#FAF6EE`), `px-4 py-2 text-xs font-semibold uppercase tracking-wider`.
- **Night Primary:** Warm brushed gold ochre (`#D4A853`) background with charred charcoal text (`#121316`), `px-4 py-2 text-xs font-semibold uppercase tracking-wider`.
- **Identity Accent (Terracotta):** Sacred vermilion (`#B5482E`) background with white text (`#FFFFFF`), `hover:bg-[#9E3D27]`.
- **Outline / Ghost:** Transparent background, `border border-light-border dark:border-dark-border`, text ink with terracotta/ochre hover tint.

### Hanko Seal Stamp
- **Signature Component:** Traditional Japanese vermilion stamp with double hairline frame and seal-script Kanji (`原` or `問`).
- **Style:** Square seal with `rx="22"` outer stroke (`13px`) and `rx="14"` inner stroke (`2.5px`, `opacity="0.65"`), centering authentic Kanji character.
- **Role:** Floating AI assistant launcher, signature verification, atelier seal.

### Status Badge
- **Active State:** Bamboo moss green background (`bg-bamboo/10 dark:bg-bamboo/20`), bamboo border, and pulsing beacon dot.
- **Completed State:** Muted surface background, subtle stone ink, static dot.
- **Typography:** `font-mono text-[11px] font-bold uppercase tracking-wider`.

### Tech Tag
- **Style:** Architectural pill with `rounded-[2px]`, monospace typography (`Azeret Mono`), subtle border, and official brand SVG icon.
- **Hover:** Gentle lift (`hover:-translate-y-0.5`), border shift to terracotta/ochre.

### Cards & Modal Windows
- **Background:** Solid, 100% opaque warm washi (`#FAF6EE`) or charred slate (`#23262F`).
- **Border:** Inlaid double hairline joinery (`#D4C4AA` / `#383B44`).
- **No Background Bleed:** Translucent card bodies are strictly forbidden.

### Inputs & Text Areas
- **Style:** Crisp `rounded-[2px]` field, `border border-light-border dark:border-dark-border`, background `#FAF6EE` (Day) or `#0E0F12` (Night).
- **Focus:** `focus-visible:border-terracotta dark:focus-visible:border-ochre focus-visible:ring-1`.

---

## Do's and Don'ts

### Do:
- **Do** maintain calibrated 0px to 3px border radii (`rounded-[2px]` for controls, `rounded-[3px]` for cards).
- **Do** preserve solid, non-transparent washi (`#FAF6EE`) and charred cedar (`#23262F`) card backgrounds.
- **Do** reserve terracotta cinnabar (`#B5482E`) for authentic Hanko seals, active status beacons, and identity marks.
- **Do** use warm charred cedar (`#121316`) for night mode rather than cold pitch black (`#000000`).
- **Do** maintain continuous tactile washi paper grain overlay (`opacity: 0.16` Day, `0.065` Night).
- **Do** feather photography and portraits into paper using radial gradients.

### Don't:
- **Don't** use bubbly rounded corners (`12px`, `16px`, `24px`).
- **Don't** use cold OLED pitch black (`#000000`).
- **Don't** make card containers translucent with background text showing through.
- **Don't** use neon glows, cyan/magenta cyber lines, or HUD sci-fi styling.
- **Don't** apply heavy double hairline frames to inner nested bullet points.
- **Don't** use generic drop shadows when an architectural hairline border suffices.
