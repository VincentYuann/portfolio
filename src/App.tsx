import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/hero/Hero';
import { VariantProvider } from './context/VariantContext';
import { WashiProvider } from './context/WashiContext';

const ThemedToaster = lazy(() => import('./components/layout/ThemedToaster').then((m) => ({ default: m.ThemedToaster })));

import {
  ProjectsPageSkeleton,
  HobbiesPageSkeleton,
  ResumePageSkeleton,
  AdminStudioSkeleton,
  LoginPageSkeleton,
  DefaultPageSkeleton,
} from './components/common/Skeletons';

// Route-level and below-the-fold code-splitting (drastically reduces initial bundle size and TBT)
const ExperienceSection = lazy(() => import('./components/sections/experience/ExperienceSection').then((m) => ({ default: m.ExperienceSection })));
const ProjectsShowcase = lazy(() => import('./components/sections/projects/ProjectsShowcase').then((m) => ({ default: m.ProjectsShowcase })));
const PhilosophyBento = lazy(() => import('./components/sections/philosophy/PhilosophyBento').then((m) => ({ default: m.PhilosophyBento })));
const HobbiesSection = lazy(() => import('./components/sections/hobbies/HobbiesSection').then((m) => ({ default: m.HobbiesSection })));
const ContactSection = lazy(() => import('./components/sections/contact/ContactSection').then((m) => ({ default: m.ContactSection })));
const Footer = lazy(() => import('./components/layout/Footer').then((m) => ({ default: m.Footer })));

