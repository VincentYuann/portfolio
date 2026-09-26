import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ArrowLeft, Search, ExternalLink, Github, Layers, Calendar } from 'lucide-react';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { TechTag } from '../../common/TechTag';
import { CornerBrackets } from '../../common/CornerBrackets';
import { useSiteData, Project } from '../../../context/SiteDataContext';
import { StatusBadge } from '../../common/StatusBadge';
import { handleImageError } from '../../../lib/constants';
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

  return (
    <div className="relative w-full min-h-screen overflow-x-clip">
      <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Detail Modal (Loaded dynamically on-demand) */}
        {selectedProject && (
          <Suspense fallback={null}>
            <ProjectDetailModal
              project={selectedProject}
              onClose={closeProject}
            />
          </Suspense>
        )}

        {/* Back navigation button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => onNavigate?.('home', 'featured-works')}
            className="inline-flex items-center gap-2 font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio</span>
          </button>
        </div>

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-light-border/70 dark:border-dark-border/80 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-serif text-terracotta text-sm">ARCHIVE //</span>
              <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                SELECTED PORTFOLIO · 作品全集
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal">
              All Engineering Works{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
                作品全集
              </span>
            </h1>
            <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 font-normal leading-relaxed max-w-3xl">
              Archive of distributed microservices, generative AI runtimes, and contemplative computing interfaces crafted with disciplined full-stack precision.
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
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink dark:text-dark-ink focus:outline-none focus:border-terracotta/60"
            />
          </div>
        </div>

        {/* Projects Grid: Compact Widgets */}
        {filteredProjects.length === 0 ? (
          <div className="p-16 text-center rounded-xl bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <Layers className="w-10 h-10 text-light-ink-subtle dark:text-dark-ink-subtle mx-auto mb-3" />
            <h3 className="font-serif text-lg text-light-ink dark:text-dark-ink">
              No projects matched your criteria
            </h3>
            <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mt-1">
              Try adjusting your search keywords or clearing your query.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-terracotta hover:bg-terracotta/90 text-white text-xs font-sans rounded-md transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="interactive-card group relative bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl overflow-visible p-5 shadow-akari hover:border-terracotta/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Ensō Bloom: Top-left only on hover */}
                <EnsoOrbital
                  placement="top-left"
                  size={80}
                  hoverOnly={true}
                />

                {/* Corner Hairline Brackets */}
                <CornerBrackets size="sm" />

                <div>
                  {/* Thumbnail Image Header */}
                  <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden mb-4 bg-light-surface-muted dark:bg-dark-surface-muted">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      onError={handleImageError()}
                    />
                    {/* Subtle watermark stamp */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs text-[11px] font-serif text-white/90">
                      {project.kanji}
                    </div>
                  </div>

                  {/* Timeline Strip: Dates + Active Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                    <span className="font-mono text-[11px] text-terracotta font-semibold tracking-wider uppercase flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-terracotta" />
                      {project.startDate || '2024'} - {project.endDate || (project.isActive ? 'Present' : 'Completed')}
                    </span>

                    <StatusBadge
                      isActive={project.isActive}
                      activeLabel="ACTIVE / 稼働中"
                      completedLabel="COMPLETED / 完了"
                      size="sm"
                    />
                  </div>

                  <h3 className="font-serif text-lg font-medium text-light-ink dark:text-dark-ink group-hover:text-terracotta transition-colors line-clamp-1">
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
                      <span className="px-1.5 py-0.5 text-[10px] font-mono text-light-ink-subtle dark:text-dark-ink-subtle">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Card Action Foot */}
                  <div className="pt-3 border-t border-light-border/60 dark:border-dark-border/60 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => openProject(project)}
                      className="font-sans text-[11px] font-medium text-terracotta hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none rounded py-0.5 cursor-pointer"
                    >
                      <span>Inspect System</span>
                      <span>→</span>
                    </button>

                    <div className="flex items-center gap-2 text-light-ink-muted dark:text-dark-ink-muted" onClick={(e) => e.stopPropagation()}>
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 hover:text-light-ink dark:hover:text-dark-ink transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none rounded"
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
                          className="p-1 hover:text-light-ink dark:hover:text-dark-ink transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none rounded"
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
