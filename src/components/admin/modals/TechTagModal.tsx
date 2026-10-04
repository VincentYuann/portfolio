import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Plus, Check, ChevronDown, ChevronRight, Layers, Sparkles, GripVertical } from 'lucide-react';
import { TechTag } from '../../common/TechTag';
import { useTechIcon, searchTechIcons, normalizeTechSlug } from '../../../lib/techIcons';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

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
      'DeepSeek',
      'LLaMA',
      'CUDA',
      'llama.cpp',
      'Ollama',
      'LangChain',
      'LlamaIndex',
      'scikit-learn',
      'Keras',
      'Jupyter',
      'Pandas',
      'NumPy',
      'OpenCV',
      'Qdrant',
      'Pinecone',
      'Chroma',
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
      'Google',
      'Google Cloud',
      'AWS',
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

/**
 * Live search preview showing verified brand status or clean text-only fallback (no emojis)
 */
const SearchBadgePreview: React.FC<{ query: string }> = ({ query }) => {
  const { isOfficialBrand, canonicalName } = useTechIcon(query);
  const name = canonicalName || query.trim();

  return (
    <div className="mt-2.5 flex items-center gap-2 text-xs text-light-ink-muted dark:text-dark-ink-muted">
      <span>Preview:</span>
      <TechTag tag={name} size="sm" />
      {isOfficialBrand ? (
        <span className="text-2xs font-mono text-bamboo font-semibold uppercase">
          Official Brand Logo Found
        </span>
      ) : (
        <span className="text-2xs font-mono text-light-ink-muted dark:text-dark-ink-muted uppercase">
          Custom Tag (Text Only)
        </span>
      )}
    </div>
  );
};

