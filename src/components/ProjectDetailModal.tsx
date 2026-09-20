import React from 'react';
import { Project } from '../data/projects';
import { ExternalLink, Github, ListChecks, Layers, Calendar } from 'lucide-react';
import { TechTag } from './TechTag';
import { CornerBrackets } from './CornerBrackets';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCornerBrackets={false}
        className="max-w-4xl lg:max-w-5xl xl:max-w-6xl w-[calc(100%-2rem)] sm:w-full p-0 overflow-hidden max-h-[calc(100dvh-3rem)] flex flex-col bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl shadow-2xl z-50"
      >
        <CornerBrackets size="lg" />

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-3.5 sm:py-4 border-b border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-muted shrink-0 pr-12">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-terracotta text-lg sm:text-2xl font-bold" aria-hidden="true">
              {project.kanji || '案'}
            </span>
            <span className="font-mono text-[11px] sm:text-xs uppercase font-semibold text-light-ink-muted dark:text-dark-ink-muted tracking-wider">
              {project.badge || 'ENGINEERING ARCHIVE'}
            </span>
          </div>

          {/* Timeline & Active Status Badge in Header */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-terracotta font-semibold tracking-wider uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-terracotta" />
              {project.startDate || '2024'} - {project.endDate || (project.isActive ? 'Present' : 'Completed')}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                project.isActive
                  ? 'bg-terracotta/15 border border-terracotta/40 text-terracotta dark:text-[#ff7d63]'
                  : 'bg-stone-100 dark:bg-[#20222a] border border-stone-300 dark:border-[#383b47] text-stone-600 dark:text-stone-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  project.isActive ? 'bg-terracotta animate-pulse' : 'bg-stone-400 dark:bg-neutral-500'
                }`}
              />
              <span>{project.isActive ? 'ACTIVE / 稼働中' : 'COMPLETED / 完了'}</span>
            </span>
          </div>
        </div>

        {/* Scrollable Content: Spacious 2-Column Split on PC (lg:) */}
        <div className="p-5 sm:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column (PC): Showcase Image, Tech Stack, & Links */}
            <div className="lg:col-span-5 space-y-6">
              {/* Project Image */}
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-light-border/70 dark:border-dark-border relative bg-light-surface-muted dark:bg-dark-canvas shadow-inner group">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = './images/sumi-os-workspace.jpg';
                  }}
                />
                {project.kanji && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/50 backdrop-blur-xs text-xs font-serif text-white/95">
                    {project.kanji}
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              <div className="p-4 rounded-xl bg-light-surface-raised/60 dark:bg-dark-surface-card/60 border border-light-border/60 dark:border-dark-border/60 space-y-3">
                <div className="font-sans text-[11px] uppercase tracking-wider font-semibold text-light-ink-subtle dark:text-dark-ink-subtle">
                  Technologies &amp; Infrastructure
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <TechTag key={tag} tag={tag} size="lg" />
                  ))}
                </div>
              </div>

              {/* Quick Actions (Desktop Left Rail) */}
              <div className="hidden lg:flex items-center gap-3 pt-2">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-sans font-medium rounded-lg border border-light-border dark:border-dark-border hover:bg-light-surface dark:hover:bg-dark-surface text-light-ink dark:text-dark-ink transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}
                {project.links.live && project.links.live !== '#' && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-sans font-medium rounded-lg bg-terracotta hover:bg-terracotta-hover text-white transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Deployment</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column (PC): Title, Overview, Architectural Highlights, Metrics */}
            <div className="lg:col-span-7 space-y-6">
              {/* Title & Subtitle */}
              <DialogHeader className="text-left space-y-1.5">
                <DialogTitle className="font-serif text-2xl sm:text-3xl lg:text-4xl text-light-ink dark:text-dark-ink font-normal tracking-tight">
                  {project.title}
                </DialogTitle>
                <DialogDescription className="font-sans text-xs sm:text-sm text-terracotta dark:text-ochre font-medium uppercase tracking-wider">
                  {project.subtitle}
                </DialogDescription>
              </DialogHeader>

              {/* Architectural Overview */}
              <div className="space-y-2">
                <h3 className="font-serif text-base sm:text-lg text-light-ink dark:text-dark-ink flex items-center gap-2">
                  <Layers className="w-4 h-4 text-terracotta" />
                  <span>Architectural Overview</span>
                </h3>
                <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-light">
                  {project.overview}
                </p>
              </div>

              {/* Key Architectural Highlights & Engineering Principles */}
              {project.bullets && project.bullets.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-serif text-base sm:text-lg text-light-ink dark:text-dark-ink font-normal flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-terracotta" />
                    <span>Key Architectural Highlights</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {project.bullets.map((point, idx) => (
                      <li
                        key={idx}
                        className="p-3 sm:p-3.5 rounded-lg border border-light-border/80 dark:border-dark-border/80 bg-light-surface-raised/70 dark:bg-dark-surface-card/70 hover:border-terracotta/40 hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised transition-all flex items-start gap-3 shadow-2xs group"
                      >
                        <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-terracotta dark:text-[#ff7d63] bg-terracotta/10 dark:bg-terracotta/15 border border-terracotta/30 rounded px-1.5 py-0.5 shrink-0 select-none shadow-[0_0_8px_rgba(200,60,35,0.15)] mt-0.5">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="font-sans text-xs sm:text-sm text-light-ink dark:text-dark-ink leading-relaxed font-normal">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* System Metrics (if present) */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <div className="font-sans text-[11px] uppercase tracking-wider font-semibold text-light-ink-subtle dark:text-dark-ink-subtle">
                    Operational Metrics
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surface-raised/50 dark:bg-dark-surface-card/50"
                      >
                        <div className="font-serif text-lg font-bold text-terracotta">
                          {metric.value}
                        </div>
                        <div className="font-sans text-[11px] text-light-ink-muted dark:text-dark-ink-muted">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-t border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-muted flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-sans font-medium rounded-lg border border-light-border dark:border-dark-border hover:bg-light-surface dark:hover:bg-dark-surface text-light-ink dark:text-dark-ink transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Repository</span>
              </a>
            )}
            {project.links.live && project.links.live !== '#' && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-sans font-medium rounded-lg bg-terracotta hover:bg-terracotta-hover text-white transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Demo</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none rounded px-3 py-1.5 cursor-pointer"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
