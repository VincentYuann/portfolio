import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus,
  Trash2,
  Mail,
  Github,
  Linkedin,
  ChevronDown,
  ChevronRight,
  BookOpen,
  GraduationCap,
  MapPin,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import { supabase, formatErrorMessage, withTimeout } from '../../../lib/supabase';
import {
  useSiteData,
  CapabilityPillar,
  parsePillarTags,
  HankoCardConfig,
} from '../../../context/SiteDataContext';
import { HankoStamp } from '../../common/HankoStamp';
import { KanjiPickerModal } from '../modals/KanjiPickerModal';
import { CornerBrackets } from '../../common/CornerBrackets';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { TechTagSelector } from '../shared/TechTagSelector';
import { useAdminDirty } from '../shared/useAdminDirty';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { toast } from 'sonner';

interface IntroData {
  name: string;
  role: string;
  headline: string;
  tagline: string;
  email: string;
  github: string;
  linkedin: string;
  capability_pillars: CapabilityPillar[];
  hanko_card: HankoCardConfig;
}

const mapProfileToIntroData = (profile: any): IntroData => ({
  name: profile?.name || '',
  role: profile?.role || '',
  headline: profile?.headline || '',
  tagline: profile?.tagline || '',
  email: profile?.email || '',
  github: profile?.github || '',
  linkedin: profile?.linkedin || '',
  capability_pillars:
    Array.isArray(profile?.capability_pillars)
      ? profile.capability_pillars
      : [],
  hanko_card: profile?.hanko_card || {
    headerLabel: '',
    locationArchive: '',
    stampCharacter: '',
    statusBadge: '',
    lines: [],
  },
});

