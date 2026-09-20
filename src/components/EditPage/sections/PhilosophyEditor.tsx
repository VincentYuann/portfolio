import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase, formatErrorMessage, withTimeout } from '../../../lib/supabase';
import { useSiteData } from '../../../context/SiteDataContext';
import { CornerBrackets } from '../../CornerBrackets';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { EmblemKanjiSelector } from '../shared/EmblemKanjiSelector';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
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
  const { pillars: contextPillars, refresh } = useSiteData();
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
  }, [pillars]);

  const update = (pos: number, patch: Partial<PillarEntry>) => {
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

      await withTimeout(
        (async () => {
          const { error: delErr } = await supabase
            .from('philosophy_pillars')
            .delete()
            .gt('position', rows.length);
          if (delErr) console.warn('Could not prune removed pillars:', delErr);

          if (rows.length > 0) {
            const { error } = await supabase
              .from('philosophy_pillars')
              .upsert(rows, { onConflict: 'position' });
            if (error) throw error;
          }
        })(),
        15000,
        'Save request timed out. Please check your network and try again.'
      );

      await refresh();
      notifyClean();
      setSaveState('success');
      toast.success('Philosophy pillars saved & synced to homepage!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      setSaveState('error');
      toast.error('Failed to save philosophy: ' + formatErrorMessage(err));
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Universal Section Header */}
      <EditorSectionHeader
        title="Philosophy & Architectural Pillars"
        subtitle="Up to 3 core tenets mapped directly to the Japanese Bento on the homepage."
        saveState={saveState}
        onSave={handleSave}
        saveLabel="Save Pillars"
        onAdd={pillars.length < 3 ? addPillar : undefined}
        addLabel="Add Pillar"
      />

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
                onKanjiChange={(char, romaji) => update(pillar.position, { kanji: char, romaji: romaji || pillar.romaji })}
                onKanjiSubtitleChange={(romaji) => update(pillar.position, { romaji })}
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
                  onChange={(e) => update(pillar.position, { title: e.target.value })}
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
                  onChange={(e) => update(pillar.position, { tag: e.target.value })}
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
                  onChange={(e) => update(pillar.position, { description: e.target.value })}
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
  );
};
