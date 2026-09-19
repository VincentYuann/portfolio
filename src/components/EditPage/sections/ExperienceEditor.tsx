import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  Loader2,
  Upload,
  X,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { supabase, formatErrorMessage, uploadProjectImage } from '../../../lib/supabase';
import { useSiteData, ExperienceRecord } from '../../../context/SiteDataContext';
import { TechTag } from '../../TechTag';
import { TechTagModal } from '../TechTagModal';
import { KanjiPickerModal } from '../KanjiPickerModal';
import { getKanjiPreset } from '../../../lib/kanjiLibrary';
import { toast } from 'sonner';
import { CornerBrackets } from '../../CornerBrackets';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';

/* ─── Types ──────────────────────────────────────────────────────────── */

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  overview: string;
  bullets: string[];
  tags: string[];
  isActive: boolean;
  statusLabel: string;
  domainLabel: string;
  logoUrl: string;
  kanji: string;
  kanjiSubtitle: string;
  displayOrder: number;
}

const newEntry = (order: number = 0): ExperienceEntry => ({
  id: crypto.randomUUID(),
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  overview: '',
  bullets: [''],
  tags: order === 0 ? ['C++', 'CUDA', 'TimescaleDB', 'React'] : ['Rust', 'PostgreSQL', 'TypeScript'],
  isActive: order === 0,
  statusLabel: order === 0 ? 'ACTIVE / 現職' : '歴任 / COMPLETED',
  domainLabel: '',
  logoUrl: '',
  kanji: order === 0 ? '木' : order === 1 ? '墨' : order === 2 ? '明' : '原',
  kanjiSubtitle: order === 0 ? 'AI' : order === 1 ? 'SUMI' : order === 2 ? 'CRAFT' : 'SYS',
  displayOrder: order,
});

type SaveState = 'idle' | 'saving' | 'success' | 'error';

/* ─── Tech Stack Tag Input ───────────────────────────────────────────── */
const TechTagInput: React.FC<{
  tags: string[];
  onChange: (tags: string[]) => void;
}> = ({ tags, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-xs">Substrates &amp; Tech Stack</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="text-terracotta hover:text-terracotta hover:bg-terracotta/10 text-xs h-7 px-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Official Logo Tag
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2.5 rounded-xl bg-light-surface/50 dark:bg-dark-surface/50 border border-light-border dark:border-dark-border items-center">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 group bg-light-surface dark:bg-[#16171D] border border-light-border dark:border-[#333640] hover:border-terracotta/50 rounded-md pr-1.5 shadow-2xs transition-colors"
          >
            <TechTag tag={tag} size="sm" className="border-0 shadow-none bg-transparent dark:bg-transparent" />
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="text-light-ink-subtle hover:text-red-500 transition-colors p-0.5 cursor-pointer"
              title={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length === 0 && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="font-sans text-xs text-light-ink-subtle dark:text-dark-ink-subtle italic hover:text-terracotta transition-colors cursor-pointer"
          >
            Click to add technology tags…
          </button>
        )}
      </div>

      <TechTagModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedTags={tags}
        onChange={onChange}
      />
    </div>
  );
};

