import React, { useState, Suspense, lazy } from 'react';
import { ArrowRight, Layers, Github, ExternalLink, Calendar } from 'lucide-react';
import { TechTag } from '../../common/TechTag';
import { CornerBrackets } from '../../common/CornerBrackets';
import { Badge } from '../../ui/badge';
import { Card } from '../../ui/card';
import { useSiteData, Project } from '../../../context/SiteDataContext';
import { SectionHeading } from '../../common/SectionHeading';
import { StatusBadge } from '../../common/StatusBadge';
import { handleImageError } from '../../../lib/constants';
import { SectionSideBackdrop } from '../../common/SectionSideBackdrop';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { SectionDivider } from '../../common/SectionDivider';

const ProjectDetailModal = lazy(() =>
  import('./ProjectDetailModal').then((m) => ({ default: m.ProjectDetailModal }))
);

interface ProjectsShowcaseProps {
  onNavigate?: (view: 'home' | 'projects' | 'resume', sectionId?: string) => void;
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ onNavigate }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | number | null>(null);
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

  const currentIndex = selectedProject
    ? displayedProjects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  const handleNextProject = () => {
    if (currentIndex >= 0 && currentIndex < displayedProjects.length - 1) {
      openProject(displayedProjects[currentIndex + 1]);
    } else if (currentIndex === displayedProjects.length - 1) {
      openProject(displayedProjects[0]);
    }
  };

  const handlePrevProject = () => {
    if (currentIndex > 0) {
      openProject(displayedProjects[currentIndex - 1]);
    } else if (currentIndex === 0) {
      openProject(displayedProjects[displayedProjects.length - 1]);
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
      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-[2px] bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border hover:border-light-border-strong dark:hover:border-dark-border-strong text-light-ink dark:text-dark-ink font-sans text-xs uppercase tracking-widest shadow-2xs transition-all duration-200"
    >
      <Layers className="w-3.5 h-3.5 text-light-ink-muted dark:text-dark-ink-muted" />
      <span className="sm:hidden">All Projects ({projects?.length || 0})</span>
      <span className="hidden sm:inline">View All Projects ({projects?.length || 0})</span>
      <ArrowRight className="w-3.5 h-3.5 text-light-ink-muted dark:text-dark-ink-muted transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  );

  return (
    <section
      id="featured-works"
      className="section-chamber-alt relative w-full pt-8 sm:pt-12 pb-24 lg:pb-32 scroll-mt-12 overflow-hidden bg-[#FAF5EB] dark:bg-[#1E1F24]"
    >
      {/* Architectural Background Chamber for Featured Works */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-light-surface-card/30 to-transparent dark:via-dark-surface/40 pointer-events-none z-0" />
      {/* Subtle Japanese Joinery Axis Ambient Glow */}
      <div className="absolute right-0 sm:right-24 top-1/3 w-96 h-96 bg-radial-[at_center] from-ochre/[0.04] dark:from-ochre/[0.025] to-transparent pointer-events-none z-0" />
      
      {/* 16:9 Cedar Wood Ground & Dynamic Cresting Wave across Lower/Right Canvas */}
      <SectionSideBackdrop
        textureDay="./background/white wood.jpg"
        textureNight="./background/black wood.jpg"
        painting="./decorators/ocean.jpg"
        paintingAlt="Sumi-e ocean wave ink wash painting"
        placement="bottom-right"
        artworkWidth="w-full lg:w-[75%]"
        maskCenter="at 70% 65%"
        textureOpacityDay={0.65}
        textureOpacityNight={0.45}
        paintingOpacityDay={0.35}
        paintingOpacityNight={0.14}
      />

      {/* Section Divider on Top of Section */}
      <div className="relative z-10 w-full mb-10 sm:mb-14">
        <SectionDivider label="SELECTED PORTFOLIO · 作品" shortLabel="PORTFOLIO · 作品" />
      </div>

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
              <Card
                key={project.id}
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
                className="group relative w-full p-4 sm:p-8"
              >
                {/* Celestial Ensō Orbital Circle with Brushstroke (Appears strictly on card hover) */}
                <EnsoOrbital
                  placement="top-left"
                  size={120}
                  active={hoveredProjectId === project.id}
                />

                {/* Corner Hairline Brackets (Subtle) */}
                <CornerBrackets size="md" />

                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center ${
                    isAlternate ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Visual Media Column with Faded Edge Vignette */}
                  <div className={`lg:col-span-6 ${isAlternate ? 'lg:col-start-7' : ''}`}>
                    <div className="relative aspect-[16/9] w-full rounded-[2px] overflow-hidden bg-light-surface-muted dark:bg-dark-canvas border border-light-border/70 dark:border-dark-border/70">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center group-hover:opacity-95 transition-opacity duration-300"
                        style={{
                          maskImage: 'radial-gradient(ellipse 96% 94% at 50% 50%, black 72%, transparent 100%)',
                          WebkitMaskImage: 'radial-gradient(ellipse 96% 94% at 50% 50%, black 72%, transparent 100%)',
                        }}
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
                        <Badge variant="outline" className="font-mono text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-[2px] bg-light-surface-muted/60 dark:bg-dark-canvas border-light-border dark:border-dark-border text-light-ink-muted dark:text-dark-ink-muted">
                          #{String(index + 1).padStart(2, '0')}
                        </Badge>

                        {(project.startDate || project.endDate) && (
                          <span className="font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted font-medium tracking-wider uppercase flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 opacity-70" />
                            {project.startDate ? `${project.startDate} - ` : ''}{project.endDate || (isCurrent ? 'Present' : 'Completed')}
                          </span>
                        )}

                        <StatusBadge isActive={isCurrent} />
                      </div>

                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h3 className="font-serif text-2xl sm:text-3xl text-light-ink dark:text-dark-ink font-medium tracking-tight group-hover:text-terracotta dark:group-hover:text-ochre transition-colors duration-200">
                          {project.title}
                        </h3>
                        <span className="font-serif text-lg text-light-ink-muted dark:text-dark-ink-muted shrink-0">
                          {project.kanji}
                        </span>
                      </div>
                      <p className="font-sans text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                        {project.subtitle}
                      </p>
                    </div>

                    <p className="font-sans text-sm text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-normal max-w-prose">
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
                        onClick={() => openProject(project)}
                        className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-light-ink dark:text-dark-ink font-medium hover:text-terracotta dark:hover:text-ochre transition-colors focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-ochre focus-visible:outline-none rounded py-1 px-0.5 group/btn cursor-pointer"
                      >
                        <span>
                          {project.links.caseStudyText || 'View Architecture'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1.5 text-light-ink-muted dark:text-dark-ink-muted group-hover/btn:text-terracotta dark:group-hover/btn:text-ochre" />
                      </button>

                      {/* Direct External Links */}
                      <div className="flex items-center gap-1.5 text-light-ink-muted dark:text-dark-ink-muted" onClick={(e) => e.stopPropagation()}>
                        {project.links.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-[2px] hover:bg-light-surface-raised dark:hover:bg-dark-surface hover:text-light-ink dark:hover:text-dark-ink border border-transparent hover:border-light-border dark:border-dark-border transition-colors focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-ochre focus-visible:outline-none cursor-pointer"
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
                            className="p-1.5 rounded-[2px] hover:bg-light-surface-raised dark:hover:bg-dark-surface hover:text-light-ink dark:hover:text-dark-ink border border-transparent hover:border-light-border dark:border-dark-border transition-colors focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-ochre focus-visible:outline-none cursor-pointer"
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
              </Card>
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
            onNext={handleNextProject}
            onPrev={handlePrevProject}
            hasNext={displayedProjects.length > 1}
            hasPrev={displayedProjects.length > 1}
          />
        </Suspense>
      )}
    </section>
  );
};
