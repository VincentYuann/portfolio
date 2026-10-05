import React, { useState, Suspense, lazy } from 'react';
import { ArrowRight, Layers, Github, ExternalLink } from 'lucide-react';
import { TechTag } from '../../common/TechTag';
import { CornerBrackets } from '../../common/CornerBrackets';
import { Card } from '../../ui/card';
import { useSiteData, Project } from '../../../context/SiteDataContext';
import { SectionHeading } from '../../common/SectionHeading';
import { handleImageError } from '../../../lib/constants';
import { SectionSideBackdrop } from '../../common/SectionSideBackdrop';
import { EnsoOrbital } from '../../common/EnsoOrbital';
import { SectionDivider } from '../../common/SectionDivider';
import { CardMetaStrip } from '../../common/CardMetaStrip';
import { useLayoutVariant } from '../../../context/LayoutContext';

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
  const { layoutInfo } = useLayoutVariant();

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
    if (displayedProjects.length === 0) return;
    const nextIdx = (currentIndex + 1) % displayedProjects.length;
    openProject(displayedProjects[nextIdx]);
  };

  const handlePrevProject = () => {
    if (displayedProjects.length === 0) return;
    const prevIdx = (currentIndex - 1 + displayedProjects.length) % displayedProjects.length;
    openProject(displayedProjects[prevIdx]);
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
      className="section-chamber-alt relative w-full pt-8 sm:pt-12 pb-24 lg:pb-32 scroll-mt-12 overflow-hidden bg-light-canvas-soft dark:bg-dark-canvas-soft"
    >
      {/* Architectural Background Chamber for Featured Works */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-light-surface-card/30 to-transparent dark:via-dark-surface/40 pointer-events-none z-0" />
      {/* Subtle Japanese Joinery Axis Ambient Glow */}
      <div className="absolute right-0 sm:right-24 top-1/3 w-96 h-96 bg-radial-[at_center] from-ochre/[0.04] dark:from-ochre/[0.025] to-transparent pointer-events-none z-0" />
      
      {/* 16:9 Cedar Wood Ground & Dynamic Cresting Wave across Lower/Right Canvas */}
      <SectionSideBackdrop
        textureDay="./background/white wood.webp"
        textureNight="./background/black wood.webp"
        painting="./decorators/ocean.webp"
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

      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Classical Wabi-Sabi Numerals & View All Action */}
        <SectionHeading
          numeral="03 //"
          categoryTag="SELECTED PORTFOLIO · 作品"
          title="Featured Works"
          kanjiSubtitle="主な作品"
          description="Production-grade web platforms, interactive applications, and scalable architectures crafted with disciplined full-stack precision."
          actions={archiveAction}
        />

        {/* Projects Layout Variations: Editorial Stack (Default/Matrix) vs Telemetry Horizon vs Edge-Bleed Gallery */}
        {layoutInfo.projectsLayout === 'telemetry' ? (
          /* Telemetry Horizon: Dense horizontal telemetry strips with visible specs & direct action dock */
          <div className="flex flex-col gap-6">
            {displayedProjects.map((project, index) => {
              const isCurrent = typeof project.isActive === 'boolean' ? project.isActive : index === 0;
              return (
                <div
                  key={project.id}
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                  className="group relative w-full p-4 sm:p-6 rounded-[2px] bg-light-surface-card/80 dark:bg-dark-surface-card/80 border border-light-border dark:border-dark-border hover:border-light-border-strong dark:hover:border-dark-border-strong transition-all duration-200"
                >
                  <CornerBrackets size="sm" />
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                    {/* Media Thumbnail Strip (3 cols) */}
                    <div className="lg:col-span-3">
                      <div className="relative aspect-[16/10] w-full rounded-[2px] overflow-hidden bg-light-surface-muted dark:bg-dark-canvas border border-light-border/70 dark:border-dark-border/70">
                        <img
                          src={project.image}
                          alt={project.title}
                          width={480}
                          height={300}
                          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                          onError={handleImageError()}
                        />
                      </div>
                    </div>

                    {/* Specifications & Overview (6 cols) */}
                    <div className="lg:col-span-6 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-2xs font-bold text-terracotta dark:text-ochre">
                          SPEC.0{index + 1}
                        </span>
                        <CardMetaStrip
                          index={index + 1}
                          startDate={project.startDate}
                          endDate={project.endDate}
                          isActive={isCurrent}
                        />
                      </div>
                      <div className="flex items-baseline gap-3">
                        <h3 className="font-serif text-2xl font-normal text-light-ink dark:text-dark-ink group-hover:text-terracotta dark:group-hover:text-ochre transition-colors">
                          {project.title}
                        </h3>
                        <span className="font-serif text-lg text-light-ink-muted dark:text-dark-ink-muted">
                          {project.kanji}
                        </span>
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.map((tag) => (
                          <TechTag key={tag} tag={tag} size="sm" />
                        ))}
                      </div>
                    </div>

                    {/* Telemetry Action Ribbon (3 cols) */}
                    <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-2 lg:border-l lg:border-light-border/60 dark:lg:border-dark-border/60 lg:pl-5">
                      <button
                        type="button"
                        onClick={() => openProject(project)}
                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[2px] font-sans text-2xs font-bold uppercase tracking-wider bg-light-surface-raised dark:bg-dark-surface hover:bg-terracotta hover:text-white dark:hover:bg-ochre dark:hover:text-dark-canvas text-light-ink dark:text-dark-ink border border-light-border dark:border-dark-border hover:border-terracotta dark:hover:border-ochre transition-all cursor-pointer"
                      >
                        <span>{project.links.caseStudyText || 'View Architecture'}</span>
                        <ArrowRight className="w-3 h-3 text-terracotta dark:text-ochre" />
                      </button>
                      <div className="flex items-center gap-2 w-full">
                        {project.links.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[2px] font-sans text-2xs font-semibold text-light-ink dark:text-dark-ink bg-light-surface/80 dark:bg-dark-surface/80 hover:bg-light-surface-raised dark:hover:bg-dark-surface border border-light-border dark:border-dark-border transition-all"
                          >
                            <Github className="w-3 h-3 text-light-ink-muted dark:text-dark-ink-muted" />
                            <span>Code</span>
                          </a>
                        )}
                        {project.links.live && project.links.live !== '#' && (
                          <a
                            href={project.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[2px] font-sans text-2xs font-semibold text-terracotta dark:text-ochre bg-terracotta/10 dark:bg-ochre/10 hover:bg-terracotta hover:text-white dark:hover:bg-ochre dark:hover:text-dark-canvas border border-terracotta/35 dark:border-ochre/35 transition-all"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Alternating Editorial Project Cards Stack (Default Blueprint / Ma Gallery / Radar Matrix) */
          <div className="flex flex-col gap-8 sm:gap-12 lg:gap-14">
            {displayedProjects.map((project, index) => {
              const isAlternate = index % 2 === 1;
              const isCurrent = typeof project.isActive === 'boolean' ? project.isActive : index === 0;

              return (
                <Card
                  key={project.id}
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                  className={`group relative w-full p-5 sm:p-8 lg:p-10 ${
                    layoutInfo.projectsLayout === 'gallery'
                      ? 'border-light-border/40 dark:border-dark-border/40 bg-light-surface-card/40 dark:bg-dark-surface-card/40'
                      : ''
                  }`}
                >
                  <EnsoOrbital
                    placement="top-left"
                    size={120}
                    active={hoveredProjectId === project.id}
                  />
                  <CornerBrackets size="md" />

                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center ${
                      isAlternate ? 'lg:grid-flow-dense' : ''
                    }`}
                  >
                    {/* Visual Media Column */}
                    <div className={`lg:col-span-6 ${isAlternate ? 'lg:col-start-7' : ''}`}>
                      <div className="relative aspect-[16/9] w-full rounded-[2px] overflow-hidden bg-light-surface-muted dark:bg-dark-canvas border border-light-border/70 dark:border-dark-border/70">
                        <img
                          src={project.image}
                          alt={project.title}
                          width={640}
                          height={360}
                          className="w-full h-full object-cover object-center group-hover:opacity-95 transition-opacity duration-300 vignette-mask-subtle"
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
                      <div>
                        <CardMetaStrip
                          index={index + 1}
                          startDate={project.startDate}
                          endDate={project.endDate}
                          isActive={isCurrent}
                          activeLabel="ACTIVE / 稼働中"
                          completedLabel="COMPLETED / 完了"
                        />

                        <div className="flex items-center justify-between gap-4 mb-1.5">
                          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-light-ink dark:text-dark-ink font-normal leading-[1.15] tracking-tight group-hover:text-terracotta dark:group-hover:text-ochre transition-colors duration-200">
                            {project.title}
                          </h3>
                          <span aria-hidden="true" className="font-serif text-xl sm:text-2xl lg:text-3xl text-light-ink-muted dark:text-dark-ink-muted shrink-0 select-none">
                            {project.kanji}
                          </span>
                        </div>
                        <p className="font-chakra text-xs sm:text-sm font-semibold text-light-ink-muted dark:text-dark-ink-muted uppercase tracking-wider">
                          {project.subtitle}
                        </p>
                      </div>

                      <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-normal max-w-prose">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.tags.map((tag) => (
                          <TechTag key={tag} tag={tag} size="md" />
                        ))}
                      </div>

                      <div className="pt-3.5 border-t border-light-border/60 dark:border-dark-border/80 flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => openProject(project)}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[2px] font-sans text-xs font-bold uppercase tracking-wider bg-light-surface-raised dark:bg-dark-surface hover:bg-terracotta hover:text-white dark:hover:bg-ochre dark:hover:text-dark-canvas text-light-ink dark:text-dark-ink border border-light-border dark:border-dark-border hover:border-terracotta dark:hover:border-ochre transition-all duration-200 focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-ochre focus-visible:outline-none cursor-pointer group/btn shadow-2xs"
                        >
                          <span>
                            {project.links.caseStudyText || 'View Architecture'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1 text-terracotta dark:text-ochre group-hover/btn:text-white dark:group-hover/btn:text-dark-canvas" />
                        </button>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {project.links.github && (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] font-sans text-xs font-bold text-light-ink dark:text-dark-ink bg-light-surface/80 dark:bg-dark-surface/80 hover:bg-light-surface-raised dark:hover:bg-dark-surface border border-light-border dark:border-dark-border hover:border-light-border-strong dark:hover:border-dark-border-strong transition-all focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-ochre focus-visible:outline-none cursor-pointer shadow-2xs"
                              title="GitHub Repository"
                              aria-label={`${project.title} GitHub Repository`}
                            >
                              <Github className="w-3.5 h-3.5 shrink-0 text-light-ink-muted dark:text-dark-ink-muted" />
                              <span>GitHub</span>
                            </a>
                          )}
                          {project.links.live && project.links.live !== '#' && (
                            <a
                              href={project.links.live}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] font-sans text-xs font-bold text-terracotta dark:text-ochre bg-terracotta/10 dark:bg-ochre/10 hover:bg-terracotta hover:text-white dark:hover:bg-ochre dark:hover:text-dark-canvas border border-terracotta/35 dark:border-ochre/35 hover:border-terracotta dark:hover:border-ochre transition-all focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-ochre focus-visible:outline-none cursor-pointer shadow-2xs"
                              title="Live Deployment"
                              aria-label={`${project.title} Live Deployment`}
                            >
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                              <span>Live Demo</span>
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
        )}
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
