import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, formatErrorMessage } from '../../../lib/supabase';
import { useSiteData } from '../../../context/SiteDataContext';
import { CornerBrackets } from '../../CornerBrackets';
import { Button } from '../../ui/button';
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
  kanji: '',
  romaji: '',
  title: '',
  tag: '',
  description: '',
});

type SaveState = 'idle' | 'saving' | 'success' | 'error';

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
  const [errorMsg, setErrorMsg] = useState('');

  // Sync from SiteDataContext when context data changes
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

  const update = (pos: number, patch: Partial<PillarEntry>) =>
    setPillars((prev) =>
      prev.map((p) => (p.position === pos ? { ...p, ...patch } : p)),
    );

  const addPillar = () => {
    if (pillars.length >= 3) return;
    setPillars((prev) => [...prev, newPillar(prev.length + 1)]);
  };

  const removePillar = (pos: number) => {
    const next = pillars
      .filter((p) => p.position !== pos)
      .map((p, idx) => ({ ...p, position: idx + 1 }));
    setPillars(next);
  };

  const handleSave = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');
    setErrorMsg('');

    try {
      if (!supabase) throw new Error('Supabase not configured');

      // Re-index positions 1, 2, 3
      const rows = pillars.map((p, idx) => ({
        position: idx + 1,
        kanji: p.kanji,
        romaji: p.romaji,
        title: p.title,
        tag: p.tag,
        description: p.description,
        updated_at: new Date().toISOString(),
      }));

      // Delete any existing pillars that are beyond our new length
      await supabase
        .from('philosophy_pillars')
        .delete()
        .gt('position', rows.length);

      if (rows.length > 0) {
        const { error } = await supabase
          .from('philosophy_pillars')
          .upsert(rows, { onConflict: 'position' });
        if (error) throw error;
      }

      await refresh();
      setSaveState('success');
      toast.success('Philosophy pillars updated & synced to homepage!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      const msg = formatErrorMessage(err);
      setErrorMsg(msg);
      setSaveState('error');
      toast.error(msg || 'Failed to save philosophy pillars.');
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-light-ink dark:text-dark-ink font-normal">
            Philosophy Pillars
          </h2>
          <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mt-1">
            Up to 3 architectural pillars. Maps directly to the Japanese Bento section on the homepage.
          </p>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap">
          {pillars.length < 3 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPillar}
              className="gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Pillar
            </Button>
          )}

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
                : 'Save Philosophy Pillars'}
            </span>
          </Button>
          {saveState === 'error' && errorMsg && (
            <p className="font-sans text-[11px] text-red-400 text-right w-full max-w-xs">
              {errorMsg}
            </p>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-5">
        {pillars.map((pillar, idx) => (
          <div
            key={pillar.position}
            className="relative bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-4 sm:p-6 shadow-xs classical-card-frame space-y-4"
          >
            <CornerBrackets size="sm" />
            <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-light-border/60 dark:border-dark-border/60">
              <div className="flex items-start sm:items-center gap-2 sm:gap-2.5 flex-1 min-w-0 flex-wrap">
                <Badge variant="terracotta" className="font-mono text-xs px-2 py-0.5 shrink-0">
                  PILLAR {String(idx + 1).padStart(2, '0')}
                </Badge>
                <span className="font-serif text-sm sm:text-base font-medium text-light-ink dark:text-dark-ink flex-1 min-w-0">
                  {pillar.kanji} · {pillar.romaji} — {pillar.title || 'Untitled Pillar'}
                </span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePillar(pillar.position)}
                className="h-8 w-8 p-0 text-light-ink-muted hover:text-red-500 hover:bg-red-500/10 shrink-0"
                title="Delete pillar"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="mb-1.5">Kanji (Japanese Symbol)</Label>
                <Input
                  type="text"
                  value={pillar.kanji}
                  onChange={(e) => update(pillar.position, { kanji: e.target.value })}
                  placeholder="e.g. 間"
                  className="font-serif text-base"
                />
              </div>
              <div>
                <Label className="mb-1.5">Romaji</Label>
                <Input
                  type="text"
                  value={pillar.romaji}
                  onChange={(e) => update(pillar.position, { romaji: e.target.value })}
                  placeholder="e.g. Ma"
                />
              </div>
              <div>
                <Label className="mb-1.5">English Title</Label>
                <Input
                  type="text"
                  value={pillar.title}
                  onChange={(e) => update(pillar.position, { title: e.target.value })}
                  placeholder="e.g. Intentional Space"
                  className="font-medium"
                />
              </div>
            </div>

            <div>
              <Label className="mb-1.5">Tagline (Category / Boundary)</Label>
              <Input
                type="text"
                value={pillar.tag}
                onChange={(e) => update(pillar.position, { tag: e.target.value })}
                placeholder="e.g. Uncluttered System Boundaries"
              />
            </div>

            <div>
              <Label className="mb-1.5">Description (Philosophical Tenet - Resizable)</Label>
              <Textarea
                rows={3}
                className="min-h-[85px] leading-relaxed"
                value={pillar.description}
                onChange={(e) => update(pillar.position, { description: e.target.value })}
                placeholder="Philosophy paragraph explaining this tenet…"
              />
            </div>
          </div>
        ))}
      </div>

      {pillars.length === 0 && (
        <div className="text-center py-16 text-light-ink-muted dark:text-dark-ink-muted font-sans text-sm rounded-xl border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface p-8">
          <p className="mb-3">No philosophy pillars configured.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPillar}
          >
            Add first pillar
          </Button>
        </div>
      )}
    </div>
  );
};
