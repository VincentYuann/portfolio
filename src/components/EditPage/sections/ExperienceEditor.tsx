import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
} from 'lucide-react';
import { supabase, formatErrorMessage, uploadExperienceLogo, withTimeout } from '../../../lib/supabase';
import { useSiteData } from '../../../context/SiteDataContext';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { EditorCardShell } from '../shared/EditorCardShell';
import { TechTagSelector } from '../shared/TechTagSelector';
import { EmblemKanjiSelector } from '../shared/EmblemKanjiSelector';
import { BulletListEditor } from '../shared/BulletListEditor';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { toast } from 'sonner';

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

export const ExperienceEditor: React.FC = () => {
  const { experiences: contextExperiences, refresh } = useSiteData();
  const [experiences, setExperiences] = useState<ExperienceEntry[]>(() => {
    if (contextExperiences && contextExperiences.length > 0) {
      return contextExperiences.map((e, idx) => ({
        id: e.id || crypto.randomUUID(),
        title: e.title || '',
        company: e.company || '',
        location: e.location || '',
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        description: e.description || '',
        overview: e.overview || e.description || '',
        bullets:
          Array.isArray(e.bullets) && e.bullets.length > 0
            ? e.bullets
            : e.description
            ? e.description.split(/(?<=[.!?])\s+/).filter(Boolean)
            : [''],
        tags: e.tags || [],
        isActive: typeof e.isActive === 'boolean' ? e.isActive : idx === 0,
        statusLabel: e.statusLabel || (idx === 0 ? 'ACTIVE / 現職' : '歴任 / COMPLETED'),
        domainLabel: e.domainLabel || '',
        logoUrl: e.logoUrl || '',
        kanji: e.kanji || (idx === 0 ? '木' : idx === 1 ? '墨' : idx === 2 ? '明' : '原'),
        kanjiSubtitle: e.kanjiSubtitle || (idx === 0 ? 'AI' : idx === 1 ? 'SUMI' : idx === 2 ? 'CRAFT' : 'SYS'),
        displayOrder: typeof e.displayOrder === 'number' ? e.displayOrder : idx,
      }));
    }
    return [];
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  // Sync from context
  useEffect(() => {
    if (contextExperiences && contextExperiences.length > 0) {
      setExperiences(
        contextExperiences.map((e, idx) => ({
          id: e.id || crypto.randomUUID(),
          title: e.title || '',
          company: e.company || '',
          location: e.location || '',
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          description: e.description || '',
          overview: e.overview || e.description || '',
          bullets:
            Array.isArray(e.bullets) && e.bullets.length > 0
              ? e.bullets
              : e.description
              ? e.description.split(/(?<=[.!?])\s+/).filter(Boolean)
              : [''],
          tags: e.tags || [],
          isActive: typeof e.isActive === 'boolean' ? e.isActive : idx === 0,
          statusLabel: e.statusLabel || (idx === 0 ? 'ACTIVE / 現職' : '歴任 / COMPLETED'),
          domainLabel: e.domainLabel || '',
          logoUrl: e.logoUrl || '',
          kanji: e.kanji || (idx === 0 ? '木' : idx === 1 ? '墨' : idx === 2 ? '明' : '原'),
          kanjiSubtitle: e.kanjiSubtitle || (idx === 0 ? 'AI' : idx === 1 ? 'SUMI' : idx === 2 ? 'CRAFT' : 'SYS'),
          displayOrder: typeof e.displayOrder === 'number' ? e.displayOrder : idx,
        })),
      );
    }
  }, [contextExperiences]);

  const notifyDirty = () => {
    window.dispatchEvent(new CustomEvent('portfolio-admin-dirty', { detail: { dirty: true } }));
  };

  const notifyClean = () => {
    window.dispatchEvent(new CustomEvent('portfolio-admin-clean'));
  };

  // Keyboard save listener
  useEffect(() => {
    const handleGlobalSave = () => handleSaveAll();
    window.addEventListener('portfolio-admin-save', handleGlobalSave);
    return () => window.removeEventListener('portfolio-admin-save', handleGlobalSave);
  }, [experiences]);

  const updateEntry = (id: string, patch: Partial<ExperienceEntry>) => {
    notifyDirty();
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    );
  };

  const addEntry = () => {
    notifyDirty();
    const created = newEntry(experiences.length);
    setExperiences((prev) => [created, ...prev]);
    setExpandedId(created.id);
  };

  const deleteEntry = (id: string) => {
    const target = experiences.find((e) => e.id === id);
    if (!target) return;

    const originalList = [...experiences];
    const updatedList = experiences.filter((e) => e.id !== id);

    setExperiences(updatedList);
    notifyDirty();

    toast(`Deleted "${target.company || 'Milestone'}"`, {
      description: 'Click undo to restore this career milestone.',
      duration: 6000,
      action: {
        label: 'Undo',
        onClick: () => {
          setExperiences(originalList);
          notifyDirty();
          toast.success(`Restored "${target.company || 'Milestone'}"`);
        },
      },
    });
  };

  const moveEntry = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= experiences.length) return;

    notifyDirty();
    const copy = [...experiences];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);

    const reordered = copy.map((e, idx) => ({ ...e, displayOrder: idx }));
    setExperiences(reordered);
  };

  const handleSaveAll = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');

    try {
      if (!supabase) throw new Error('Supabase not configured');

      const updates = experiences.map((e, idx) => {
        const cleanBullets = e.bullets.filter(Boolean);
        const combinedDescription = cleanBullets.join(' ') || e.overview || e.description || '';
        return {
          id: e.id,
          title: e.title || `Role ${idx + 1}`,
          company: e.company || 'Company',
          location: e.location || '',
          start_date: e.startDate || '',
          end_date: e.endDate || '',
          is_active: Boolean(e.isActive),
          status_label: e.statusLabel || (e.isActive ? 'ACTIVE / 現職' : '歴任 / COMPLETED'),
          display_order: typeof e.displayOrder === 'number' ? e.displayOrder : idx,
          logo_url: e.logoUrl || '',
          kanji: e.kanji || '木',
          kanji_subtitle: e.kanjiSubtitle || '',
          tags: e.tags || [],
          overview: e.overview || '',
          bullets: cleanBullets,
          domain_label: e.domainLabel || '',
          description: combinedDescription,
          updated_at: new Date().toISOString(),
        };
      });

      await withTimeout(
        (async () => {
          // 1. Prune removed experiences in Supabase
          const { data: existing } = await supabase.from('experience').select('id');
          if (existing && existing.length > 0) {
            const currentIdSet = new Set(updates.map((u) => u.id));
            const toDelete = existing
              .filter((row) => !currentIdSet.has(row.id))
              .map((row) => row.id);
            if (toDelete.length > 0) {
              const { error: delErr } = await supabase.from('experience').delete().in('id', toDelete);
              if (delErr) console.warn('Could not prune removed experiences:', delErr);
            }
          }

          // 2. Upsert current experiences
          if (updates.length > 0) {
            const { error } = await supabase.from('experience').upsert(updates, { onConflict: 'id' });
            if (error) throw error;
          }
        })(),
        15000,
        'Save request timed out. Please check your network and try again.'
      );

      await refresh();
      notifyClean();
      setSaveState('success');
      toast.success('Career trajectory & milestones saved to Supabase!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      setSaveState('error');
      toast.error('Failed to save experience: ' + formatErrorMessage(err));
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  const handleUploadLogoFile = async (entryId: string, file: File): Promise<string | null> => {
    try {
      const url = await uploadExperienceLogo(file);
      updateEntry(entryId, { logoUrl: url });
      toast.success('Company emblem uploaded to Supabase Storage!');
      return url;
    } catch (err) {
      toast.error('Failed to upload logo: ' + formatErrorMessage(err));
      return null;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Universal Section Header */}
      <EditorSectionHeader
        title="Career Trajectory & Experience"
        subtitle="Manage professional roles, engineering achievements, and technical milestones."
        saveState={saveState}
        onSave={handleSaveAll}
        saveLabel="Save All Milestones"
        onAdd={addEntry}
        addLabel="Add Milestone"
      />

      {/* Experience Cards Stack */}
      <div className="space-y-4 sm:space-y-5">
        {experiences.map((exp, idx) => {
          const isExpanded = expandedId === exp.id;

          return (
            <EditorCardShell
              key={exp.id}
              ordinal={idx + 1}
              title={exp.company ? `${exp.title || 'Role'} · ${exp.company}` : exp.title}
              subtitle={`${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}${exp.location ? ` · ${exp.location}` : ''}`}
              badge={
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                    exp.isActive
                      ? 'bg-terracotta/15 border border-terracotta/50 text-terracotta dark:text-[#ff7d63]'
                      : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink-muted dark:text-dark-ink-muted'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      exp.isActive ? 'bg-terracotta animate-pulse' : 'bg-stone-400 dark:bg-neutral-500'
                    }`}
                  />
                  <span>{exp.isActive ? 'ACTIVE / 現職' : 'COMPLETED / 歴任'}</span>
                </span>
              }
              emblem={
                <span className="font-serif font-bold text-terracotta text-base leading-none">
                  {exp.kanji || '木'}
                </span>
              }
              isExpanded={isExpanded}
              onToggleExpand={() => setExpandedId(isExpanded ? null : exp.id)}
              onMoveUp={() => moveEntry(idx, 'up')}
              onMoveDown={() => moveEntry(idx, 'down')}
              canMoveUp={idx > 0}
              canMoveDown={idx < experiences.length - 1}
              onDelete={() => deleteEntry(exp.id)}
            >
              {/* 2-Column Responsive Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 pt-2">
                {/* Left Column (Role Metadata & Dates) */}
                <div className="md:col-span-5 space-y-4">
                  <div>
                    <Label htmlFor={`exp-${exp.id}-company`} required>
                      Company / Organization
                    </Label>
                    <Input
                      id={`exp-${exp.id}-company`}
                      value={exp.company}
                      onChange={(e) => updateEntry(exp.id, { company: e.target.value })}
                      placeholder="e.g. Sumi Intelligence Studio"
                      className="mt-1 font-serif text-sm font-medium"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`exp-${exp.id}-title`} required>
                      Role Title
                    </Label>
                    <Input
                      id={`exp-${exp.id}-title`}
                      value={exp.title}
                      onChange={(e) => updateEntry(exp.id, { title: e.target.value })}
                      placeholder="e.g. Full-Stack & AI Systems Engineer"
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`exp-${exp.id}-location`} className="text-xs font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-light-ink-muted" />
                        <span>Location</span>
                      </Label>
                      <Input
                        id={`exp-${exp.id}-location`}
                        value={exp.location}
                        onChange={(e) => updateEntry(exp.id, { location: e.target.value })}
                        placeholder="e.g. Tokyo / Remote"
                        className="mt-1 text-xs"
                      />
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 p-2 rounded-md bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={exp.isActive}
                          onChange={(e) => updateEntry(exp.id, { isActive: e.target.checked })}
                          className="rounded text-terracotta focus:ring-terracotta h-4 w-4"
                        />
                        <span className="text-xs font-medium text-light-ink dark:text-dark-ink">
                          Current Active Role
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`exp-${exp.id}-start`} className="text-xs font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-light-ink-muted" />
                        <span>Start Date</span>
                      </Label>
                      <Input
                        id={`exp-${exp.id}-start`}
                        value={exp.startDate}
                        onChange={(e) => updateEntry(exp.id, { startDate: e.target.value })}
                        placeholder="e.g. May 2024"
                        className="mt-1 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`exp-${exp.id}-end`} className="text-xs font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-light-ink-muted" />
                        <span>End Date</span>
                      </Label>
                      <Input
                        id={`exp-${exp.id}-end`}
                        value={exp.endDate}
                        disabled={exp.isActive}
                        onChange={(e) => updateEntry(exp.id, { endDate: e.target.value })}
                        placeholder={exp.isActive ? 'Present (Active)' : 'e.g. Dec 2024'}
                        className="mt-1 text-xs font-mono disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Universal Emblem / Kanji Selector */}
                  <EmblemKanjiSelector
                    kanji={exp.kanji}
                    kanjiSubtitle={exp.kanjiSubtitle}
                    logoUrl={exp.logoUrl}
                    onKanjiChange={(char, romaji) => updateEntry(exp.id, { kanji: char, kanjiSubtitle: romaji || exp.kanjiSubtitle })}
                    onKanjiSubtitleChange={(subtitle) => updateEntry(exp.id, { kanjiSubtitle: subtitle })}
                    onLogoUrlChange={(url) => updateEntry(exp.id, { logoUrl: url })}
                    onUploadImage={(file) => handleUploadLogoFile(exp.id, file)}
                    label="Company Emblem Seal or Logo"
                  />
                </div>

                {/* Right Column (Overview & Engineering Impact Bullets) */}
                <div className="md:col-span-7 space-y-5">
                  <div>
                    <Label htmlFor={`exp-${exp.id}-overview`} className="text-xs font-medium">
                      Executive Overview &amp; Role Context
                    </Label>
                    <Textarea
                      id={`exp-${exp.id}-overview`}
                      rows={3}
                      value={exp.overview}
                      onChange={(e) =>
                        updateEntry(exp.id, {
                          overview: e.target.value,
                          description: e.target.value,
                        })
                      }
                      placeholder="High-level narrative summarizing your leadership, team context, and core system responsibility…"
                      className="mt-1 text-xs leading-relaxed"
                    />
                  </div>

                  {/* Universal Tech Stack Tags */}
                  <TechTagSelector
                    tags={exp.tags}
                    onChange={(tags) => updateEntry(exp.id, { tags })}
                    label="Substrates & Core Tech Stack"
                  />

                  {/* Universal Bullet List Editor */}
                  <BulletListEditor
                    bullets={exp.bullets}
                    onChange={(bullets) => updateEntry(exp.id, { bullets })}
                    label="Engineering Contributions & Quantified Impact"
                    placeholder="e.g. Engineered real-time WebGL canvas pipeline reducing render latency by 45%…"
                  />
                </div>
              </div>
            </EditorCardShell>
          );
        })}

        {experiences.length === 0 && (
          <div className="text-center py-12 border border-dashed border-light-border dark:border-dark-border rounded-xl bg-light-surface/30 dark:bg-dark-surface/30">
            <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted">
              No career milestones found. Click "+ New Milestone" above to add your first role.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