export const TechTagModal: React.FC<TechTagModalProps> = ({
  isOpen,
  onClose,
  selectedTags,
  onChange,
}) => {
  const [search, setSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const list: string[] = [];
    TECH_CATEGORIES.forEach((cat) => {
      cat.tags.forEach((t) => {
        if (!list.includes(t)) list.push(t);
      });
    });
    return list;
  }, []);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    const normQ = normalizeTechSlug(q);
    return allTags.filter((t) => {
      const normT = normalizeTechSlug(t);
      return (
        t.toLowerCase().includes(q) ||
        normT.includes(normQ)
      );
    });
  }, [allTags, search]);

  // Live Iconify discovery for arbitrary search terms
  useEffect(() => {
    const q = search.trim();
    if (q.length < 2) {
      setDynamicSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      searchTechIcons(q).then((results) => {
        const existingLower = new Set(allTags.map((t) => t.toLowerCase()));
        const unique = results.filter((r) => !existingLower.has(r.toLowerCase()));
        setDynamicSuggestions(unique.slice(0, 8));
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [search, allTags]);

  const [draggedTagIdx, setDraggedTagIdx] = useState<number | null>(null);
  const [dragOverTagIdx, setDragOverTagIdx] = useState<number | null>(null);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const handleMoveTag = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= selectedTags.length || fromIdx === toIdx) return;
    const next = [...selectedTags];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onChange(next);
  };

  const handleDragTagStart = (idx: number) => (e: React.DragEvent<HTMLSpanElement>) => {
    setDraggedTagIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const handleDragTagOver = (idx: number) => (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTagIdx !== idx) {
      setDragOverTagIdx(idx);
    }
  };

  const handleDragTagEnd = () => {
    setDraggedTagIdx(null);
    setDragOverTagIdx(null);
  };

  const handleDropTag = (targetIdx: number) => (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (draggedTagIdx !== null && draggedTagIdx !== targetIdx) {
      handleMoveTag(draggedTagIdx, targetIdx);
    }
    setDraggedTagIdx(null);
    setDragOverTagIdx(null);
  };

  const handleAddCustom = (tagToAdd?: string) => {
    const target = (tagToAdd || search).trim();
    if (!target) return;
    if (!selectedTags.includes(target)) {
      onChange([...selectedTags, target]);
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
      <DialogContent fullscreen showCornerBrackets={false} className="p-0 gap-0 overflow-hidden flex flex-col">
        {/* Header - Distilled, uncluttered header with integrated count & actions */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-light-border dark:border-dark-border shrink-0 pr-14 sm:pr-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Layers className="w-4 h-4 text-terracotta dark:text-ochre shrink-0" />
            <DialogTitle className="text-sm sm:text-base font-semibold tracking-tight text-light-ink dark:text-dark-ink truncate">
              Technology Stack Library
            </DialogTitle>
            <span className="text-light-ink-subtle text-xs hidden xs:inline">·</span>
            <Badge variant="terracotta" className="text-2xs py-0.5 px-2 font-mono shrink-0">
              {selectedTags.length} selected
            </Badge>
          </div>

          {/* Quick Accordion Collapse/Expand Controls */}
          {!search && (
            <div className="flex items-center gap-1.5 text-2xs sm:text-xs font-mono shrink-0">
              <button
                type="button"
                onClick={expandAll}
                className="text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta dark:hover:text-ochre transition-colors px-1.5 py-0.5 rounded cursor-pointer"
              >
                Expand all
              </button>
              <span className="text-light-ink-subtle">/</span>
              <button
                type="button"
                onClick={collapseAll}
                className="text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta dark:hover:text-ochre transition-colors px-1.5 py-0.5 rounded cursor-pointer"
              >
                Collapse
              </button>
            </div>
          )}
        </div>

        {/* Search Bar - Generous breathing room, accessible touch input */}
        <div className="px-4 py-2.5 sm:px-6 sm:py-3 border-b border-light-border/60 dark:border-dark-border/60 bg-light-surface/40 dark:bg-dark-surface-muted/20 shrink-0">
          <div className="relative flex items-center gap-2">
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
                className="pl-9 pr-8 text-xs sm:text-sm h-9 w-full bg-light-surface-card dark:bg-dark-surface-card rounded-md"
                placeholder="Search technologies (e.g. PyTorch, React, Docker, FastAPI)…"
                aria-label="Search technologies"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-light-ink-subtle hover:text-light-ink dark:hover:text-dark-ink p-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {search.trim() && (
              <Button
                type="button"
                size="sm"
                onClick={() => handleAddCustom()}
                className="gap-1.5 shrink-0 text-xs h-9 px-3"
              >
                <Plus className="w-3.5 h-3.5" />
                Add &ldquo;{search.trim()}&rdquo;
              </Button>
            )}
          </div>

          {search.trim() && <SearchBadgePreview query={search.trim()} />}
        </div>

        {/* Selected Tags Tray - Clean horizontal scroll/wrap with ample breathing room */}
        {selectedTags.length > 0 && (
          <div className="px-4 py-2.5 sm:px-6 sm:py-3 bg-terracotta/5 dark:bg-ochre/5 border-b border-light-border/60 dark:border-dark-border/60 shrink-0 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-2xs font-mono text-terracotta dark:text-ochre">
              <span className="font-semibold uppercase tracking-wider">
                Selected Badges ({selectedTags.length})
              </span>
              <span className="text-light-ink-muted dark:text-dark-ink-muted font-normal text-3xs">
                Drag badges or tap &times; to remove
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap overflow-y-auto max-h-32 sm:max-h-36 py-1 -mx-1 px-1 overscroll-contain">
              {selectedTags.map((tag, idx) => {
                const isDragging = draggedTagIdx === idx;
                const isOver = dragOverTagIdx === idx;

                return (
                  <span
                    key={`${tag}-${idx}`}
                    draggable
                    onDragStart={handleDragTagStart(idx)}
                    onDragOver={handleDragTagOver(idx)}
                    onDragEnd={handleDragTagEnd}
                    onDrop={handleDropTag(idx)}
                    title="Drag to reposition badge order"
                    className={`inline-flex items-center gap-1 bg-light-surface dark:bg-dark-surface border rounded-md pl-1.5 pr-1 py-0.5 shadow-2xs transition-all select-none cursor-grab active:cursor-grabbing ${
                      isDragging
                        ? 'opacity-40 scale-95 border-dashed border-terracotta dark:border-ochre'
                        : isOver
                        ? 'border-terracotta dark:border-[#D4A853] ring-1 ring-terracotta/40 dark:ring-[#D4A853]/40 scale-[1.02]'
                        : 'border-terracotta/30 dark:border-[#D4A853]/30 hover:border-terracotta dark:hover:border-[#D4A853]'
                    }`}
                  >
                    <GripVertical className="w-3 h-3 text-light-ink-subtle/50 hover:text-light-ink-muted transition-colors shrink-0" />
                    <TechTag tag={tag} size="sm" className="border-0 shadow-none bg-transparent dark:bg-transparent pointer-events-none p-0" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTag(tag);
                      }}
                      className="text-light-ink-subtle hover:text-red-500 transition-colors p-1 rounded-sm cursor-pointer ml-0.5"
                      aria-label={`Remove ${tag}`}
                      title={`Remove ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable Categories / Search Results */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4">
          {searchResults ? (
            <div className="space-y-5">
              {/* Preloaded Matching Badges */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                    Curated Library Matches ({searchResults.length})
                  </span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {searchResults.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => toggleTag(tag)}
                          className={`group inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer min-h-[38px] sm:min-h-[32px] select-none ${
                            isSelected
                              ? 'bg-terracotta/15 dark:bg-[#D4A853]/15 border-terracotta dark:border-[#D4A853] text-terracotta dark:text-[#D4A853] font-semibold shadow-xs ring-1 ring-terracotta/20 dark:ring-[#D4A853]/20'
                              : 'bg-light-surface dark:bg-dark-surface border-light-border/90 dark:border-dark-border/90 text-light-ink dark:text-dark-ink hover:border-terracotta/70 dark:hover:border-[#D4A853]/70 hover:text-terracotta dark:hover:text-[#D4A853]'
                          }`}
                        >
                          <TechTag tag={tag} size="sm" className="border-0 bg-transparent dark:bg-transparent shadow-none p-0 pointer-events-none" />
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-terracotta dark:text-[#D4A853] shrink-0 ml-0.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 opacity-35 group-hover:opacity-100 shrink-0 ml-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border border-dashed border-light-border dark:border-dark-border text-xs text-light-ink-muted dark:text-dark-ink-muted">
                    No curated badge matches &ldquo;{search}&rdquo;. You can still add it directly below.
                  </div>
                )}
              </div>

              {/* Dynamic Iconify Suggestions if discovered */}
              {dynamicSuggestions.length > 0 && (
                <div className="pt-2 border-t border-light-border/60 dark:border-dark-border/60">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-bamboo" />
                    <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                      Discovered via Iconify Registry ({dynamicSuggestions.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {dynamicSuggestions.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => toggleTag(tag)}
                          className={`group inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer min-h-[38px] sm:min-h-[32px] select-none ${
                            isSelected
                              ? 'bg-terracotta/15 dark:bg-[#D4A853]/15 border-terracotta dark:border-[#D4A853] text-terracotta dark:text-[#D4A853] font-semibold shadow-xs ring-1 ring-terracotta/20 dark:ring-[#D4A853]/20'
                              : 'bg-light-surface dark:bg-dark-surface border-light-border/90 dark:border-dark-border/90 text-light-ink dark:text-dark-ink hover:border-terracotta/70 dark:hover:border-[#D4A853]/70 hover:text-terracotta dark:hover:text-[#D4A853]'
                          }`}
                        >
                          <TechTag tag={tag} size="sm" className="border-0 bg-transparent dark:bg-transparent shadow-none p-0 pointer-events-none" />
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-terracotta dark:text-[#D4A853] shrink-0 ml-0.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 opacity-35 group-hover:opacity-100 shrink-0 ml-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add Custom Directly */}
              <div className="text-center pt-4">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleAddCustom()}
                  className="gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add &ldquo;{search.trim()}&rdquo; to Tech Stack
                </Button>
              </div>
            </div>
          ) : (
            TECH_CATEGORIES.map((cat) => {
              const isCollapsed = Boolean(collapsedCategories[cat.category]);
              const selectedInCat = cat.tags.filter((t) => selectedTags.includes(t)).length;

              return (
                <div
                  key={cat.category}
                  className="border-b border-light-border/70 dark:border-dark-border/70 pb-3"
                >
                  {/* Collapsible Category Header Bar - flat and architectural */}
                  <button
                    type="button"
                    aria-expanded={!isCollapsed}
                    onClick={() => toggleCategory(cat.category)}
                    className="w-full flex items-center justify-between py-2.5 px-1 hover:text-terracotta dark:hover:text-[#D4A853] transition-colors cursor-pointer select-none text-left"
                  >
                    <div className="flex items-center gap-2">
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-terracotta dark:text-[#D4A853] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-terracotta dark:text-[#D4A853] shrink-0" />
                      )}
                      <span className="font-mono text-xs sm:text-sm font-semibold text-light-ink dark:text-dark-ink tracking-wide">
                        {cat.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {selectedInCat > 0 && (
                        <Badge variant="terracotta" className="text-2xs py-0 px-1.5 font-mono">
                          {selectedInCat} active
                        </Badge>
                      )}
                      <span className="text-2xs font-mono text-light-ink-subtle">
                        {cat.tags.length} badges
                      </span>
                    </div>
                  </button>

                  {/* Expanded Tags Grid */}
                  {!isCollapsed && (
                    <div className="pt-2 pb-1 px-1">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {cat.tags.map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => toggleTag(tag)}
                              className={`group inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer min-h-[38px] sm:min-h-[32px] select-none ${
                                isSelected
                                  ? 'bg-terracotta/15 dark:bg-[#D4A853]/15 border-terracotta dark:border-[#D4A853] text-terracotta dark:text-[#D4A853] font-semibold shadow-xs ring-1 ring-terracotta/20 dark:ring-[#D4A853]/20'
                                  : 'bg-light-surface dark:bg-dark-surface border-light-border/90 dark:border-dark-border/90 text-light-ink dark:text-dark-ink hover:border-terracotta/70 dark:hover:border-[#D4A853]/70 hover:text-terracotta dark:hover:text-[#D4A853]'
                              }`}
                            >
                              <TechTag tag={tag} size="sm" className="border-0 bg-transparent dark:bg-transparent shadow-none p-0 pointer-events-none" />
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 text-terracotta dark:text-[#D4A853] shrink-0 ml-0.5" />
                              ) : (
                                <Plus className="w-3.5 h-3.5 opacity-35 group-hover:opacity-100 shrink-0 ml-0.5" />
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

        {/* Footer - Clear primary action with comfortable touch target */}
        <div className="p-3 sm:px-6 sm:py-3.5 border-t border-light-border dark:border-dark-border bg-light-surface/90 dark:bg-dark-surface-card shrink-0 flex items-center justify-between gap-3">
          <span className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted hidden sm:inline">
            Official Simple Icons &amp; Devicon dynamic integration
          </span>
          <Button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 h-10 sm:h-9 font-medium text-xs sm:text-sm cursor-pointer ml-auto"
          >
            Done ({selectedTags.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
