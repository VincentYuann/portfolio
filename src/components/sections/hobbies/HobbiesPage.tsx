import React, { useState } from 'react';
import { ArrowLeft, Search, Layers } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { ViewMode } from '../../../App';
import { HobbyCard } from './HobbyCard';
import { SectionSideBackdrop } from '../../common/SectionSideBackdrop';

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
      {/* 16:9 Linen Texture Ground & Sumi-e Pine Tree (Retains exact Hobbies Section identity) */}
      <SectionSideBackdrop
        textureDay="./background/white linen.jpg"
        textureNight="./background/black linen.jpg"
        painting="./decorators/tree.jpg"
        paintingAlt="Sumi-e pine tree ink wash painting"
        placement="right"
        artworkWidth="w-full lg:w-[50%]"
        maskCenter="at 75% 50%"
        textureOpacityDay={0.65}
        textureOpacityNight={0.45}
        paintingOpacityDay={0.35}
        paintingOpacityNight={0.14}
      />
      <div className="w-full pt-20 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        {/* Back navigation button */}
        <div className="mb-4 sm:mb-8">
          <button
            onClick={() => onNavigate?.('home', 'hobbies')}
            className="inline-flex items-center gap-2 font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta dark:hover:text-[#D4A853] transition-colors group cursor-pointer py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio</span>
          </button>
        </div>

        {/* Header Title Section — distilled on mobile */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 sm:pb-8 border-b border-light-border/70 dark:border-dark-border/80 mb-5 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="font-mono text-[11px] sm:text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium">Archive //</span>
              <span className="font-mono text-[11px] sm:text-xs font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                Personal Pursuits · 趣味の記録
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal leading-tight">
              Hobbies &amp; Life{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-lg sm:text-2xl lg:text-3xl ml-1.5 sm:ml-2 whitespace-nowrap inline-block">
                日常と趣味
              </span>
            </h1>
            <p className="font-sans text-xs sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-2 sm:mt-3 font-normal leading-relaxed max-w-prose">
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
              className="w-full pl-9 pr-3 py-2 text-xs rounded-[2px] bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink focus:outline-none focus:border-terracotta/60 dark:focus:border-[#D4A853]/60 font-sans"
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
                className={`px-3 py-1.5 rounded-[2px] font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light shadow-xs'
                    : 'bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink-muted dark:text-dark-ink-muted hover:border-terracotta/50 dark:hover:border-[#D4A853]/50'
                }`}
              >
                {cat === 'all' ? 'All Passions' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Hobbies Grid */}
        {filteredHobbies.length === 0 ? (
          <div className="p-16 text-center rounded-[3px] bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border">
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
              className="mt-4 px-4 py-2 bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light text-xs font-sans rounded-[2px] transition-opacity hover:opacity-90 cursor-pointer"
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
