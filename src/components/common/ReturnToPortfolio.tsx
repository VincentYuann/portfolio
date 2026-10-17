import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ViewMode } from '../../App';

interface ReturnToPortfolioProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
  sectionId?: string;
  label?: string;
  className?: string;
}

export const ReturnToPortfolio: React.FC<ReturnToPortfolioProps> = ({
  onNavigate,
  sectionId,
  label = 'Return to Portfolio',
  className = '',
}) => {
  return (
    <div className={`mb-4 sm:mb-8 ${className}`}>
      <button
        type="button"
        onClick={() => onNavigate?.('home', sectionId)}
        className="inline-flex items-center gap-2 font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta dark:hover:text-ochre transition-colors group cursor-pointer py-1 select-none"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
        <span>{label}</span>
      </button>
    </div>
  );
};
