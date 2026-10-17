import React, { useState } from 'react';
import { Search, Layers } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { ViewMode } from '../../../App';
import { HobbyCard } from './HobbyCard';
import { SectionSideBackdrop } from '../../common/SectionSideBackdrop';
import { PageContainer } from '../../common/PageContainer';
import { ReturnToPortfolio } from '../../common/ReturnToPortfolio';
import { SubpageHeader } from '../../common/SubpageHeader';

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
        textureDay="./background/white linen.webp"
        textureNight="./background/black linen.webp"
        painting="./decorators/tree.webp"
        paintingAlt="Sumi-e pine tree ink wash painting"
        placement="right"
        artworkWidth="w-full lg:w-[50%]"
        maskCenter="at 75% 50%"
        textureOpacityDay={0.65}
        textureOpacityNight={0.45}
        paintingOpacityDay={0.35}
        paintingOpacityNight={0.14}
      />
      <PageContainer className="pt-20 sm:pt-28 pb-16 sm:pb-20 relative z-10">
        {/* Back navigation button */}
        <ReturnToPortfolio onNavigate={onNavigate} sectionId="hobbies" />

        {/* Header Title Section */}
        <SubpageHeader
          archiveKicker="Archive //"
          categoryTag="Personal Pursuits · 趣味の記録"
          title="Hobbies & Life"
          kanjiSubtitle="日常と趣味"
          description="A gallery of interests, creative outlets, and passions outside of software engineering: anime, gaming, fitness, market trading, and dining."
          actions={
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-ink-muted" />
              <input
                type="text"
                placeholder="Search passions, shows, workouts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-[2px] bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink focus:outline-none focus:border-terracotta/60 dark:focus:border-ochre/60 font-sans"
              />
            </div>
          }
        />

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
                    : 'bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink-muted dark:text-dark-ink-muted hover:border-terracotta/50 dark:hover:border-ochre/50'
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
              className="mt-4 px-4 py-2 bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light text-xs font-sans rounded-[2px] transition-all hover:opacity-90 dark:hover:bg-white cursor-pointer"
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
      </PageContainer>
    </div>
  );
};
