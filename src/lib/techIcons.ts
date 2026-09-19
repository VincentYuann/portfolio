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
  SiPandas,
  SiNumpy,
  SiOpencv,
  SiLangchain,
  SiOllama,
  SiQdrant,

  // Languages & Core Runtimes
  SiRust,
  SiPython,
  SiCplusplus,
  SiC,
  SiGo,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiBun,
  SiDeno,
  SiGnubash,
  SiHtml5,
  SiCss,
  SiWebassembly,
  SiKotlin,
  SiSwift,
  SiPhp,
  SiRuby,
  SiElixir,
  SiScala,
  SiZig,

  // Frontend & UI
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiVuedotjs,
  SiNuxt,
  SiSvelte,
  SiAngular,
  SiAstro,
  SiRemix,
  SiFramer,
  SiVite,
  SiRedux,

  // Backend & APIs
  SiFastapi,
  SiFlask,
  SiDjango,
  SiExpress,
  SiNestjs,
  SiSpringboot,
  SiTrpc,
  SiGraphql,
  SiApachekafka,
  SiRabbitmq,
  SiSocketdotio,
  SiMqtt,

  // Databases & Storage
  SiPostgresql,
  SiSupabase,
  SiRedis,
  SiMongodb,
  SiSqlite,
  SiMysql,
  SiPrisma,
  SiTimescale,
  SiClickhouse,
  SiGooglebigquery,
  SiApachecassandra,
  SiFirebase,

  // Cloud, Infrastructure & DevOps
  SiDocker,
  SiKubernetes,
  SiLinux,
  SiGooglecloud,
  SiCloudflare,
  SiGithub,
  SiGitlab,
  SiGit,
  SiNginx,
  SiVercel,
  SiNetlify,
  SiTerraform,
  SiAnsible,
  SiJenkins,
  SiDatadog,
  SiPrometheus,
  SiGrafana,

  // Creative Tech & Graphics
  SiThreedotjs,
  SiWebgl,
  SiOpengl,
  SiBlender,
  SiFigma,

  // Testing & Tooling
  SiPostman,
  SiJest,
  SiVitest,
  SiCypress,
} from '@icons-pack/react-simple-icons';

