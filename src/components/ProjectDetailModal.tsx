import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Project } from '../data/projects';
import { X, ExternalLink, Github, CheckCircle2, Layers } from 'lucide-react';
import { TechTag } from './TechTag';
import { CornerBrackets } from './CornerBrackets';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto" role="dialog" aria-modal="true">
      {/* Dimmed & Blurred Backdrop - Complete dimming so nothing behind bleeds through */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/80 dark:bg-black/90 backdrop-blur-md transition-opacity cursor-pointer"
      />

      {/* Modal Positioning Wrapper: guaranteed clearance at top and bottom */}
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 pt-16 sm:pt-20 pb-12">
        {/* Modal Container */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="interactive-card relative w-full max-w-3xl bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[calc(100dvh-5.5rem)] sm:max-h-[calc(100dvh-6.5rem)] my-auto classical-card-frame"
        >
          <CornerBrackets size="lg" />
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface-muted shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-terracotta text-lg sm:text-xl">{project.kanji}</span>
              <span className="font-mono text-[11px] sm:text-xs uppercase font-semibold text-light-ink-muted dark:text-dark-ink-muted tracking-wider">
                {project.badge}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-light-surface-muted dark:hover:bg-dark-surface text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
            {/* Title & Subtitle */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-light-ink dark:text-dark-ink font-normal tracking-tight">
                {project.title}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-terracotta font-medium uppercase tracking-wider mt-1">
                {project.subtitle}
              </p>
            </div>

            {/* Project Image */}
            <div className="w-full h-48 sm:h-72 rounded-xl overflow-hidden border border-light-border/70 dark:border-[#2D3039] relative bg-light-surface-muted dark:bg-[#121316]">
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
                    className="p-3 sm:p-4 rounded-lg border-l-2 border-terracotta/50 bg-light-surface-raised/60 dark:bg-dark-surface-card/60 pl-3.5 sm:pl-4"
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
              className="text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none rounded px-2.5 py-1.5"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
