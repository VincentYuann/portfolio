# Vincent Yuan — Distributed Systems & AI Engineer

[![Live Site](https://img.shields.io/badge/Live_Portfolio-vincentyuann.github.io-B5482E?style=for-the-badge&logo=githubpages&logoColor=white)](https://vincentyuann.github.io/profolio)
[![React 18](https://img.shields.io/badge/React_18.3-Vite_6-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

A bespoke dual-theme engineering portfolio joining the architectural restraint of Japanese *Wabi-Sabi*, *Ma* (intentional negative space), and *Shokunin* craftsmanship with high-performance distributed systems engineering.

Check out the live portfolio: [https://vincentyuann.github.io/profolio](https://vincentyuann.github.io/profolio)  
Reach out or say hi: [https://vincentyuann.github.io/profolio/#/contact](https://vincentyuann.github.io/profolio/#/contact)

---

## 🏛️ Design Philosophy & Visual System

* **Akari Day Mode**: Warm washi-paper canvas (`#F2E9DA`), fine tan hairlines, and softened charcoal-navy text reflecting daylight through shoji screens.
* **Obsidian Night Mode**: Deep blue-charcoal canvas (`#1E1F24`), graphite borders, and warm off-white typography creating a calm evening workbench.
* **Ensō Orbital Dynamics (`<EnsoOrbital />`)**: Calligraphic sumi-e ink wash ensō rings with rotating golden celestial orbits, pulsing vermilion rubies, and dust motes revealed exclusively on card hover (`hoverOnly={true}`) to preserve *Ma*.
* **Seigaiha Wave & Diamond Crest Dividers (`<SectionDivider />`)**: Hand-drawn wave arches (Seigaiha) paired with dashed hairline rules and concentric terracotta/ochre diamond crests.
* **Scattered Vertical Margin Bento Widgets (`<VerticalMarginWidget />`)**: Architectural *tategaki* typography, telemetry coordinates, and authentic square Hanko seal stamps (`原`, `寂`, `侘`, `墨`, `匠`, `明`, `道`, `創`, `整`, `証`, `記`) anchoring widescreen desktop viewports.
* **Classical Card Joinery (`.classical-card-frame`, `<CornerBrackets />`)**: Inset hairline framing and shifting corner L-brackets mimicking precision wood joinery.

---

## 🛠️ Architecture & Tech Stack

```mermaid
graph TD
    Client["React 18 + Vite SPA<br/>(TailwindCSS, Framer Motion)"]
    Auth["Supabase Auth<br/>(GitHub OAuth, Strict Exact URL)"]
    DB["PostgreSQL Database<br/>(Row Level Security / RLS)"]
    Storage["Supabase S3 Storage<br/>(portfolio-assets Bucket)"]

    Client -->|OAuth Auth| Auth
    Client -->|Public Read & Admin Mutations| DB
    Client -->|PDF Upload / Direct S3 Stream| Storage
    DB -.->|Enforces is_admin on verified JWT| DB
```

### Frontend
- **Framework**: React 18.3 + TypeScript 5.7
- **Bundler**: Vite 6.1 (configured for base `./` subpath deployment on GitHub Pages)
- **Styling**: Tailwind CSS with custom Akari color tokens & CSS custom properties
- **Typography**: Canela / Serif display headings, Montserrat sans-serif body, JetBrains Mono code & metadata
- **Icons & Micro-Graphics**: `lucide-react`, inline SVGs, vectorized Hanko stamps, Seigaiha waves

### Backend & Cloud
- **Database**: PostgreSQL on Supabase with strict Row Level Security (RLS) policies
- **Storage**: S3-backed Supabase Storage (`portfolio-assets` bucket)
- **Authentication**: GitHub OAuth with cryptographically verified JWT checking `is_admin()` against `vincentyuan1020@gmail.com`

---

## 📂 Core Pages & Capabilities

| Page / Section | Key Highlights |
| :--- | :--- |
| **`#home`** | Full-bleed panoramic sumi-e landscape banner, pine tree (*Matsu* 松) flank, featured projects showcase, work experience chronology, architectural philosophy bento, and contact form with live rate limiting. |
| **`#projects`** | Complete catalog of distributed microservices and generative AI runtimes with real-time tag search, category filtering, monochrome `<TechTag />` badges, and in-depth architecture modal inspection. |
| **`#resume`** | Dual-mode interactive viewer with live PDF streaming from S3 storage and syntax-highlighted LaTeX source code editor with instant copy/download. |
| **`#edit`** *(Admin)* | Full CMS suite with live in-place editors for Intro, Experience, Projects, Philosophy, and Resume, featuring per-item and global saves with instant `sonner` toast confirmations. |

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/VincentYuann/VincentYuann.git
cd VincentYuann

# Install dependencies
npm install

# Configure environment variables (.env.local)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=vincentyuan1020@gmail.com

# Start Vite development server
npm run dev

# Build for production
npm run build
```

---

## 📄 License
MIT © [Vincent Yuan](https://github.com/VincentYuann)
