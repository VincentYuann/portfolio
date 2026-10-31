import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { ViewMode } from '../../App';

const AiChatModal = lazy(() =>
  import('./chat/AiChatModal').then((m) => ({ default: m.AiChatModal }))
);

export interface AiChatWidgetProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
  isAdmin?: boolean;
}

export const AiChatWidget: React.FC<AiChatWidgetProps> = ({
  onNavigate,
  isAdmin = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStamping, setIsStamping] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Global hotkeys: Cmd+K / Ctrl+K toggles widget
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpen = () => {
    setIsStamping(true);
    setTimeout(() => {
      setIsOpen(true);
      setIsStamping(false);
    }, 200);
  };

  const prefetchModal = () => {
    // Warm chunk cache before click
    import('./chat/AiChatModal');
  };

  return (
    <>
      {/* ─── HANGING SEAL PLAQUE (問 SIDE TAG) ─── */}
      {!isOpen && (
        <button
          ref={launcherRef}
          type="button"
          onClick={handleOpen}
          onMouseEnter={prefetchModal}
          onFocus={prefetchModal}
          className={`fixed right-0 top-[52%] -translate-y-1/2 z-50 flex flex-col items-center gap-1.5 py-3 px-2 rounded-l-md bg-light-surface/95 dark:bg-dark-surface/95 backdrop-blur-md border-l border-y border-light-border dark:border-dark-border hover:border-terracotta/70 dark:hover:border-ochre/70 text-light-ink dark:text-dark-ink shadow-xs transition-all duration-200 group cursor-pointer translate-x-1 hover:translate-x-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-ochre ${
            isStamping ? 'scale-90 ring-1 ring-terracotta/40 dark:ring-ochre/40' : ''
          }`}
          aria-label="Ask Vincent AI (Press Cmd+K or Ctrl+K)"
          aria-haspopup="dialog"
          aria-expanded={false}
          title="Ask Vincent (⌘K)"
        >
          {/* Authentic Hanko Stamp Mark */}
          <div className="size-8 rounded-[3px] bg-terracotta text-white dark:bg-ochre dark:text-[#121316] flex items-center justify-center font-serif font-bold text-base shadow-xs group-hover:scale-105 transition-transform shrink-0 relative overflow-hidden">
            問
            {isStamping && (
              <span className="absolute inset-0 bg-white/25 dark:bg-black/20 animate-pulse pointer-events-none" />
            )}
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-light-ink-muted dark:text-dark-ink-muted [writing-mode:vertical-rl] font-semibold">
            ASK
          </span>
          <kbd className="hidden sm:block text-[9px] font-mono font-medium text-light-ink-muted dark:text-dark-ink-muted group-hover:text-terracotta dark:group-hover:text-ochre transition-colors">
            ⌘K
          </kbd>
        </button>
      )}

      {/* ─── CODE-SPLIT LAZY CHAT MODAL ─── */}
      {isOpen && (
        <Suspense fallback={null}>
          <AiChatModal
            onClose={() => setIsOpen(false)}
            onNavigate={onNavigate}
            isAdmin={isAdmin}
            launcherRef={launcherRef}
          />
        </Suspense>
      )}
    </>
  );
};

export default AiChatWidget;
