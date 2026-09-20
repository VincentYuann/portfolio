import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../data/projects';

/* ─── Types ───────────────────────────────────────────────────────── */

export interface CapabilityPillar {
  label: string;
  items: string;
  tags?: string[];
}

/**
 * Robustly sanitizes and extracts technology tags from a capability pillar,
 * removing any corrupted Unicode replacement bytes (U+FFFD) and splitting across
 * whitespace, middle dots, commas, bullets, and slashes.
 */
export function parsePillarTags(pillar: { items?: string; tags?: string[] }): string[] {
  if (Array.isArray(pillar.tags) && pillar.tags.length > 0) {
    return pillar.tags.filter((t) => Boolean(t && t.trim() && !t.includes('\uFFFD') && !/^[\s·,・•|/]+$/.test(t)));
  }
  if (!pillar.items) return [];
  return pillar.items
    .replace(/\uFFFD/g, ' ')
    .replace(/[·・•|/]+/g, ' ')
    .split(/\s+/)
    .map((s) => s.trim())
    .filter((s) => Boolean(s.length > 0 && !s.includes('\uFFFD') && !/^[\s·,・•|/]+$/.test(s)));
}

export interface HankoCardLine {
  text: string;
  label: string;
  tooltip?: string;
}

export interface HankoCardConfig {
  headerLabel?: string;       // e.g. "SEAL / 認印"
  locationArchive?: string;   // e.g. "KYOTO ARCHIVE" or "TORONTO, CA"
  stampCharacter?: string;    // e.g. "原", "匠", "創", "道"
  statusBadge?: string;       // e.g. "AVAILABLE FOR WORK"
  lines?: HankoCardLine[];
}

export const DEFAULT_HANKO_CARD: HankoCardConfig = {
  headerLabel: 'SEAL / 認印',
  locationArchive: 'PHILADELPHIA, PA',
  stampCharacter: '原',
  statusBadge: 'OPEN TO ROLES · FULL-STACK',
  lines: [
    { text: '間と余白の美学', label: 'MA · 間', tooltip: 'Aesthetics of Negative Space (Ma)' },
    { text: '静寂と簡素な調和', label: 'WA · 調和', tooltip: 'Silence and Simple Harmony (Wa)' },
    { text: '職人の精緻な組手', label: 'CRAFT · 職人', tooltip: 'Artisan Precision and Joinery (Shokunin)' },
  ],
};

export interface OriginMilestone {
  era: string;
  title: string;
  subtitle?: string;
  tag?: string;
  description: string;
}

export interface OriginStoryConfig {
  badge?: string;
  headline?: string;
  leadParagraph?: string;
  milestones?: OriginMilestone[];
}

export const DEFAULT_ORIGIN_STORY: OriginStoryConfig = {
  badge: 'ORIGIN & TRAJECTORY · 原点と軌跡',
  headline: 'From Logic Puzzles to Full-Stack Systems',
  leadParagraph:
    'My engineering path began not with grand architecture, but with genuine curiosity: discovering how logic turns static pixels into dynamic systems, mastering state through game mechanics, and bringing the human empathy of hospitality into every layer of software architecture.',
  milestones: [
    {
      era: 'PHASE 01',
      title: 'The Spark & Logic',
      subtitle: 'High School HTML / CSS / JS',
      tag: 'WEB ROOTS',
      description:
        'Discovered coding in a high school class: seeing how a few lines of JavaScript could turn static markup into an interactive canvas. The thrill of transforming logic into visual response set the foundation.',
    },
    {
      era: 'PHASE 02',
      title: 'Mechanics & State',
      subtitle: 'Python OOP & Pygame',
      tag: 'SYSTEM MECHANICS',
      description:
        'Majoring in CS in college, I explored game development with Python and Pygame. Writing game loops, state machines, tick rates, and collision mathematics from scratch forged my deep object-oriented foundation.',
    },
    {
      era: 'PHASE 03',
      title: 'Beyond the Iceberg',
      subtitle: 'Co-op & Full-Stack Systems',
      tag: 'DATA FLOW & APIS',
      description:
        'Real-world software and co-ops revealed that frontend styling is only the tip of the iceberg. I became fascinated by what lives beneath: API contracts, relational schemas, caching, and resilient system data flow.',
    },
    {
      era: 'PHASE 04',
      title: 'Hospitality Empathy',
      subtitle: 'Service Industry to Code',
      tag: 'USER-FIRST CRAFT',
      description:
        'Years as a barista and server in Philadelphia taught me active listening, anticipating user friction before it happens, and remaining calm during peak rushes, translating directly into human-centered software engineering.',
    },
  ],
};

