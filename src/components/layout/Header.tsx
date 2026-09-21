import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { X, Sun, Moon } from 'lucide-react';
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
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (currentView !== 'home') return;
      
      // If reached bottom of page, highlight contact
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact');
        return;
      }

      const scrollPosition = window.scrollY + 220;
      const sections = ['contact', 'hobbies', 'philosophy', 'featured-works', 'experience', 'home'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
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
    { id: 'home', num: '01', label: 'Home', fullLabel: 'Home', href: '#home', view: 'home' as const },
    { id: 'experience', num: '02', label: 'Experience', fullLabel: 'Experience', href: '#experience', view: 'home' as const },
    { id: 'featured-works', num: '03', label: 'Projects', fullLabel: 'Projects', href: '#featured-works', view: 'home' as const },
    { id: 'philosophy', num: '04', label: 'Philosophy', fullLabel: 'Philosophy', href: '#philosophy', view: 'home' as const },
    { id: 'hobbies', num: '05', label: 'Hobbies', fullLabel: 'Hobbies & Interests', href: '#hobbies', view: 'home' as const },
    { id: 'contact', num: '06', label: 'Contact', fullLabel: 'Contact', href: '#contact', view: 'home' as const },
    { id: 'resume', num: '07', label: 'Resume', fullLabel: 'Resume', href: '#resume', view: 'resume' as const },
    ...(isAdmin ? [{ id: 'edit', num: '08', label: 'Edit', fullLabel: 'Edit Portfolio', href: '#edit', view: 'edit' as const }] : []),
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
            aria-label="Vincent Yuan · Home"
          >
            <div className="relative flex items-center justify-center -rotate-1 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105">
              <HankoStamp className="h-9 w-9 transition-all duration-300" />
            </div>
          </a>
        </div>

        {/* Center: Desktop Navigation: Shown on wide screens (>= xl / 1280px) with adaptive spacing */}
        <nav className="hidden xl:flex items-center gap-2.5 2xl:gap-5 min-w-0">
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
                className={`group relative font-sans text-[11px] 2xl:text-xs uppercase tracking-wider 2xl:tracking-widest transition-colors flex items-center gap-1.5 py-1 whitespace-nowrap ${
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

        {/* Right side cluster: always neatly aligned without overlapping */}
        <div className="flex items-center gap-2 sm:gap-2.5 2xl:gap-3 shrink-0">
          {/* Day / Night segmented toggle */}
          <div className="flex items-center p-0.5 rounded-full bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border text-[10px] sm:text-[11px] select-none shrink-0 shadow-2xs">
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

          {/* Contact CTA (shown on sm-lg; hidden on xl to prevent navbar crowding, shown on 2xl where there's ample room) */}
          <a
            href="#contact"
            onClick={(e) => {
              if (onOpenContact) {
                e.preventDefault();
                onOpenContact();
              }
            }}
            className="hidden sm:inline-flex xl:hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium tracking-wide bg-light-button-dark dark:bg-dark-button-light text-light-on-dark dark:text-dark-on-light hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
          >
            <span>Get in Touch</span>
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
              <div className="hidden xl:block absolute right-0 top-full mt-2 w-48 bg-light-surface-card dark:bg-[#181920] border border-light-border dark:border-[#2D3039] rounded-xl shadow-xl overflow-hidden py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
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
                ) : isVisitor ? (
                  <>
                    <div className="px-4 py-1.5 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                      Visitor · Read-Only
                    </div>
                    <button
                      onClick={() => {
                        setDesktopDropdownOpen(false);
                        onNavigate?.('projects');
                      }}
                      className="w-full text-left px-4 py-2 font-sans text-xs text-light-ink dark:text-dark-ink hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised hover:text-terracotta transition-colors cursor-pointer"
                    >
                      View Projects
                    </button>
                    <div className="mx-3 my-1 border-t border-light-border dark:border-dark-border" />
                    <button
                      onClick={() => {
                        setDesktopDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-left px-4 py-2 font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised hover:text-red-400 transition-colors cursor-pointer"
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
                  <span className="font-medium">{item.fullLabel || item.label}</span>
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
                Get in Touch
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
