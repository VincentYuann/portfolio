import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/hero/Hero';
import { SectionDivider } from './components/common/SectionDivider';
import { ExperienceSection } from './components/sections/experience/ExperienceSection';
import { ProjectsShowcase } from './components/sections/projects/ProjectsShowcase';
import { PhilosophyBento } from './components/sections/philosophy/PhilosophyBento';
import { HobbiesSection } from './components/sections/hobbies/HobbiesSection';
import { ContactSection } from './components/sections/contact/ContactSection';
import { Footer } from './components/layout/Footer';
import { supabase } from './lib/supabase';
import { toast } from 'sonner';
import { ThemedToaster } from './components/layout/ThemedToaster';
import { AiChatWidget } from './components/common/AiChatWidget';
import { TooltipProvider } from './components/ui/tooltip';

import {
  ProjectsPageSkeleton,
  HobbiesPageSkeleton,
  ResumePageSkeleton,
  AdminStudioSkeleton,
  LoginPageSkeleton,
  DefaultPageSkeleton,
} from './components/common/Skeletons';

// Route-level code-splitting for non-critical views (drastically reduces initial bundle size)
const ProjectsPage = lazy(() => import('./components/sections/projects/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const ResumePage = lazy(() => import('./components/sections/resume/ResumePage').then((m) => ({ default: m.ResumePage })));
const HobbiesPage = lazy(() => import('./components/sections/hobbies/HobbiesPage').then((m) => ({ default: m.HobbiesPage })));
const LoginPage = lazy(() => import('./components/sections/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const EditPage = lazy(() => import('./components/admin/AdminStudio').then((m) => ({ default: m.AdminStudio })));

export type ViewMode = 'home' | 'projects' | 'resume' | 'login' | 'edit' | 'hobbies';

const RouteLoadingFallback: React.FC<{ currentView?: ViewMode }> = ({ currentView }) => {
  switch (currentView) {
    case 'projects':
      return <ProjectsPageSkeleton />;
    case 'hobbies':
      return <HobbiesPageSkeleton />;
    case 'resume':
      return <ResumePageSkeleton />;
    case 'edit':
      return <AdminStudioSkeleton />;
    case 'login':
      return <LoginPageSkeleton />;
    default:
      return <DefaultPageSkeleton />;
  }
};

const getInitialView = (): ViewMode => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.toLowerCase();
  if (hash === '#resume' || hash === '#cv') return 'resume';
  if (hash === '#all-projects' || hash === '#projects' || hash === '#archive') return 'projects';
  if (hash === '#all-hobbies' || hash === '#hobbies-archive') return 'hobbies';
  if (hash === '#login') return 'login';
  if (hash === '#edit') return 'edit';
  return 'home';
};

const HomeView: React.FC<{ onNavigate: (view: ViewMode, sectionId?: string) => void }> = ({ onNavigate }) => {
  const { experiences, projects, pillars, profile, hobbies } = useSiteData();
  const hasExperiences = Array.isArray(experiences) && experiences.length > 0;
  const hasProjects = Array.isArray(projects) && projects.length > 0;
  const hasPhilosophy = (Array.isArray(pillars) && pillars.length > 0) || Boolean(profile?.origin_story);
  const hasHobbies = Array.isArray(hobbies) && hobbies.length > 0;

  return (
    <>
      <Hero onNavigate={onNavigate} />
      {hasExperiences && (
        <>
          <SectionDivider label="CAREER TRAJECTORY · 職歴" shortLabel="CAREER · 職歴" />
          <ExperienceSection onNavigate={onNavigate} />
        </>
      )}
      {hasProjects && (
        <>
          <SectionDivider label="SELECTED PORTFOLIO · 作品" shortLabel="PORTFOLIO · 作品" />
          <ProjectsShowcase onNavigate={onNavigate} />
        </>
      )}
      {hasPhilosophy && (
        <>
          <SectionDivider label="ORIGIN & PHILOSOPHY · 原点と哲学" shortLabel="PHILOSOPHY · 哲学" />
          <PhilosophyBento />
        </>
      )}
      {hasHobbies && (
        <>
          <SectionDivider label="HOBBIES & INTERESTS · 趣味と日常" shortLabel="HOBBIES · 趣味" />
          <HobbiesSection onNavigate={onNavigate} />
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
  const [isVisitor, setIsVisitor] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Stable refs so hash routing effect never needs to re-run on state changes
  const isAdminRef = useRef(isDevAdmin);
  const isVisitorRef = useRef(false);
  const authReadyRef = useRef(false);
  const setViewRef = useRef(setCurrentView);
  setViewRef.current = setCurrentView;

  const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'vincentyuan1020@gmail.com').toLowerCase().trim();

  const isOwnerSession = (session: any): boolean => {
    if (typeof window !== 'undefined' && window.sessionStorage?.getItem('dev_admin') === 'true') {
      return true;
    }
    const email = session?.user?.email?.toLowerCase()?.trim();
    const metaEmail = session?.user?.user_metadata?.email?.toLowerCase()?.trim();
    const userName = (session?.user?.user_metadata?.user_name || session?.user?.user_metadata?.preferred_username || '')?.toLowerCase()?.trim();

    return (
      (!!email && email === ADMIN_EMAIL) ||
      (!!metaEmail && metaEmail === ADMIN_EMAIL) ||
      (!!userName && userName === 'vincentyuann')
    );
  };

  /* -- Supabase auth listener: single subscription, strict admin verification -- */
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
      const isVisitorUser = Boolean(session?.user && !isOwner);
      isAdminRef.current = isOwner;
      isVisitorRef.current = isVisitorUser;
      setIsAdmin(isOwner);
      setIsVisitor(isVisitorUser);
      authReadyRef.current = true;
      setAuthReady(true);

      if (event === 'INITIAL_SESSION') {
        const hash = window.location.hash.toLowerCase();
        if (hash === '#edit') {
          if (isOwner) {
            setViewRef.current('edit');
          } else {
            if (isVisitorUser) {
              toast.info('Visitor Access Only', {
                description: "You're logged in as a visitor, not an admin. You can only view projects.",
                duration: 5000,
              });
            }
            setViewRef.current('projects');
            window.history.replaceState(null, '', '#all-projects');
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
          // Logged in as a visitor (non-admin)
          toast.info('Logged in as Visitor', {
            description: "You're logged in as a visitor, not an admin. You can only view projects.",
            duration: 6000,
          });
          // Redirect from login or edit view to projects
          setViewRef.current('projects');
          window.history.replaceState(null, '', '#all-projects');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (event === 'TOKEN_REFRESHED') {
        isAdminRef.current = isOwner;
        isVisitorRef.current = isVisitorUser;
        setIsAdmin(isOwner);
        setIsVisitor(isVisitorUser);
      } else if (event === 'SIGNED_OUT') {
        isAdminRef.current = false;
        isVisitorRef.current = false;
        setIsAdmin(false);
        setIsVisitor(false);
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

  /* -- URL hash routing -- */
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
      } else if (hash === '#all-hobbies' || hash === '#hobbies-archive') {
        setViewRef.current('hobbies');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#login') {
        setViewRef.current('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#edit') {
        if (isAdminRef.current) {
          setViewRef.current('edit');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (authReadyRef.current) {
          toast.warning('Visitor Access Only', {
            description: "You're logged in as a visitor, not an admin. You can only view projects.",
            duration: 5000,
          });
          setViewRef.current('projects');
          window.history.replaceState(null, '', '#all-projects');
        } else {
          // Auth is still hydrating: keep 'edit' view and let auth listener decide
          setViewRef.current('edit');
        }
      } else if (hash === '' || hash === '#home' || hash === '#') {
        setViewRef.current('home');
      }
      // Any unrecognised hash (e.g. section anchors like #contact): do nothing
    };

    handleHashChange(); // Run once on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); // ← empty deps: no re-runs from state changes

  const handleNavigate = (view: ViewMode, sectionId?: string) => {
    // Guard: edit is only accessible when admin
    if (view === 'edit' && authReadyRef.current && !isAdminRef.current) {
      toast.warning('Visitor Access Only', {
        description: "You're logged in as a visitor, not an admin. You can only view projects.",
        duration: 5000,
      });
      handleNavigate('projects');
      return;
    }

    setCurrentView(view);

    if (view === 'resume') {
      window.location.hash = '#resume';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'projects') {
      window.location.hash = '#all-projects';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'hobbies') {
      window.location.hash = '#all-hobbies';
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
      <TooltipProvider delayDuration={200}>
        <SiteDataProvider>
          <div className="min-h-screen bg-light-canvas dark:bg-dark-canvas text-light-ink dark:text-dark-ink washi-pattern transition-colors duration-300 flex flex-col selection:bg-terracotta/20 selection:text-terracotta">
            <Header
              currentView={currentView}
              onNavigate={handleNavigate}
              onOpenContact={() => handleNavigate('home', 'contact')}
              isAdmin={isAdmin}
              isVisitor={isVisitor}
              onLogout={handleLogout}
            />

            <main className="flex-1 w-full">
              <Suspense fallback={<RouteLoadingFallback currentView={currentView} />}>
                {currentView === 'login' && (
                  <LoginPage onNavigate={handleNavigate} isVisitor={isVisitor} onLogout={handleLogout} />
                )}

                <div key={currentView} className="animate-view-enter w-full">
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

                  {currentView === 'hobbies' && (
                    <HobbiesPage onNavigate={handleNavigate} />
                  )}

                  {currentView === 'home' && (
                    <HomeView onNavigate={handleNavigate} />
                  )}
                </div>
              </Suspense>
            </main>

            {currentView === 'home' && <Footer onNavigate={handleNavigate} />}
          </div>
          <AiChatWidget onNavigate={handleNavigate} isAdmin={isAdmin} />
          <ThemedToaster />
        </SiteDataProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
