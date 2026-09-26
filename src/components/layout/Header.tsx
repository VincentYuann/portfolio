import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { X, Sun, Moon, LogOut, LogIn, SlidersHorizontal, Eye } from 'lucide-react';
import { HankoStamp } from '../common/HankoStamp';

export type ViewMode = 'home' | 'projects' | 'resume' | 'login' | 'edit' | 'hobbies';

interface HeaderProps {
  onOpenContact?: () => void;
  currentView?: ViewMode;
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
  isAdmin?: boolean;
  isVisitor?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenContact,
  currentView = 'home',
  onNavigate,
  isAdmin = false,
  isVisitor = false,
  onLogout,
}) => {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Lightweight, RAF-throttled scroll listener for header elevation only (zero layout reads)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Layout-thrash-free active section tracking using IntersectionObserver
  useEffect(() => {
    if (currentView !== 'home') return;

    const sectionIds = ['home', 'experience', 'featured-works', 'philosophy', 'hobbies', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visibleSections = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(entry.target.id, entry);
        });

        const intersecting = Array.from(visibleSections.values()).filter((e) => e.isIntersecting);
        if (intersecting.length === 0) return;

        // Sort by distance to the 100px reading line below the header
        intersecting.sort((a, b) => {
          const distA = Math.abs(a.boundingClientRect.top - 100);
          const distB = Math.abs(b.boundingClientRect.top - 100);
          return distA - distB;
        });

        const best = intersecting[0]?.target.id;
        if (best) {
          setActiveSection(best);
        }
      },
      {
        rootMargin: '-80px 0px -25% 0px',
        threshold: [0, 0.15, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentView]);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'home', num: '01', label: 'Home', fullLabel: 'Home', href: '#home', view: 'home' as const },
    { id: 'experience', num: '02', label: 'Experience', fullLabel: 'Experience', href: '#experience', view: 'home' as const },
    { id: 'featured-works', num: '03', label: 'Projects', fullLabel: 'Projects', href: '#featured-works', view: 'home' as const },
    { id: 'philosophy', num: '04', label: 'Philosophy', fullLabel: 'Philosophy', href: '#philosophy', view: 'home' as const },
    { id: 'hobbies', num: '05', label: 'Hobbies', fullLabel: 'Hobbies & Interests', href: '#hobbies', view: 'home' as const },
    { id: 'contact', num: '06', label: 'Contact', fullLabel: 'Contact', href: '#contact', view: 'home' as const },
    { id: 'resume', num: '07', label: 'Resume', fullLabel: 'Resume', href: '#resume', view: 'resume' as const },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof navItems)[0],
  ) => {
    if (onNavigate) {
      e.preventDefault();
      if (item.view === 'home') {
        setActiveSection(item.id);
      }
      onNavigate(item.view, item.id);
      setMobileDrawerOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-light-canvas/90 dark:bg-dark-canvas/90 backdrop-blur-md border-b border-light-border/70 dark:border-dark-border/80 shadow-sm'
          : 'bg-light-canvas/70 dark:bg-dark-canvas/70 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="h-20 w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#home"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('home', 'home');
              }
            }}
            className="flex items-center group cursor-pointer"
            aria-label="Vincent Yuan · Home"
          >
            <div className="relative flex items-center justify-center -rotate-1 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105">
              <HankoStamp className="h-9 w-9 transition-all duration-300" />
            </div>
          </a>
        </div>

        {/* Center: Desktop Navigation: Shown on wide screens (>= xl / 1280px) with deliberate breathing room */}
        <nav className="hidden xl:flex items-center gap-3 2xl:gap-4 shrink-0">
          {navItems.map((item) => {
            const isActive =
              currentView === 'edit'
                ? item.id === 'edit'
                : currentView === 'resume'
                ? item.id === 'resume'
                : currentView === 'projects'
                ? item.id === 'featured-works'
                : currentView === 'hobbies'
                ? item.id === 'hobbies'
                : activeSection === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`group relative font-sans text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 py-1 whitespace-nowrap ${
                  isActive
                    ? 'text-terracotta font-semibold'
                    : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink'
                }`}
              >
                <span className="opacity-40 text-[11px] font-mono">{item.num}</span>
                <span>{item.label}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-terracotta rounded-full transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Right side cluster: always neatly aligned with zero overlap */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Day / Night segmented toggle */}
          <div className="flex items-center p-0.5 rounded-full bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-[11px] sm:text-xs select-none shrink-0 shadow-2xs">
            <button
              onClick={() => setTheme('day')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full font-sans font-semibold tracking-wider transition-all duration-200 cursor-pointer group/theme ${
                theme === 'day'
                  ? 'bg-light-surface-raised text-light-ink shadow-sm'
                  : 'text-light-ink-muted hover:text-light-ink dark:text-dark-ink-muted dark:hover:text-dark-ink'
              }`}
              title="Day Mode"
              aria-label="Switch to Day Mode"
            >
              <Sun className={`w-3 h-3 transition-transform duration-300 ${theme === 'day' ? 'rotate-0 scale-105 text-ochre' : '-rotate-45 scale-95 group-hover/theme:rotate-0'}`} />
              <span className="hidden sm:inline">DAY</span>
            </button>
            <button
              onClick={() => setTheme('night')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full font-sans font-semibold tracking-wider transition-all duration-200 cursor-pointer group/theme ${
                theme === 'night'
                  ? 'bg-dark-surface-raised text-dark-ink shadow-sm'
                  : 'text-light-ink-muted hover:text-light-ink dark:text-dark-ink-muted dark:hover:text-dark-ink'
              }`}
              title="Night Mode"
              aria-label="Switch to Night Mode"
            >
              <Moon className={`w-3 h-3 transition-transform duration-300 ${theme === 'night' ? 'rotate-0 scale-105 text-terracotta' : 'rotate-45 scale-95 group-hover/theme:rotate-0'}`} />
              <span className="hidden sm:inline">NIGHT</span>
            </button>
          </div>

          {/* Contact CTA (shown on sm-lg; hidden on xl+ where 06 Contact is already in the main navbar) */}
          <a
            href="#contact"
            onClick={(e) => {
              if (onOpenContact) {
                e.preventDefault();
                onOpenContact();
              }
            }}
            className="hidden sm:inline-flex xl:hidden items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium tracking-wide bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
          >
            <span>Get in Touch</span>
          </a>

          {/* Desktop Action Cluster: Admin controls, Visitor badge, or Sign In button (>= xl) */}
          {isAdmin ? (
            <div className="hidden xl:flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onNavigate?.(currentView === 'edit' ? 'home' : 'edit')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans border transition-colors cursor-pointer ${
                  currentView === 'edit'
                    ? 'bg-terracotta text-white border-terracotta shadow-xs'
                    : 'text-terracotta border-terracotta/40 bg-terracotta/10 hover:bg-terracotta/20 hover:border-terracotta'
                }`}
                title={currentView === 'edit' ? 'Exit Studio & view public site' : 'Open Studio to edit portfolio'}
                aria-label={currentView === 'edit' ? 'View Site' : 'Edit Site'}
              >
                {currentView === 'edit' ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono font-medium">View Site</span>
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono font-medium">Edit Site</span>
                  </>
                )}
              </button>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted hover:text-red-500 hover:bg-light-surface-raised dark:hover:bg-dark-surface border border-light-border dark:border-dark-border transition-colors cursor-pointer"
                title="Sign out of Admin mode"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono">Sign Out</span>
              </button>
            </div>
          ) : isVisitor ? (
            <div className="hidden xl:flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20">
                Visitor
              </span>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted hover:text-red-500 hover:bg-light-surface-raised dark:hover:bg-dark-surface border border-light-border dark:border-dark-border transition-colors cursor-pointer"
                title="Exit Visitor session"
                aria-label="Exit Visitor"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono">Exit</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate?.('login')}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink hover:bg-light-surface-raised dark:hover:bg-dark-surface border border-light-border dark:border-dark-border transition-colors cursor-pointer shrink-0"
              title="Admin Login"
              aria-label="Admin Login"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono">Sign In</span>
            </button>
          )}

          {/* ── Bordered 三 Menu Button: Exclusively on Mobile and Tablet (< xl) ── */}
          <div className="relative xl:hidden">
            <button
              onClick={() => setMobileDrawerOpen((prev) => !prev)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 select-none cursor-pointer shrink-0 ${
                mobileDrawerOpen
                  ? 'border-terracotta bg-terracotta/10 text-terracotta shadow-xs'
                  : 'border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface text-light-ink dark:text-dark-ink hover:border-terracotta/60 hover:text-terracotta'
              }`}
              aria-label={mobileDrawerOpen ? 'Close menu' : 'Open menu'}
              title="Menu"
            >
              {mobileDrawerOpen ? (
                <X className="w-4 h-4 text-terracotta transition-transform duration-200" />
              ) : (
                <span className="font-serif text-base font-medium leading-none tracking-tight">三</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tablet & Mobile Navigation Drawer (Active on < xl screens) ── */}
      {mobileDrawerOpen && (
        <div className="xl:hidden px-6 py-5 bg-light-surface/98 dark:bg-dark-surface/98 backdrop-blur-md border-b border-light-border dark:border-dark-border shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive =
                currentView === 'edit'
                  ? item.id === 'edit'
                  : currentView === 'resume'
                  ? item.id === 'resume'
                  : currentView === 'projects'
                  ? item.id === 'featured-works'
                  : currentView === 'hobbies'
                  ? item.id === 'hobbies'
                  : activeSection === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-sans uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-terracotta/10 text-terracotta font-semibold'
                      : 'text-light-ink-muted dark:text-dark-ink-muted hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised hover:text-light-ink dark:hover:text-dark-ink'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />}
                    <span className="font-medium">{item.fullLabel || item.label}</span>
                  </div>
                  <span className="font-mono text-[11px] opacity-50">{item.num}</span>
                </a>
              );
            })}

            {/* Bottom Actions inside Drawer */}
            <div className="pt-3 mt-2 border-t border-light-border dark:border-dark-border space-y-2">
              <a
                href="#contact"
                onClick={(e) => {
                  if (onOpenContact) {
                    e.preventDefault();
                    onOpenContact();
                  }
                  setMobileDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-xs font-sans font-medium tracking-wide bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light hover:opacity-90 transition-opacity"
              >
                Get in Touch
              </a>

              {isAdmin ? (
                <div className="flex items-center justify-between pt-1 px-1 text-xs">
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      onNavigate?.(currentView === 'edit' ? 'home' : 'edit');
                    }}
                    className="py-1 text-light-ink dark:text-dark-ink hover:text-terracotta transition-colors font-sans"
                  >
                    {currentView === 'edit' ? 'View Site' : 'Edit Portfolio'}
                  </button>
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      onLogout?.();
                    }}
                    className="py-1 text-light-ink-muted dark:text-dark-ink-muted hover:text-red-400 transition-colors font-sans"
                  >
                    Logout
                  </button>
                </div>
              ) : isVisitor ? (
                <div className="flex items-center justify-between pt-1 px-1 text-xs">
                  <span className="py-1 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-medium">
                    Visitor (View Only)
                  </span>
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      onLogout?.();
                    }}
                    className="py-1 text-light-ink-muted dark:text-dark-ink-muted hover:text-red-400 transition-colors font-sans"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onNavigate?.('login');
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-sans text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors"
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
