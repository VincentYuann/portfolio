import React, { useState, useEffect } from 'react';
import { Plus, Trash2, User, Globe, Mail, Github, Linkedin } from 'lucide-react';
import { supabase, formatErrorMessage, withTimeout } from '../../../lib/supabase';
import { useSiteData, CapabilityPillar } from '../../../context/SiteDataContext';
import { CornerBrackets } from '../../CornerBrackets';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { TechTagSelector } from '../shared/TechTagSelector';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { toast } from 'sonner';

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

  // Sync from context
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

  const notifyDirty = () => {
    window.dispatchEvent(new CustomEvent('portfolio-admin-dirty', { detail: { dirty: true } }));
  };

  const notifyClean = () => {
    window.dispatchEvent(new CustomEvent('portfolio-admin-clean'));
  };

  // Global save listener
  useEffect(() => {
    const handleGlobalSave = () => handleSave();
    window.addEventListener('portfolio-admin-save', handleGlobalSave);
    return () => window.removeEventListener('portfolio-admin-save', handleGlobalSave);
  }, [data]);

  const set = (key: string, val: string) => {
    notifyDirty();
    setData((prev) => ({ ...prev, [key]: val }));
  };

  const getPillarTags = (pillar: CapabilityPillar): string[] => {
    if (Array.isArray(pillar.tags) && pillar.tags.length > 0) return pillar.tags;
    if (!pillar.items) return [];
    return pillar.items.split(/[\s·,]+/).map((s) => s.trim()).filter(Boolean);
  };

  const updatePillar = (idx: number, patch: Partial<CapabilityPillar>) => {
    notifyDirty();
    setData((prev) => {
      const next = [...prev.capability_pillars];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, capability_pillars: next };
    });
  };

  const addPillar = () => {
    if (data.capability_pillars.length >= 3) return;
    notifyDirty();
    setData((prev) => ({
      ...prev,
      capability_pillars: [
        ...prev.capability_pillars,
        { label: 'SYSTEMS', items: 'Rust · Docker', tags: ['Rust', 'Docker'] },
      ],
    }));
  };

  const removePillar = (idx: number) => {
    notifyDirty();
    setData((prev) => ({
      ...prev,
      capability_pillars: prev.capability_pillars.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');

    try {
      if (!supabase) throw new Error('Supabase not configured');

      await withTimeout(
        (async () => {
          const { error } = await supabase
            .from('profile')
            .upsert({ id: 1, ...data, updated_at: new Date().toISOString() });
          if (error) throw error;
        })(),
        15000,
        'Save request timed out. Please check your network and try again.'
      );

      await refresh();
      notifyClean();
      setSaveState('success');
      toast.success('Intro & profile changes saved to Supabase!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      setSaveState('error');
      toast.error('Failed to save profile: ' + formatErrorMessage(err));
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Universal Section Header */}
      <EditorSectionHeader
        title="Intro & Profile Identity"
        subtitle="Manage hero narrative headline, biography statement, and social links."
        saveState={saveState}
        onSave={handleSave}
        saveLabel="Save Profile"
      />

      {/* Form Container */}
      <div className="relative bg-light-surface-card dark:bg-[#181920] border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-7 space-y-6 shadow-xs classical-card-frame">
        <CornerBrackets size="md" />

        {/* Identity & Seal Card */}
        <div className="space-y-3">
          <p className="font-mono text-xs font-semibold text-terracotta uppercase tracking-widest flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-ochre" />
            <span>Identity &amp; Display Name</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="intro-name" required>Display Name</Label>
              <Input
                id="intro-name"
                type="text"
                value={data.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Vincent Yuan"
                className="mt-1 font-serif text-sm font-medium"
              />
            </div>
            <div>
              <Label htmlFor="intro-role">Role Headline / Craft Specialization</Label>
              <Input
                id="intro-role"
                type="text"
                value={data.role}
                onChange={(e) => set('role', e.target.value)}
                placeholder="Distributed Systems & Creative Technologist"
                className="mt-1 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Hero Headline & Tagline */}
        <div className="space-y-3 pt-3 border-t border-light-border/60 dark:border-dark-border/60">
          <p className="font-mono text-xs font-semibold text-terracotta uppercase tracking-widest">
            Hero Narrative &amp; Statement
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="intro-headline" className="text-xs font-medium">
                Headline (Hero Statement)
              </Label>
              <Textarea
                id="intro-headline"
                rows={2}
                value={data.headline}
                onChange={(e) => set('headline', e.target.value)}
                placeholder="Bridging Distributed Computing and Japanese Aesthetic Craft…"
                className="mt-1 font-serif text-sm leading-snug"
              />
            </div>
            <div>
              <Label htmlFor="intro-tagline" className="text-xs font-medium">
                Biography Narrative Tagline
              </Label>
              <Textarea
                id="intro-tagline"
                rows={3}
                value={data.tagline}
                onChange={(e) => set('tagline', e.target.value)}
                placeholder="Comprehensive narrative paragraph placed directly below the hero headline…"
                className="mt-1 text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="space-y-3 pt-3 border-t border-light-border/60 dark:border-dark-border/60">
          <p className="font-mono text-xs font-semibold text-terracotta uppercase tracking-widest flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-ochre" />
            <span>Contact &amp; Public Social Links</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="intro-email" className="text-xs font-medium flex items-center gap-1">
                <Mail className="w-3 h-3 text-light-ink-muted" />
                <span>Email Address</span>
              </Label>
              <Input
                id="intro-email"
                type="email"
                value={data.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="vincent@example.com"
                className="mt-1 text-xs font-mono"
              />
            </div>
            <div>
              <Label htmlFor="intro-github" className="text-xs font-medium flex items-center gap-1">
                <Github className="w-3 h-3 text-light-ink-muted" />
                <span>GitHub Profile</span>
              </Label>
              <Input
                id="intro-github"
                type="url"
                value={data.github}
                onChange={(e) => set('github', e.target.value)}
                placeholder="https://github.com/..."
                className="mt-1 text-xs font-mono"
              />
            </div>
            <div>
              <Label htmlFor="intro-linkedin" className="text-xs font-medium flex items-center gap-1">
                <Linkedin className="w-3 h-3 text-light-ink-muted" />
                <span>LinkedIn Profile</span>
              </Label>
              <Input
                id="intro-linkedin"
                type="url"
                value={data.linkedin}
                onChange={(e) => set('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="mt-1 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Capability Domains Ribbon */}
        <div className="space-y-3 pt-3 border-t border-light-border/60 dark:border-dark-border/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs font-semibold text-terracotta uppercase tracking-widest">
                Technical Domains Ribbon (Max 3)
              </p>
              <p className="font-sans text-[11px] text-light-ink-muted dark:text-dark-ink-muted">
                These tags display in the architectural badge strip beneath your hero section.
              </p>
            </div>
            {data.capability_pillars.length < 3 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addPillar}
                className="text-terracotta hover:text-terracotta hover:bg-terracotta/10 text-xs h-7 px-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Domain
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {data.capability_pillars.map((p, idx) => {
              const currentTags = getPillarTags(p);
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border/70 dark:border-dark-border/70 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 max-w-sm">
                      <Label className="text-[11px] font-mono uppercase tracking-wider text-light-ink-muted dark:text-dark-ink-muted mb-1 block">
                        Domain Category
                      </Label>
                      <Input
                        value={p.label}
                        onChange={(e) => updatePillar(idx, { label: e.target.value.toUpperCase() })}
                        placeholder="DOMAIN (e.g. SYSTEMS, CLOUD)"
                        className="font-mono uppercase text-xs h-8"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePillar(idx)}
                      className="p-1.5 text-light-ink-subtle hover:text-red-500 rounded transition-colors cursor-pointer self-end mb-0.5"
                      title="Remove domain"
                      aria-label="Remove domain"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <TechTagSelector
                    tags={currentTags}
                    onChange={(tags) =>
                      updatePillar(idx, {
                        tags,
                        items: tags.join(' · '),
                      })
                    }
                    label="Technologies & Substrates"
                  />
                </div>
              );
            })}

            {data.capability_pillars.length === 0 && (
              <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted italic py-1">
                No domain ribbons added. Click "+ Add Domain" above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