import {
  Sparkles,
  Cloud,
  Cpu,
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
 * Curated Registry of Official Brand Tech Logos
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
  pandas: { icon: SiPandas, name: 'Pandas' },
  numpy: { icon: SiNumpy, name: 'NumPy' },
  opencv: { icon: SiOpencv, name: 'OpenCV' },
  langchain: { icon: SiLangchain, name: 'LangChain' },
  ollama: { icon: SiOllama, name: 'Ollama' },
  qdrant: { icon: SiQdrant, name: 'Qdrant' },
  cuda: { icon: Cpu as unknown as TechIconComponent, name: 'CUDA' },
  llamacpp: { icon: SiCplusplus, name: 'llama.cpp' },

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
  bun: { icon: SiBun, name: 'Bun' },
  deno: { icon: SiDeno, name: 'Deno' },
  bash: { icon: SiGnubash, name: 'Bash' },
  shell: { icon: SiGnubash, name: 'Shell' },
  wasm: { icon: SiWebassembly, name: 'WebAssembly' },
  kotlin: { icon: SiKotlin, name: 'Kotlin' },
  swift: { icon: SiSwift, name: 'Swift' },
  php: { icon: SiPhp, name: 'PHP' },
  ruby: { icon: SiRuby, name: 'Ruby' },
  elixir: { icon: SiElixir, name: 'Elixir' },
  scala: { icon: SiScala, name: 'Scala' },
  zig: { icon: SiZig, name: 'Zig' },
  html5: { icon: SiHtml5, name: 'HTML5' },
  css: { icon: SiCss, name: 'CSS3' },

  // Frontend
  react: { icon: SiReact, name: 'React' },
  nextjs: { icon: SiNextdotjs, name: 'Next.js' },
  tailwindcss: { icon: SiTailwindcss, name: 'Tailwind CSS' },
  vue: { icon: SiVuedotjs, name: 'Vue.js' },
  nuxt: { icon: SiNuxt, name: 'Nuxt.js' },
  svelte: { icon: SiSvelte, name: 'Svelte' },
  angular: { icon: SiAngular, name: 'Angular' },
  astro: { icon: SiAstro, name: 'Astro' },
  remix: { icon: SiRemix, name: 'Remix' },
  framermotion: { icon: SiFramer, name: 'Framer Motion' },
  vite: { icon: SiVite, name: 'Vite' },
  redux: { icon: SiRedux, name: 'Redux' },

  // Backend & APIs
  fastapi: { icon: SiFastapi, name: 'FastAPI' },
  flask: { icon: SiFlask, name: 'Flask' },
  django: { icon: SiDjango, name: 'Django' },
  express: { icon: SiExpress, name: 'Express' },
  nestjs: { icon: SiNestjs, name: 'NestJS' },
  springboot: { icon: SiSpringboot, name: 'Spring Boot' },
  trpc: { icon: SiTrpc, name: 'tRPC' },
  graphql: { icon: SiGraphql, name: 'GraphQL' },
  kafka: { icon: SiApachekafka, name: 'Apache Kafka' },
  rabbitmq: { icon: SiRabbitmq, name: 'RabbitMQ' },
  websocket: { icon: SiSocketdotio, name: 'WebSockets' },
  mqtt: { icon: SiMqtt, name: 'MQTT' },

  // Databases & Backend
  postgresql: { icon: SiPostgresql, name: 'PostgreSQL' },
  supabase: { icon: SiSupabase, name: 'Supabase' },
  redis: { icon: SiRedis, name: 'Redis' },
  mongodb: { icon: SiMongodb, name: 'MongoDB' },
  sqlite: { icon: SiSqlite, name: 'SQLite' },
  mysql: { icon: SiMysql, name: 'MySQL' },
  prisma: { icon: SiPrisma, name: 'Prisma' },
  timescaledb: { icon: SiTimescale, name: 'TimescaleDB' },
  clickhouse: { icon: SiClickhouse, name: 'ClickHouse' },
  bigquery: { icon: SiGooglebigquery, name: 'BigQuery' },
  cassandra: { icon: SiApachecassandra, name: 'Cassandra' },
  firebase: { icon: SiFirebase, name: 'Firebase' },

  // DevOps & Cloud
  docker: { icon: SiDocker, name: 'Docker' },
  kubernetes: { icon: SiKubernetes, name: 'Kubernetes' },
  linux: { icon: SiLinux, name: 'Linux' },
  aws: { icon: Cloud as unknown as TechIconComponent, name: 'AWS' },
  gcp: { icon: SiGooglecloud, name: 'Google Cloud' },
  cloudflare: { icon: SiCloudflare, name: 'Cloudflare' },
  github: { icon: SiGithub, name: 'GitHub' },
  gitlab: { icon: SiGitlab, name: 'GitLab' },
  git: { icon: SiGit, name: 'Git' },
  nginx: { icon: SiNginx, name: 'NGINX' },
  vercel: { icon: SiVercel, name: 'Vercel' },
  netlify: { icon: SiNetlify, name: 'Netlify' },
  terraform: { icon: SiTerraform, name: 'Terraform' },
  ansible: { icon: SiAnsible, name: 'Ansible' },
  jenkins: { icon: SiJenkins, name: 'Jenkins' },
  datadog: { icon: SiDatadog, name: 'Datadog' },
  prometheus: { icon: SiPrometheus, name: 'Prometheus' },
  grafana: { icon: SiGrafana, name: 'Grafana' },

  // Creative Tech & 3D
  threejs: { icon: SiThreedotjs, name: 'Three.js' },
  webgl: { icon: SiWebgl, name: 'WebGL' },
  opengl: { icon: SiOpengl, name: 'OpenGL' },
  blender: { icon: SiBlender, name: 'Blender' },
  figma: { icon: SiFigma, name: 'Figma' },

  // Testing & Quality
  postman: { icon: SiPostman, name: 'Postman' },
  jest: { icon: SiJest, name: 'Jest' },
  vitest: { icon: SiVitest, name: 'Vitest' },
  cypress: { icon: SiCypress, name: 'Cypress' },
};

/**
 * Aliases for natural search and abbreviations
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
  'next.js 14': 'nextjs',
  'three.js': 'threejs',
  three: 'threejs',
  'llama.cpp': 'llamacpp',
  'llama-3': 'llama',
  'llama 3': 'llama',
  llamaindex: 'langchain',
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
  framer: 'framermotion',
  timescale: 'timescaledb',
};

/**
 * Normalizer helper for consistent lookup
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
 * Typo-tolerant Levenshtein distance
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
 * Maps any raw technology string to its official brand logo.
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

  // Tier 2: Token / Prefix matching for compound tags
  for (const [key, item] of Object.entries(TECH_ICON_REGISTRY)) {
    if (key.length >= 3) {
      if (norm.startsWith(key) || norm.endsWith(key)) {
        return { Icon: item.icon, isOfficialBrand: true, canonicalName: item.name };
      }
    }
  }

  // Tier 3: Strict Levenshtein match for small typos
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

  // Tier 4: Custom / Unmatched tag
  return { Icon: null, isOfficialBrand: false, canonicalName: tag.trim() };
}
