import React from 'react';
import {
  ArrowRight,
  FileText,
  Code2,
  Cpu,
  Sparkles,
  Github,
  Linkedin,
  Mail,
  Compass,
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';

interface HeroAkariStudioProps {
  onNavigate?: (view: 'home' | 'projects' | 'resume', sectionId?: string) => void;
}

export const HeroAkariStudio: React.FC<HeroAkariStudioProps> = ({ onNavigate }) => {
  const { profile } = useSiteData();

  const headline =
    profile?.headline || 'Crafting thoughtful digital experiences with algorithmic clarity.';
  const tagline =
    profile?.tagline ||
    'Full-Stack Software Engineer with concentrations in Systems Architecture & AI based in Philadelphia, PA.';
  const displayName = profile?.name || 'Vincent Yuan';
  const displayRole = profile?.role || 'Software & Generative AI Engineer';

  return (
    <section
      id="home"
      className="relative w-full min-h-[92vh] lg:min-h-screen pt-28 lg:pt-36 pb-16 lg:pb-24 flex flex-col justify-between overflow-hidden"
    >
      {/* 
        FIXED PINNED HERO BACKDROP (The Division Effect)
        Layer 1: 16:9 Tactile Texture Ground (Washi Paper / Tactile Linen)
        Layer 2: Panoramic Sumi-e Mountain Landscape & Mist (Naturally placed on right)
        Layer 3: Sumi-e Pine / Bamboo accents & subtle mist gradients
      */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
        {/* Layer 1: Full-Bleed Tactile Texture Ground */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          {/* Day Mode: Tactile Washi Paper Texture */}
          <img
            src="./background/white paper texture.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover dark:hidden mix-blend-multiply opacity-60 transition-opacity duration-700"
            loading="eager"
          />
          {/* Night Mode: Tactile Black Charcoal Washi Paper */}
          <img
            src="./background/black paper.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover hidden dark:block opacity-45 mix-blend-screen transition-opacity duration-700"
            loading="eager"
          />
        </div>

        {/* Layer 2: Refined Sumi-e Landscape Artwork (Appropriate size, anchored on the right) */}
        <div
          className="absolute right-0 top-0 bottom-0 h-full w-full lg:w-[46%] pointer-events-none overflow-hidden transition-opacity duration-700"
          style={{
            maskImage:
              'radial-gradient(ellipse 90% 80% at 70% 50%, black 35%, transparent 95%), linear-gradient(to bottom, black 85%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 80% at 70% 50%, black 35%, transparent 95%), linear-gradient(to bottom, black 85%, transparent 100%)',
          }}
        >
          {/* Day Mode: Sumi-e Mountain Ridges & Pagoda in warm ink wash */}
          <img
            src="./background/hero-sumie-landscape-banner.jpg"
            alt="Sumi-e landscape mountains and mist"
            className="w-full h-full object-contain sm:object-right dark:hidden mix-blend-multiply opacity-60 transition-opacity duration-700"
            loading="eager"
          />
          {/* Night Mode: Ethereal Silver-Ash Sumi-e Mountain Peaks */}
          <img
            src="./background/hero-sumie-landscape-banner.jpg"
            alt="Sumi-e landscape mountains in night mist"
            className="w-full h-full object-contain sm:object-right hidden dark:block mix-blend-screen opacity-35 filter invert contrast-125 brightness-90 transition-opacity duration-700"
            loading="eager"
          />
        </div>

        {/* Layer 3: Delicate Pine Tree Accent in the West Margin (Tasteful scale) */}
        <div
          className="absolute left-0 top-1/4 w-56 lg:w-64 h-56 lg:h-64 pointer-events-none opacity-25 dark:opacity-15 mix-blend-multiply dark:mix-blend-screen"
          style={{
            maskImage: 'radial-gradient(ellipse 80% 80% at 35% 50%, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 35% 50%, black 20%, transparent 80%)',
          }}
        >
          <img
            src="./decorators/tree.jpg"
            alt="Sumi-e pine branch accent"
            className="w-full h-full object-contain object-left dark:filter dark:invert"
            loading="lazy"
          />
        </div>

        {/* Layer 4: Delicate Sumi-e Bamboo Leaf Accent on East Margin */}
        <div
          className="absolute right-0 top-12 w-44 lg:w-56 h-64 lg:h-80 pointer-events-none opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen"
          style={{
            maskImage: 'radial-gradient(ellipse 85% 85% at 75% 35%, black 25%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 75% 35%, black 25%, transparent 85%)',
          }}
        >
          <img
            src="./decorators/bamboo.jpg"
            alt="Sumi-e bamboo leaves accent"
            className="w-full h-full object-contain object-right-top dark:filter dark:invert"
            loading="lazy"
          />
        </div>

        {/* Layer 4: Gentle Atmospheric Wash Gradients for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-light-canvas/75 via-light-canvas/35 to-transparent dark:from-dark-canvas/80 dark:via-dark-canvas/40 dark:to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-light-canvas dark:from-dark-canvas to-transparent pointer-events-none" />
      </div>

      {/* Main Studio Frame Layout (Sidebar + Hero Content) */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 flex-1 flex flex-col justify-between relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start h-full">
          
          {/* 
            LEFT PERSISTENT EDITORIAL SPINE (Studio Colophon & Atelier Dossier)
            Addresses navbar duplication by:
            1. Omitting redundant second Hanko stamp (header has the canonical seal)
            2. Omitting redundant internal nav links (header already has them)
            3. Providing real curatorial telemetry, coordinates, and external profiles
          */}
          <aside className="lg:col-span-4 xl:col-span-3 border-b lg:border-b-0 lg:border-r border-light-border dark:border-dark-border pb-6 lg:pb-0 pr-0 lg:pr-8 flex flex-col justify-between gap-6 h-full">
            
            {/* Atelier Identity Block */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-chakra uppercase tracking-widest text-light-ink-subtle dark:text-dark-ink-subtle font-semibold">
                <span className="w-2 h-2 rounded-[1px] bg-terracotta inline-block" />
                <span>ATELIER DOSSIER · 工匠の記録</span>
              </div>

              <div>
                <h2 className="font-zen text-2xl lg:text-3xl font-medium tracking-tight text-light-ink dark:text-dark-ink">
                  {displayName}
                </h2>
                <p className="font-chakra text-xs uppercase tracking-widest text-light-ink-subtle dark:text-dark-ink-subtle font-medium mt-1">
                  {displayRole}
                </p>
              </div>

              {/* Japanese Tategaki Marginalia */}
              <div className="pt-4 border-t border-light-border/60 dark:border-dark-border/60">
                <p className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest leading-relaxed">
                  HANDMADE SYSTEMS INSPIRED BY TRADITION. DESIGNED TO SCALE.
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="writing-vertical-rl font-zen text-xs tracking-[0.25em] text-light-ink-muted dark:text-dark-ink-muted select-none opacity-80">
                    間と余白の美学
                  </div>
                  <div className="writing-vertical-rl font-zen text-xs tracking-[0.25em] text-light-ink-muted dark:text-dark-ink-muted select-none opacity-80">
                    職人の精緻な組手
                  </div>
                </div>
              </div>
            </div>

            {/* Atelier Telemetry & Geolocation (Replaces redundant nav links) */}
            <div className="space-y-3 pt-5 border-t border-light-border/60 dark:border-dark-border/60 text-xs">
              <div className="flex items-center gap-2 text-light-ink-subtle dark:text-dark-ink-subtle">
                <Compass className="w-3.5 h-3.5 text-light-ink-muted dark:text-dark-ink-muted shrink-0" />
                <span className="font-mono text-[11px] text-light-ink-muted dark:text-dark-ink-muted tracking-tight">
                  PHILLY, PA · 39.9526° N, 75.1652° W
                </span>
              </div>
              <div className="text-[11px] font-mono text-light-ink-muted dark:text-dark-ink-muted">
                EDUCATION // DREXEL UNIVERSITY (BS CS)
              </div>
              <div className="text-[11px] font-mono text-light-ink-muted dark:text-dark-ink-muted">
                TIMEZONE // EST (UTC-5) · ACTIVE ATELIER
              </div>
            </div>

            {/* External Channels (Channels not in top navbar) */}
            <div className="space-y-3 pt-5 border-t border-light-border/60 dark:border-dark-border/60">
              <div className="text-2xs font-chakra uppercase tracking-widest text-light-ink-subtle dark:text-dark-ink-subtle font-semibold">
                DIRECT CHANNELS &amp; REPOSITORIES
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://github.com/VincentYuann"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 text-light-ink dark:text-dark-ink text-xs font-mono transition-colors shadow-2xs"
                  title="GitHub Profile"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/vincent-yuan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 text-light-ink dark:text-dark-ink text-xs font-mono transition-colors shadow-2xs"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="mailto:vincentyuan1020@gmail.com"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-terracotta/60 text-light-ink dark:text-dark-ink text-xs font-mono transition-colors shadow-2xs"
                  title="Send Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>
            </div>

            {/* Status Consultation Badge (Matching moodboard cinnabar status dot) */}
            <div className="flex items-center gap-3 pt-5 border-t border-light-border/60 dark:border-dark-border/60">
              <div className="relative w-6 h-6 rounded-[2px] bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border flex items-center justify-center shrink-0">
                <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              </div>
              <div>
                <p className="font-chakra text-2xs uppercase tracking-wider text-light-ink-subtle dark:text-dark-ink-subtle">
                  CURRENT AVAILABILITY
                </p>
                <p className="font-sans text-xs font-medium text-light-ink dark:text-dark-ink">
                  Open to Full-Stack &amp; AI Roles
                </p>
              </div>
            </div>
          </aside>

          {/* 
            RIGHT MAIN WORKSPACE (Akari Canvas)
            Display headline in Zen Old Mincho, body copy in Mulish, and the 3 Core Tech Stacks
          */}
          <main className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between gap-8 h-full">
            <div className="space-y-6 max-w-4xl">
              {/* Category Eyebrow with quiet neutral dot */}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-light-ink-subtle/80 dark:bg-[#787368]" />
                <span className="font-chakra text-xs uppercase tracking-widest text-light-ink-subtle dark:text-dark-ink-subtle font-semibold">
                  STUDIO PERSPECTIVE · 空間と調和
                </span>
              </div>

              {/* Bold Serif Editorial Display Headline in Zen Old Mincho */}
              <h1 className="font-zen text-4xl sm:text-5xl md:text-6xl lg:text-display-lg font-normal text-light-ink dark:text-dark-ink leading-[1.08] tracking-tight text-balance">
                {headline}
              </h1>

              {/* Subtitle Paragraph in Mulish */}
              <p className="font-mulish text-base sm:text-lg text-light-ink-muted dark:text-dark-ink-muted max-w-2xl leading-relaxed font-light">
                {tagline}
              </p>

              {/* Action Buttons with 2px corners */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#featured-works"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('home', 'featured-works');
                    }
                  }}
                  className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light font-mulish text-xs sm:text-sm font-semibold rounded-[2px] shadow-2xs hover:opacity-95 transition-all cursor-pointer"
                >
                  <span>Explore Selected Works</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>

                <a
                  href="#resume"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('resume');
                    }
                  }}
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:border-light-border-strong dark:hover:border-dark-border-strong text-light-ink dark:text-dark-ink font-mulish text-xs sm:text-sm font-medium rounded-[2px] shadow-2xs transition-all cursor-pointer"
                >
                  <span>Technical CV</span>
                  <FileText className="w-4 h-4 text-light-ink-muted dark:text-dark-ink-muted transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            {/* 
              3 TECH STACK CORE PILLARS (Replaces generic distributed scale / shokunin journey)
              Presents concrete engineering capabilities:
              1. Systems & Backend Runtimes
              2. Frontend & Interaction Craft
              3. Agentic AI & Data Pipelines
            */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-light-border/60 dark:border-dark-border/60">
              
              {/* Stack 1: Systems & Backend */}
              <div className="flex flex-col gap-2 p-4.5 rounded-[2px] bg-light-surface-card dark:bg-dark-surface-card craft-card border border-light-border dark:border-dark-border">
                <div className="flex items-center justify-between text-light-ink dark:text-dark-ink">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-light-ink-muted dark:text-dark-ink-muted" />
                    <span className="font-chakra text-xs uppercase tracking-wider font-semibold">
                      SYSTEMS &amp; CLOUD
                    </span>
                  </div>
                  <span className="font-mono text-2xs text-light-ink-subtle">BACKEND</span>
                </div>
                <div className="text-[11px] font-mono font-medium text-bamboo dark:text-bamboo-light">
                  Python · FastAPI · PostgreSQL · Node.js · Docker
                </div>
                <p className="font-mulish text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-light">
                  High-throughput async APIs, distributed task workers, and relational schemas built for high availability and low latency.
                </p>
              </div>

              {/* Stack 2: Frontend & Interaction */}
              <div className="flex flex-col gap-2 p-4.5 rounded-[2px] bg-light-surface-card dark:bg-dark-surface-card craft-card border border-light-border dark:border-dark-border">
                <div className="flex items-center justify-between text-light-ink dark:text-dark-ink">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-light-ink-muted dark:text-dark-ink-muted" />
                    <span className="font-chakra text-xs uppercase tracking-wider font-semibold">
                      FRONTEND &amp; UI
                    </span>
                  </div>
                  <span className="font-mono text-2xs text-light-ink-subtle">CRAFT</span>
                </div>
                <div className="text-[11px] font-mono font-medium text-bamboo dark:text-bamboo-light">
                  React 19 · TypeScript · Tailwind · Next.js · Vite
                </div>
                <p className="font-mulish text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-light">
                  Type-safe component joinery, sub-100ms micro-interactions, responsive fluid physics, and wabi-sabi tactile elegance.
                </p>
              </div>

              {/* Stack 3: Agentic AI & RAG */}
              <div className="flex flex-col gap-2 p-4.5 rounded-[2px] bg-light-surface-card dark:bg-dark-surface-card craft-card border border-light-border dark:border-dark-border">
                <div className="flex items-center justify-between text-light-ink dark:text-dark-ink">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-light-ink-muted dark:text-dark-ink-muted" />
                    <span className="font-chakra text-xs uppercase tracking-wider font-semibold">
                      AGENTIC AI &amp; RAG
                    </span>
                  </div>
                  <span className="font-mono text-2xs text-light-ink-subtle">INTELLIGENCE</span>
                </div>
                <div className="text-[11px] font-mono font-medium text-bamboo dark:text-bamboo-light">
                  Qdrant · LlamaIndex · Gemini API · LangChain · RAG
                </div>
                <p className="font-mulish text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-light">
                  Autonomous agent tool-calling, semantic vector indexing, hybrid retrieval chunking, and grounded prompt engineering.
                </p>
              </div>

            </div>
          </main>
        </div>
      </div>
    </section>
  );
};
