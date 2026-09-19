import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SectionDivider } from './components/SectionDivider';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { PhilosophyBento } from './components/PhilosophyBento';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectsPage } from './components/ProjectsPage';
import { ResumePage } from './components/ResumePage';
import { LoginPage } from './components/LoginPage';
import { EditPage } from './components/EditPage';
import { supabase } from './lib/supabase';
import { toast } from 'sonner';
import { ThemedToaster } from './components/ThemedToaster';

export type ViewMode = 'home' | 'projects' | 'resume' | 'login' | 'edit';

const getInitialView = (): ViewMode => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.toLowerCase();
  if (hash === '#resume' || hash === '#cv') return 'resume';
  if (hash === '#all-projects' || hash === '#projects' || hash === '#archive') return 'projects';
  if (hash === '#login') return 'login';
  if (hash === '#edit') return 'edit';
  return 'home';
};

const HomeView: React.FC<{ onNavigate: (view: ViewMode, sectionId?: string) => void }> = ({ onNavigate }) => {
  const { experiences, projects, pillars } = useSiteData();
  const hasExperiences = Array.isArray(experiences) && experiences.length > 0;
  const hasProjects = Array.isArray(projects) && projects.length > 0;
  const hasPillars = Array.isArray(pillars) && pillars.length > 0;

  return (
    <>
      <Hero onNavigate={onNavigate} />
      {hasExperiences && (
        <>
          <SectionDivider label="CAREER TRAJECTORY · 職歴 · MILESTONES" shortLabel="CAREER · 職歴" />
          <ExperienceSection onNavigate={onNavigate} />
        </>
      )}
      {hasProjects && (
        <>
          <SectionDivider label="MA · WABI-SABI · CRAFT" shortLabel="CRAFT · 作品" />
          <ProjectsShowcase onNavigate={onNavigate} />
        </>
      )}
      {hasPillars && (
        <>
          <SectionDivider label="PHILOSOPHY · SHOKUNIN · MA" shortLabel="PHILOSOPHY · 哲学" />
          <PhilosophyBento />
        </>
      )}
      <SectionDivider label="INITIATE A DIALOGUE · 対話" shortLabel="DIALOGUE · 対話" />
      <ContactSection />
    </>
  );
};

