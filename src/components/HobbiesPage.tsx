import React, { useState } from 'react';
import { ArrowLeft, Search, Layers } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { VerticalMarginWidget, MARGIN_PRESETS } from './VerticalMarginWidget';
import { ViewMode } from '../App';
import { HobbyCard } from './shared/HobbyCard';

interface HobbiesPageProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
}

export const HobbiesPage: React.FC<HobbiesPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { profile } = useSiteData();
  const hobbies = Array.isArray(profile.hobbies) ? profile.hobbies : [];

  // Extract unique categories for pill filter bar
  const categories: string[] = ['all', ...Array.from(new Set(hobbies.map((h) => h.category).filter((c): c is string => Boolean(c))))];

  const filteredHobbies = hobbies.filter((hobby) => {
    const matchesSearch =
      !searchQuery.trim() ||
      hobby.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hobby.subtitle && hobby.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      hobby.whyDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hobby.category && hobby.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (hobby.metadata &&
        hobby.metadata.some(
          (m) =>
            m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.value.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesCategory =
      selectedCategory === 'all' || (hobby.category && hobby.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative w-full min-h-screen overflow-x-clip">
      {/* Floating Vertical Margins in Left & Right Empty Spaces */}
      <VerticalMarginWidget
        side="left"
        top="top-72"
        {...MARGIN_PRESETS.shokuninCraft}
      />
      <VerticalMarginWidget
        side="right"
        top="top-96"
        {...MARGIN_PRESETS.akariSimplicity}
      />
      <VerticalMarginWidget
        side="left"
        top="top-[68%]"
        type="minimal"
        stampChar="遊"
      />

      <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back navigation button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => onNavigate?.('home', 'hobbies')}
            className="inline-flex items-center gap-2 font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio</span>
          </button>
        </div>

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-light-border/70 dark:border-[#2D3039]/80 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-serif text-terracotta text-sm">ARCHIVE //</span>
              <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                PERSONAL PURSUITS · 趣味の記録
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal">
              Hobbies &amp; Life{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
                日常と趣味
              </span>
            </h1>
            <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 font-light leading-relaxed max-w-3xl">
              A gallery of interests, creative outlets, and passions outside of software engineering: anime, gaming, fitness, market trading, and dining.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-ink-muted" />
            <input
              type="text"
              placeholder="Search passions, shows, workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink focus:outline-none focus:border-terracotta/60"
            />
          </div>
        </div>

        {/* Filter Pills */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-terracotta text-white shadow-xs'
                    : 'bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink-muted dark:text-dark-ink-muted hover:border-terracotta/50'
                }`}
              >
                {cat === 'all' ? 'All Passions' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Hobbies Grid */}
        {filteredHobbies.length === 0 ? (
          <div className="p-16 text-center rounded-xl bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <Layers className="w-10 h-10 text-light-ink-subtle dark:text-dark-ink-subtle mx-auto mb-3" />
            <h3 className="font-serif text-lg text-light-ink dark:text-dark-ink">
              No hobbies matched your criteria
            </h3>
            <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mt-1">
              Try adjusting your search query or selecting "All Passions".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-terracotta hover:bg-terracotta/90 text-white text-xs font-sans rounded-md transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {filteredHobbies.map((hobby, idx) => (
              <HobbyCard
                key={hobby.id || idx}
                hobby={hobby}
                index={idx}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