export const IntroEditor: React.FC = () => {
  const { profile: contextProfile, refresh } = useSiteData();
  const [data, setData] = useState(() => mapProfileToIntroData(contextProfile));

  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    left_canvas: false,
    right_plaque: false,
  });
  const [kanjiModalOpen, setKanjiModalOpen] = useState(false);

  const toggle = (section: string) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const resetIntro = useCallback(() => {
    if (contextProfile) {
      setData(mapProfileToIntroData(contextProfile));
    }
  }, [contextProfile]);

  // Sync from context
  useEffect(() => {
    resetIntro();
  }, [resetIntro]);

  const handleSaveRef = useRef<() => void>(() => {});

  const { notifyDirty, notifyClean } = useAdminDirty('intro', resetIntro, () => {
    handleSaveRef.current();
  });

  const set = (key: string, val: string) => {
    notifyDirty();
    setData((prev) => ({ ...prev, [key]: val }));
  };

  const getPillarTags = (pillar: CapabilityPillar): string[] => {
    return parsePillarTags(pillar);
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

  const updateHanko = (patch: Partial<HankoCardConfig>) => {
    notifyDirty();
    setData((prev) => ({
      ...prev,
      hanko_card: {
        ...(prev.hanko_card || {}),
        ...patch,
      },
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
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', 1);
          if (error) {
            // Graceful fallback if hanko_card column does not exist in Postgres yet
            if (error.code === '42703' || error.message?.includes('hanko_card')) {
              const { hanko_card, ...rest } = data as any;
              const retry = await supabase
                .from('profile')
                .update({ ...rest, updated_at: new Date().toISOString() })
                .eq('id', 1);
              if (retry.error) throw retry.error;
              if (hanko_card) {
                try {
                  localStorage.setItem('portfolio_hanko_card_override', JSON.stringify(hanko_card));
                } catch {}
              }
            } else {
              throw error;
            }
          }
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

  handleSaveRef.current = handleSave;

  const hankoData = data.hanko_card || { lines: [] };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Universal Section Header */}
      <EditorSectionHeader
        title="Intro & Profile Identity"
        subtitle="Configure the hero headline, technical domain shelves, and recruiter profile credentials."
        saveState={saveState}
        onSave={handleSave}
        saveLabel="Save Profile"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* CARD 1: Left Hero Canvas (Headline & Technical Domain Shelves) */}
        <div className="relative bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-xl shadow-xs classical-card-frame overflow-hidden">
          <CornerBrackets size="sm" />
          <button
            type="button"
            onClick={() => toggle('left_canvas')}
            className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-light-surface/40 dark:hover:bg-dark-surface/40 transition-colors cursor-pointer select-none text-left"
            aria-expanded={!collapsed.left_canvas}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-light-surface-raised dark:bg-dark-surface-muted border border-light-border dark:border-dark-border flex items-center justify-center text-terracotta dark:text-ochre shrink-0">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-mono text-xs sm:text-sm font-semibold text-light-ink dark:text-dark-ink tracking-wide uppercase">
                  Left Canvas · Headline &amp; Domains
                </h3>
                <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted hidden sm:block">
                  Primary hero statement and technical domain shelves.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-light-ink dark:text-dark-ink font-semibold px-2 py-0.5 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                {data.capability_pillars.length}/3 DOMAINS
              </span>
              {!collapsed.left_canvas ? (
                <ChevronDown className="w-4 h-4 text-terracotta dark:text-ochre" />
              ) : (
                <ChevronRight className="w-4 h-4 text-light-ink-subtle" />
              )}
            </div>
          </button>

          {!collapsed.left_canvas && (
            <div className="p-4 sm:p-6 pt-2 sm:pt-2 space-y-6 border-t border-light-border/60 dark:border-dark-border/60">
              {/* Primary Headline Input */}
              <div className="space-y-1.5">
                <Label htmlFor="intro-headline" className="text-xs font-semibold text-light-ink dark:text-dark-ink">
                  Headline (Hero Statement)
                </Label>
                <Textarea
                  id="intro-headline"
                  rows={3}
                  value={data.headline}
                  onChange={(e) => set('headline', e.target.value)}
                  placeholder="Building resilient full-stack systems and intelligent web applications…"
                  className="font-serif text-sm leading-relaxed"
                />
              </div>

              {/* Technical Domains Ribbon Configuration */}
              <div className="pt-4 border-t border-light-border/40 dark:border-dark-border/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-semibold text-light-ink dark:text-dark-ink uppercase tracking-wider">
                    Technical Domain Shelves (Max 3)
                  </h4>
                  {data.capability_pillars.length < 3 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addPillar}
                      className="text-terracotta dark:text-ochre hover:text-terracotta dark:hover:text-ochre hover:bg-terracotta/10 dark:hover:bg-ochre/10 text-xs h-7 px-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add Domain
                    </Button>
                  )}
                </div>

                <div className="space-y-4 divide-y divide-light-border/50 dark:divide-dark-border/50">
                  {data.capability_pillars.map((p, idx) => {
                    const currentTags = getPillarTags(p);
                    return (
                      <div key={idx} className="pt-4 first:pt-0 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 max-w-sm">
                            <Label className="text-xs font-medium text-light-ink dark:text-dark-ink mb-1 block">
                              Domain Category Title
                            </Label>
                            <Input
                              value={p.label}
                              onChange={(e) => updatePillar(idx, { label: e.target.value.toUpperCase() })}
                              placeholder="DOMAIN (e.g. FRONTEND & UI)"
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
                      No domain shelves configured. Click "+ Add Domain" above.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CARD 2: Right Profile Plaque (Recruiter Credentials, Hanko Seal, Channels) */}
        <div className="relative bg-light-surface-card dark:bg-dark-surface-card border border-light-border dark:border-dark-border rounded-xl shadow-xs classical-card-frame overflow-hidden">
          <CornerBrackets size="sm" />
          <button
            type="button"
            onClick={() => toggle('right_plaque')}
            className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-light-surface/40 dark:hover:bg-dark-surface/40 transition-colors cursor-pointer select-none text-left"
            aria-expanded={!collapsed.right_plaque}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-light-surface-raised dark:bg-dark-surface-muted border border-light-border dark:border-dark-border flex items-center justify-center text-terracotta dark:text-ochre shrink-0">
                <HankoStamp char={hankoData.stampCharacter || '原'} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-mono text-xs sm:text-sm font-semibold text-light-ink dark:text-dark-ink tracking-wide uppercase">
                  Right Profile Plaque · Recruiter Snapshot
                </h3>
                <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted hidden sm:block">
                  Personal credentials, institution, location, seal stamp, and contact channels.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!collapsed.right_plaque ? (
                <ChevronDown className="w-4 h-4 text-terracotta dark:text-ochre" />
              ) : (
                <ChevronRight className="w-4 h-4 text-light-ink-subtle" />
              )}
            </div>
          </button>

          {!collapsed.right_plaque && (
            <div className="p-4 sm:p-6 pt-2 sm:pt-2 space-y-5 border-t border-light-border/60 dark:border-dark-border/60">
              {/* Identity & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="intro-name" required className="text-xs font-semibold">Display Name</Label>
                  <Input
                    id="intro-name"
                    type="text"
                    value={data.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Vincent Yuan"
                    className="mt-1 font-serif text-sm font-medium h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="intro-role" className="text-xs font-semibold">Role Headline</Label>
                  <Input
                    id="intro-role"
                    type="text"
                    value={data.role}
                    onChange={(e) => set('role', e.target.value)}
                    placeholder="Full-Stack AI & Software Engineer"
                    className="mt-1 text-xs h-9"
                  />
                </div>
              </div>

              {/* Recruiter Credentials & Status */}
              <div className="space-y-3 pt-3 border-t border-light-border/40 dark:border-dark-border/40">
                <div>
                  <Label className="text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted mb-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />
                    <span>University &amp; Major</span>
                  </Label>
                  <Input
                    value={hankoData.headerLabel || ''}
                    onChange={(e) => updateHanko({ headerLabel: e.target.value })}
                    placeholder="Drexel University · CS & Math"
                    className="font-mono text-xs h-8"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />
                      <span>Location / City</span>
                    </Label>
                    <Input
                      value={hankoData.locationArchive || ''}
                      onChange={(e) => updateHanko({ locationArchive: e.target.value })}
                      placeholder="PHILADELPHIA, PA"
                      className="font-mono uppercase text-xs h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />
                      <span>Live Availability Status</span>
                    </Label>
                    <Input
                      value={hankoData.statusBadge || ''}
                      onChange={(e) => updateHanko({ statusBadge: e.target.value })}
                      placeholder="OPEN TO FULL-STACK ROLES"
                      className="font-mono uppercase text-xs h-8"
                    />
                  </div>
                </div>
              </div>

              {/* Hanko Stamp Character & Kanji Picker */}
              <div className="pt-3 border-t border-light-border/40 dark:border-dark-border/40">
                <Label className="text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted mb-1.5 block">
                  Hanko Seal Character (認印)
                </Label>
                <div className="flex items-center gap-2 max-w-sm">
                  <div className="w-9 h-9 rounded-lg bg-light-surface-raised dark:bg-dark-surface-muted border border-light-border dark:border-dark-border flex items-center justify-center text-terracotta dark:text-ochre shrink-0">
                    <HankoStamp char={hankoData.stampCharacter || '原'} className="w-6 h-6" />
                  </div>
                  <Input
                    value={hankoData.stampCharacter || ''}
                    onChange={(e) => updateHanko({ stampCharacter: e.target.value })}
                    placeholder="原 (or 鑑賞)"
                    maxLength={4}
                    className="font-serif text-sm h-9 flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setKanjiModalOpen(true)}
                    className="h-9 px-3 text-xs font-mono text-light-ink-muted hover:text-terracotta dark:hover:text-ochre border-light-border dark:border-dark-border cursor-pointer shrink-0"
                    title="Choose Kanji"
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1 text-terracotta dark:text-ochre" />
                    Picker
                  </Button>
                </div>
              </div>

              {/* Public Channels & Contact (Synced across Hero Card and Contact Section) */}
              <div className="pt-3 border-t border-light-border/40 dark:border-dark-border/40 space-y-2.5">
                <h4 className="font-mono text-xs font-semibold text-light-ink dark:text-dark-ink uppercase tracking-wider">
                  Direct Contact Channels
                </h4>
                <div className="space-y-2.5">
                  <div>
                    <Label htmlFor="intro-email" className="text-xs font-medium flex items-center gap-1.5 mb-1">
                      <Mail className="w-3.5 h-3.5 text-light-ink-muted" />
                      <span>Email Address</span>
                    </Label>
                    <Input
                      id="intro-email"
                      type="email"
                      value={data.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="vincent@example.com"
                      className="text-xs font-mono h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="intro-github" className="text-xs font-medium flex items-center gap-1.5 mb-1">
                      <Github className="w-3.5 h-3.5 text-light-ink-muted" />
                      <span>GitHub URL</span>
                    </Label>
                    <Input
                      id="intro-github"
                      type="url"
                      value={data.github}
                      onChange={(e) => set('github', e.target.value)}
                      placeholder="https://github.com/..."
                      className="text-xs font-mono h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="intro-linkedin" className="text-xs font-medium flex items-center gap-1.5 mb-1">
                      <Linkedin className="w-3.5 h-3.5 text-light-ink-muted" />
                      <span>LinkedIn URL</span>
                    </Label>
                    <Input
                      id="intro-linkedin"
                      type="url"
                      value={data.linkedin}
                      onChange={(e) => set('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="text-xs font-mono h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <KanjiPickerModal
        isOpen={kanjiModalOpen}
        selectedChar={hankoData.stampCharacter || '原'}
        onSelect={(char) => {
          updateHanko({ stampCharacter: char });
          setKanjiModalOpen(false);
        }}
        onClose={() => setKanjiModalOpen(false)}
      />
    </div>
  );
};
