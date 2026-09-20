import React, { useState, useEffect } from 'react';
import {
  Trash2,
  ChevronDown,
  ChevronRight,
  Compass,
  ScrollText,
  RotateCcw,
} from 'lucide-react';
import { supabase, formatErrorMessage, withTimeout } from '../../../lib/supabase';
import {
  useSiteData,
  OriginStoryConfig,
  OriginMilestone,
  DEFAULT_ORIGIN_STORY,
} from '../../../context/SiteDataContext';
import { CornerBrackets } from '../../CornerBrackets';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { EmblemKanjiSelector } from '../shared/EmblemKanjiSelector';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { toast } from 'sonner';

interface PillarEntry {
  position: number;
  kanji: string;
  romaji: string;
  title: string;
  tag: string;
  description: string;
}

const newPillar = (pos: number): PillarEntry => ({
  position: pos,
  kanji: pos === 1 ? '間' : pos === 2 ? '匠' : '侘',
  romaji: pos === 1 ? 'MA' : pos === 2 ? 'SHOKUNIN' : 'WABI-SABI',
  title: '',
  tag: '',
  description: '',
});

export const PhilosophyEditor: React.FC = () => {
  const { pillars: contextPillars, profile: contextProfile, refresh } = useSiteData();

  // Collapsible cards state: both start closed by default
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    origin: true,
    pillars: true,
  });

  const toggle = (section: string) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Origin Trajectory state
  const [originData, setOriginData] = useState<OriginStoryConfig>(() => {
    return contextProfile?.origin_story || DEFAULT_ORIGIN_STORY;
  });

  // Pillars state
  const [pillars, setPillars] = useState<PillarEntry[]>(() => {
    if (Array.isArray(contextPillars) && contextPillars.length > 0) {
      return contextPillars.map((p) => ({
        position: p.position,
        kanji: p.kanji || '',
        romaji: p.romaji || '',
        title: p.title || '',
        tag: p.tag || '',
        description: p.description || '',
      }));
    }
    return [];
  });

  const [saveState, setSaveState] = useState<SaveState>('idle');

  // Sync from context
  useEffect(() => {
    if (contextProfile?.origin_story) {
      setOriginData(contextProfile.origin_story);
    }
  }, [contextProfile]);

  useEffect(() => {
    if (Array.isArray(contextPillars)) {
      setPillars(
        contextPillars.map((p) => ({
          position: p.position,
          kanji: p.kanji || '',
          romaji: p.romaji || '',
          title: p.title || '',
          tag: p.tag || '',
          description: p.description || '',
        })),
      );
    }
  }, [contextPillars]);

  const notifyDirty = () => {
    window.dispatchEvent(new CustomEvent('portfolio-admin-dirty', { detail: { dirty: true } }));
  };

  const notifyClean = () => {
    window.dispatchEvent(new CustomEvent('portfolio-admin-clean'));
  };

  // Keyboard save listener
  useEffect(() => {
    const handleGlobalSave = () => handleSave();
    window.addEventListener('portfolio-admin-save', handleGlobalSave);
    return () => window.removeEventListener('portfolio-admin-save', handleGlobalSave);
  }, [pillars, originData]);

  // Origin Story updaters
  const updateOrigin = (patch: Partial<OriginStoryConfig>) => {
    notifyDirty();
    setOriginData((prev) => ({ ...prev, ...patch }));
  };

  const updateMilestone = (index: number, patch: Partial<OriginMilestone>) => {
    notifyDirty();
    setOriginData((prev) => {
      const currentList = prev.milestones || DEFAULT_ORIGIN_STORY.milestones!;
      const updated = currentList.map((m, idx) => (idx === index ? { ...m, ...patch } : m));
      return { ...prev, milestones: updated };
    });
  };

  const resetOriginToDefault = () => {
    notifyDirty();
    setOriginData(DEFAULT_ORIGIN_STORY);
    toast.info('Origin story reset to default draft. Click Save to persist.');
  };

  // Pillar updaters
  const updatePillar = (pos: number, patch: Partial<PillarEntry>) => {
    notifyDirty();
    setPillars((prev) =>
      prev.map((p) => (p.position === pos ? { ...p, ...patch } : p)),
    );
  };

  const addPillar = () => {
    if (pillars.length >= 3) {
      toast.info('Maximum 3 philosophy pillars allowed for homepage layout.');
      return;
    }
    notifyDirty();
    const created = newPillar(pillars.length + 1);
    setPillars((prev) => [...prev, created]);
  };

  const deletePillar = (pos: number) => {
    if (pillars.length <= 1) {
      toast.error('You must keep at least 1 philosophy pillar.');
      return;
    }
    notifyDirty();
    const remaining = pillars
      .filter((p) => p.position !== pos)
      .map((p, idx) => ({ ...p, position: idx + 1 }));
    setPillars(remaining);
    toast.success('Pillar removed. Click Save to persist.');
  };

  const handleSave = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');

    try {
      if (!supabase) throw new Error('Supabase not configured');

      const rows = pillars.map((p, idx) => ({
        position: idx + 1,
        kanji: p.kanji || '',
        romaji: p.romaji || '',
        title: p.title || '',
        tag: p.tag || '',
        description: p.description || '',
        updated_at: new Date().toISOString(),
      }));

      try {
        localStorage.setItem('portfolio_origin_story_override', JSON.stringify(originData));
        localStorage.setItem('portfolio_pillars_cache', JSON.stringify(rows));
      } catch {}

      await withTimeout(
        (async () => {
          // 1. Save pillars to philosophy_pillars table
          const { error: delErr } = await supabase
            .from('philosophy_pillars')
            .delete()
            .gt('position', rows.length);
          if (delErr) console.warn('Could not prune removed pillars:', delErr);

          if (rows.length > 0) {
            const { error: pillarErr } = await supabase
              .from('philosophy_pillars')
              .upsert(rows, { onConflict: 'position' });
            if (pillarErr) throw pillarErr;
          }

          // 2. Save origin_story to profile table
          try {
            const { error: profileErr } = await supabase
              .from('profile')
              .update({
                origin_story: originData,
                updated_at: new Date().toISOString(),
              })
              .eq('id', 1);

            if (profileErr) {
              if (profileErr.code === '42703' || profileErr.message?.includes('origin_story')) {
                console.warn('origin_story column not in database yet; cached locally in localStorage');
              } else {
                console.warn('Profile origin_story update warning:', profileErr);
              }
            }
          } catch (pErr) {
            console.warn('Origin story save caught exception:', pErr);
          }
        })(),
        15000,
        'Save request timed out. Please check your network and try again.'
      );

      await refresh();
      notifyClean();
      setSaveState('success');
      toast.success('Philosophy & Origin Story saved & synced to homepage!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      setSaveState('error');
      toast.error('Failed to save philosophy: ' + formatErrorMessage(err));
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  const milestoneList = originData.milestones || DEFAULT_ORIGIN_STORY.milestones!;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Universal Section Header */}
      <EditorSectionHeader
        title="Origin Trajectory & Philosophy"
        subtitle="Manage your 4-phase personal engineering journey and the 3 architectural pillars on the homepage."
        saveState={saveState}
        onSave={handleSave}
        saveLabel="Save All Changes"
        onAdd={pillars.length < 3 ? addPillar : undefined}
        addLabel="Add Pillar"
      />

      {/* Collapsible Card 1: Origin Trajectory Narrative */}
      <div className="rounded-xl border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-[#181920] shadow-xs classical-card-frame overflow-hidden transition-colors">
        <CornerBrackets size="sm" />
        <button
          type="button"
          onClick={() => toggle('origin')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-light-surface/50 dark:hover:bg-dark-surface-raised/50 transition-colors cursor-pointer select-none"
          aria-expanded={!collapsed.origin}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-light-surface-raised dark:bg-dark-surface-muted border border-light-border dark:border-dark-border flex items-center justify-center text-terracotta shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono text-xs sm:text-sm font-semibold text-light-ink dark:text-dark-ink tracking-wide uppercase">
                Origin Trajectory &amp; Journey (原点と軌跡)
              </h3>
              <p className="font-sans text-[11px] text-light-ink-muted dark:text-dark-ink-muted hidden sm:block">
                4-phase engineering journey from logic puzzles and game loops to distributed systems and hospitality empathy.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!collapsed.origin ? (
              <ChevronDown className="w-4 h-4 text-terracotta" />
            ) : (
              <ChevronRight className="w-4 h-4 text-light-ink-subtle" />
            )}
          </div>
        </button>

        {!collapsed.origin && (
          <div className="p-4 sm:p-6 pt-2 sm:pt-2 space-y-6 border-t border-light-border/60 dark:border-dark-border/60">
            {/* Header & Reset row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-light-ink-muted dark:text-dark-ink-muted">
                Narrative Header &amp; Lead
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetOriginToDefault}
                className="text-[11px] font-mono h-7 text-light-ink-subtle hover:text-terracotta cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset to Default Story
              </Button>
            </div>

            {/* Headline */}
            <div>
              <Label className="text-[11px] font-mono uppercase tracking-wider text-light-ink-muted dark:text-dark-ink-muted mb-1 block">
                Narrative Headline
              </Label>
              <Input
                value={originData.headline || ''}
                onChange={(e) => updateOrigin({ headline: e.target.value })}
                placeholder="From Logic Puzzles to Full-Stack Systems"
                className="font-serif text-sm font-medium h-9"
              />
            </div>

            {/* Lead Narrative Paragraph */}
            <div>
              <Label className="text-[11px] font-mono uppercase tracking-wider text-light-ink-muted dark:text-dark-ink-muted mb-1 block">
                Origin Lead Paragraph
              </Label>
              <Textarea
                rows={3}
                value={originData.leadParagraph || ''}
                onChange={(e) => updateOrigin({ leadParagraph: e.target.value })}
                placeholder="Explain the spark, curiosity, and human principles behind your engineering path…"
                className="text-xs leading-relaxed font-light"
              />
            </div>

            {/* 4 Milestones */}
            <div className="space-y-4 pt-2 border-t border-light-border/60 dark:border-dark-border/60">
              <Label className="text-[11px] font-mono uppercase tracking-wider text-light-ink-muted dark:text-dark-ink-muted block">
                Four Trajectory Milestones (Phases 01 - 04)
              </Label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {milestoneList.map((milestone, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-light-surface/60 dark:bg-dark-surface-raised/40 border border-light-border/70 dark:border-dark-border/70 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Input
                        value={milestone.era}
                        onChange={(e) => updateMilestone(idx, { era: e.target.value })}
                        placeholder={`PHASE 0${idx + 1}`}
                        className="w-28 font-mono font-bold text-terracotta text-xs h-8 uppercase"
                      />
                      <Input
                        value={milestone.tag || ''}
                        onChange={(e) => updateMilestone(idx, { tag: e.target.value })}
                        placeholder="ERA TAG"
                        className="w-32 font-mono text-[11px] text-right h-8 uppercase"
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        value={milestone.title}
                        onChange={(e) => updateMilestone(idx, { title: e.target.value })}
                        placeholder="Milestone Title"
                        className="font-serif font-medium text-xs h-8"
                      />
                      <Input
                        value={milestone.subtitle || ''}
                        onChange={(e) => updateMilestone(idx, { subtitle: e.target.value })}
                        placeholder="Subtitle (e.g. Technology or Context)"
                        className="text-xs text-light-ink-muted dark:text-dark-ink-muted h-8"
                      />
                      <Textarea
                        rows={3}
                        value={milestone.description}
                        onChange={(e) => updateMilestone(idx, { description: e.target.value })}
                        placeholder="Milestone description…"
                        className="text-xs leading-relaxed font-light min-h-[75px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collapsible Card 2: Core Philosophy Pillars */}
      <div className="rounded-xl border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-[#181920] shadow-xs classical-card-frame overflow-hidden transition-colors">
        <CornerBrackets size="sm" />
        <button
          type="button"
          onClick={() => toggle('pillars')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-light-surface/50 dark:hover:bg-dark-surface-raised/50 transition-colors cursor-pointer select-none"
          aria-expanded={!collapsed.pillars}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-light-surface-raised dark:bg-dark-surface-muted border border-light-border dark:border-dark-border flex items-center justify-center text-terracotta shrink-0">
              <ScrollText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono text-xs sm:text-sm font-semibold text-light-ink dark:text-dark-ink tracking-wide uppercase">
                Architectural Philosophy Pillars (三つの信条)
              </h3>
              <p className="font-sans text-[11px] text-light-ink-muted dark:text-dark-ink-muted hidden sm:block">
                Up to 3 core architectural tenets displayed as cards in the Japanese Bento on the homepage.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-light-ink-subtle px-2 py-0.5 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
              {pillars.length}/3 PILLARS
            </span>
            {!collapsed.pillars ? (
              <ChevronDown className="w-4 h-4 text-terracotta" />
            ) : (
              <ChevronRight className="w-4 h-4 text-light-ink-subtle" />
            )}
          </div>
        </button>

        {!collapsed.pillars && (
          <div className="p-4 sm:p-6 pt-2 sm:pt-2 space-y-6 border-t border-light-border/60 dark:border-dark-border/60">
            {/* Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {pillars.map((pillar) => (
                <div
                  key={pillar.position}
                  className="relative rounded-xl border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-[#181920] p-5 sm:p-6 space-y-4 shadow-xs classical-card-frame flex flex-col justify-between overflow-hidden"
                >
                  <CornerBrackets size="sm" />

                  <div className="space-y-4.5">
                    {/* Header Pill & Delete */}
                    <div className="flex items-center justify-between">
                      <Badge variant="terracotta" className="font-mono text-xs px-2.5 py-0.5 font-semibold">
                        PILLAR 0{pillar.position}
                      </Badge>
                      {pillars.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deletePillar(pillar.position)}
                          className="p-1.5 text-light-ink-subtle hover:text-red-500 rounded-md hover:bg-light-surface dark:hover:bg-[#20222a] transition-colors cursor-pointer"
                          title="Delete pillar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Universal Emblem Kanji Selector */}
                    <EmblemKanjiSelector
                      kanji={pillar.kanji}
                      kanjiSubtitle={pillar.romaji}
                      onKanjiChange={(char, romaji) =>
                        updatePillar(pillar.position, { kanji: char, romaji: romaji || pillar.romaji })
                      }
                      onKanjiSubtitleChange={(romaji) => updatePillar(pillar.position, { romaji })}
                      showLogoOption={false}
                      label="Kanji Concept Character"
                    />

                    {/* Title & Tag */}
                    <div>
                      <Label htmlFor={`pillar-${pillar.position}-title`} required>
                        Pillar Title
                      </Label>
                      <Input
                        id={`pillar-${pillar.position}-title`}
                        value={pillar.title}
                        onChange={(e) => updatePillar(pillar.position, { title: e.target.value })}
                        placeholder="e.g. Negative Space & Intentionality"
                        className="mt-1 font-serif text-sm font-medium"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`pillar-${pillar.position}-tag`} className="text-xs font-medium">
                        Category Tag
                      </Label>
                      <Input
                        id={`pillar-${pillar.position}-tag`}
                        value={pillar.tag}
                        onChange={(e) => updatePillar(pillar.position, { tag: e.target.value })}
                        placeholder="e.g. ARCHITECTURE · SPATIAL HARMONY"
                        className="mt-1 text-xs font-mono uppercase"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`pillar-${pillar.position}-desc`} className="text-xs font-medium">
                        Philosophical Narrative
                      </Label>
                      <Textarea
                        id={`pillar-${pillar.position}-desc`}
                        rows={5}
                        value={pillar.description}
                        onChange={(e) => updatePillar(pillar.position, { description: e.target.value })}
                        placeholder="Explain how this Japanese aesthetic principle informs your engineering and software craft…"
                        className="mt-1 text-xs leading-relaxed min-h-[96px]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {pillars.length === 0 && (
                <div className="col-span-3 text-center py-12 border border-dashed border-light-border dark:border-dark-border rounded-xl bg-light-surface/30 dark:bg-dark-surface/30">
                  <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted">
                    No philosophy pillars defined. Click "+ Add Pillar" above to create one.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
