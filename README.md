# Vincent Yuan — Software Engineering Portfolio

[![Live Site](https://img.shields.io/badge/Live_Portfolio-vincentyuann.github.io-B5482E?style=for-the-badge&logo=githubpages&logoColor=white)](https://vincentyuann.github.io/portfolio)
[![React 18](https://img.shields.io/badge/React_18.3-Vite_6-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

A modern, dynamic personal portfolio combining Japanese *Wabi-Sabi* aesthetics (*Ma* negative space, sumi-e ink wash, Hanko seals) with high-performance full-stack web engineering.

🔗 **Live Portfolio**: [https://vincentyuann.github.io/portfolio](https://vincentyuann.github.io/portfolio)

---

## 🏛️ Features & Architecture

- **Dual-Theme Design System**: Seamless switching between *Akari Day* (warm washi paper) and *Obsidian Night* (deep graphite canvas) with Japanese calligraphy accents and sumi-e bamboo margin art.
- **Dynamic Supabase Backend**: All projects, experience timelines, hobbies, and profile configurations are stored in PostgreSQL with Row-Level Security (RLS) and real-time site synchronization.
- **Projects Showcase & Catalog**: Tag-based search, featured project highlights, architecture modal inspectors, and dynamic live/GitHub links.
- **Career Trajectory & Milestones**: Interactive chronology of engineering roles, progressive disclosure impact drawers, and domain badges.
- **Hobbies & Pursuits**: Multi-image photo galleries with lightbox zoom, category filter pills, and compact metadata badges.
- **Curriculum Vitae & LaTeX Studio**: S3-backed PDF resume streaming alongside an interactive, live-editable LaTeX source viewer.
- **Admin CMS Editor (`#edit`)**: Full in-browser management suite with dirty state tracking, drag-and-drop reordering, storage uploads, and `Ctrl+S` quick save.
- **Modular DRY Architecture**: Centralized reusable components (`SectionHeading`, `StatusBadge`, `HobbyCard`, `MarginBambooFlanks`, `useAdminDirty`).

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite 6, Lucide Icons, Sonner |
| **Backend & Auth** | Supabase (PostgreSQL, Row Level Security, GitHub OAuth) |
| **Storage & Media** | Supabase Storage (S3-compatible bucket for images & PDF CVs) |
| **Deployment** | GitHub Pages with GitHub Actions CI/CD |

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/VincentYuann/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Set up environment variables (.env.local)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=your_admin_email

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build
```

---

## 📄 License

MIT © [Vincent Yuan](https://github.com/VincentYuann)
