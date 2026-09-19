import React from 'react';
import {
  // AI & Machine Learning
  SiPytorch,
  SiTensorflow,
  SiHuggingface,
  SiGooglegemini,
  SiAnthropic,
  SiClaude,
  SiMeta,
  SiMetaai,
  SiScikitlearn,
  SiKeras,
  SiJupyter,

  // Languages & Core Runtimes
  SiRust,
  SiPython,
  SiCplusplus,
  SiC,
  SiGo,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiGnubash,
  SiHtml5,
  SiCss,
  SiWebassembly,

  // Frontend & UI
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiVuedotjs,
  SiSvelte,
  SiAngular,
  SiVite,
  SiRedux,

  // Databases & Storage
  SiPostgresql,
  SiSupabase,
  SiRedis,
  SiMongodb,
  SiSqlite,
  SiMysql,
  SiPrisma,

  // Cloud, Infrastructure & Containers
  SiDocker,
  SiKubernetes,
  SiLinux,
  SiGooglecloud,
  SiCloudflare,
  SiGithub,
  SiGit,
  SiNginx,
  SiVercel,

  // Streams, Events & APIs
  SiApachekafka,
  SiGraphql,
  SiSocketdotio,
  SiRabbitmq,

  // Creative Tech & Graphics
  SiThreedotjs,
  SiWebgl,
  SiOpengl,
  SiBlender,
} from '@icons-pack/react-simple-icons';

import {
  Sparkles,
  Cloud,
} from 'lucide-react';

export type TechIconComponent = React.ComponentType<{
  className?: string;
  size?: number | string;
  color?: string;
}>;

export interface TechIconMatch {
  Icon: TechIconComponent | null;
  isOfficialBrand: boolean;
  canonicalName: string;
}

/**
 * 1. Curated Registry of Official Brand Tech Logos
 */
export const TECH_ICON_REGISTRY: Record<string, { icon: TechIconComponent; name: string }> = {
  // AI & ML
  pytorch: { icon: SiPytorch, name: 'PyTorch' },
  tensorflow: { icon: SiTensorflow, name: 'TensorFlow' },
  huggingface: { icon: SiHuggingface, name: 'Hugging Face' },
  gemini: { icon: SiGooglegemini, name: 'Gemini' },
  anthropic: { icon: SiAnthropic, name: 'Anthropic' },
  claude: { icon: SiClaude, name: 'Claude' },
  scikitlearn: { icon: SiScikitlearn, name: 'scikit-learn' },
  keras: { icon: SiKeras, name: 'Keras' },
  jupyter: { icon: SiJupyter, name: 'Jupyter' },
  llama: { icon: SiMeta, name: 'LLaMA' },
  meta: { icon: SiMeta, name: 'Meta' },
  metaai: { icon: SiMetaai, name: 'Meta AI' },
  openai: { icon: Sparkles as unknown as TechIconComponent, name: 'OpenAI' },

  // Languages & Runtimes
  rust: { icon: SiRust, name: 'Rust' },
  python: { icon: SiPython, name: 'Python' },
  cplusplus: { icon: SiCplusplus, name: 'C++' },
  c: { icon: SiC, name: 'C' },
  go: { icon: SiGo, name: 'Go' },
  golang: { icon: SiGo, name: 'Go' },
  typescript: { icon: SiTypescript, name: 'TypeScript' },
  javascript: { icon: SiJavascript, name: 'JavaScript' },
  nodejs: { icon: SiNodedotjs, name: 'Node.js' },
  bash: { icon: SiGnubash, name: 'Bash' },
  shell: { icon: SiGnubash, name: 'Shell' },
  wasm: { icon: SiWebassembly, name: 'WebAssembly' },

  // Frontend
  react: { icon: SiReact, name: 'React' },
  nextjs: { icon: SiNextdotjs, name: 'Next.js' },
  tailwindcss: { icon: SiTailwindcss, name: 'Tailwind CSS' },
  vue: { icon: SiVuedotjs, name: 'Vue.js' },
  svelte: { icon: SiSvelte, name: 'Svelte' },
  angular: { icon: SiAngular, name: 'Angular' },
  vite: { icon: SiVite, name: 'Vite' },
  redux: { icon: SiRedux, name: 'Redux' },
  html5: { icon: SiHtml5, name: 'HTML5' },
  css: { icon: SiCss, name: 'CSS3' },

  // Databases & Backend
  postgresql: { icon: SiPostgresql, name: 'PostgreSQL' },
  supabase: { icon: SiSupabase, name: 'Supabase' },
  redis: { icon: SiRedis, name: 'Redis' },
  mongodb: { icon: SiMongodb, name: 'MongoDB' },
  sqlite: { icon: SiSqlite, name: 'SQLite' },
  mysql: { icon: SiMysql, name: 'MySQL' },
  prisma: { icon: SiPrisma, name: 'Prisma' },

  // DevOps & Cloud
  docker: { icon: SiDocker, name: 'Docker' },
  kubernetes: { icon: SiKubernetes, name: 'Kubernetes' },
  linux: { icon: SiLinux, name: 'Linux' },
  aws: { icon: Cloud as unknown as TechIconComponent, name: 'AWS' },
  gcp: { icon: SiGooglecloud, name: 'Google Cloud' },
  cloudflare: { icon: SiCloudflare, name: 'Cloudflare' },
  github: { icon: SiGithub, name: 'GitHub' },
  git: { icon: SiGit, name: 'Git' },
  nginx: { icon: SiNginx, name: 'NGINX' },
  vercel: { icon: SiVercel, name: 'Vercel' },

  // Streams & APIs
  kafka: { icon: SiApachekafka, name: 'Apache Kafka' },
  graphql: { icon: SiGraphql, name: 'GraphQL' },
  websocket: { icon: SiSocketdotio, name: 'WebSockets' },
  rabbitmq: { icon: SiRabbitmq, name: 'RabbitMQ' },

  // Creative Tech
  threejs: { icon: SiThreedotjs, name: 'Three.js' },
  webgl: { icon: SiWebgl, name: 'WebGL' },
  opengl: { icon: SiOpengl, name: 'OpenGL' },
  blender: { icon: SiBlender, name: 'Blender' },
};

