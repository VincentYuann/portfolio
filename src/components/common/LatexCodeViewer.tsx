import React, { useMemo } from 'react';
import { tokenizeLatexLine, getTokenClassName } from '../../lib/latexHighlight';

export interface LatexCodeViewerProps {
  code: string;
  className?: string;
  maxHeightClass?: string;
}

/**
 * Universal Syntax-Highlighted LaTeX Code Viewer
 * Centralized viewer component used across ResumePage and ResumeEditor.
 * High cohesion, zero external dependencies, robust line-by-line tokenization.
 */
export const LatexCodeViewer: React.FC<LatexCodeViewerProps> = ({
  code,
  className = '',
  maxHeightClass = 'max-h-[750px] sm:max-h-[880px] md:max-h-[1050px] lg:max-h-[1160px] xl:max-h-[1200px]',
}) => {
  const lines = useMemo(() => (code ? code.split('\n') : []), [code]);

  return (
    <div
      className={`w-full ${maxHeightClass} overflow-auto p-4 sm:p-6 font-mono text-xs leading-relaxed bg-[#FDFCFA] dark:bg-[#18191D] ${className}`}
    >
      <pre className="table w-full">
        {lines.map((line, idx) => {
          const tokens = tokenizeLatexLine(line);
          return (
            <div
              key={idx}
              className="table-row hover:bg-light-surface-muted/40 dark:hover:bg-dark-surface-muted/30 transition-colors"
            >
              <span className="table-cell select-none pr-4 text-right opacity-30 text-2xs w-10 align-top font-mono">
                {idx + 1}
              </span>
              <span className="table-cell whitespace-pre-wrap break-all">
                {tokens.map((token, tIdx) => (
                  <span key={tIdx} className={getTokenClassName(token.type)}>
                    {token.text}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
};
