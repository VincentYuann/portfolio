# Vincent Yuan — Software Engineering Portfolio

[![Live Site](https://img.shields.io/badge/Live_Portfolio-vincentyuann.github.io-B5482E?style=for-the-badge&logo=githubpages&logoColor=white)](https://vincentyuann.github.io/portfolio)
[![React 18](https://img.shields.io/badge/React_18.3-Vite_6-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

A modern, dynamic personal portfolio combining Japanese *Wabi-Sabi* aesthetics (*Ma* negative space, sumi-e ink wash, Hanko seals) with high-performance full-stack web engineering.

🔗 **Live Portfolio**: [https://vincentyuann.github.io/portfolio](https://vincentyuann.github.io/portfolio)

---

## 🏛️ System Architecture & Data Flow

The application is structured as a reactive Single Page Application (SPA) powered by React 18, Vite, and Supabase. Public visitors enjoy fast, cached reads, while verified admin sessions enable live in-browser CMS modifications.

```mermaid
graph TD
    subgraph Client ["Frontend Client (React 18 + Vite)"]
        UI["UI Layer<br/>(Layout, Sections, Common Widgets)"]
        Context["SiteDataContext<br/>(Global Cache, Sync & Fallbacks)"]
        Admin["Admin CMS Studio<br/>(Live Editors, Dirty Tracker)"]
    end

    subgraph Supabase ["Supabase Backend (Cloud Infrastructure)"]
        Auth["Supabase Auth<br/>(GitHub OAuth + JWT Validation)"]
        DB["PostgreSQL Database<br/>(Tables with Row Level Security)"]
        Storage["Supabase Storage S3<br/>(portfolio-assets Bucket)"]
    end

    UI --> Context
    Admin -->|CRUD Mutations & Sync| Context
    Context -->|Public Anon Reads| DB
    Admin -->|Verify Admin JWT| Auth
    Auth -->|Admin Claims Guard| DB
    Admin -->|Direct Image/PDF Upload| Storage
    UI -->|Stream PDF & Optimized Images| Storage
```

### 🔄 Frontend & Backend Interactions

1. **Public Reads & Resilient Fallbacks**:
   - The frontend queries Supabase PostgreSQL tables (`projects`, `experience`, `profile`, `philosophy_pillars`) using the anonymous public client key.
   - If offline or experiencing network delays, `SiteDataContext` seamlessly falls back to bundled schemas and `localStorage` caching to guarantee zero visual interruption.

2. **Authenticated Admin Operations**:
   - The Admin Studio (`#edit`) authenticates via GitHub OAuth.
   - PostgreSQL Row Level Security (RLS) policies cryptographically verify the JWT claims against the administrator's designated email address before granting write permissions (`INSERT`, `UPDATE`, `DELETE`).

3. **Storage & Assets Management**:
   - Resume PDF documents and hobby photo galleries are uploaded directly to the S3-backed Supabase `portfolio-assets` bucket with strict content-type validations and size constraints.
   - The client streams assets with automatic error-fallback handlers (`handleImageError`) to ensure robust media rendering.

---

## 📂 Component & Code Organization

The codebase cleanly separates **universal shell/layout elements**, **reusable visual widgets**, **atomic UI primitives**, and **domain-specific feature sections**:

```
src/
├── components/
│   ├── layout/            # Universal Shell (Header, Footer, Toast notifications)
│   ├── common/            # Shared Wabi-Sabi elements (EnsoOrbital, SectionHeading, StatusBadge, etc.)
│   ├── ui/                # Headless UI primitives (Button, Dialog, Badge, Input, Tabs, etc.)
│   ├── sections/          # Domain-specific feature modules
│   │   ├── hero/          # Identity banner & Hanko card
│   │   ├── projects/      # Projects showcase, catalog page & architecture modal
│   │   ├── experience/    # Career trajectory milestones & timeline
│   │   ├── philosophy/    # Architectural pillars & engineering craft bento
│   │   ├── hobbies/       # Photo gallery archive, filter pills & hobby cards
│   │   ├── contact/       # Contact form & correspondence
│   │   ├── resume/        # S3 PDF stream viewer & live LaTeX editor
│   │   └── auth/          # Admin authentication modal
│   └── admin/             # Isolated Admin CMS Studio & editor sections
├── context/               # SiteDataContext & Supabase real-time synchronization
├── lib/                   # Supabase client, constants, and helper utilities
└── data/                  # TypeScript interfaces and fallback datasets
```

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite 6, Lucide Icons, Sonner, Yet-Another-React-Lightbox |
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
