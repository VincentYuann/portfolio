export interface KanjiPreset {
  char: string;
  romaji: string;
  category: 'Philosophy & Zen' | 'Elements & Nature' | 'Engineering & Craft' | 'Origin & Architecture' | 'Dynamic & Motion' | 'Intelligence & Light';
  meaning: string;
  conceptDescription: string;
}

export const KANJI_PRESETS: KanjiPreset[] = [
  // Philosophy & Zen
  {
    char: '間',
    romaji: 'Ma',
    category: 'Philosophy & Zen',
    meaning: 'Intentional Space',
    conceptDescription: 'The negative space and conscious pause that gives form to architecture.',
  },
  {
    char: '墨',
    romaji: 'Sumi',
    category: 'Philosophy & Zen',
    meaning: 'Sumi Ink & Digital Simplicity',
    conceptDescription: 'Distraction-free computing and monochrome calligraphy aesthetics.',
  },
  {
    char: '寂',
    romaji: 'Jaku / Sabi',
    category: 'Philosophy & Zen',
    meaning: 'Wabi-Sabi Patina',
    conceptDescription: 'Celebrating natural wear, honest materials, and functional authenticity.',
  },
  {
    char: '幽',
    romaji: 'Yūgen',
    category: 'Philosophy & Zen',
    meaning: 'Subtle Mystery',
    conceptDescription: 'A profound grace and depth beneath the visible surface.',
  },
  {
    char: '渋',
    romaji: 'Shibui',
    category: 'Philosophy & Zen',
    meaning: 'Restrained Elegance',
    conceptDescription: 'Subtle, unobtrusive beauty that reveals itself gradually.',
  },
  {
    char: '静',
    romaji: 'Sei / Shizuka',
    category: 'Philosophy & Zen',
    meaning: 'Tranquility & Calm',
    conceptDescription: 'Zero cognitive noise, peaceful runtime stability, and clean focus.',
  },
  {
    char: '和',
    romaji: 'Wa',
    category: 'Philosophy & Zen',
    meaning: 'Harmony & Balance',
    conceptDescription: 'Seamless integration between human intent and machine execution.',
  },
  {
    char: '道',
    romaji: 'Dō / Michi',
    category: 'Philosophy & Zen',
    meaning: 'The Way / Discipline',
    conceptDescription: 'The lifelong pursuit of mastery, method, and principled craftsmanship.',
  },

  // Elements & Nature
  {
    char: '木',
    romaji: 'Ki / Moku',
    category: 'Elements & Nature',
    meaning: 'Tree · Organic Growth / AI',
    conceptDescription: 'Living synthesis, tree-based models, and organic system evolution.',
  },
  {
    char: '焔',
    romaji: 'Homura',
    category: 'Elements & Nature',
    meaning: 'Flame · High Velocity',
    conceptDescription: 'Blazing performance, passionate intensity, and rapid throughput.',
  },
  {
    char: '蓮',
    romaji: 'Ren / Hasu',
    category: 'Elements & Nature',
    meaning: 'Lotus · Purity in Code',
    conceptDescription: 'Elegance rising from complexity without retaining impurities.',
  },
  {
    char: '雲',
    romaji: 'Kumo',
    category: 'Elements & Nature',
    meaning: 'Cloud · Distributed Fabric',
    conceptDescription: 'Ephemeral infrastructure, elastic clusters, and ambient compute.',
  },
  {
    char: '風',
    romaji: 'Kaze',
    category: 'Elements & Nature',
    meaning: 'Wind · Fluid Low-Latency',
    conceptDescription: 'Unimpeded packet streaming, rapid data pipelines, and responsive UI.',
  },
  {
    char: '海',
    romaji: 'Umi',
    category: 'Elements & Nature',
    meaning: 'Ocean · Data Lake',
    conceptDescription: 'Deep reservoirs of telemetry, massive vector stores, and vast scale.',
  },
  {
    char: '星',
    romaji: 'Hoshi',
    category: 'Elements & Nature',
    meaning: 'Star · Guiding Vision',
    conceptDescription: 'Celestial beacons, north-star architecture, and clear direction.',
  },
  {
    char: '鏡',
    romaji: 'Kagami',
    category: 'Elements & Nature',
    meaning: 'Mirror · Observability',
    conceptDescription: 'Telemetry reflection, system introspectability, and clear logging.',
  },

  // Engineering & Craft
  {
    char: '匠',
    romaji: 'Takumi',
    category: 'Engineering & Craft',
    meaning: 'Artisan / Master Craft',
    conceptDescription: 'Meticulous engineering, unyielding attention to detail, and pride of work.',
  },
  {
    char: '創',
    romaji: 'Sō / Tsukuru',
    category: 'Engineering & Craft',
    meaning: 'Creation & Invention',
    conceptDescription: 'Architecting novel systems, original products, and groundbreaking tools.',
  },
  {
    char: '研',
    romaji: 'Ken / Togi',
    category: 'Engineering & Craft',
    meaning: 'Research & Honing',
    conceptDescription: 'Sharpening algorithms, deep exploration, and scientific precision.',
  },
  {
    char: '機',
    romaji: 'Ki / Karakuri',
    category: 'Engineering & Craft',
    meaning: 'Mechanism & Engine',
    conceptDescription: 'State machines, deterministic pipelines, and resilient mechanical engines.',
  },
  {
    char: '律',
    romaji: 'Ritsu',
    category: 'Engineering & Craft',
    meaning: 'Law & Cryptography',
    conceptDescription: 'Strict protocols, cryptographic verifiability, and type safety.',
  },
  {
    char: '結',
    romaji: 'Yui / Musubi',
    category: 'Engineering & Craft',
    meaning: 'Nexus & Synthesis',
    conceptDescription: 'Binding disparate services into an unified, synchronized ecosystem.',
  },
  {
    char: '武',
    romaji: 'Bu',
    category: 'Engineering & Craft',
    meaning: 'Hardened Security',
    conceptDescription: 'Defensive architecture, zero-trust boundaries, and fault tolerance.',
  },

  // Origin & Architecture
  {
    char: '零',
    romaji: 'Rei / Zero',
    category: 'Origin & Architecture',
    meaning: 'Zero · Genesis Kernel',
    conceptDescription: 'The baseline foundation, zero-dependency kernels, and clean genesis.',
  },
  {
    char: '基',
    romaji: 'Ki / Moto',
    category: 'Origin & Architecture',
    meaning: 'Substrate & Core',
    conceptDescription: 'The foundational bedrock upon which entire platforms are erected.',
  },
  {
    char: '構',
    romaji: 'Kō / Kamae',
    category: 'Origin & Architecture',
    meaning: 'System Framework',
    conceptDescription: 'Structural design patterns, schema blueprints, and scaffolding.',
  },
  {
    char: '礎',
    romaji: 'Ishizue',
    category: 'Origin & Architecture',
    meaning: 'Cornerstone',
    conceptDescription: 'Immutable, unshakable groundwork ensuring long-term resilience.',
  },
  {
    char: '案',
    romaji: 'An',
    category: 'Origin & Architecture',
    meaning: 'Project Blueprint',
    conceptDescription: 'Technical proposal, design document, and architectural prototype.',
  },
  {
    char: '核',
    romaji: 'Kaku',
    category: 'Origin & Architecture',
    meaning: 'Kernel / Core Engine',
    conceptDescription: 'The central nucleus that powers compute, memory, and orchestration.',
  },

  // Dynamic & Motion
  {
    char: '龍',
    romaji: 'Ryū',
    category: 'Dynamic & Motion',
    meaning: 'Dragon · Ascendant Scale',
    conceptDescription: 'Dynamic power, exponential scalability, and fearless ambition.',
  },
  {
    char: '流',
    romaji: 'Ryū / Nagare',
    category: 'Dynamic & Motion',
    meaning: 'Reactive Event Stream',
    conceptDescription: 'Event-driven message streams, reactive pipelines, and smooth flow.',
  },
  {
    char: '閃',
    romaji: 'Sen / Hirameki',
    category: 'Dynamic & Motion',
    meaning: 'Flash · Real-Time Speed',
    conceptDescription: 'Sub-millisecond latency, instant spark of insight, and rapid inference.',
  },
  {
    char: '極',
    romaji: 'Kyoku',
    category: 'Dynamic & Motion',
    meaning: 'Zenith / Optimization',
    conceptDescription: 'Maximum performance ceiling, SIMD vectorization, and GPU acceleration.',
  },
  {
    char: '響',
    romaji: 'Hibiki',
    category: 'Dynamic & Motion',
    meaning: 'Resonance & Telemetry',
    conceptDescription: 'Live signals echoing back from production systems in real-time.',
  },
  {
    char: '影',
    romaji: 'Kage',
    category: 'Dynamic & Motion',
    meaning: 'Shadow · Background Daemon',
    conceptDescription: 'Silent background workers, headless services, and stealth operations.',
  },

  // Intelligence & Light
  {
    char: '智',
    romaji: 'Chi',
    category: 'Intelligence & Light',
    meaning: 'Wisdom & Intelligence',
    conceptDescription: 'Knowledge graphs, neural reasoning, and deep analytical insight.',
  },
  {
    char: '光',
    romaji: 'Hikari',
    category: 'Intelligence & Light',
    meaning: 'Light & Clarity',
    conceptDescription: 'Unambiguous UX, clear system boundaries, and illuminating documentation.',
  },
  {
    char: '明',
    romaji: 'Mei / Akari',
    category: 'Intelligence & Light',
    meaning: 'Illumination & Insight',
    conceptDescription: 'Bespoke design clarity, luminous aesthetics, and transparent telemetry.',
  },
  {
    char: '虚',
    romaji: 'Kyō / Utsuro',
    category: 'Intelligence & Light',
    meaning: 'Boundless Void / Compute',
    conceptDescription: 'Infinite capacity, decoupled compute from storage, and pure potential.',
  },
  {
    char: '魂',
    romaji: 'Tamashii',
    category: 'Intelligence & Light',
    meaning: 'Soul · Core Identity',
    conceptDescription: 'The intangible spirit and signature aesthetic infused into software.',
  },
  {
    char: '玄',
    romaji: 'Gen',
    category: 'Intelligence & Light',
    meaning: 'Profound / Deep Zen',
    conceptDescription: 'The subtle elegance of deep engineering invisible to the untrained eye.',
  },
];

/**
 * Finds the preset details for any given kanji character string.
 */
export function getKanjiPreset(char: string): KanjiPreset | undefined {
  if (!char) return undefined;
  const trimmed = char.trim();
  return KANJI_PRESETS.find((p) => p.char === trimmed);
}
