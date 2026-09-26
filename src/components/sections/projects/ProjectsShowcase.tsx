import React, { useState, Suspense, lazy } from 'react';
import { ArrowRight, Layers, Github, ExternalLink, Calendar } from 'lucide-react';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { TechTag } from '../../common/TechTag';
import { CornerBrackets } from '../../common/CornerBrackets';
import { Badge } from '../../ui/badge';
import { useSiteData, Project } from '../../../context/SiteDataContext';
import { SectionHeading } from '../../common/SectionHeading';
import { StatusBadge } from '../../common/StatusBadge';
import { handleImageError } from '../../../lib/constants';

const ProjectDetailModal = lazy(() =>
  import('./ProjectDetailModal').then((m) => ({ default: m.ProjectDetailModal }))
);

interface ProjectsShowcaseProps {
  onNavigate?: (view: 'home' | 'projects' | 'resume', sectionId?: string) => void;
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ onNavigate }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects } = useSiteData();

  const allProjects = projects && projects.length > 0 ? projects : [];
  const featured = allProjects.filter((p) => p.isFeatured);
  const displayedProjects = (featured.length > 0 ? featured : allProjects).slice(0, 3);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    window.history.replaceState(null, '', `#project-${project.id}`);
  };

  const closeProject = () => {
    setSelectedProject(null);
    if (window.location.hash.startsWith('#project-')) {
      window.history.replaceState(null, '', '#featured-works');
    }
  };

  if (displayedProjects.length === 0) {
    return null;
  }

  const archiveAction = (
    <a
      href="#all-projects"
      onClick={(e) => {
        if (onNavigate) {
          e.preventDefault();
          onNavigate('projects');
        }
      }}
      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:border-terracotta/50 text-light-ink dark:text-dark-ink font-sans text-xs uppercase tracking-widest shadow-xs transition-all duration-200"
    >
      <Layers className="w-3.5 h-3.5 text-terracotta" />
      <span className="sm:hidden">All Projects ({projects?.length || 0})</span>
      <span className="hidden sm:inline">View All Projects ({projects?.length || 0})</span>
      <ArrowRight className="w-3.5 h-3.5 text-terracotta transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  );

  return (
    <section id="featured-works" className="relative w-full overflow-hidden py-16 lg:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header with Classical Wabi-Sabi Numerals & View All Action */}
        <SectionHeading
          numeral="03 //"
          categoryTag="SELECTED PORTFOLIO · 作品"
          title="Featured Works"
          kanjiSubtitle="主な作品"
          description="Production-grade web platforms, interactive applications, and scalable architectures crafted with disciplined full-stack precision."
          action={archiveAction}
        />

        {/* Alternating Editorial Project Cards Stack (Top 3 on Home) */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {displayedProjects.map((project, index) => {
            const isAlternate = index % 2 === 1;
            const isCurrent = typeof project.isActive === 'boolean' ? project.isActive : index === 0;

            return (
              <article
                key={project.id}
                onClick={() => openProject(project)}
                className="interactive-card group relative w-full bg-light-surface-card dark:bg-dark-surface-card hover:bg-light-surface dark:hover:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl p-4 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-akari dark:hover:shadow-night-glow classical-card-frame overflow-visible cursor-pointer"
              >
                {/* Celestial Ensō Orbital Circle: appears ONLY on the hovered project card */}
                <EnsoOrbital
                  placement="top-left"
                  size={96}
                  hoverOnly={true}
                />

                {/* Corner Hairline Brackets */}
                <CornerBrackets size="md" />

                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center ${
                    isAlternate ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Visual Media Column */}
                  <div className={`lg:col-span-6 ${isAlternate ? 'lg:col-start-7' : ''}`}>
                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-light-surface-muted dark:bg-dark-surface-muted border border-light-border/70 dark:border-dark-border/70">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError()}
                      />
                    </div>
                  </div>

                  {/* Narrative & Specifications Column */}
                  <div
                    className={`lg:col-span-6 flex flex-col justify-center gap-4 ${
                      isAlternate ? 'lg:col-start-1' : ''
                    }`}
                  >
                    {/* Unified Metadata Strip: Order + Date + Active Status Pill */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <Badge variant="terracotta" className="font-mono text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                          #{String(index + 1).padStart(2, '0')}
                        </Badge>

                        {(project.startDate || project.endDate) && (
                          <span className="font-mono text-xs text-terracotta font-semibold tracking-wider uppercase flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-terracotta" />
                            {project.startDate || '2024'} - {project.endDate || (isCurrent ? 'Present' : 'Completed')}
                          </span>
                        )}

                        <StatusBadge isActive={isCurrent} />
                      </div>

                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h3 className="font-serif text-2xl sm:text-3xl text-light-ink dark:text-dark-ink font-medium tracking-tight group-hover:text-terracotta transition-colors duration-200">
                          {project.title}
                        </h3>
                        <span className="font-serif text-lg text-terracotta dark:text-ochre shrink-0">
                          {project.kanji}
                        </span>
                      </div>
                      <p className="font-sans text-xs font-medium text-terracotta dark:text-ochre uppercase tracking-wider">
                        {project.subtitle}
                      </p>
                    </div>

                    <p className="font-sans text-sm text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-normal">
                      {project.description}
                    </p>

                    {/* Minimalist Tech Tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.tags.map((tag) => (
                        <TechTag key={tag} tag={tag} size="md" />
                      ))}
                    </div>

                    {/* Action Foot Link & Direct Repository / Live Triggers */}
                    <div className="pt-3 border-t border-light-border/60 dark:border-dark-border/80 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-light-ink dark:text-dark-ink font-medium hover:text-terracotta transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none rounded py-1 px-0.5 group/btn cursor-pointer"
                      >
                        <span>
                          {project.links.caseStudyText || 'View Architecture'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1.5 text-terracotta" />
                      </button>

                      {/* Direct External Links */}
                      <div className="flex items-center gap-1.5 text-light-ink-muted dark:text-dark-ink-muted" onClick={(e) => e.stopPropagation()}>
                        {project.links.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-md hover:bg-light-surface-raised dark:hover:bg-dark-surface hover:text-light-ink dark:hover:text-dark-ink border border-transparent hover:border-light-border dark:hover:border-dark-border transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                            title="GitHub Repository"
                            aria-label={`${project.title} GitHub Repository`}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.links.live && project.links.live !== '#' && (
                          <a
                            href={project.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-md hover:bg-light-surface-raised dark:hover:bg-dark-surface hover:text-light-ink dark:hover:text-dark-ink border border-transparent hover:border-light-border dark:hover:border-dark-border transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                            title="Live Deployment"
                            aria-label={`${project.title} Live Deployment`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Case Study Detail Modal (Loaded dynamically on-demand) */}
      {selectedProject && (
        <Suspense fallback={null}>
          <ProjectDetailModal
            project={selectedProject}
            onClose={closeProject}
          />
        </Suspense>
      )}
    </section>
  );
};