const ProjectsPage = lazy(() => import('./components/sections/projects/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const ResumePage = lazy(() => import('./components/sections/resume/ResumePage').then((m) => ({ default: m.ResumePage })));
const HobbiesPage = lazy(() => import('./components/sections/hobbies/HobbiesPage').then((m) => ({ default: m.HobbiesPage })));
const LoginPage = lazy(() => import('./components/sections/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const EditPage = lazy(() => import('./components/admin/AdminStudio').then((m) => ({ default: m.AdminStudio })));
const VisualSystemPage = lazy(() => import('./components/sections/visual-system/VisualSystemPage').then((m) => ({ default: m.VisualSystemPage })));
const AiChatWidget = lazy(() => import('./components/common/AiChatWidget').then((m) => ({ default: m.AiChatWidget })));

export type ViewMode = 'home' | 'projects' | 'resume' | 'login' | 'edit' | 'hobbies' | 'visual-system';

const SKELETON_COMPONENTS: Record<string, React.FC> = {
  projects: ProjectsPageSkeleton,
  hobbies: HobbiesPageSkeleton,
  resume: ResumePageSkeleton,
  edit: AdminStudioSkeleton,
  login: LoginPageSkeleton,
  'visual-system': DefaultPageSkeleton,
};

const RouteLoadingFallback: React.FC<{ currentView?: ViewMode }> = ({ currentView }) => {
  const Component = (currentView && SKELETON_COMPONENTS[currentView]) || DefaultPageSkeleton;
  return <Component />;
};

const HASH_TO_VIEW_MAP: Record<string, ViewMode> = {
  '#resume': 'resume',
  '#cv': 'resume',
  '#projects': 'projects',
  '#all-projects': 'projects',
  '#archive': 'projects',
  '#hobbies': 'hobbies',
  '#all-hobbies': 'hobbies',
  '#hobbies-archive': 'hobbies',
  '#visual-system': 'visual-system',
  '#design-system': 'visual-system',
  '#typography': 'visual-system',
  '#styles': 'visual-system',
  '#login': 'login',
  '#edit': 'edit',
};

const VIEW_TO_HASH_MAP: Record<ViewMode, string> = {
  home: '#home',
  projects: '#all-projects',
  resume: '#resume',
  hobbies: '#all-hobbies',
  'visual-system': '#visual-system',
  login: '#login',
  edit: '#edit',
};

const getInitialView = (): ViewMode => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.toLowerCase();
  if (hash.startsWith('#project-')) return 'projects';
  return HASH_TO_VIEW_MAP[hash] || 'home';
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
      {/* 
        PARALLAX SCROLLING LAYERING: THE DIVISION EFFECT
        The Hero section above has a fixed pinned backdrop.
        This lower product showcase container is a heavy, independent craft surface
        (bg-light-canvas dark:bg-[#1E1F24]) that mask-slides straight over the hero on scroll.
      */}
      <div className="division-showcase-container relative z-20 w-full bg-light-canvas dark:bg-dark-canvas shadow-[0_-24px_50px_rgba(43,46,58,0.08)] dark:shadow-[0_-28px_60px_rgba(0,0,0,0.65)] transition-colors duration-300">
        <Suspense fallback={<div className="min-h-[40vh]" />}>
          {hasExperiences && (
            <ExperienceSection onNavigate={onNavigate} />
          )}
          {hasProjects && (
            <ProjectsShowcase onNavigate={onNavigate} />
          )}
          {hasPhilosophy && (
            <PhilosophyBento />
          )}
          {hasHobbies && (
            <HobbiesSection onNavigate={onNavigate} />
          )}
          <ContactSection />
        </Suspense>
      </div>
    </>
  );
};

export const App: React.FC = () => {
  const isDevAdmin = Boolean(import.meta.env.DEV && typeof window !== 'undefined' && window.sessionStorage?.getItem('dev_admin') === 'true');
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
    if (import.meta.env.DEV && typeof window !== 'undefined' && window.sessionStorage?.getItem('dev_admin') === 'true') {
      return true;
    }
    const email = session?.user?.email?.toLowerCase()?.trim();
    // Strict authentication: only trust verified top-level auth.user.email
    return !!email && email === ADMIN_EMAIL;
  };

  /* -- Supabase auth listener: single subscription, strict admin verification -- */
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    import('./lib/supabase').then(async ({ supabase }) => {
      if (!supabase) {
        authReadyRef.current = true;
        setAuthReady(true);
        if (getInitialView() === 'edit') {
          setCurrentView('home');
          window.history.replaceState(null, '', '#home');
        }
        return;
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
                const { toast } = await import('sonner');
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
          const { toast } = await import('sonner');
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

      unsubscribe = () => subscription.unsubscribe();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  /* -- URL hash routing -- */
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();

      // Ignore OAuth callback hashes (contain access_token)
      if (hash.includes('access_token') || hash.includes('type=signup') || hash.includes('type=recovery')) {
        return;
      }

      if (hash.startsWith('#project-')) {
        setViewRef.current((prev) => {
          if (prev === 'projects' || prev === 'home') return prev;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return 'projects';
        });
        return;
      }

      const targetView = HASH_TO_VIEW_MAP[hash];

      if (targetView === 'edit') {
        if (isAdminRef.current) {
          setViewRef.current('edit');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (authReadyRef.current) {
          import('sonner').then(({ toast }) => {
            toast.warning('Visitor Access Only', {
              description: "You're logged in as a visitor, not an admin. You can only view projects.",
              duration: 5000,
            });
          });
          setViewRef.current('projects');
          window.history.replaceState(null, '', '#all-projects');
        } else {
          setViewRef.current('edit');
        }
      } else if (targetView) {
        setViewRef.current(targetView);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!hash || hash === '#home' || hash === '#') {
        setViewRef.current('home');
      }
    };

    handleHashChange(); // Run once on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); // ← empty deps: no re-runs from state changes

  const handleNavigate = (view: ViewMode, sectionId?: string) => {
    // Guard: edit is only accessible when admin
    if (view === 'edit' && authReadyRef.current && !isAdminRef.current) {
      import('sonner').then(({ toast }) => {
        toast.warning('Visitor Access Only', {
          description: "You're logged in as a visitor, not an admin. You can only view projects.",
          duration: 5000,
        });
      });
      handleNavigate('projects');
      return;
    }

    setCurrentView(view);

    const targetHash = sectionId ? `#${sectionId}` : VIEW_TO_HASH_MAP[view] || '#home';
    window.location.hash = targetHash;

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
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage?.removeItem('dev_admin');
    }
    setIsAdmin(false);
    isAdminRef.current = false;
    const { supabase } = await import('./lib/supabase');
    const { toast } = await import('sonner');
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
      <WashiProvider>
        <VariantProvider>
          <SiteDataProvider>
          <div className="min-h-screen bg-light-canvas dark:bg-dark-canvas text-light-ink dark:text-dark-ink transition-colors duration-300 flex flex-col selection:bg-terracotta/20 selection:text-terracotta dark:selection:bg-[#D4A853]/25 dark:selection:text-[#D4A853] overflow-x-clip">
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

                  {currentView === 'visual-system' && (
                    <VisualSystemPage onNavigate={handleNavigate} />
                  )}

                  {currentView === 'home' && (
                    <HomeView onNavigate={handleNavigate} />
                  )}
                </div>
              </Suspense>
            </main>

            {currentView === 'home' && (
              <Suspense fallback={null}>
                <Footer onNavigate={handleNavigate} />
              </Suspense>
            )}
          </div>
          <Suspense fallback={null}>
            <AiChatWidget onNavigate={handleNavigate} isAdmin={isAdmin} />
          </Suspense>
          <Suspense fallback={null}>
            <ThemedToaster />
          </Suspense>
        </SiteDataProvider>
      </VariantProvider>
    </WashiProvider>
  </ThemeProvider>
);
};

export default App;
