import React from 'react';
import { Project } from '../data/projects';
import { ExternalLink, Github, CheckCircle2, Layers } from 'lucide-react';
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
        className="max-w-3xl w-[calc(100%-2rem)] sm:w-full p-0 overflow-hidden max-h-[calc(100dvh-4rem)] flex flex-col bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl shadow-2xl z-50"
      >
        <CornerBrackets size="lg" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-muted shrink-0 pr-12">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-terracotta text-lg sm:text-xl font-normal" aria-hidden="true">
              {project.kanji}
            </span>
            <span className="font-mono text-[11px] sm:text-xs uppercase font-semibold text-light-ink-muted dark:text-dark-ink-muted tracking-wider">
              {project.badge}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          {/* Title & Subtitle */}
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="font-serif text-2xl sm:text-3xl text-light-ink dark:text-dark-ink font-normal tracking-tight">
              {project.title}
            </DialogTitle>
            <DialogDescription className="font-sans text-xs sm:text-sm text-terracotta dark:text-ochre font-medium uppercase tracking-wider mt-1">
              {project.subtitle}
            </DialogDescription>
          </DialogHeader>

          {/* Project Image */}
          <div className="w-full h-48 sm:h-72 rounded-xl overflow-hidden border border-light-border/70 dark:border-dark-border relative bg-light-surface-muted dark:bg-dark-canvas">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = './images/sumi-os-workspace.jpg';
              }}
            />
          </div>

          {/* Architectural Overview */}
          <div className="space-y-2">
            <h3 className="font-serif text-lg text-light-ink dark:text-dark-ink flex items-center gap-2">
              <Layers className="w-4 h-4 text-terracotta" />
              <span>Architectural Overview</span>
            </h3>
            <p className="font-sans text-sm sm:text-base text-light-ink-muted dark:text-dark-ink-muted leading-relaxed font-light">
              {project.overview}
            </p>
          </div>

          {/* Deep Architectural Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-light-ink dark:text-dark-ink font-normal">
              System Highlights &amp; Engineering Principles
            </h3>
            <div className="space-y-3">
              {project.architectureDetails.map((section, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-lg border border-light-border/80 dark:border-dark-border/80 bg-light-surface-raised/60 dark:bg-dark-surface-card/60 relative"
                >
                  <h4 className="font-sans text-xs sm:text-sm font-semibold text-light-ink dark:text-dark-ink mb-1.5 flex items-center gap-1.5">
                    <span className="text-terracotta font-mono text-xs">§</span>
                    <span>{section.title}</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {section.points.map((pt, pIdx) => (
                      <li
                        key={pIdx}
                        className="font-sans text-xs sm:text-sm text-light-ink-muted dark:text-dark-ink-muted flex items-start gap-2 leading-relaxed font-light"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-terracotta shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Tags */}
          <div>
            <div className="font-sans text-[11px] uppercase tracking-wider font-semibold text-light-ink-subtle dark:text-dark-ink-subtle mb-2.5">
              Technologies &amp; Infrastructure
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <TechTag key={tag} tag={tag} size="lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-muted flex items-center justify-between gap-4 shrink-0">
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
            className="text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none rounded px-2.5 py-1.5 cursor-pointer"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
