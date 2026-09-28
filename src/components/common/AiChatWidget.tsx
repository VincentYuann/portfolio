import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { ViewMode } from '../../App';

const AiChatModal = lazy(() =>
  import('./chat/AiChatModal').then((m) => ({ default: m.AiChatModal }))
);

export interface AiChatWidgetProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
  isAdmin?: boolean;
}

export const AiChatWidget: React.FC<AiChatWidgetProps> = ({ onNavigate, isAdmin = false }) => {
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
    }, 240);
  };

  const prefetchModal = () => {
    // Warm chunk cache before click
    import('./chat/AiChatModal');
  };

  return (
    <>
      {/* ─── 1. SINGULAR HANKO TRIGGER (DESIGN SYSTEM ALIGNED) ─── */}
      {!isOpen && (
        <button
          ref={launcherRef}
          type="button"
          onClick={handleOpen}
          onMouseEnter={prefetchModal}
          onFocus={prefetchModal}
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 p-1.5 sm:pl-2 sm:pr-3.5 sm:py-1.5 rounded-full bg-light-surface-card dark:bg-dark-surface-card border border-terracotta/40 hover:border-terracotta dark:border-ochre/40 dark:hover:border-ochre text-light-ink dark:text-dark-ink shadow-md hover:shadow-hanko-glow transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta dark:focus-visible:ring-ochre focus-visible:ring-offset-2 active:scale-95 cursor-pointer min-h-[48px] min-w-[48px] ${
            isStamping ? 'scale-90 ring-4 ring-terracotta/30 dark:ring-ochre/30 shadow-hanko-glow' : ''
          }`}
          aria-label="Open Vincent's AI Companion (Press Cmd+K or Ctrl+K)"
          aria-haspopup="dialog"
          aria-expanded={false}
          title="Ask Vincent's AI (⌘K)"
        >
          {/* Vermilion Stamp Impression Ripple (Inshu Seal Wave) */}
          {isStamping && (
            <span className="absolute inset-0 rounded-full border-2 border-terracotta dark:border-ochre animate-ping pointer-events-none opacity-80" />
          )}

          {/* Authentic Hanko Stamp Mark */}
          <div className="w-9 h-9 rounded-full bg-terracotta dark:bg-dark-button-light text-white dark:text-dark-on-light flex items-center justify-center font-serif font-bold text-sm shadow-xs group-hover:scale-105 transition-transform shrink-0 relative overflow-hidden">
            問
            {isStamping && (
              <span className="absolute inset-0 bg-white/25 animate-pulse pointer-events-none" />
            )}
          </div>
          {/* Launcher Label & Shortcut Affordance (Responsive Desktop Expansion) */}
          <div className="hidden sm:flex items-center gap-2 pr-0.5">
            <span className="font-serif text-xs sm:text-sm font-medium tracking-tight">
              Ask Vincent's AI
            </span>
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-xs font-mono font-medium rounded border border-light-border dark:border-dark-border bg-light-surface-raised dark:bg-dark-surface text-light-ink-muted dark:text-stone-300">
              ⌘K
            </kbd>
          </div>
        </button>
      )}

      {/* ─── 2. CODE-SPLIT LAZY CHAT MODAL ─── */}
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
