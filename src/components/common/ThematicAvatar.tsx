import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export interface ThematicAvatarProps {
  src?: string;
  alt?: string;
  className?: string;
}

const OCTAGONAL_CLIP =
  'polygon(14% 0%, 86% 0%, 100% 14%, 100% 86%, 86% 100%, 14% 100%, 0% 86%, 0% 14%)';

export const ThematicAvatar: React.FC<ThematicAvatarProps> = ({
  src,
  alt = 'Profile Avatar',
  className,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        'relative inline-block size-24 sm:size-28 select-none group/avatar',
        className
      )}
    >
      {/* 1px Whisper-Thin Architectural Moon Gate Frame - No Glow, No Drama */}
      <div
        className="relative w-full h-full p-[1px] bg-light-border dark:bg-dark-border transition-colors duration-200 group-hover/avatar:bg-light-border-strong dark:group-hover/avatar:bg-dark-border-strong"
        style={{ clipPath: OCTAGONAL_CLIP }}
      >
        <div
          className="w-full h-full overflow-hidden bg-light-surface-muted dark:bg-dark-surface-muted"
          style={{ clipPath: OCTAGONAL_CLIP }}
        >
          {src && !hasError ? (
            <img
              src={src}
              alt={alt}
              onError={() => setHasError(true)}
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover/avatar:scale-102"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#E5E1D8] dark:bg-[#1E2027] text-[#9E9A8E] dark:text-[#736F64]">
              <svg className="size-13 sm:size-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThematicAvatar;
