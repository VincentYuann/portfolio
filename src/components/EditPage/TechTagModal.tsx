import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Check, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { TechTag } from '../TechTag';
import { getTechBadgeIcon } from '../../lib/techIcons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export const TECH_CATEGORIES: { category: string; tags: string[] }[] = [
  {
    category: 'AI & Machine Learning & LLMs',
    tags: [
      'PyTorch',
      'TensorFlow',
      'OpenAI',
      'Gemini',
      'Claude',
      'Anthropic',
      'Hugging Face',
      'LLaMA',
      'CUDA',
      'llama.cpp',
      'Ollama',
      'LangChain',
      'scikit-learn',
      'Keras',
      'Jupyter',
      'Pandas',
      'NumPy',
      'OpenCV',
      'Qdrant',
    ],
  },
  {
    category: 'Languages & Core Systems',
    tags: [
      'Rust',
      'Python',
      'C++',
      'C',
      'Go',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Bun',
      'Deno',
      'Bash',
      'WebAssembly',
      'Kotlin',
      'Swift',
      'Zig',
      'Elixir',
      'Scala',
      'Ruby',
      'PHP',
    ],
  },
  {
    category: 'Frontend & UI Frameworks',
    tags: [
      'React',
      'Next.js',
      'Tailwind CSS',
      'Vue.js',
      'Nuxt.js',
      'Svelte',
      'Angular',
      'Astro',
      'Remix',
      'Vite',
      'Framer Motion',
      'Redux',
      'HTML5',
      'CSS3',
    ],
  },
  {
    category: 'Backend, Runtimes & APIs',
    tags: [
      'FastAPI',
      'Flask',
      'Django',
      'Express',
      'NestJS',
      'Spring Boot',
      'tRPC',
      'GraphQL',
      'Apache Kafka',
      'RabbitMQ',
      'WebSockets',
      'MQTT',
    ],
  },
  {
    category: 'Databases & Storage',
    tags: [
      'PostgreSQL',
      'Supabase',
      'Redis',
      'MongoDB',
      'SQLite',
      'MySQL',
      'Prisma',
      'TimescaleDB',
      'ClickHouse',
      'BigQuery',
      'Cassandra',
      'Firebase',
    ],
  },
  {
    category: 'Cloud, Infrastructure & DevOps',
    tags: [
      'Docker',
      'Kubernetes',
      'Linux',
      'AWS',
      'Google Cloud',
      'Cloudflare',
      'Vercel',
      'Netlify',
      'Terraform',
      'Ansible',
      'Jenkins',
      'GitHub',
      'GitLab',
      'Git',
      'NGINX',
      'Datadog',
      'Prometheus',
      'Grafana',
    ],
  },
  {
    category: 'Creative Tech, 3D & Graphics',
    tags: [
      'Three.js',
      'WebGL',
      'OpenGL',
      'Blender',
      'Figma',
    ],
  },
  {
    category: 'Testing & Quality Assurance',
    tags: [
      'Postman',
      'Jest',
      'Vitest',
      'Cypress',
    ],
  },
];

