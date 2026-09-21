import React from 'react';

interface CornerBracketsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CornerBrackets: React.FC<CornerBracketsProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const dim = sizeMap[size];
  const borderCls = 'border-ochre/55 dark:border-ochre/45 pointer-events-none transition-colors duration-300';

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      {/* Top Left */}
      <div
        className={`corner-bracket corner-bracket-tl absolute ${size === 'sm' ? 'top-2 left-2' : size === 'lg' ? 'top-3 left-3' : 'top-2.5 left-2.5'} ${dim} border-t border-l ${borderCls}`}
      />
      {/* Top Right */}
      <div
        className={`corner-bracket corner-bracket-tr absolute ${size === 'sm' ? 'top-2 right-2' : size === 'lg' ? 'top-3 right-3' : 'top-2.5 right-2.5'} ${dim} border-t border-r ${borderCls}`}
      />
      {/* Bottom Left */}
      <div
        className={`corner-bracket corner-bracket-bl absolute ${size === 'sm' ? 'bottom-2 left-2' : size === 'lg' ? 'bottom-3 left-3' : 'bottom-2.5 left-2.5'} ${dim} border-b border-l ${borderCls}`}
      />
      {/* Bottom Right */}
      <div
        className={`corner-bracket corner-bracket-br absolute ${size === 'sm' ? 'bottom-2 right-2' : size === 'lg' ? 'bottom-3 right-3' : 'bottom-2.5 right-2.5'} ${dim} border-b border-r ${borderCls}`}
      />
    </div>
  );
};
