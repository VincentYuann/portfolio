import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase, formatErrorMessage, getOAuthRedirectUrl } from '../../../lib/supabase';
import { HankoStamp } from '../../common/HankoStamp';
import { CornerBrackets } from '../../common/CornerBrackets';
import { toast } from 'sonner';
import { ViewMode } from '../../../App';

interface LoginPageProps {
  onNavigate: (view: ViewMode) => void;
  isVisitor?: boolean;
  onLogout?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, isVisitor = false, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGithubLogin = async () => {
    if (!supabase) {
      const msg = 'Supabase is not configured.';
      setError(msg);
      toast.error(msg);
      return;
    }
    setLoading(true);
    setError('');
    const redirectUrl = getOAuthRedirectUrl();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl,
      },
    });
    if (authError) {
      const msg = formatErrorMessage(authError);
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
    // On success Supabase redirects the page; the auth listener in App.tsx handles navigation.
  };

  return (
    <div className="min-h-screen bg-light-canvas dark:bg-dark-canvas flex flex-col items-center justify-center px-6 relative">
      {/* Authentic Hanko Stamp Brand Header */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="relative p-2 flex items-center justify-center animate-seal-breathe">
          <HankoStamp className="w-18 h-18 sm:w-20 sm:h-20" char="原" />
        </div>
        <span className="font-serif text-2xl text-light-ink dark:text-dark-ink tracking-wide font-medium">
          Vincent Yuan
        </span>
        <span className="font-sans text-[11px] font-semibold text-terracotta dark:text-ochre uppercase tracking-widest">
          ADMIN ACCESS · 認印
        </span>
      </div>

      {/* Login Card with Japanese Double Hairline Frame & Corner Brackets */}
      <div className="interactive-card relative w-full max-w-sm bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-8 shadow-akari dark:shadow-night-glow flex flex-col gap-5 classical-card-frame">
        <CornerBrackets size="md" />

        <h1 className="font-serif text-lg text-light-ink dark:text-dark-ink text-center">
          {isVisitor ? 'Visitor Mode Active' : 'Sign in to edit'}
        </h1>

        {isVisitor ? (
          <div className="space-y-4 text-center">
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-sans text-left space-y-1">
              <p className="font-semibold text-xs flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                Signed in as Visitor
              </p>
              <p className="text-[11px] opacity-90 leading-relaxed font-light">
                You currently have read-only visitor access. Only the portfolio owner can access the edit studio.
              </p>
            </div>

            <button
              onClick={() => onNavigate('projects')}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-medium tracking-wide transition-colors cursor-pointer shadow-xs"
            >
              View Projects
            </button>

            <div className="pt-2 border-t border-light-border dark:border-dark-border flex items-center justify-between text-xs">
              <button
                onClick={handleGithubLogin}
                disabled={loading}
                className="text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors text-[11px] font-mono cursor-pointer"
              >
                Switch Account
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-light-ink-muted dark:text-dark-ink-muted hover:text-red-400 transition-colors text-[11px] font-mono cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={handleGithubLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg bg-[#24292e] dark:bg-[#202228] hover:bg-[#1a1e22] dark:hover:bg-[#2a2d36] text-white border border-transparent dark:border-dark-border font-sans text-sm font-medium tracking-wide transition-all duration-200 shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {/* GitHub SVG icon */}
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              {loading ? 'Redirecting…' : 'Continue with GitHub'}
            </button>

            {error && (
              <p className="font-sans text-xs text-red-500 dark:text-red-400 text-center">{error}</p>
            )}
          </>
        )}

        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center justify-center gap-2 font-mono text-xs text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Portfolio</span>
        </button>
      </div>
    </div>
  );
};