interface TechTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export const TechTagModal: React.FC<TechTagModalProps> = ({
  isOpen,
  onClose,
  selectedTags,
  onChange,
}) => {
  const [search, setSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const allTags = useMemo(() => {
    const list: string[] = [];
    TECH_CATEGORIES.forEach((cat) => {
      cat.tags.forEach((t) => {
        if (!list.includes(t)) list.push(t);
      });
    });
    return list;
  }, []);

  const totalTagCount = allTags.length;

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    return allTags.filter((t) => {
      const match = getTechBadgeIcon(t);
      return (
        t.toLowerCase().includes(q) ||
        match.canonicalName.toLowerCase().includes(q)
      );
    });
  }, [allTags, search]);

  const searchBadge = useMemo(() => {
    const q = search.trim();
    if (!q) return null;
    return getTechBadgeIcon(q);
  }, [search]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = search.trim();
    if (!trimmed) return;
    const match = getTechBadgeIcon(trimmed);
    const tagName = match.canonicalName || trimmed;
    if (!selectedTags.includes(tagName)) {
      onChange([...selectedTags, tagName]);
    }
    setSearch('');
  };

  const toggleCategory = (catName: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const expandAll = () => setCollapsedCategories({});
  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    TECH_CATEGORIES.forEach((c) => {
      next[c.category] = true;
    });
    setCollapsedCategories(next);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl lg:max-w-4xl xl:max-w-5xl h-[88vh] max-h-[780px] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-light-border dark:border-dark-border shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-terracotta font-semibold uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-ochre" />
                Official Tech Stack Library
              </span>
              <span className="text-light-ink-subtle text-xs">·</span>
              <Badge variant="terracotta" className="text-[10px] py-0 px-1.5 font-mono">
                {selectedTags.length} selected
              </Badge>
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono hidden sm:inline-flex">
                {totalTagCount} Badges Preloaded
              </Badge>
            </div>

            {/* Quick Expand / Collapse Actions */}
            {!search && (
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={expandAll}
                  className="text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors px-2 py-1 rounded hover:bg-terracotta/10 cursor-pointer"
                >
                  Expand All
                </button>
                <span className="text-light-ink-subtle">/</span>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors px-2 py-1 rounded hover:bg-terracotta/10 cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            )}
          </div>

          <DialogTitle className="mt-1 text-lg sm:text-xl">Select Official Technology Badges</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            High-fidelity brand logos automatically linked without version number clutter.
          </DialogDescription>
        </DialogHeader>

        {/* Search Input Bar */}
        <div className="p-3 sm:p-4 border-b border-light-border/60 dark:border-dark-border/60 bg-light-surface/50 dark:bg-dark-surface-muted/30 shrink-0">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-ink-subtle pointer-events-none" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustom();
                  }
                }}
                className="pl-9 pr-3 text-xs sm:text-sm w-full"
                placeholder="Search official tech logos (e.g. PyTorch, Docker, Next.js, Rust, AWS, CUDA)…"
                aria-label="Search official technology logos"
                autoFocus
              />
            </div>
            {search.trim() && (
              <Button
                type="button"
                size="sm"
                onClick={handleAddCustom}
                className="gap-1 shrink-0 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add &ldquo;{searchBadge?.canonicalName || search.trim()}&rdquo;
              </Button>
            )}
          </div>

          {searchBadge && (
            <div className="mt-2.5 flex items-center gap-2 text-xs text-light-ink-muted dark:text-dark-ink-muted">
              <span>Preview:</span>
              <TechTag tag={searchBadge.canonicalName || search.trim()} size="sm" />
              {searchBadge.isOfficialBrand ? (
                <span className="text-[10px] font-mono text-bamboo font-semibold uppercase">
                  Official Brand Logo Found
                </span>
              ) : (
                <span className="text-[10px] font-mono text-light-ink-muted dark:text-dark-ink-muted uppercase">
                  Custom Tag (No Logo)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Selected Tags Preview Bar */}
        {selectedTags.length > 0 && (
          <div className="px-5 py-2.5 bg-terracotta/5 dark:bg-terracotta/10 border-b border-light-border/60 dark:border-dark-border/60 flex items-center gap-2 overflow-y-auto max-h-24 shrink-0">
            <span className="font-mono text-[10px] text-terracotta font-semibold uppercase tracking-wider shrink-0">
              Active ({selectedTags.length}):
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-light-surface dark:bg-dark-surface border border-terracotta/40 rounded-md pr-1.5 shadow-2xs"
                >
                  <TechTag tag={tag} size="sm" className="border-0 shadow-none bg-transparent dark:bg-transparent" />
                  <button
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="text-light-ink-subtle hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable Categories / Search Results */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4">
          {searchResults ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                  Matching Badges ({searchResults.length})
                </span>
              </div>

              {searchResults.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {searchResults.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleTag(tag)}
                        className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-terracotta/15 border-terracotta text-terracotta font-semibold shadow-xs'
                            : 'bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink hover:border-terracotta hover:text-terracotta'
                        }`}
                      >
                        <TechTag tag={tag} size="sm" className="border-0 bg-transparent dark:bg-transparent shadow-none p-0" />
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-terracotta shrink-0 ml-1" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mb-3">
                    No predefined tech badge found matching &ldquo;{search}&rdquo;.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddCustom}
                    className="gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add &ldquo;{searchBadge?.canonicalName || search.trim()}&rdquo; to Tech Stack
                  </Button>
                </div>
              )}
            </div>
          ) : (
            TECH_CATEGORIES.map((cat) => {
              const isCollapsed = Boolean(collapsedCategories[cat.category]);
              const selectedInCat = cat.tags.filter((t) => selectedTags.includes(t)).length;

              return (
                <div
                  key={cat.category}
                  className="rounded-xl border border-light-border/80 dark:border-dark-border/80 overflow-hidden bg-light-surface/40 dark:bg-dark-surface/40"
                >
                  {/* Collapsible Category Header Bar */}
                  <button
                    type="button"
                    aria-expanded={!isCollapsed}
                    onClick={() => toggleCategory(cat.category)}
                    className="w-full flex items-center justify-between p-3.5 sm:px-4 bg-light-surface-card dark:bg-dark-surface-card hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised transition-colors cursor-pointer select-none text-left"
                  >
                    <div className="flex items-center gap-2">
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-terracotta shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-terracotta shrink-0" />
                      )}
                      <span className="font-mono text-xs font-semibold text-light-ink dark:text-dark-ink tracking-wide">
                        {cat.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {selectedInCat > 0 && (
                        <Badge variant="terracotta" className="text-[10px] py-0 px-1.5 font-mono">
                          {selectedInCat} active
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono">
                        {cat.tags.length} items
                      </Badge>
                    </div>
                  </button>

                  {/* Expanded Tags Grid */}
                  {!isCollapsed && (
                    <div className="p-3.5 sm:p-4 border-t border-light-border/60 dark:border-dark-border/60 bg-light-surface/20 dark:bg-dark-surface/20">
                      <div className="flex flex-wrap gap-2">
                        {cat.tags.map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => toggleTag(tag)}
                              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-terracotta/15 border-terracotta text-terracotta font-semibold shadow-xs'
                                  : 'bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink hover:border-terracotta hover:text-terracotta'
                              }`}
                            >
                              <TechTag tag={tag} size="sm" className="border-0 bg-transparent dark:bg-transparent shadow-none p-0" />
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 text-terracotta shrink-0 ml-1" />
                              ) : (
                                <Plus className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 shrink-0 ml-1" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-3.5 sm:p-4 border-t border-light-border dark:border-dark-border bg-light-surface/90 dark:bg-dark-surface-card shrink-0 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <span className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted text-center sm:text-left">
            Monochrome architectural badge design · Official simple-icons integration
          </span>
          <Button type="button" onClick={onClose} className="px-5">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