/**
 * 2. Aliases for natural search and abbreviations
 */
const TECH_ALIASES: Record<string, string> = {
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
  cplusplus: 'cplusplus',
  'c++': 'cplusplus',
  tailwind: 'tailwindcss',
  vuejs: 'vue',
  next: 'nextjs',
  'next.js': 'nextjs',
  'three.js': 'threejs',
  three: 'threejs',
  'llama.cpp': 'llama',
  'llama-3': 'llama',
  'llama 3': 'llama',
  llamaindex: 'llama',
  'socket.io': 'websocket',
  websockets: 'websocket',
  'amazon web services': 'aws',
  'google cloud': 'gcp',
  'google cloud platform': 'gcp',
  webassembly: 'wasm',
  sh: 'bash',
  zsh: 'bash',
  css3: 'css',
  html: 'html5',
};

/**
 * 3. Normalizer helper for consistent lookup
 */
export function normalizeTechKey(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\.js\b/g, 'js')
    .replace(/\+\+/g, 'plusplus')
    .replace(/#/g, 'sharp')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * 4. Typo-tolerant Levenshtein distance
 */
function getLevenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Main function: Maps any raw technology string to its official brand logo.
 * If no official brand is matched, returns { Icon: null, isOfficialBrand: false, canonicalName: tag }.
 */
export function getTechBadgeIcon(tag: string): TechIconMatch {
  if (!tag || !tag.trim()) {
    return { Icon: null, isOfficialBrand: false, canonicalName: tag || '' };
  }

  const raw = tag.toLowerCase().trim();
  const norm = normalizeTechKey(tag);

  // Check aliases directly first
  if (TECH_ALIASES[raw]) {
    const key = TECH_ALIASES[raw];
    if (TECH_ICON_REGISTRY[key]) {
      return { Icon: TECH_ICON_REGISTRY[key].icon, isOfficialBrand: true, canonicalName: TECH_ICON_REGISTRY[key].name };
    }
  }
  if (TECH_ALIASES[norm]) {
    const key = TECH_ALIASES[norm];
    if (TECH_ICON_REGISTRY[key]) {
      return { Icon: TECH_ICON_REGISTRY[key].icon, isOfficialBrand: true, canonicalName: TECH_ICON_REGISTRY[key].name };
    }
  }

  // Tier 1: Exact registry match
  if (TECH_ICON_REGISTRY[norm]) {
    return { Icon: TECH_ICON_REGISTRY[norm].icon, isOfficialBrand: true, canonicalName: TECH_ICON_REGISTRY[norm].name };
  }

  // Tier 2: Token / Prefix matching for compound tags (e.g. 'Docker Compose' -> 'Docker', 'Next.js 14' -> 'Next.js')
  for (const [key, item] of Object.entries(TECH_ICON_REGISTRY)) {
    if (key.length >= 3) {
      if (norm.startsWith(key) || norm.endsWith(key)) {
        return { Icon: item.icon, isOfficialBrand: true, canonicalName: item.name };
      }
    }
  }

  // Tier 3: Strict Levenshtein match for small typos (e.g. 'pytrch' -> 'pytorch')
  if (norm.length >= 5) {
    let bestKey: string | null = null;
    let minDist = 999;

    for (const key of Object.keys(TECH_ICON_REGISTRY)) {
      if (Math.abs(norm.length - key.length) > 2) continue;
      const dist = getLevenshteinDistance(norm, key);
      const maxAllowed = norm.length >= 7 ? 2 : 1;
      if (dist <= maxAllowed && dist < minDist) {
        minDist = dist;
        bestKey = key;
      }
    }

    if (bestKey) {
      return { Icon: TECH_ICON_REGISTRY[bestKey].icon, isOfficialBrand: true, canonicalName: TECH_ICON_REGISTRY[bestKey].name };
    }
  }

  // Tier 4: Custom / Unmatched tag — no icon, pure text badge
  return { Icon: null, isOfficialBrand: false, canonicalName: tag.trim() };
}