export const ExperienceEditor: React.FC = () => {
  const { experiences: contextExperiences, refresh } = useSiteData();
  const [entries, setEntries] = useState<ExperienceEntry[]>(() => {
    if (Array.isArray(contextExperiences) && contextExperiences.length > 0) {
      return contextExperiences.map((row, idx) => {
        let bullets: string[] = [];
        if (Array.isArray(row.bullets) && row.bullets.length > 0) {
          bullets = row.bullets;
        } else if (row.description) {
          bullets = row.description
            .split(/(?<=[.!?])\s+/)
            .map((p) => p.trim())
            .filter((p) => p.length > 0);
        }
        if (bullets.length === 0) bullets = [''];

        return {
          id: row.id || crypto.randomUUID(),
          title: row.title || '',
          company: row.company || '',
          location: row.location || '',
          startDate: row.startDate || '',
          endDate: row.endDate || '',
          description: row.description || '',
          overview: row.overview || (idx === 0 ? 'High-performance AI inference infrastructure studio specializing in local-first edge LLMs, real-time telemetry pipelines, and artisanal WebGL interfaces.' : row.description || ''),
          bullets,
          tags: Array.isArray(row.tags) && row.tags.length > 0 ? row.tags : idx === 0 ? ['C++', 'CUDA', 'TimescaleDB', 'React'] : ['Rust', 'PostgreSQL', 'TypeScript'],
          isActive: typeof row.isActive === 'boolean' ? row.isActive : idx === 0,
          statusLabel: row.statusLabel || (row.isActive ? 'ACTIVE / 現職' : '歴任 / COMPLETED'),
          domainLabel: row.domainLabel || '',
          logoUrl: row.logoUrl || '',
          kanji: row.kanji || (idx === 0 ? '木' : idx === 1 ? '墨' : idx === 2 ? '明' : '原'),
          kanjiSubtitle: row.kanjiSubtitle || (idx === 0 ? 'AI' : idx === 1 ? 'SUMI' : idx === 2 ? 'CRAFT' : 'SYS'),
          displayOrder: typeof row.displayOrder === 'number' ? row.displayOrder : idx,
        };
      });
    }
    return [];
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [kanjiModalEntryId, setKanjiModalEntryId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [singleSavingId, setSingleSavingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingLogoId, setUploadingLogoId] = useState<string | null>(null);

  // Sync from SiteDataContext when context data updates
  useEffect(() => {
    if (Array.isArray(contextExperiences) && contextExperiences.length > 0) {
      setEntries(
        contextExperiences.map((row, idx) => {
          let bullets: string[] = [];
          if (Array.isArray(row.bullets) && row.bullets.length > 0) {
            bullets = row.bullets;
          } else if (row.description) {
            bullets = row.description
              .split(/(?<=[.!?])\s+/)
              .map((p) => p.trim())
              .filter((p) => p.length > 0);
          }
          if (bullets.length === 0) bullets = [''];

          return {
            id: row.id || crypto.randomUUID(),
            title: row.title || '',
            company: row.company || '',
            location: row.location || '',
            startDate: row.startDate || '',
            endDate: row.endDate || '',
            description: row.description || '',
            overview: row.overview || (idx === 0 ? 'High-performance AI inference infrastructure studio specializing in local-first edge LLMs, real-time telemetry pipelines, and artisanal WebGL interfaces.' : row.description || ''),
            bullets,
            tags: Array.isArray(row.tags) && row.tags.length > 0 ? row.tags : idx === 0 ? ['C++', 'CUDA', 'TimescaleDB', 'React'] : ['Rust', 'PostgreSQL', 'TypeScript'],
            isActive: typeof row.isActive === 'boolean' ? row.isActive : idx === 0,
            statusLabel: row.statusLabel || (row.isActive ? 'ACTIVE / 現職' : '歴任 / COMPLETED'),
            domainLabel: row.domainLabel || '',
            logoUrl: row.logoUrl || '',
            kanji: row.kanji || (idx === 0 ? '木' : idx === 1 ? '墨' : idx === 2 ? '明' : '原'),
            kanjiSubtitle: row.kanjiSubtitle || (idx === 0 ? 'AI' : idx === 1 ? 'SUMI' : idx === 2 ? 'CRAFT' : 'SYS'),
            displayOrder: typeof row.displayOrder === 'number' ? row.displayOrder : idx,
          };
        })
      );
    }
  }, [contextExperiences]);

  const updateEntry = (id: string, patch: Partial<ExperienceEntry>) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  /**
   * Real-time Active Toggle: More than 1 role can be active simultaneously!
   */
  const toggleActiveState = async (id: string) => {
    const current = entries.find((e) => e.id === id);
    if (!current) return;
    const nextActive = !current.isActive;

    const updated = entries.map((e) => {
      if (e.id === id) {
        return {
          ...e,
          isActive: nextActive,
          statusLabel: nextActive ? 'ACTIVE / 現職' : '歴任 / COMPLETED',
        };
      }
      return e;
    });

    setEntries(updated);

    // Cache locally
    try {
      localStorage.setItem('portfolio_experience_cache', JSON.stringify(updated));
    } catch {}

    toast.success(
      nextActive
        ? `"${current.title || 'Role'}" marked ACTIVE / 現職!`
        : `"${current.title || 'Role'}" marked 歴任 / COMPLETED.`
    );
  };

  const handleImageUpload = async (id: string, file: File) => {
    try {
      setUploadingLogoId(id);
      const url = await uploadProjectImage(file);
      updateEntry(id, { logoUrl: url });
      toast.success('Emblem logo uploaded successfully!');
    } catch {
      toast.error('Failed to upload logo image.');
    } finally {
      setUploadingLogoId(null);
    }
  };

  const addBullet = (entryId: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId ? { ...e, bullets: [...e.bullets, ''] } : e
      )
    );
  };

  const updateBullet = (entryId: string, index: number, value: string) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== entryId) return e;
        const nextBullets = [...e.bullets];
        nextBullets[index] = value;
        return { ...e, bullets: nextBullets };
      })
    );
  };

  const removeBullet = (entryId: string, index: number) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== entryId) return e;
        const nextBullets = e.bullets.filter((_, i) => i !== index);
        return { ...e, bullets: nextBullets.length > 0 ? nextBullets : [''] };
      })
    );
  };

  const moveEntry = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= entries.length) return;
    const next = [...entries];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    const reordered = next.map((item, idx) => ({ ...item, displayOrder: idx }));
    setEntries(reordered);
  };

  /* ─── Drag & Drop Handling ─── */
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const fromIndexStr = e.dataTransfer.getData('text/plain');
    const fromIndex = parseInt(fromIndexStr, 10);
    if (!isNaN(fromIndex) && fromIndex !== dropIndex) {
      moveEntry(fromIndex, dropIndex);
      toast.success('Milestone chronological order updated!');
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleAddNew = () => {
    const created = newEntry(entries.length);
    setEntries((prev) => [...prev, created]);
    setExpandedId(created.id);
  };

  const removeEntry = async (entry: ExperienceEntry) => {
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    if (expandedId === entry.id) setExpandedId(null);

    if (supabase && entry.title && entry.company) {
      try {
        const { error } = await supabase
          .from('experience')
          .delete()
          .match({ id: entry.id });

        if (error) {
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

  /* ─── Save Single Milestone to Supabase & Local Cache ─── */
  const handleSaveSingle = async (id: string) => {
    const e = entries.find((item) => item.id === id);
    if (!e) return;

    setSingleSavingId(id);
    try {
      if (!supabase) throw new Error('Supabase is not configured.');

      const idx = entries.findIndex((item) => item.id === id);
      const cleanBullets = e.bullets.map((b) => b.trim()).filter((b) => b.length > 0);
      const combinedDescription = cleanBullets.join(' ') || e.overview || e.description;

      const row = {
        id: e.id,
        title: e.title || `Role ${idx + 1}`,
        company: e.company || 'Company',
        location: e.location,
        start_date: e.startDate,
        end_date: e.endDate,
        description: combinedDescription,
        overview: e.overview,
        bullets: cleanBullets,
        tags: e.tags,
        is_active: e.isActive,
        status_label: e.isActive ? 'ACTIVE / 現職' : '歴任 / COMPLETED',
        domain_label: e.domainLabel,
        logo_url: e.logoUrl,
        kanji: e.kanji,
        kanji_subtitle: e.kanjiSubtitle,
        display_order: idx,
        updated_at: new Date().toISOString(),
      };

      // Cache locally
      try {
        localStorage.setItem('portfolio_experience_cache', JSON.stringify(entries));
      } catch {}

      const { error } = await supabase
        .from('experience')
        .upsert(row, { onConflict: 'id' });

      if (error) {
        const rawMsg = formatErrorMessage(error).toLowerCase();
        if (rawMsg.includes('violates row-level security') || rawMsg.includes('rls')) {
          await refresh();
          toast.success(`"${e.title || 'Role'}" saved to local cache! (Sign in as Admin for remote DB sync)`);
          setExpandedId(null);
          return;
        }
        throw error;
      }

      await refresh();
      toast.success(`"${e.title || 'Role'}" saved directly to database!`);
      setExpandedId(null);
    } catch (err: unknown) {
      const msg = formatErrorMessage(err);
      toast.error(msg || 'Failed to save milestone.');
    } finally {
      setSingleSavingId(null);
    }
  };

  /* ─── Save All Milestones ─── */
  const handleSaveAll = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');
    setErrorMsg('');

    try {
      if (!supabase) throw new Error('Supabase client is not configured.');

      const validEntries = entries.filter((e) => e.title.trim() && e.company.trim());

      const fullRows = validEntries.map((e, idx) => {
        const cleanBullets = e.bullets.map((b) => b.trim()).filter((b) => b.length > 0);
        const combinedDescription = cleanBullets.join(' ') || e.overview || e.description;

        return {
          id: e.id,
          title: e.title,
          company: e.company,
          location: e.location,
          start_date: e.startDate,
          end_date: e.endDate,
          description: combinedDescription,
          overview: e.overview,
          bullets: cleanBullets,
          tags: e.tags,
          is_active: e.isActive,
          status_label: e.isActive ? 'ACTIVE / 現職' : '歴任 / COMPLETED',
          domain_label: e.domainLabel,
          logo_url: e.logoUrl,
          kanji: e.kanji,
          kanji_subtitle: e.kanjiSubtitle,
          display_order: idx,
          updated_at: new Date().toISOString(),
        };
      });

      // Cache locally immediately
      try {
        const mappedLocal: ExperienceRecord[] = validEntries.map((e, idx) => ({
          id: e.id,
          title: e.title,
          company: e.company,
          location: e.location,
          startDate: e.startDate,
          endDate: e.endDate,
          description: e.bullets.map((b) => b.trim()).filter((b) => b.length > 0).join(' ') || e.overview || e.description,
          overview: e.overview,
          bullets: e.bullets.map((b) => b.trim()).filter((b) => b.length > 0),
          tags: e.tags,
          isActive: e.isActive,
          statusLabel: e.isActive ? 'ACTIVE / 現職' : '歴任 / COMPLETED',
          domainLabel: e.domainLabel,
          logoUrl: e.logoUrl,
          kanji: e.kanji,
          kanjiSubtitle: e.kanjiSubtitle,
          displayOrder: idx,
        }));
        localStorage.setItem('portfolio_experience_cache', JSON.stringify(mappedLocal));
      } catch {}

      if (fullRows.length > 0) {
        const { error } = await supabase
          .from('experience')
          .upsert(fullRows, { onConflict: 'id' });

        if (error) throw error;
      }

      await refresh();
      setSaveState('success');
      toast.success('All work milestones synchronized successfully with database!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      const msg = formatErrorMessage(err);
      setErrorMsg(msg);
      setSaveState('error');
      toast.error(msg || 'Failed to save experience entries.');
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  const activeModalEntry = entries.find((e) => e.id === kanjiModalEntryId);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono tracking-widest text-ochre uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
            CHRONICLE &amp; MILESTONES ENGINE
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-light-ink dark:text-dark-ink font-normal">
            Work Experience &amp; Milestones
          </h2>
          <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mt-1">
            Manage your career trajectory. Drag &amp; drop or use arrow buttons to reorder. Click EDIT to customize roles and stacks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddNew}
            className="gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Milestone
          </Button>

          {/* Save All button */}
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
            onClick={handleSaveAll}
            className="gap-2 bg-terracotta hover:bg-terracotta/90 text-white shadow-xs"
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
                : 'Save All Milestones'}
            </span>
          </Button>
        </div>
      </div>

      {saveState === 'error' && errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-sans text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Distilled Collapsible Milestone Cards List */}
      <div className="space-y-4">
        {entries.map((entry, idx) => {
          const isExpanded = expandedId === entry.id;
          const isDragging = draggedIndex === idx;
          const isOver = dragOverIndex === idx;
          const hasLogo = Boolean(entry.logoUrl && entry.logoUrl.trim());
          const kanjiPreset = getKanjiPreset(entry.kanji);

          return (
            <div
              key={entry.id}
              draggable={!isExpanded}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={`relative bg-light-surface-card dark:bg-dark-surface border rounded-xl transition-all duration-200 classical-card-frame shadow-xs ${
                isExpanded
                  ? 'border-terracotta/50 dark:border-terracotta/40 ring-1 ring-terracotta/20'
                  : 'border-light-border dark:border-dark-border hover:border-terracotta/40'
              } ${isDragging ? 'opacity-30 scale-[0.99] border-dashed border-terracotta' : ''} ${
                isOver ? 'border-terracotta ring-2 ring-terracotta/30' : ''
              }`}
            >
              <CornerBrackets size="sm" />

              {/* ── Distilled Collapsed Header Row ── */}
              <div className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 select-none">
                {/* Left: Drag Handle, Arrows, Number, Title & Subtitle */}
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {/* Grip Handle for Dragging */}
                  <div
                    className="p-1 sm:p-1.5 text-light-ink-subtle hover:text-terracotta cursor-grab active:cursor-grabbing shrink-0 transition-colors mt-0.5 sm:mt-0"
                    title="Click and drag to reorder"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Up / Down Arrow Controls */}
                  <div className="flex flex-col gap-0.5 shrink-0 mt-0.5 sm:mt-0" draggable={false}>
                    <button
                      type="button"
                      onClick={() => moveEntry(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-0.5 rounded text-light-ink-subtle hover:text-terracotta disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveEntry(idx, idx + 1)}
                      disabled={idx === entries.length - 1}
                      className="p-0.5 rounded text-light-ink-subtle hover:text-terracotta disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Order Number Badge */}
                  <Badge variant="terracotta" className="font-mono text-xs px-2 py-0.5 shrink-0 mt-0.5 sm:mt-0">
                    {String(idx + 1).padStart(2, '0')}
                  </Badge>

                  {/* Title & Info Preview */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    className="flex flex-col min-w-0 cursor-pointer group/title flex-1"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif text-sm sm:text-base font-medium text-light-ink dark:text-dark-ink group-hover/title:text-terracotta transition-colors">
                        {entry.title || 'Untitled Role'}
                      </span>
                      {entry.company && (
                        <Badge variant="outline" className="text-[10px] uppercase font-mono py-0 shrink-0">
                          {entry.company}
                        </Badge>
                      )}
                      {entry.kanji && (
                        <span className="font-serif text-xs text-terracotta font-semibold shrink-0" title={kanjiPreset?.meaning}>
                          {entry.kanji}
                        </span>
                      )}
                    </div>
                    {(entry.location || entry.startDate) && (
                      <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted truncate mt-0.5">
                        {entry.location ? `${entry.location} · ` : ''}{entry.startDate} — {entry.endDate || 'Present'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Quick Actions */}
                <div className="flex items-center justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-light-border/40 dark:border-dark-border/40" draggable={false}>
                  {/* High-Contrast Active vs Completed Toggle Pill */}
                  <button
                    type="button"
                    onClick={() => toggleActiveState(entry.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      entry.isActive
                        ? 'bg-emerald-500/15 border border-emerald-500/60 text-emerald-800 dark:text-emerald-300 shadow-2xs hover:bg-emerald-500/25'
                        : 'bg-stone-100 border border-stone-300 text-stone-700 dark:bg-[#20222b] dark:border-[#383b49] dark:text-stone-300 hover:border-light-ink-subtle'
                    }`}
                    title={entry.isActive ? 'Active position (Click to mark Completed)' : 'Completed role (Click to mark Active)'}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        entry.isActive
                          ? 'bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse'
                          : 'bg-stone-400 dark:bg-neutral-500'
                      }`}
                    />
                    <span>{entry.isActive ? 'ACTIVE / 現職' : '歴任 / COMPLETED'}</span>
                  </button>

                  {/* Single Unified Edit / Collapse Toggle Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    className="gap-1 h-8 px-2.5 cursor-pointer font-mono"
                  >
                    <span className="text-xs">{isExpanded ? 'Collapse' : 'Edit'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-terracotta" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </Button>

                  {/* Delete Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(entry)}
                    className="h-8 w-8 p-0 text-light-ink-muted hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                    title="Delete milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* ── Expanded Full Milestone Editor Form ── */}
              {isExpanded && (
                <div className="p-4 sm:p-6 border-t border-light-border dark:border-dark-border space-y-6 bg-light-surface-raised/40 dark:bg-dark-surface-card/60 animate-in fade-in slide-in-from-top-1 duration-200">
                  {/* Square Emblem / Logo & Hanko Seal Sub-Panel */}
                  <div className="p-4 rounded-xl bg-light-surface/60 dark:bg-[#14151b]/70 border border-light-border/80 dark:border-dark-border/80 space-y-3.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider text-ochre font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                        Square Emblem / Logo &amp; Hanko Seal Fallback
                      </span>
                      <span className="text-[11px] font-mono text-light-ink-muted dark:text-dark-ink-muted">
                        {hasLogo ? 'Custom Logo Active' : 'Default Hanko Seal Active'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {/* Square Visual Preview Box */}
                      <div className="relative shrink-0 flex items-center justify-center w-16 h-16 rounded-xl border border-terracotta/70 bg-light-surface dark:bg-[#181920] overflow-hidden shadow-inner">
                        {hasLogo ? (
                          <img
                            src={entry.logoUrl}
                            alt="Emblem preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center font-serif font-black text-terracotta text-2xl leading-none select-none p-1">
                            <span>{entry.kanji || '木'}</span>
                            <span className="text-[8px] font-mono tracking-widest text-ochre uppercase mt-1 font-bold">
                              {entry.kanjiSubtitle || 'AI'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Logo Upload & URL Field */}
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            type="url"
                            value={entry.logoUrl}
                            onChange={(e) => updateEntry(entry.id, { logoUrl: e.target.value })}
                            placeholder="Company Logo Image URL (e.g. https://.../logo.png or ./images/...)"
                            className="text-xs font-mono h-8"
                          />
                          {hasLogo && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => updateEntry(entry.id, { logoUrl: '' })}
                              className="h-8 px-2 text-xs text-light-ink-muted hover:text-red-500 cursor-pointer"
                              title="Remove custom logo and revert to Hanko Seal"
                            >
                              <X className="w-3.5 h-3.5 mr-1" />
                              Clear
                            </Button>
                          )}
                          <label className="cursor-pointer shrink-0">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(entry.id, file);
                              }}
                            />
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md bg-light-surface-card dark:bg-[#20222b] border border-light-border dark:border-[#2e303d] hover:border-terracotta text-light-ink dark:text-dark-ink transition-colors h-8">
                              {uploadingLogoId === entry.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-terracotta" />
                              ) : (
                                <Upload className="w-3.5 h-3.5 text-terracotta" />
                              )}
                              <span className="hidden sm:inline">Upload Logo</span>
                            </span>
                          </label>
                        </div>

                        {/* Kanji Seal Fallback Selectors */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                          {/* Selectable Kanji Symbol with Meaning Breakdown */}
                          <div>
                            <Label className="text-[10px] text-light-ink-muted dark:text-dark-ink-muted mb-1">
                              Kanji Seal Character
                            </Label>
                            <button
                              type="button"
                              onClick={() => setKanjiModalEntryId(entry.id)}
                              className="w-full flex items-center justify-between px-2.5 h-8 rounded-md bg-light-surface dark:bg-[#181922] border border-light-border dark:border-dark-border hover:border-terracotta transition-colors text-left cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="font-serif text-sm font-bold text-terracotta">
                                  {entry.kanji || '木'}
                                </span>
                                <span className="font-sans text-[10px] text-light-ink-muted dark:text-dark-ink-muted truncate">
                                  {kanjiPreset ? `· ${kanjiPreset.meaning}` : '· Custom'}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-terracotta font-semibold uppercase shrink-0">
                                Pick ▾
                              </span>
                            </button>
                          </div>

                          <div>
                            <Label className="text-[10px] text-light-ink-muted dark:text-dark-ink-muted mb-1">
                              Seal Subtitle (e.g. AI / SUMI)
                            </Label>
                            <Input
                              type="text"
                              maxLength={8}
                              value={entry.kanjiSubtitle}
                              onChange={(e) => updateEntry(entry.id, { kanjiSubtitle: e.target.value })}
                              placeholder="e.g. AI / SUMI"
                              className="text-xs font-mono uppercase text-center h-8 font-semibold"
                            />
                          </div>

                          <div>
                            <Label className="text-[10px] text-light-ink-muted dark:text-dark-ink-muted mb-1">
                              Domain / Subtitle
                            </Label>
                            <Input
                              type="text"
                              value={entry.domainLabel}
                              onChange={(e) => updateEntry(entry.id, { domainLabel: e.target.value })}
                              placeholder="e.g. Distributed Substrate"
                              className="text-xs font-mono h-8"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Role Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1.5 text-xs text-terracotta font-medium">Job Title</Label>
                      <Input
                        type="text"
                        value={entry.title}
                        onChange={(e) => updateEntry(entry.id, { title: e.target.value })}
                        placeholder="e.g. Full-Stack & AI Systems Engineer"
                        className="font-medium text-sm"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 text-xs font-medium">Company Name</Label>
                      <Input
                        type="text"
                        value={entry.company}
                        onChange={(e) => updateEntry(entry.id, { company: e.target.value })}
                        placeholder="e.g. Sumi Intelligence Studio"
                        className="font-medium text-sm"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 text-xs">Location</Label>
                      <Input
                        type="text"
                        value={entry.location}
                        onChange={(e) => updateEntry(entry.id, { location: e.target.value })}
                        placeholder="e.g. Tokyo / Remote"
                        className="text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="mb-1.5 text-xs">Start Date</Label>
                        <Input
                          type="text"
                          value={entry.startDate}
                          onChange={(e) => updateEntry(entry.id, { startDate: e.target.value })}
                          placeholder="e.g. May 2024"
                          className="text-xs font-mono"
                        />
                      </div>
                      <div>
                        <Label className="mb-1.5 text-xs">End Date</Label>
                        <Input
                          type="text"
                          value={entry.endDate}
                          onChange={(e) => updateEntry(entry.id, { endDate: e.target.value })}
                          placeholder="e.g. Present"
                          className="text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* High-Level Narrative Summary (Always Visible on Card) */}
                  <div>
                    <Label className="mb-1.5 text-xs font-semibold">
                      Company Mission &amp; Role Narrative Summary (Always Visible on Card)
                    </Label>
                    <Textarea
                      rows={2}
                      className="min-h-[60px] leading-relaxed text-xs sm:text-sm font-sans"
                      value={entry.overview}
                      onChange={(e) => updateEntry(entry.id, { overview: e.target.value })}
                      placeholder="High-performance AI inference infrastructure studio specializing in local-first edge LLMs, real-time telemetry pipelines, and artisanal WebGL interfaces…"
                    />
                  </div>

                  {/* Quantified Bullet Points (Revealed on Inspect Click) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">
                        Quantified Engineering Achievements &amp; Impact (Revealed on Inspect)
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addBullet(entry.id)}
                        className="text-terracotta hover:text-terracotta hover:bg-terracotta/10 text-xs h-6 px-2 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Bullet Point
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {entry.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="text-terracotta text-xs select-none mt-2">⊘</span>
                          <Textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => updateBullet(entry.id, bIdx, e.target.value)}
                            placeholder="Architected local low-latency inference runtimes with custom C++ llama.cpp socket daemons, achieving sub-18ms time-to-first-token…"
                            className="flex-1 text-xs leading-relaxed min-h-[50px]"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBullet(entry.id, bIdx)}
                            className="h-8 w-8 p-0 text-light-ink-muted hover:text-red-500 hover:bg-red-500/10 shrink-0 mt-1 cursor-pointer"
                            title="Delete bullet point"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Substrates & Tech Stack Tag Selector */}
                  <TechTagInput
                    tags={entry.tags}
                    onChange={(tags) => updateEntry(entry.id, { tags })}
                  />

                  {/* ── Bottom Right Save Action Bar (Matching Projects Design) ── */}
                  <div className="pt-4 mt-8 border-t border-light-border/80 dark:border-dark-border/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-light-ink-muted dark:text-dark-ink-muted">
                      <span className="font-mono text-[10px] text-terracotta font-semibold uppercase tracking-wider">
                        STATUS:
                      </span>
                      <span>
                        {entry.isActive ? 'Active Position (現職)' : 'Completed Role (歴任)'}
                      </span>
                      <span className="text-light-ink-subtle">·</span>
                      <span className="font-mono text-[10px]">
                        Order #{idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        disabled={singleSavingId === entry.id}
                        onClick={() => handleSaveSingle(entry.id)}
                        className="gap-1.5 h-8 px-4 text-xs bg-terracotta hover:bg-terracotta/90 text-white shadow-xs cursor-pointer"
                      >
                        {singleSavingId === entry.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>{singleSavingId === entry.id ? 'Saving…' : 'Save Milestone'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Kanji Preset Selection Modal */}
      {kanjiModalEntryId && activeModalEntry && (
        <KanjiPickerModal
          isOpen={Boolean(kanjiModalEntryId)}
          onClose={() => setKanjiModalEntryId(null)}
          selectedChar={activeModalEntry.kanji}
          onSelect={(kanji, preset) => {
            updateEntry(activeModalEntry.id, {
              kanji,
              kanjiSubtitle: preset ? preset.romaji.split('/')[0].trim().toUpperCase() : activeModalEntry.kanjiSubtitle,
            });
          }}
          title={`Select Kanji Seal for "${activeModalEntry.company || activeModalEntry.title || 'Role'}"`}
        />
      )}

      {entries.length === 0 && (
        <div className="text-center py-16 text-light-ink-muted dark:text-dark-ink-muted font-sans text-sm rounded-xl border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface p-8">
          <p className="mb-3">No work experience milestones found.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddNew}
            className="border-dashed cursor-pointer"
          >
            Add your first milestone entry
          </Button>
        </div>
      )}
    </div>
  );
};
