import React, { useState } from 'react';
import { Project } from '../data/projects';
import { ArrowRight, Layers, Github, ExternalLink, Calendar } from 'lucide-react';
import { ProjectDetailModal } from './ProjectDetailModal';
import { EnsoOrbital } from './EnsoOrbital';
import { TechTag } from './TechTag';
import { CornerBrackets } from './CornerBrackets';
import { Badge } from './ui/badge';
import { VerticalMarginWidget, MARGIN_PRESETS } from './VerticalMarginWidget';
import { useSiteData } from '../context/SiteDataContext';

interface ProjectsShowcaseProps {
  onNavigate?: (view: 'home' | 'projects' | 'resume', sectionId?: string) => void;
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ onNavigate }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects } = useSiteData();

  const allProjects = projects && projects.length > 0 ? projects : [];
  const featured = allProjects.filter((p) => p.isFeatured);
  const displayedProjects = (featured.length > 0 ? featured : allProjects).slice(0, 3);

  if (displayedProjects.length === 0) {
    return null;
  }

  return (
    <section id="featured-works" className="relative w-full overflow-hidden py-16 lg:py-24">
      {/* Subtle Japanese Sumi-e Arts in Left & Right Empty Margins */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        {/* Left Margin Flank Bamboo */}
        <div className="absolute -left-6 xl:left-2 bottom-12 top-24 w-32 xl:w-48 pointer-events-none z-0 hidden lg:block">
          <img
            src="./images/sumie-tall-vertical-bamboo.jpg"
            alt="Sumi-e bamboo margin accent"
            className="w-full h-full object-contain object-bottom opacity-30 dark:opacity-15 mix-blend-multiply dark:mix-blend-screen dark:invert animate-bamboo-sway"
            style={{
              maskImage: 'radial-gradient(ellipse 85% 85% at 30% 60%, black 35%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 30% 60%, black 35%, transparent 85%)',
            }}
          />
        </div>

        {/* Right Margin Flank Bamboo */}
        <div className="absolute -right-6 xl:right-2 bottom-12 top-24 w-32 xl:w-48 pointer-events-none z-0 hidden lg:block">
          <img
            src="./images/sumie-tall-vertical-bamboo.jpg"
            alt="Sumi-e bamboo margin accent"
            className="w-full h-full object-contain object-bottom opacity-30 dark:opacity-15 mix-blend-multiply dark:mix-blend-screen dark:invert scale-x-[-1]"
            style={{
              maskImage: 'radial-gradient(ellipse 85% 85% at 70% 60%, black 35%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 70% 60%, black 35%, transparent 85%)',
            }}
          />
        </div>

        {/* Top and Bottom Fades */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-light-canvas via-light-canvas/70 to-transparent dark:from-dark-canvas dark:via-dark-canvas/70 z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-light-canvas via-light-canvas/70 to-transparent dark:from-dark-canvas dark:via-dark-canvas/70 z-10 pointer-events-none" />
      </div>

      {/* Floating Vertical Margins */}
      <VerticalMarginWidget
        side="left"
        top="top-1/2 -translate-y-1/2"
        {...MARGIN_PRESETS.inkHarmony}
      />
      <VerticalMarginWidget
        side="right"
        top="top-1/2 -translate-y-1/2"
        {...MARGIN_PRESETS.codeSoul}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header with Classical Wabi-Sabi Numerals & View All Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-light-border/70 dark:border-[#2D3039]/80 gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-serif text-terracotta text-sm">03 //</span>
              <span className="font-sans text-[11px] font-semibold text-light-ink-subtle dark:text-dark-ink-subtle uppercase tracking-widest">
                SELECTED PORTFOLIO · 作品
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-light-ink dark:text-dark-ink tracking-tight font-normal">
              Featured Works{' '}
              <span className="font-serif font-light text-light-ink-muted dark:text-dark-ink-muted text-2xl lg:text-3xl ml-2 whitespace-nowrap inline-block">
                主な作品
              </span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted mt-3 font-light leading-relaxed">
              Production-grade web platforms, interactive applications, and scalable architectures crafted with disciplined full-stack precision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <a
              href="#all-projects"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('projects');
                }
              }}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-light-surface-card dark:bg-[#181920] border border-light-border dark:border-[#2D3039] hover:border-terracotta/50 text-light-ink dark:text-[#EDEAE4] font-sans text-xs uppercase tracking-widest shadow-xs transition-all duration-200"
            >
              <Layers className="w-3.5 h-3.5 text-terracotta" />
              <span className="sm:hidden">All Projects ({projects?.length || 0})</span>
              <span className="hidden sm:inline">View All Projects ({projects?.length || 0})</span>
              <ArrowRight className="w-3.5 h-3.5 text-terracotta transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Alternating Editorial Project Cards Stack (Top 3 on Home) */}
        <div className="flex flex-col space-y-6 sm:space-y-8">
          {displayedProjects.map((project, index) => {
            const isAlternate = index % 2 === 1;
            const isCurrent = typeof project.isActive === 'boolean' ? project.isActive : index === 0;

            return (
              <article
                key={project.id}
                className="interactive-card group relative w-full bg-light-surface-card dark:bg-[#1B1C22] hover:bg-light-surface dark:hover:bg-[#202229] border border-light-border dark:border-[#2D3039] rounded-xl p-4 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-akari dark:hover:shadow-night-glow classical-card-frame overflow-visible"
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
                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-light-surface-muted dark:bg-[#121316] border border-light-border/70 dark:border-[#2D3039]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = './images/sumi-os-workspace.jpg';
                        }}
                      />
                    </div>
                  </div>

                  {/* Narrative & Specifications Column */}
                  <div
                    className={`lg:col-span-6 flex flex-col justify-center space-y-4 ${
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

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors ${
                            isCurrent
                              ? 'bg-terracotta/15 border border-terracotta/50 text-terracotta dark:text-[#ff7d63] dark:shadow-[0_0_10px_rgba(200,60,35,0.25)]'
                              : 'bg-stone-100 border border-stone-300 text-stone-600 dark:bg-[#20222a] dark:border-[#383b47] dark:text-stone-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCurrent
                                ? 'bg-terracotta shadow-[0_0_6px_rgba(200,60,35,0.8)] animate-pulse'
                                : 'bg-stone-400 dark:bg-neutral-500'
                            }`}
                          />
                          <span>{isCurrent ? 'ACTIVE / 稼働中' : 'COMPLETED'}</span>
                        </span>
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

                    <p className="font-sans text-sm text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-light">
                      {project.description}
                    </p>

                    {/* Minimalist Tech Tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.tags.map((tag) => (
                        <TechTag key={tag} tag={tag} size="md" />
                      ))}
                    </div>

                    {/* Action Foot Link & Direct Repository / Live Triggers */}
                    <div className="pt-3 border-t border-light-border/60 dark:border-[#2D3039]/80 flex items-center justify-between gap-4">
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

        {/* Project Detail Case Study Modal */}
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
};