export interface SiteProfile {
  name: string;
  headline: string;
  tagline: string;
  email: string;
  github: string;
  linkedin: string;
  role: string;
  capability_pillars: CapabilityPillar[];
  hanko_card?: HankoCardConfig;
  origin_story?: OriginStoryConfig;
}

export interface PhilosophyPillar {
  position: number;
  kanji: string;
  romaji: string;
  title: string;
  tag: string;
  description: string;
}

export interface ExperienceRecord {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  overview?: string;
  bullets?: string[];
  tags?: string[];
  isActive?: boolean;
  statusLabel?: string;
  domainLabel?: string;
  logoUrl?: string;
  kanji?: string;
  kanjiSubtitle?: string;
  displayOrder?: number;
}

export interface SiteData {
  profile: SiteProfile;
  pillars: PhilosophyPillar[];
  projects: Project[];
  experiences: ExperienceRecord[];
  loading: boolean;
  refresh: () => Promise<void>;
}

/* ─── Defaults (empty when Supabase has no data) ──────────────── */

export const DEFAULT_EXPERIENCES: ExperienceRecord[] = [];

export const DEFAULT_PROFILE: SiteProfile = {
  name: 'Vincent Yuan',
  headline: 'Crafting disciplined software systems with full-stack precision, algorithmic clarity, and Japanese wabi-sabi harmony.',
  tagline: 'Computer Science student with Systems Architecture & AI concentrations based in Philadelphia. Bringing curiosity from game mechanics and logic puzzles into scalable backend architecture, intuitive user interfaces, and the user-first empathy of hospitality.',
  email: 'vincentyuan1020@gmail.com',
  github: 'https://github.com/VincentYuann',
  linkedin: 'https://linkedin.com',
  role: 'Software Engineer · Full-Stack & Systems',
  capability_pillars: [
    { label: 'SYSTEMS & ARCHITECTURE', items: 'TypeScript · Python · Docker · Linux', tags: ['TypeScript', 'Python', 'Docker', 'Linux'] },
    { label: 'FULL-STACK & DATA', items: 'React · Next.js · Node.js · PostgreSQL · Tailwind CSS', tags: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS'] },
    { label: 'AI & RUNTIMES', items: 'PyTorch · Local LLMs · REST APIs · Git', tags: ['PyTorch', 'Local LLMs', 'REST APIs', 'Git'] },
  ],
  hanko_card: DEFAULT_HANKO_CARD,
  origin_story: DEFAULT_ORIGIN_STORY,
};

export const DEFAULT_PILLARS: PhilosophyPillar[] = [];

/* ─── Context ─────────────────────────────────────────────────────── */

const SiteDataContext = createContext<SiteData>({
  profile: DEFAULT_PROFILE,
  pillars: DEFAULT_PILLARS,
  projects: [],
  experiences: DEFAULT_EXPERIENCES,
  loading: true,
  refresh: async () => {},
});

export const useSiteData = () => useContext(SiteDataContext);

/* ─── Helper to normalize project row from Supabase ─────────────── */
function mapRowToProject(row: any, index?: number): Project {
  const title = row.title || '';
  const id = row.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const summary = row.summary || row.description || '';
  
  // Format key engineering highlights & bullets
  let bullets: string[] = [];
  if (Array.isArray(row.bullets) && row.bullets.length > 0) {
    bullets = row.bullets;
  } else if (Array.isArray(row.sections) && row.sections.length > 0) {
    bullets = row.sections.flatMap((s: any) =>
      Array.isArray(s.bullets) ? s.bullets : Array.isArray(s.points) ? s.points : [],
    );
  }

  const isFeatured = typeof row.is_featured === 'boolean' 
    ? row.is_featured 
    : false;

  const displayOrder = typeof row.display_order === 'number'
    ? row.display_order
    : (index ?? 0);

  const isActive = typeof row.is_active === 'boolean'
    ? row.is_active
    : typeof row.isActive === 'boolean'
    ? row.isActive
    : (row.end_date?.toLowerCase().includes('present') || row.endDate?.toLowerCase().includes('present') || false);

  const startDate = row.start_date || row.startDate || '';
  const endDate = row.end_date || row.endDate || '';
  const statusLabel = row.status_label || row.statusLabel || (isActive ? 'ACTIVE / 稼働中' : 'COMPLETED / 完了');

  return {
    id,
    title,
    kanji: row.kanji || '',
    category: row.category || undefined,
    badge: row.badge || '',
    subtitle: row.subtitle || summary,
    description: summary,
    image: row.image || '',
    tags: Array.isArray(row.tech_stacks) ? row.tech_stacks : Array.isArray(row.tags) ? row.tags : [],
    metrics: Array.isArray(row.metrics) ? row.metrics : [],
    overview: row.overview || summary,
    bullets,
    startDate,
    endDate,
    isActive,
    statusLabel,
    links: {
      github: row.github_link || row.links?.github || '',
      live: row.live_link || row.links?.live || '',
      caseStudyText: row.case_study_text || '',
    },
    isFeatured,
    displayOrder,
  };
}

/* ─── Provider ────────────────────────────────────────────────────── */

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<SiteProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('portfolio_profile_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (!parsed.origin_story) {
            parsed.origin_story = DEFAULT_ORIGIN_STORY;
          }
          return parsed;
        }
      } catch (e) {
        console.warn('Profile cache parse error', e);
      }
    }
    return DEFAULT_PROFILE;
  });

  const [pillars, setPillars] = useState<PhilosophyPillar[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('portfolio_pillars_cache');
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.warn('Pillars cache parse error', e);
      }
    }
    return DEFAULT_PILLARS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('portfolio_projects_cache');
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.warn('Projects cache parse error', e);
      }
    }
    return [];
  });

  const [experiences, setExperiences] = useState<ExperienceRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('portfolio_experience_cache');
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.warn('Experience cache parse error', e);
      }
    }
    return DEFAULT_EXPERIENCES;
  });

  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }

    try {
      const [profileRes, pillarsRes, projectsRes, expRes] = await Promise.all([
        supabase.from('profile').select('*').eq('id', 1).single(),
        supabase.from('philosophy_pillars').select('*').order('position').limit(3),
        supabase.from('projects').select('*').order('created_at'),
        supabase.from('experience').select('*').order('created_at'),
      ]);

      if (profileRes.data) {
        const row = profileRes.data;
        let localHankoOverride: HankoCardConfig | null = null;
        try {
          const cached = localStorage.getItem('portfolio_hanko_card_override');
          if (cached) localHankoOverride = JSON.parse(cached);
        } catch {}

        const mappedHankoCard: HankoCardConfig = {
          ...DEFAULT_HANKO_CARD,
          ...(row.hanko_card && typeof row.hanko_card === 'object' ? row.hanko_card : {}),
          ...(localHankoOverride || {}),
        };

        let localOriginOverride: OriginStoryConfig | null = null;
        try {
          const cachedOrigin = localStorage.getItem('portfolio_origin_story_override');
          if (cachedOrigin) localOriginOverride = JSON.parse(cachedOrigin);
        } catch {}

        const mappedOriginStory: OriginStoryConfig = {
          ...DEFAULT_ORIGIN_STORY,
          ...(row.origin_story && typeof row.origin_story === 'object' ? row.origin_story : {}),
          ...(localOriginOverride || {}),
        };

        const mappedProfile: SiteProfile = {
          name:     row.name     || '',
          headline: row.headline || '',
          tagline:  row.tagline  || '',
          email:    row.email    || '',
          github:   row.github   || '',
          linkedin: row.linkedin || '',
          role:     row.role     || '',
          capability_pillars: Array.isArray(row.capability_pillars)
            ? row.capability_pillars.map((p: any) => {
                const tags = parsePillarTags(p);
                return {
                  label: (p.label || '').trim(),
                  tags,
                  items: tags.join(' · ') || (p.items || '').replace(/\uFFFD/g, ' · ').trim(),
                };
              })
            : [],
          hanko_card: mappedHankoCard,
          origin_story: mappedOriginStory,
        };
        setProfile(mappedProfile);
        try {
          localStorage.setItem('portfolio_profile_cache', JSON.stringify(mappedProfile));
        } catch {}
      } else {
        setProfile(DEFAULT_PROFILE);
      }

      if (pillarsRes.data) {
        const mappedPillars: PhilosophyPillar[] = pillarsRes.data.map((row: any) => ({
          position:    row.position,
          kanji:       row.kanji       || '',
          romaji:      row.romaji      || '',
          title:       row.title       || '',
          tag:         row.tag         || '',
          description: row.description || '',
        }));
        setPillars(mappedPillars);
        try {
          localStorage.setItem('portfolio_pillars_cache', JSON.stringify(mappedPillars));
        } catch {}
      } else {
        setPillars([]);
      }

      if (projectsRes.data) {
        const mapped = projectsRes.data.map((row: any, idx: number) => {
          return mapRowToProject(row, idx);
        });

        // Sort mapped projects by displayOrder if present
        mapped.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
        setProjects(mapped);
        try {
          localStorage.setItem('portfolio_projects_cache', JSON.stringify(mapped));
        } catch {}
      } else {
        setProjects([]);
      }

      if (expRes.data) {
        const mappedExp: ExperienceRecord[] = expRes.data.map((row: any, idx: number) => {
          const isCurrent =
            row.is_active ??
            row.isActive ??
            (row.end_date?.toLowerCase().includes('present') ||
              row.endDate?.toLowerCase().includes('present') ||
              idx === 0);

          // Extract bullets from array or split description
          let bullets: string[] = [];
          if (Array.isArray(row.bullets) && row.bullets.length > 0) {
            bullets = row.bullets;
          } else if (row.description) {
            bullets = row.description
              .split(/(?<=[.!?])\s+/)
              .map((p: string) => p.trim())
              .filter((p: string) => p.length > 0);
          }

          // Default overview summary if not explicitly provided
          const overview =
            row.overview ||
            (idx === 0
              ? 'High-performance AI inference infrastructure studio specializing in local-first edge LLMs, real-time telemetry pipelines, and artisanal WebGL interfaces.'
              : idx === 1
              ? 'Global AI automation consultancy delivering RAG pipeline integrations, vector retrieval systems, and continuous delivery middleware for enterprise clients.'
              : row.description || '');

          const defaultTags =
            idx === 0
              ? ['C++', 'CUDA', 'TimescaleDB', 'WebSockets', 'WebGL', 'React']
              : idx === 1
              ? ['LlamaIndex', 'Qdrant', 'Flask', 'Docker', 'Jenkins', 'n8n']
              : ['Rust', 'PostgreSQL', 'TypeScript'];

          const tags = Array.isArray(row.tags) && row.tags.length > 0
            ? row.tags
            : Array.isArray(row.tech_stacks) && row.tech_stacks.length > 0
            ? row.tech_stacks
            : defaultTags;

          return {
            id: row.id || crypto.randomUUID(),
            title: row.title || '',
            company: row.company || '',
            location: row.location || '',
            startDate: row.start_date || row.startDate || '',
            endDate: row.end_date || row.endDate || '',
            description: row.description || '',
            overview,
            bullets,
            tags,
            isActive: isCurrent,
            statusLabel:
              row.status_label ||
              row.statusLabel ||
              (isCurrent ? 'ACTIVE / 現職' : '歴任 / COMPLETED'),
            domainLabel: row.domain_label || row.domainLabel || '',
            logoUrl: row.logo_url || row.logoUrl || row.logo || '',
            kanji: row.kanji || (idx === 0 ? '木' : idx === 1 ? '墨' : idx === 2 ? '明' : '原'),
            kanjiSubtitle:
              row.kanji_subtitle ||
              row.kanjiSubtitle ||
              (idx === 0 ? 'AI' : idx === 1 ? 'SUMI' : idx === 2 ? 'CRAFT' : 'SYS'),
            displayOrder:
              typeof row.display_order === 'number'
                ? row.display_order
                : typeof row.displayOrder === 'number'
                ? row.displayOrder
                : idx,
          };
        });

        // Sort by displayOrder ascending
        mappedExp.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
        setExperiences(mappedExp);
        try {
          localStorage.setItem('portfolio_experience_cache', JSON.stringify(mappedExp));
        } catch {}
      } else {
        setExperiences([]);
      }
    } catch (err) {
      console.warn('Error loading site data from Supabase:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchAll(); 

    // Subscribe to real-time database changes across public tables
    if (!supabase) return;

    const channel = supabase
      .channel('schema-realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchAll();
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [fetchAll]);

  return (
    <SiteDataContext.Provider value={{ profile, pillars, projects, experiences, loading, refresh: fetchAll }}>
      {children}
    </SiteDataContext.Provider>
  );
};
