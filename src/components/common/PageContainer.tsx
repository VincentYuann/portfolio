import React from 'react';

/**
 * Centralized Layout Constants & Tokens for Whole-Site Canvas Cohesion.
 * Using this single source of truth ensures:
 * 1. All standalone pages and home chambers share identical proportional widths.
 * 2. Any future layout changes (e.g. tweaking max-width from 1536px to 1440px or 1600px)
 *    only happen in this ONE file.
 * 3. Typographic measures adhere strictly to optimal editorial readability standards.
 */

export const CANVAS_WIDTH = {
  /** Master canvas max-width for wide screens across all pages and sections */
  wide: 'max-w-[1536px]',
  /** Standard content container with responsive gutter padding */
  container: 'w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8',
  /** Editorial copy max-width for optimal reading line length */
  prose: 'max-w-prose',
  measure: 'max-w-3xl',
  /** Focused narrow content (e.g. form fields, login card) */
  compact: 'max-w-xl mx-auto',
} as const;

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Standardized Page Container wrapper ensuring all sub-pages adhere to the wide-canvas grid.
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component className={`${CANVAS_WIDTH.container} ${className}`}>
      {children}
    </Component>
  );
};
