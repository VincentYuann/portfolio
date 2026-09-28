import React, { useState, useEffect } from 'react';
import {
  // Core AI & ML
  SiPytorch,
  SiTensorflow,
  SiGooglegemini,

  // Core Languages & Runtimes
  SiRust,
  SiPython,
  SiGo,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,

  // Core Frontend & Web
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiVite,
  SiThreedotjs,

  // Core Backend & DB
  SiFastapi,
  SiPostgresql,
  SiSupabase,

  // Core Cloud & DevOps
  SiDocker,
  SiKubernetes,
  SiLinux,
  SiGit,
  SiGithub,
  SiGooglecloud,
} from '@icons-pack/react-simple-icons';

import { Bot, Cloud, Cpu } from 'lucide-react';

export type TechIconComponent = React.ComponentType<{
  className?: string;
  size?: number | string;
  color?: string;
}>;

export interface TechIconMatch {
  Icon: TechIconComponent | null;
  svgString: string | null;
  isOfficialBrand: boolean;
  canonicalName: string;
}

export interface TechIconHookResult {
  IconComponent: TechIconComponent | null;
  svgString: string | null;
  isOfficialBrand: boolean;
  isLoading: boolean;
  canonicalName: string;
}

/**
 * Curated Core Local Registry for instantaneous (0ms) offline rendering.
 * All other technologies are dynamically resolved on demand via jsDelivr Simple Icons CDN
 * and cached permanently in localStorage.
 */
export const LOCAL_TECH_REGISTRY: Record<string, { icon: TechIconComponent; name: string }> = {
  typescript: { icon: SiTypescript, name: 'TypeScript' },
  javascript: { icon: SiJavascript, name: 'JavaScript' },
  python: { icon: SiPython, name: 'Python' },
  react: { icon: SiReact, name: 'React' },
  nextjs: { icon: SiNextdotjs, name: 'Next.js' },
  nodejs: { icon: SiNodedotjs, name: 'Node.js' },
  tailwindcss: { icon: SiTailwindcss, name: 'Tailwind CSS' },
  vite: { icon: SiVite, name: 'Vite' },
  fastapi: { icon: SiFastapi, name: 'FastAPI' },
  postgresql: { icon: SiPostgresql, name: 'PostgreSQL' },
  supabase: { icon: SiSupabase, name: 'Supabase' },
  docker: { icon: SiDocker, name: 'Docker' },
  kubernetes: { icon: SiKubernetes, name: 'Kubernetes' },
  linux: { icon: SiLinux, name: 'Linux' },
  git: { icon: SiGit, name: 'Git' },
  github: { icon: SiGithub, name: 'GitHub' },
  pytorch: { icon: SiPytorch, name: 'PyTorch' },
  tensorflow: { icon: SiTensorflow, name: 'TensorFlow' },
  gemini: { icon: SiGooglegemini, name: 'Gemini' },
  rust: { icon: SiRust, name: 'Rust' },
  go: { icon: SiGo, name: 'Go' },
  gcp: { icon: SiGooglecloud, name: 'Google Cloud' },
  googlecloud: { icon: SiGooglecloud, name: 'Google Cloud' },
  threejs: { icon: SiThreedotjs, name: 'Three.js' },
  openai: { icon: Bot as unknown as TechIconComponent, name: 'OpenAI' },
  cuda: { icon: Cpu as unknown as TechIconComponent, name: 'CUDA' },
  aws: { icon: Cloud as unknown as TechIconComponent, name: 'AWS' },
};

/**
 * Common Aliases for natural developer terminology
 */
