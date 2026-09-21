import React from 'react';
import { Project } from '../../../context/SiteDataContext';
import { ExternalLink, Github, ListChecks, Layers, Calendar } from 'lucide-react';
import { TechTag } from '../../common/TechTag';
import { CornerBrackets } from '../../common/CornerBrackets';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../ui/dialog';

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
        className="max-w-4xl lg:max-w-5xl xl:max-w-6xl w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-full p-0 overflow-hidden max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl shadow-2xl z-50"
      >
        <CornerBrackets size="lg" />

        {/* Modal Top Bar: Left Archive Info + Unblocked Dedicated Zone for Close Button */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-7 py-3 sm:py-3.5 border-b border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-muted shrink-0 pr-14 sm:pr-16">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className="font-serif text-terracotta text-lg sm:text-2xl font-bold shrink-0" aria-hidden="true">
              {project.kanji || '案'}
            </span>
            <span className="font-mono text-[10px] sm:text-xs uppercase font-semibold text-light-ink-muted dark:text-dark-ink-muted tracking-wider truncate">
              {project.badge || 'ENGINEERING ARCHIVE'}
            </span>
          </div>
        </div>

        {/* Scrollable Content: Mobile-First Single Column & Desktop 2-Column Split */}
        <div className="p-4 sm:p-7 overflow-y-auto space-y-6">
          {/* Project Identity Header (Always at top of body for clear context) */}
          <div className="space-y-2 border-b border-light-border/60 dark:border-dark-border/60 pb-4 sm:pb-5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Date Range Strip */}
              <span className="font-mono text-xs text-terracotta dark:text-[#ff7d63] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-terracotta dark:text-[#ff7d63]" />
                {project.startDate || '2024'} - {project.endDate || (project.isActive ? 'Present' : 'Completed')}
              </span>

              {/* Status Badge with Japanese subtitle across all viewports */}
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

            <DialogHeader className="text-left space-y-1">
              <DialogTitle className="font-serif text-2xl sm:text-3xl lg:text-4xl text-light-ink dark:text-dark-ink font-medium tracking-tight">
                {project.title}
              </DialogTitle>
              <DialogDescription className="font-sans text-xs sm:text-sm text-terracotta dark:text-ochre font-medium uppercase tracking-wider">
                {project.subtitle}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Main Grid: Responsive 2-Column Split on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Showcase Media & Technical Specifications */}
            <div className="lg:col-span-5 space-y-5">
              {/* Showcase Image */}
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-light-border/70 dark:border-dark-border relative bg-light-surface-muted dark:bg-dark-canvas shadow-inner group">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = './images/sumi-os-workspace.jpg';
                  }}
                />
                {project.kanji && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-xs font-serif text-white/95">
                    {project.kanji}
                  </div>
                )}
              </div>

              {/* Action Buttons for Mobile / Desktop Left Rail */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {project.links.live && project.links.live !== '#' && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-sans font-medium rounded-lg bg-terracotta hover:bg-terracotta-hover text-white transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Deployment</span>
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-sans font-medium rounded-lg border border-light-border dark:border-dark-border hover:bg-light-surface dark:hover:bg-dark-surface text-light-ink dark:text-dark-ink transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Repository</span>
                  </a>
                )}
              </div>

              {/* Technologies & Substrates Card */}
              <div className="p-4 rounded-xl bg-light-surface-raised/60 dark:bg-dark-surface-card/60 border border-light-border/60 dark:border-dark-border/60 space-y-2.5">
                <div className="font-sans text-[11px] uppercase tracking-wider font-semibold text-light-ink-subtle dark:text-dark-ink-subtle">
                  Technologies &amp; Infrastructure
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.tags.map((tag) => (
                    <TechTag key={tag} tag={tag} size="md" />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Narrative, Architectural Highlights, Metrics */}
            <div className="lg:col-span-7 space-y-5">
              {/* Architectural Overview */}
              <div className="space-y-2">
                <h3 className="font-serif text-base sm:text-lg text-light-ink dark:text-dark-ink font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4 text-terracotta" />
                  <span>Architectural Overview</span>
                </h3>
                <p className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-normal">
                  {project.overview}
                </p>
              </div>

              {/* Key Architectural Highlights & Engineering Principles */}
              {project.bullets && project.bullets.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="font-serif text-base sm:text-lg text-light-ink dark:text-dark-ink font-medium flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-terracotta" />
                    <span>Key Architectural Highlights</span>
                  </h3>
                  <ul className="space-y-2">
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
                <div className="space-y-2 pt-1">
                  <div className="font-sans text-[11px] uppercase tracking-wider font-semibold text-light-ink-subtle dark:text-dark-ink-subtle">
                    Operational Metrics
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
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

        {/* Modal Footer */}
        <div className="px-4 sm:px-7 py-3 sm:py-3.5 border-t border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-muted flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle uppercase">
              Project Specification
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta dark:hover:text-terracotta focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none rounded px-3 py-1.5 cursor-pointer font-medium"
          >
            Close ✕
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

