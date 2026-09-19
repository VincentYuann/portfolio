import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { X, Sun, Moon } from 'lucide-react';
import { HankoStamp } from './HankoStamp';

export type ViewMode = 'home' | 'projects' | 'resume' | 'login' | 'edit';

interface HeaderProps {
  onOpenContact?: () => void;
  currentView?: ViewMode;
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenContact,
  currentView = 'home',
  onNavigate,
  isAdmin = false,
  onLogout,
}) => {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (currentView !== 'home') return;
      const sections = ['home', 'experience', 'featured-works', 'philosophy', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Close desktop dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target as Node)) {
        setDesktopDropdownOpen(false);
      }
    };
    if (desktopDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [desktopDropdownOpen]);

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
    { id: 'home', num: '01', label: 'Home', href: '#home', view: 'home' as const },
    { id: 'experience', num: '02', label: 'Experience', href: '#experience', view: 'home' as const },
    { id: 'featured-works', num: '03', label: 'Projects', href: '#featured-works', view: 'home' as const },
    { id: 'philosophy', num: '04', label: 'Philosophy', href: '#philosophy', view: 'home' as const },
    { id: 'contact', num: '05', label: 'Contact', href: '#contact', view: 'home' as const },
    { id: 'resume', num: '06', label: 'Resume', href: '#resume', view: 'resume' as const },
    ...(isAdmin ? [{ id: 'edit', num: '07', label: 'Edit', href: '#edit', view: 'edit' as const }] : []),
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof navItems)[0],
  ) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(item.view, item.id);
      setMobileDrawerOpen(false);
    }
  };

  const isMenuOpen = mobileDrawerOpen || desktopDropdownOpen;

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
            aria-label="Vincent Yuan — Home"
          >
            <div className="relative flex items-center justify-center -rotate-1 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105">
              <HankoStamp className="h-9 w-9 transition-all duration-300" />
            </div>
          </a>
        </div>

        {/* Center: Desktop Navigation — Shown on wide screens (>= xl / 1280px) */}
        <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 min-w-0">
          {navItems.map((item) => {
            const isActive =
              currentView === 'edit'
                ? item.id === 'edit'
                : currentView === 'resume'
                ? item.id === 'resume'
                : currentView === 'projects'
                ? item.id === 'featured-works'
                : activeSection === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`group relative font-sans text-xs uppercase tracking-wider lg:tracking-widest transition-colors flex items-center gap-1.5 py-1 whitespace-nowrap ${
                  isActive
                    ? 'text-terracotta font-semibold'
                    : 'text-light-ink-muted dark:text-dark-ink-muted hover:text-light-ink dark:hover:text-dark-ink'
                }`}
              >
                <span className="opacity-40 text-[10px] font-mono">{item.num}</span>
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

        {/* Right side cluster — always neatly aligned without overlapping */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Day / Night Toggle */}
          <div className="flex items-center bg-light-surface-muted/90 dark:bg-dark-surface/90 p-1 rounded-full border border-light-border dark:border-dark-border text-[11px] shrink-0">
            <button
              onClick={() => setTheme('day')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full font-sans font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                theme === 'day'
                  ? 'bg-light-surface-raised text-light-ink shadow-sm'
                  : 'text-light-ink-muted hover:text-light-ink dark:text-dark-ink-muted dark:hover:text-dark-ink'
              }`}
              title="Day Mode"
            >
              <Sun className="w-3 h-3" />
              <span>DAY</span>
            </button>
            <button
              onClick={() => setTheme('night')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full font-sans font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                theme === 'night'
                  ? 'bg-dark-surface-raised text-dark-ink shadow-sm'
                  : 'text-light-ink-muted hover:text-light-ink dark:text-dark-ink-muted dark:hover:text-dark-ink'
              }`}
              title="Night Mode"
            >
              <Moon className="w-3 h-3" />
              <span>NIGHT</span>
            </button>
          </div>

          {/* Hire Me (shown on md+ and inside drawer on mobile) */}
          <a
            href="#contact"
            onClick={(e) => {
              if (onOpenContact) {
                e.preventDefault();
                onOpenContact();
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium tracking-wide bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
          >
            <span>Hire Me</span>
          </a>

          {/* ── Consistent Bordered 三 Menu Button across ALL screen sizes ── */}
          <div className="relative" ref={desktopMenuRef}>
            <button
              onClick={() => {
                if (window.innerWidth >= 1280) {
                  // On wide desktop: toggle quick dropdown (Edit/Login/Logout)
                  setDesktopDropdownOpen((prev) => !prev);
                  setMobileDrawerOpen(false);
                } else {
                  // On smaller desktop / tablet / mobile: toggle full mobile drawer
                  setMobileDrawerOpen((prev) => !prev);
                  setDesktopDropdownOpen(false);
                }
              }}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 select-none cursor-pointer shrink-0 ${
                isMenuOpen
                  ? 'border-terracotta bg-terracotta/10 text-terracotta shadow-xs'
                  : 'border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface text-light-ink dark:text-dark-ink hover:border-terracotta/60 hover:text-terracotta'
              }`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              title="Menu"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4 text-terracotta transition-transform duration-200" />
              ) : (
                <span className="font-serif text-base font-medium leading-none tracking-tight">三</span>
              )}
            </button>

            {/* Desktop Quick Dropdown (when >= xl) */}
            {desktopDropdownOpen && (
              <div className="hidden xl:block absolute right-0 top-full mt-2 w-44 bg-light-surface-card dark:bg-[#181920] border border-light-border dark:border-[#2D3039] rounded-xl shadow-xl overflow-hidden py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => {
                        setDesktopDropdownOpen(false);
                        onNavigate?.('edit');
                      }}
                      className="w-full text-left px-4 py-2.5 font-sans text-xs text-light-ink dark:text-dark-ink hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised hover:text-terracotta transition-colors cursor-pointer"
                    >
                      Edit Portfolio
                    </button>
                    <div className="mx-3 my-1 border-t border-light-border dark:border-dark-border" />
                    <button
                      onClick={() => {
                        setDesktopDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-left px-4 py-2.5 font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setDesktopDropdownOpen(false);
                      onNavigate?.('login');
                    }}
                    className="w-full text-left px-4 py-2.5 font-sans text-xs text-light-ink dark:text-dark-ink hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised hover:text-terracotta transition-colors cursor-pointer"
                    aria-label="Admin login"
                  >
                    Admin Login
                  </button>
                )}
              </div>
            )}
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
                  <span className="font-medium">{item.label}</span>
                  <span className="font-mono text-[10px] opacity-50">{item.num}</span>
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
                Hire Me / Get in Touch
              </a>

              {isAdmin ? (
                <div className="flex items-center justify-between pt-1 px-1 text-xs">
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      onNavigate?.('edit');
                    }}
                    className="py-1 text-light-ink dark:text-dark-ink hover:text-terracotta transition-colors font-sans"
                  >
                    Edit Portfolio
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