export const TECH_ALIASES: Record<string, string> = {
  k8s: 'kubernetes',
  postgres: 'postgresql',
  psql: 'postgresql',
  torch: 'pytorch',
  tf: 'tensorflow',
  ts: 'typescript',
  js: 'javascript',
  py: 'python',
  node: 'nodejs',
  cpp: 'cplusplus',
  'c++': 'cplusplus',
  tailwind: 'tailwindcss',
  vuejs: 'vue',
  next: 'nextjs',
  'next.js': 'nextjs',
  'three.js': 'threejs',
  three: 'threejs',
  'amazon web services': 'aws',
  'google cloud': 'gcp',
  'google cloud platform': 'gcp',
  webassembly: 'wasm',
  sh: 'bash',
  zsh: 'bash',
  shell: 'bash',
  css3: 'css',
  html: 'html5',
  llamaindex: 'llamaindex',
};

/**
 * Normalize human technology input to a slug compatible with icon registries
 */
export function normalizeTechSlug(input: string): string {
  if (!input) return '';
  const raw = input.toLowerCase().trim();

  if (TECH_ALIASES[raw]) {
    return TECH_ALIASES[raw];
  }

  const norm = raw
    .replace(/\.js\b/g, 'dotjs')
    .replace(/\+\+/g, 'plusplus')
    .replace(/#/g, 'sharp')
    .replace(/[^a-z0-9]/g, '');

  if (TECH_ALIASES[norm]) {
    return TECH_ALIASES[norm];
  }

  return norm;
}

// Global in-memory cache for dynamic SVG strings (slug -> SVG content or null)
const SVG_CACHE = new Map<string, string | null>();
const PENDING_PROMISES = new Map<string, Promise<string | null>>();
const CACHE_PREFIX = 'tech_svg_v2_';

// Seed SVG cache from localStorage
if (typeof window !== 'undefined') {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        const slug = key.replace(CACHE_PREFIX, '');
        const val = localStorage.getItem(key);
        if (val === 'NULL') {
          SVG_CACHE.set(slug, null);
        } else if (val) {
          SVG_CACHE.set(slug, val);
        }
      }
    }
  } catch {}
}

/**
 * Format SVG string to ensure it inherits currentColor and scales properly
 */
function sanitizeSvg(rawSvg: string): string {
  return rawSvg
    .replace(/<svg\b([^>]*)>/i, (_match, attrs) => {
      let cleanedAttrs = attrs
        .replace(/\bwidth="[^"]*"/i, '')
        .replace(/\bheight="[^"]*"/i, '')
        .trim();
      return `<svg width="100%" height="100%" ${cleanedAttrs}>`;
    })
    .replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"')
    .replace(/stroke="(?!none)[^"]*"/gi, 'stroke="currentColor"');
}

/**
 * Dynamically resolves an SVG logo for any technology via jsDelivr Simple Icons & Devicon
 * with zero rate-limiting and global multi-CDN caching.
 * If not found, returns null (clean fallback to pure text, NO emojis).
 */
export async function fetchTechIconSvg(tag: string): Promise<string | null> {
  const slug = normalizeTechSlug(tag);
  if (!slug) return null;

  // 1. In-memory cache hit
  if (SVG_CACHE.has(slug)) {
    return SVG_CACHE.get(slug) ?? null;
  }

  // 2. Pending network request deduplication
  if (PENDING_PROMISES.has(slug)) {
    return PENDING_PROMISES.get(slug)!;
  }

  const promise = (async (): Promise<string | null> => {
    // Uncapped, high-performance CDNs (jsDelivr simple-icons, jsDelivr devicon)
    const endpoints = [
      `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`,
      `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`,
      `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-plain.svg`,
      `https://api.iconify.design/simple-icons:${slug}.svg?color=currentColor`,
      `https://api.iconify.design/logos:${slug}.svg`,
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url);
        if (res.status === 200) {
          const text = await res.text();
          if (text && text.includes('<svg') && !text.includes('404')) {
            const cleaned = sanitizeSvg(text);
            SVG_CACHE.set(slug, cleaned);
            try {
              localStorage.setItem(`${CACHE_PREFIX}${slug}`, cleaned);
            } catch {}
            return cleaned;
          }
        }
      } catch {
        // network issue, try next endpoint
      }
    }

    // Explicitly not found across all registries
    SVG_CACHE.set(slug, null);
    try {
      localStorage.setItem(`${CACHE_PREFIX}${slug}`, 'NULL');
    } catch {}
    return null;
  })();

  PENDING_PROMISES.set(slug, promise);
  const result = await promise;
  PENDING_PROMISES.delete(slug);
  return result;
}

