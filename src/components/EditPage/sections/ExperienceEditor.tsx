import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, CheckCircle2, AlertCircle, GripVertical, Loader2 } from 'lucide-react';
import { supabase, formatErrorMessage } from '../../../lib/supabase';
import { useSiteData } from '../../../context/SiteDataContext';
import { toast } from 'sonner';
import { CornerBrackets } from '../../CornerBrackets';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

const newEntry = (): ExperienceEntry => ({
  id: crypto.randomUUID(),
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
});

type SaveState = 'idle' | 'saving' | 'success' | 'error';

export const ExperienceEditor: React.FC = () => {
  const { experiences: contextExperiences, refresh } = useSiteData();
  const [entries, setEntries] = useState<ExperienceEntry[]>(() => {
    if (Array.isArray(contextExperiences) && contextExperiences.length > 0) {
      return contextExperiences.map((row) => ({
        id: row.id || crypto.randomUUID(),
        title: row.title || '',
        company: row.company || '',
        location: row.location || '',
        startDate: row.startDate || '',
        endDate: row.endDate || '',
        description: row.description || '',
      }));
    }
    return [];
  });
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync from SiteDataContext when context data updates or background sync completes
  useEffect(() => {
    if (Array.isArray(contextExperiences)) {
      setEntries(
        contextExperiences.map((row) => ({
          id: row.id || crypto.randomUUID(),
          title: row.title || '',
          company: row.company || '',
          location: row.location || '',
          startDate: row.startDate || '',
          endDate: row.endDate || '',
          description: row.description || '',
        })),
      );
    }
  }, [contextExperiences]);

  const updateEntry = (id: string, patch: Partial<ExperienceEntry>) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const removeEntry = async (entry: ExperienceEntry) => {
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));

    if (supabase && entry.title && entry.company) {
      try {
        const { error } = await supabase
          .from('experience')
          .delete()
          .match({ id: entry.id });

        if (error) {
          // Fallback to title & company if id was local UUID not yet in db
          await supabase
            .from('experience')
            .delete()
            .eq('title', entry.title)
            .eq('company', entry.company);
        }

        toast.info(`Removed "${entry.title}" at "${entry.company}" from database.`);
        await refresh();
      } catch (err) {
        console.warn('Delete warning:', err);
      }
    }
  };

  const handleSave = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');
    setErrorMsg('');

    try {
      if (!supabase) throw new Error('Supabase client is not configured.');
      
      const rows = entries
        .filter((e) => e.title.trim() && e.company.trim())
        .map(({ id, startDate, endDate, ...rest }) => ({
          id,
          ...rest,
          start_date: startDate,
          end_date: endDate,
          updated_at: new Date().toISOString(),
        }));

      if (rows.length > 0) {
        const { error } = await supabase
          .from('experience')
          .upsert(rows, { onConflict: 'id' });

        if (error) {
          // If onConflict 'id' encounters unique constraint on title/company, fallback to title,company
          const { error: fallbackError } = await supabase
            .from('experience')
            .upsert(rows, { onConflict: 'title,company' });
          if (fallbackError) throw fallbackError;
        }
      }

      await refresh();
      setSaveState('success');
      toast.success('Experience entries saved and synchronized with database!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      const msg = formatErrorMessage(err);
      setErrorMsg(msg);
      setSaveState('error');
      toast.error(msg || 'Failed to save experience entries.');
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-light-ink dark:text-dark-ink font-normal">
            Work Experience
          </h2>
          <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mt-1">
            Manage your professional engineering roles and milestones. Changes sync to Supabase.
          </p>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEntries((prev) => [...prev, newEntry()])}
            className="gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Entry
          </Button>

          {/* Save button */}
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
                : 'Save All Experience'}
            </span>
          </Button>
          {saveState === 'error' && errorMsg && (
            <p className="font-sans text-[11px] text-red-400 text-right w-full max-w-xs">{errorMsg}</p>
          )}
        </div>
      </div>

      {/* Entry cards */}
      <div className="space-y-5">
        {entries.map((entry, idx) => (
          <div
            key={entry.id}
            className="relative bg-light-surface-card dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-4 sm:p-6 shadow-xs classical-card-frame space-y-4"
          >
            <CornerBrackets size="sm" />
            <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-light-border/60 dark:border-dark-border/60">
              <div className="flex items-start sm:items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                <GripVertical className="w-4 h-4 text-light-ink-subtle cursor-grab shrink-0 mt-0.5 sm:mt-0" />
                <Badge variant="terracotta" className="font-mono text-xs px-2 py-0.5 shrink-0 mt-0.5 sm:mt-0">
                  {String(idx + 1).padStart(2, '0')}
                </Badge>
                <span className="font-serif text-sm sm:text-base font-medium text-light-ink dark:text-dark-ink flex-1 min-w-0">
                  {entry.title || entry.company ? `${entry.title || 'Untitled Role'} — ${entry.company || 'Company'}` : 'New Experience Position'}
                </span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEntry(entry)}
                className="h-8 w-8 p-0 text-light-ink-muted hover:text-red-500 hover:bg-red-500/10 shrink-0"
                title="Delete entry"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5">Job Title</Label>
                <Input
                  type="text"
                  value={entry.title}
                  onChange={(e) => updateEntry(entry.id, { title: e.target.value })}
                  placeholder="e.g. Software Engineer"
                  className="font-medium"
                />
              </div>
              <div>
                <Label className="mb-1.5">Company</Label>
                <Input
                  type="text"
                  value={entry.company}
                  onChange={(e) => updateEntry(entry.id, { company: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="font-medium"
                />
              </div>
              <div>
                <Label className="mb-1.5">Location</Label>
                <Input
                  type="text"
                  value={entry.location}
                  onChange={(e) => updateEntry(entry.id, { location: e.target.value })}
                  placeholder="e.g. San Francisco, CA / Remote"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5">Start Date</Label>
                  <Input
                    type="text"
                    value={entry.startDate}
                    onChange={(e) => updateEntry(entry.id, { startDate: e.target.value })}
                    placeholder="e.g. May 2024"
                  />
                </div>
                <div>
                  <Label className="mb-1.5">End Date</Label>
                  <Input
                    type="text"
                    value={entry.endDate}
                    onChange={(e) => updateEntry(entry.id, { endDate: e.target.value })}
                    placeholder="e.g. Present"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-1.5">Description &amp; Key Impact (Resizable)</Label>
              <Textarea
                rows={3}
                className="min-h-[85px] leading-relaxed"
                value={entry.description}
                onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
                placeholder="Architectural contributions, systems engineered, and quantifiable impact…"
              />
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-16 text-light-ink-muted dark:text-dark-ink-muted font-sans text-sm rounded-xl border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface p-8">
          <p className="mb-3">No work experience entries found.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEntries([newEntry()])}
          >
            Add your first experience entry
          </Button>
        </div>
      )}
    </div>
  );
};
