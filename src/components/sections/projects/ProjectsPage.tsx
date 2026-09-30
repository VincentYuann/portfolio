import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ArrowLeft, Search, ExternalLink, Github, Layers, Calendar } from 'lucide-react';
import { TechTag } from '../../common/TechTag';
import { CornerBrackets } from '../../common/CornerBrackets';
import { useSiteData, Project } from '../../../context/SiteDataContext';
import { StatusBadge } from '../../common/StatusBadge';
import { handleImageError } from '../../../lib/constants';
import { SectionSideBackdrop } from '../../common/SectionSideBackdrop';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { ViewMode } from '../../../App';

const ProjectDetailModal = lazy(() =>
  import('./ProjectDetailModal').then((m) => ({ default: m.ProjectDetailModal }))
);

interface ProjectsPageProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | number | null>(null);
  const { projects } = useSiteData();

  const allProjects = projects && projects.length > 0 ? projects : [];

  // Deep-linking: sync URL hash with selected project modal
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#project-')) {
        const rawId = hash.replace('#project-', '').trim().toLowerCase();
        const target = allProjects.find(
          (p) =>
            String(p.id).toLowerCase() === rawId ||
            p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === rawId
        );
        if (target) {
          setSelectedProject(target);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [allProjects]);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    window.history.replaceState(null, '', `#project-${project.id}`);
  };

  const closeProject = () => {
    setSelectedProject(null);
    window.history.replaceState(null, '', '#all-projects');
  };

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      !searchQuery.trim() ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const currentIndex = selectedProject
    ? filteredProjects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  const handleNextProject = () => {
    if (filteredProjects.length === 0) return;
    const nextIdx = (currentIndex + 1) % filteredProjects.length;
    openProject(filteredProjects[nextIdx]);
  };

  const handlePrevProject = () => {
    if (filteredProjects.length === 0) return;
    const prevIdx = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    openProject(filteredProjects[prevIdx]);
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-clip">
      {/* 16:9 Cedar Wood Ground & Dynamic Cresting Wave (Retains exact Projects Showcase identity) */}
      <SectionSideBackdrop
        textureDay="./background/white wood.webp"
        textureNight="./background/black wood.webp"
        painting="./decorators/ocean.webp"
        paintingAlt="Sumi-e ocean wave ink wash painting"
        placement="bottom-right"
        artworkWidth="w-full lg:w-[65%]"
        maskCenter="at 75% 65%"
        textureOpacityDay={0.65}
        textureOpacityNight={0.45}
        paintingOpacityDay={0.35}
        paintingOpacityNight={0.14}
      />
      <div className="w-full pt-20 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        {/* Detail Modal (Loaded dynamically on-demand) */}
        {selectedProject && (
          <Suspense fallback={null}>
            <ProjectDetailModal
              project={selectedProject}
              onClose={closeProject}
              onNext={handleNextProject}
              onPrev={handlePrevProject}
              hasNext={filteredProjects.length > 1}
              hasPrev={filteredProjects.length > 1}
            />
          </Suspense>
        )}

        {/* Back navigation button */}
        <div className="mb-4 sm:mb-8">
          <button
            onClick={() => onNavigate?.('home', 'featured-works')}
            className="inline-flex items-center gap-2 font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta dark:hover:text-ochre transition-colors group cursor-pointer py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio</span>
          </button>
        </div>

        {/* Header Title Section - distilled on mobile */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 sm:pb-8 border-b border-light-border/70 dark:border-dark-border/80 mb-5 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium">ARCHIVE //</span>
              <span className="font-mono text-xs font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                SELECTED PORTFOLIO · 作品全集
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal leading-tight">
              All Engineering Works{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-lg sm:text-2xl lg:text-3xl ml-1.5 sm:ml-2 whitespace-nowrap inline-block">
                作品全集
              </span>
            </h1>
            <p className="font-sans text-xs sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-2 sm:mt-3 font-normal leading-relaxed max-w-3xl">
              A comprehensive collection of web applications, system architectures, and software engineering projects.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-ink-muted" />
            <input
              type="text"
              placeholder="Search projects, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-[2px] bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink focus:outline-none focus:border-terracotta/60 dark:focus:border-ochre/60 font-sans"
            />
          </div>
        </div>

        {/* Projects Grid: Compact Widgets */}
        {filteredProjects.length === 0 ? (
          <div className="p-16 text-center rounded-[3px] bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <Layers className="w-10 h-10 text-light-ink-subtle dark:text-dark-ink-subtle mx-auto mb-3" />
            <h3 className="font-serif text-lg text-light-ink dark:text-dark-ink">
              No projects matched your criteria
            </h3>
            <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mt-1">
              Try adjusting your search keywords or clearing your query.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light text-xs font-sans rounded-[2px] transition-opacity hover:opacity-90 cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                className="group relative bg-light-surface-card dark:bg-dark-surface-card craft-card classical-card-frame border border-light-border dark:border-dark-border rounded-[3px] overflow-visible p-5 shadow-sm transition-colors duration-200 flex flex-col justify-between"
              >
                {/* Celestial Ensō Orbital Circle with Brushstroke (Appears strictly on card hover) */}
                <EnsoOrbital
                  placement="top-left"
                  size={100}
                  active={hoveredProjectId === project.id}
                />

                {/* Corner Hairline Brackets (Subtle) */}
                <CornerBrackets size="sm" />

                <div>
                  {/* Thumbnail Image Header */}
                  <div className="relative aspect-[16/9] w-full rounded-[2px] overflow-hidden mb-4 bg-light-surface-muted dark:bg-dark-surface-muted">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      onError={handleImageError()}
                    />
                    {/* Subtle watermark stamp */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-[2px] bg-black/40 backdrop-blur-xs text-xs font-serif text-white/90">
                      {project.kanji}
                    </div>
                  </div>

                  {/* Timeline Strip: Dates + Active Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                    <span className="font-mono text-xs text-terracotta dark:text-ochre font-semibold tracking-wider uppercase flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-terracotta dark:text-ochre" />
                      {project.startDate || '2024'} - {project.endDate || (project.isActive ? 'Present' : 'Completed')}
                    </span>

                    <StatusBadge
                      isActive={project.isActive}
                      activeLabel="ACTIVE / 稼働中"
                      completedLabel="COMPLETED / 完了"
                      size="sm"
                    />
                  </div>

                  <h3 className="font-serif text-lg font-medium text-light-ink dark:text-dark-ink group-hover:text-terracotta dark:group-hover:text-ochre transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed line-clamp-2 mt-1.5 mb-4 font-normal">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tech Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <TechTag key={tag} tag={tag} size="sm" />
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-1.5 py-0.5 text-2xs font-mono text-light-ink-subtle dark:text-dark-ink-subtle">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Card Action Foot */}
                  <div className="pt-3 border-t border-light-border/60 dark:border-dark-border/60 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => openProject(project)}
                      className="font-sans text-xs font-medium text-terracotta dark:text-ochre hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-ochre focus-visible:outline-none rounded-[2px] min-h-[44px] sm:min-h-0 py-2 sm:py-0.5 cursor-pointer"
                    >
                      <span>Inspect System</span>
                      <span>→</span>
                    </button>

                    <div className="flex items-center gap-1 sm:gap-2 text-light-ink-muted dark:text-dark-ink-muted" onClick={(e) => e.stopPropagation()}>
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2.5 sm:p-1 hover:text-light-ink dark:hover:text-dark-ink border border-light-border/40 dark:border-dark-border/40 sm:border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-ochre focus-visible:outline-none rounded-[2px] flex items-center justify-center"
                          title="GitHub Repository"
                          aria-label={`${project.title} GitHub Repository`}
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.links.live && project.links.live !== '#' && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noreferrer"
                          className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2.5 sm:p-1 hover:text-light-ink dark:hover:text-dark-ink border border-light-border/40 dark:border-dark-border/40 sm:border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-ochre focus-visible:outline-none rounded-[2px] flex items-center justify-center"
                          title="Live Deployment"
                          aria-label={`${project.title} Live Deployment`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