/**
 * React hook to resolve tech icons with automatic dynamic discovery
 */
export function useTechIcon(tag: string): TechIconHookResult {
  const norm = normalizeTechSlug(tag);
  const localMatch = LOCAL_TECH_REGISTRY[norm];

  const [svgString, setSvgString] = useState<string | null>(() => {
    if (localMatch) return null;
    return SVG_CACHE.get(norm) ?? null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (localMatch) return false;
    return !SVG_CACHE.has(norm);
  });

  useEffect(() => {
    if (localMatch) {
      setIsLoading(false);
      return;
    }

    if (SVG_CACHE.has(norm)) {
      setSvgString(SVG_CACHE.get(norm) ?? null);
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);

    fetchTechIconSvg(tag).then((svg) => {
      if (active) {
        setSvgString(svg);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [norm, tag, localMatch]);

  if (localMatch) {
    return {
      IconComponent: localMatch.icon,
      svgString: null,
      isOfficialBrand: true,
      isLoading: false,
      canonicalName: localMatch.name,
    };
  }

  const isBrand = Boolean(svgString);

  return {
    IconComponent: null,
    svgString,
    isOfficialBrand: isBrand,
    isLoading,
    canonicalName: tag.trim(),
  };
}

/**
 * Synchronous badge inspector (checks local registry and local SVG cache)
 */
export function getTechBadgeIcon(tag: string): TechIconMatch {
  if (!tag || !tag.trim()) {
    return { Icon: null, svgString: null, isOfficialBrand: false, canonicalName: tag || '' };
  }

  const norm = normalizeTechSlug(tag);
  const localMatch = LOCAL_TECH_REGISTRY[norm];

  if (localMatch) {
    return {
      Icon: localMatch.icon,
      svgString: null,
      isOfficialBrand: true,
      canonicalName: localMatch.name,
    };
  }

  const cachedSvg = SVG_CACHE.get(norm);
  if (cachedSvg) {
    return {
      Icon: null,
      svgString: cachedSvg,
      isOfficialBrand: true,
      canonicalName: tag.trim(),
    };
  }

  // Pure text only (no emojis, no placeholders)
  return {
    Icon: null,
    svgString: null,
    isOfficialBrand: false,
    canonicalName: tag.trim(),
  };
}

/**
 * Queries Iconify for matching icons when searching, filtered strictly to tech/brand libraries
 */
export async function searchTechIcons(query: string): Promise<string[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  try {
    const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(q)}&limit=60`);
    if (!res.ok) return [];
    const data = await res.json();
    const icons = (data.icons as string[]) || [];

    // Strictly whitelist developer / tech-specific icon sets
    const techPrefixes = ['simple-icons:', 'devicon:', 'logos:', 'skill-icons:'];
    const names = new Set<string>();

    icons.forEach((ic) => {
      if (!techPrefixes.some((p) => ic.startsWith(p))) return;

      const parts = ic.split(':');
      if (parts.length === 2) {
        // Strip style suffixes like -line, -fill, -solid, -outline, -original, -plain, -icon
        const rawName = parts[1]
          .replace(/-(original|plain|icon|wordmark|line|fill|solid|outline|dark|light)$/i, '')
          .replace(/[-_]/g, ' ')
          .trim();

        if (rawName && rawName.length <= 20) {
          names.add(rawName.charAt(0).toUpperCase() + rawName.slice(1));
        }
      }
    });

    return Array.from(names);
  } catch {
    return [];
  }
}
