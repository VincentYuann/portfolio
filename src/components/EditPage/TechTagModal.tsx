import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Check } from 'lucide-react';
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
    category: 'AI & Machine Learning',
    tags: [
      'PyTorch',
      'TensorFlow',
      'OpenAI',
      'Hugging Face',
      'LLaMA',
      'scikit-learn',
      'Keras',
      'Jupyter',
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
      'Bash',
      'WebAssembly',
    ],
  },
  {
    category: 'Frontend & UI Frameworks',
    tags: [
      'React',
      'Next.js',
      'Tailwind CSS',
      'Vue.js',
      'Svelte',
      'Angular',
      'Vite',
      'Redux',
      'HTML5',
      'CSS3',
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
    ],
  },
  {
    category: 'Cloud, Infrastructure & Containers',
    tags: [
      'Docker',
      'Kubernetes',
      'Linux',
      'AWS',
      'Google Cloud',
      'Cloudflare',
      'GitHub',
      'Git',
      'NGINX',
      'Vercel',
    ],
  },
  {
    category: 'Streams, Events & APIs',
    tags: [
      'Apache Kafka',
      'GraphQL',
      'WebSockets',
      'RabbitMQ',
    ],
  },
  {
    category: 'Creative Tech, 3D & Shaders',
    tags: [
      'Three.js',
      'WebGL',
      'OpenGL',
      'Blender',
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
    return allTags.filter((t) => {
      const match = getTechBadgeIcon(t);
      return (
        t.toLowerCase().includes(q) ||
        match.canonicalName.toLowerCase().includes(q)
      );
    });
  }, [search, allTags]);

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
    const resolvedName = match.isOfficialBrand ? match.canonicalName : trimmed;

    if (!selectedTags.includes(resolvedName)) {
      onChange([...selectedTags, resolvedName]);
    }
    setSearch('');
  };

  const searchBadge = useMemo(() => {
    if (!search.trim()) return null;
    return getTechBadgeIcon(search.trim());
  }, [search]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl h-[82vh] max-h-[640px] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-5 sm:p-6 pb-4 border-b border-light-border dark:border-dark-border shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-terracotta font-semibold uppercase tracking-widest">
              Official Tech Stack Library
            </span>
            <span className="text-light-ink-subtle text-xs">·</span>
            <Badge variant="terracotta" className="text-[10px] py-0 px-1.5 font-mono">
              {selectedTags.length} selected
            </Badge>
          </div>
          <DialogTitle>Select Official Technology Badges</DialogTitle>
          <DialogDescription>
            Official brand logos automatically linked without version number clutter.
          </DialogDescription>
        </DialogHeader>

        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-light-border/60 dark:border-dark-border/60 bg-light-surface/50 dark:bg-dark-surface-muted/30 shrink-0">
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
                placeholder="Search official tech logos (e.g. PyTorch, Docker, Next.js, Rust, AWS)…"
                autoFocus
              />
            </div>
            {search.trim() && (
              <Button
                type="button"
                size="sm"
                onClick={handleAddCustom}
                className="gap-1 shrink-0"
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
              Active:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-light-surface dark:bg-[#16171D] border border-terracotta/40 rounded-md pr-1.5 shadow-2xs"
                >
                  <TechTag tag={tag} size="sm" className="border-0 shadow-none bg-transparent dark:bg-transparent" />
                  <button
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="text-light-ink-subtle hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                    title={`Remove ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable Categories / Search Results */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-6">
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
                        onClick={() => toggleTag(tag)}
                        className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-terracotta/15 border-terracotta text-terracotta font-semibold shadow-xs'
                            : 'bg-light-surface dark:bg-[#16171D] border-light-border dark:border-[#333640] text-light-ink dark:text-dark-ink hover:border-terracotta hover:text-terracotta'
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
            TECH_CATEGORIES.map((cat) => (
              <div key={cat.category} className="space-y-2.5">
                <h4 className="font-mono text-[11px] font-semibold text-terracotta uppercase tracking-widest flex items-center gap-1.5">
                  <span>§</span>
                  <span>{cat.category}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-terracotta/15 border-terracotta text-terracotta font-semibold shadow-xs'
                            : 'bg-light-surface dark:bg-[#16171D] border-light-border dark:border-[#333640] text-light-ink dark:text-dark-ink hover:border-terracotta hover:text-terracotta'
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
            ))
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-3.5 sm:p-5 border-t border-light-border dark:border-dark-border bg-light-surface/90 dark:bg-dark-surface-card shrink-0 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <span className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted text-center sm:text-left">
            Monochrome architectural badge design · No rainbow tints
          </span>
          <Button type="button" onClick={onClose} className="px-5">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
