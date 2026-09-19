import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase, formatErrorMessage } from '../../../lib/supabase';
import { useSiteData } from '../../../context/SiteDataContext';
import { CornerBrackets } from '../../CornerBrackets';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { toast } from 'sonner';

type SaveState = 'idle' | 'saving' | 'success' | 'error';

export const IntroEditor: React.FC = () => {
  const { profile: contextProfile, refresh } = useSiteData();
  const [data, setData] = useState(() => ({
    name: contextProfile?.name || '',
    role: contextProfile?.role || '',
    headline: contextProfile?.headline || '',
    tagline: contextProfile?.tagline || '',
    email: contextProfile?.email || '',
    github: contextProfile?.github || '',
    linkedin: contextProfile?.linkedin || '',
    capability_pillars:
      Array.isArray(contextProfile?.capability_pillars)
        ? contextProfile.capability_pillars
        : [],
  }));

  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync from SiteDataContext when context data changes
  useEffect(() => {
    if (contextProfile) {
      setData({
        name: contextProfile.name || '',
        role: contextProfile.role || '',
        headline: contextProfile.headline || '',
        tagline: contextProfile.tagline || '',
        email: contextProfile.email || '',
        github: contextProfile.github || '',
        linkedin: contextProfile.linkedin || '',
        capability_pillars:
          Array.isArray(contextProfile.capability_pillars)
            ? contextProfile.capability_pillars
            : [],
      });
    }
  }, [contextProfile]);

  const set = (key: string, val: string) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const updatePillar = (idx: number, patch: Partial<{ label: string; items: string }>) => {
    setData((prev) => {
      const next = [...prev.capability_pillars];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, capability_pillars: next };
    });
  };

  const addPillar = () => {
    if (data.capability_pillars.length >= 3) return;
    setData((prev) => ({
      ...prev,
      capability_pillars: [
        ...prev.capability_pillars,
        { label: '', items: '' },
      ],
    }));
  };

  const removePillar = (idx: number) =>
    setData((prev) => ({
      ...prev,
      capability_pillars: prev.capability_pillars.filter((_, i) => i !== idx),
    }));

  const handleSave = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');
    setErrorMsg('');

    try {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase
        .from('profile')
        .upsert({ id: 1, ...data, updated_at: new Date().toISOString() });

      if (error) throw error;

      await refresh();
      setSaveState('success');
      toast.success('Intro & profile changes saved to Supabase!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      const msg = formatErrorMessage(err);
      setErrorMsg(msg);
      setSaveState('error');
      toast.error(msg || 'Failed to save intro & profile.');
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-light-ink dark:text-dark-ink font-normal">
            Intro &amp; Profile
          </h2>
          <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mt-1">
            Edits the hero section, seal card, and contact links on the homepage.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap">
          <Button
            type="button"
            variant={
              saveState === 'success'
                ? 'secondary'
                : saveState === 'error'
                ? 'destructive'
                : 'default'
            }
            size="sm"
            disabled={saveState === 'saving'}
            onClick={handleSave}
            className="gap-2"
          >
            {saveState === 'saving' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saveState === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-bamboo" />}
            {saveState === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
            {saveState === 'idle' && <Save className="w-3.5 h-3.5" />}
            <span>
              {saveState === 'saving'
                ? 'Saving…'
                : saveState === 'success'
                ? 'Saved to DB'
                : saveState === 'error'
                ? 'Retry'
                : 'Save All'}
            </span>
          </Button>
          {saveState === 'error' && errorMsg && (
            <p className="font-sans text-[11px] text-red-400 max-w-xs text-right w-full">
              {errorMsg}
            </p>
          )}
        </div>
      </div>

      {/* Form Card */}
      <div className="relative bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 shadow-xs classical-card-frame">
        <CornerBrackets size="md" />

        {/* Identity */}
        <div className="space-y-3">
          <p className="font-mono text-xs font-semibold text-terracotta uppercase tracking-widest">
            § Identity &amp; Seal Card
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5">Display Name</Label>
              <Input
                type="text"
                value={data.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Your full name"
                className="font-medium"
              />
            </div>
            <div>
              <Label className="mb-1.5">Role / Subtitle</Label>
              <Input
                type="text"
                value={data.role}
                onChange={(e) => set('role', e.target.value)}
                placeholder="e.g. Software & Generative AI Engineer"
                className="font-medium"
              />
            </div>
          </div>
        </div>

        {/* Hero Text */}
        <div className="space-y-3 pt-2 border-t border-light-border/60 dark:border-dark-border/60">
          <p className="font-mono text-xs font-semibold text-terracotta uppercase tracking-widest">
            § Hero Section Text
          </p>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5">Headline (H1 - Resizable)</Label>
              <Textarea
                rows={2}
                className="min-h-[64px] font-serif text-base"
                value={data.headline}
                onChange={(e) => set('headline', e.target.value)}
                placeholder="Main hero heading…"
              />
            </div>
            <div>
              <Label className="mb-1.5">Body Paragraph (Tagline - Resizable)</Label>
              <Textarea
                rows={3}
                className="min-h-[84px] leading-relaxed"
                value={data.tagline}
                onChange={(e) => set('tagline', e.target.value)}
                placeholder="Narrative paragraph below headline…"
              />
            </div>
          </div>
        </div>

        {/* Contact Links */}
        <div className="space-y-3 pt-2 border-t border-light-border/60 dark:border-dark-border/60">
          <p className="font-mono text-xs font-semibold text-terracotta uppercase tracking-widest">
            § Contact Links
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="mb-1.5">Email</Label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label className="mb-1.5">GitHub URL</Label>
              <Input
                type="url"
                value={data.github}
                onChange={(e) => set('github', e.target.value)}
                placeholder="https://github.com/…"
              />
            </div>
            <div>
              <Label className="mb-1.5">LinkedIn URL</Label>
              <Input
                type="url"
                value={data.linkedin}
                onChange={(e) => set('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/…"
              />
            </div>
          </div>
        </div>

        {/* Capability Pillars */}
        <div className="space-y-3 pt-2 border-t border-light-border/60 dark:border-dark-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-mono text-xs font-semibold text-terracotta uppercase tracking-widest">
                § Capability Pillars (DOMAINS Ribbon - max 3)
              </p>
              <p className="font-sans text-[11px] text-light-ink-muted dark:text-dark-ink-muted">
                These appear as the technical domains ribbon in your Hero section.
              </p>
            </div>
            {data.capability_pillars.length < 3 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addPillar}
                className="text-terracotta hover:text-terracotta hover:bg-terracotta/10 text-xs h-7 self-start sm:self-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Pillar
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {data.capability_pillars.map((p, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full p-2.5 sm:p-0 rounded-lg bg-light-surface/40 sm:bg-transparent dark:bg-dark-surface/40 sm:dark:bg-transparent border sm:border-0 border-light-border/50 dark:border-dark-border/50"
              >
                {/* Pillar Label Input */}
                <Input
                  type="text"
                  className="w-full sm:w-40 shrink-0 font-mono uppercase text-xs"
                  value={p.label}
                  onChange={(e) => updatePillar(idx, { label: e.target.value })}
                  placeholder="LABEL (e.g. SYSTEMS)"
                />

                {/* Pillar Items Input */}
                <Input
                  type="text"
                  className="flex-1 min-w-0 text-xs sm:text-sm"
                  value={p.items}
                  onChange={(e) => updatePillar(idx, { items: e.target.value })}
                  placeholder="Tech · Stack · Items (e.g. Rust · Docker · Linux)"
                />

                {/* Trash Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePillar(idx)}
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-light-ink-muted hover:text-red-500 hover:bg-red-500/10 shrink-0 self-end sm:self-center"
                  title="Remove pillar"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {data.capability_pillars.length === 0 && (
              <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted italic py-2">
                No capability pillars added.{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={addPillar}
                  className="text-terracotta p-0 h-auto"
                >
                  Add one
                </Button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