export const App: React.FC = () => {
  const isDevAdmin = typeof window !== 'undefined' && window.sessionStorage?.getItem('dev_admin') === 'true';
  const [currentView, setCurrentView] = useState<ViewMode>(getInitialView);
  const [isAdmin, setIsAdmin] = useState(isDevAdmin);
  const [authReady, setAuthReady] = useState(false);

  // Stable refs so hash routing effect never needs to re-run on state changes
  const isAdminRef = useRef(isDevAdmin);
  const authReadyRef = useRef(false);
  const setViewRef = useRef(setCurrentView);
  setViewRef.current = setCurrentView;

  const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'vincentyuan1020@gmail.com').toLowerCase().trim();

  const isOwnerSession = (session: any): boolean => {
    if (typeof window !== 'undefined' && window.sessionStorage?.getItem('dev_admin') === 'true') {
      return true;
    }
    const email = session?.user?.email?.toLowerCase()?.trim();
    return !!email && email === ADMIN_EMAIL;
  };

  /* ── Supabase auth listener — single subscription, strict admin verification ── */
  useEffect(() => {
    if (!supabase) {
      authReadyRef.current = true;
      setAuthReady(true);
      if (getInitialView() === 'edit') {
        setCurrentView('home');
        window.history.replaceState(null, '', '#home');
      }
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isOwner = isOwnerSession(session);
      isAdminRef.current = isOwner;
      setIsAdmin(isOwner);
      authReadyRef.current = true;
      setAuthReady(true);

      if (event === 'INITIAL_SESSION') {
        const hash = window.location.hash.toLowerCase();
        if (hash === '#edit') {
          if (isOwner) {
            setViewRef.current('edit');
          } else {
            setViewRef.current('home');
            window.history.replaceState(null, '', '#home');
          }
        }
      } else if (event === 'SIGNED_IN') {
        if (isOwner) {
          toast.success('Welcome back, Vincent! Admin mode unlocked.');
          // If the user signed in directly from the login page, take them to home
          if (window.location.hash.toLowerCase() === '#login') {
            setViewRef.current('home');
            window.history.replaceState(null, '', '#home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          // Unauthorized user logged in — revoke and reject
          supabase?.auth.signOut();
          if (window.location.hash.toLowerCase() === '#edit') {
            setViewRef.current('home');
            window.history.replaceState(null, '', '#home');
          }
          toast.error('Access Denied: Only the portfolio owner is authorized to access the edit dashboard.');
        }
      } else if (event === 'TOKEN_REFRESHED') {
        // Token refreshed in background: update admin flags without interfering with active view
        isAdminRef.current = isOwner;
        setIsAdmin(isOwner);
      } else if (event === 'SIGNED_OUT') {
        isAdminRef.current = false;
        setIsAdmin(false);
        setViewRef.current((prev) => {
          if (prev === 'edit') {
            window.history.replaceState(null, '', '#home');
            return 'home';
          }
          return prev;
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── URL hash routing ── */
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();

      // Ignore OAuth callback hashes (contain access_token)
      if (hash.includes('access_token') || hash.includes('type=signup') || hash.includes('type=recovery')) {
        return;
      }

      if (hash === '#resume' || hash === '#cv') {
        setViewRef.current('resume');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#all-projects' || hash === '#projects' || hash === '#archive') {
        setViewRef.current('projects');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#login') {
        setViewRef.current('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#edit') {
        if (isAdminRef.current) {
          setViewRef.current('edit');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (authReadyRef.current) {
          // Only boot to home if auth check has finished and user is not admin
          setViewRef.current('home');
          window.history.replaceState(null, '', '#home');
        } else {
          // Auth is still hydrating: keep 'edit' view and let auth listener decide
          setViewRef.current('edit');
        }
      } else if (hash === '' || hash === '#home' || hash === '#') {
        setViewRef.current('home');
      }
      // Any unrecognised hash (e.g. section anchors like #contact) — do nothing
    };

    handleHashChange(); // Run once on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); // ← empty deps: no re-runs from state changes

  const handleNavigate = (view: ViewMode, sectionId?: string) => {
    // Guard: edit is only accessible when admin (or while auth check is in flight)
    if (view === 'edit' && authReadyRef.current && !isAdminRef.current) return;

    setCurrentView(view);

    if (view === 'resume') {
      window.location.hash = '#resume';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'projects') {
      window.location.hash = '#all-projects';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'login') {
      window.location.hash = '#login';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'edit') {
      window.location.hash = '#edit';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = sectionId ? `#${sectionId}` : '#home';
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      toast.info('Signed out successfully.');
    } catch {
      toast.error('Failed to sign out.');
    }
  };

  return (
    <ThemeProvider>
      <SiteDataProvider>
        <div className="min-h-screen bg-light-canvas dark:bg-dark-canvas text-light-ink dark:text-dark-ink washi-pattern transition-colors duration-300 flex flex-col selection:bg-terracotta/20 selection:text-terracotta">
          <Header
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenContact={() => handleNavigate('home', 'contact')}
            isAdmin={isAdmin}
            onLogout={handleLogout}
          />

          <main className="flex-1 w-full">
            {currentView === 'login' && (
              <LoginPage onNavigate={handleNavigate} />
            )}

            {currentView === 'edit' && (
              isAdmin ? (
                <EditPage onNavigate={handleNavigate} />
              ) : !authReady ? (
                <div className="min-h-screen flex items-center justify-center pt-20">
                  <div className="text-center font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted">
                    Verifying authorization…
                  </div>
                </div>
              ) : null
            )}

            {currentView === 'resume' && (
              <ResumePage onNavigate={handleNavigate} />
            )}

            {currentView === 'projects' && (
              <ProjectsPage onNavigate={handleNavigate} />
            )}

            {currentView === 'home' && (
              <HomeView onNavigate={handleNavigate} />
            )}
          </main>

          {currentView === 'home' && <Footer onNavigate={handleNavigate} />}
        </div>
        <ThemedToaster />
      </SiteDataProvider>
    </ThemeProvider>
  );
};

export default App;
