import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  Github,
  ExternalLink,
  GripVertical,
  Loader2,
  Star,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { supabase, formatErrorMessage, uploadProjectImage } from '../../../lib/supabase';
import { useSiteData } from '../../../context/SiteDataContext';
import { CornerBrackets } from '../../CornerBrackets';
import { TechTag } from '../../TechTag';
import { TechTagModal } from '../TechTagModal';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner';

/* ─── Types ──────────────────────────────────────────────────────────── */

export interface ProjectSection {
  id: string;
  heading: string;
  bullets: string[];
}

export interface ProjectEntry {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  summary: string;
  overview: string;
  kanji: string;
  badge: string;
  image: string;
  sections: ProjectSection[];
  techStacks: string[];
  githubLink: string;
  liveLink: string;
  isFeatured: boolean;
  displayOrder: number;
}

const CATEGORIES = [
  'Distributed Systems',
  'Generative AI',
  'Creative Tech',
  'Full-Stack',
] as const;

const newSection = (): ProjectSection => ({
  id: crypto.randomUUID(),
  heading: '',
  bullets: [''],
});

const newProject = (order: number = 0): ProjectEntry => ({
  id: crypto.randomUUID(),
  title: '',
  subtitle: '',
  category: 'Distributed Systems',
  summary: '',
  overview: '',
  kanji: '',
  badge: '',
  image: '',
  sections: [newSection()],
  techStacks: [],
  githubLink: '',
  liveLink: '',
  isFeatured: false,
  displayOrder: order,
});

type SaveState = 'idle' | 'saving' | 'success' | 'error';
type ProjectsTab = 'featured' | 'all';

/* ─── Tech Stack Tag Input ───────────────────────────────────────────── */
const TechTagInput: React.FC<{
  tags: string[];
  onChange: (tags: string[]) => void;
}> = ({ tags, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Tech Stack &amp; Infrastructure</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="text-terracotta hover:text-terracotta hover:bg-terracotta/10 text-xs h-7 px-2"
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
            + Click to add official tech stack badges
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

/* ─── Image Uploader & Preview ───────────────────────────────────────── */
const ImageUploader: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadProjectImage(file);
      onChange(url);
      toast.success('Project image uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload image: ' + formatErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>Project Hero &amp; Thumbnail Image</Label>
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {/* Preview Frame */}
        <div className="relative w-28 h-20 sm:w-32 sm:h-22 rounded-lg border border-light-border dark:border-dark-border overflow-hidden bg-light-surface dark:bg-dark-surface-muted shrink-0 group">
          <CornerBrackets size="sm" />
          {value ? (
            <img
              src={value}
              alt="Project Preview"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = './images/sumi-os-workspace.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-light-ink-subtle text-[10px]">
              <ImageIcon className="w-5 h-5 mb-1 opacity-40" />
              <span>No image</span>
            </div>
          )}
        </div>

        {/* Inputs */}
        <div className="flex-1 space-y-2 w-full min-w-0">
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-light-ink-subtle pointer-events-none" />
            <Input
              type="text"
              className="pl-8"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="./images/sumi-os-workspace.jpg or https://..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5 shrink-0"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-terracotta" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>{uploading ? 'Uploading…' : 'Upload Image File'}</span>
            </Button>
            <span className="font-sans text-[11px] text-light-ink-subtle dark:text-dark-ink-subtle">
              (Uploaded to Supabase Storage)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Section Card Editor ────────────────────────────────────────────── */
const SectionCardEditor: React.FC<{
  section: ProjectSection;
  onChange: (patch: Partial<ProjectSection>) => void;
  onRemove: () => void;
}> = ({ section, onChange, onRemove }) => {
  const updateBullet = (idx: number, val: string) => {
    const next = [...section.bullets];
    next[idx] = val;
    onChange({ bullets: next });
  };
  const addBullet = () => onChange({ bullets: [...section.bullets, ''] });
  const removeBullet = (idx: number) =>
    onChange({ bullets: section.bullets.filter((_, i) => i !== idx) });

  return (
    <div className="relative rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-4 space-y-3 shadow-xs classical-card-frame">
      <CornerBrackets size="sm" />
      {/* Heading */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-terracotta font-semibold">§</span>
        <Input
          type="text"
          value={section.heading}
          onChange={(e) => onChange({ heading: e.target.value })}
          className="font-semibold flex-1 min-w-0"
          placeholder="Section heading (e.g. Local Inference Runtime)"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="p-1.5 h-8 w-8 text-light-ink-muted hover:text-red-500 shrink-0"
          title="Remove section"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Bullets */}
      <div className="pl-2 sm:pl-6 space-y-2.5">
        {section.bullets.map((bullet, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-terracotta text-sm shrink-0 mt-2 select-none">
              ⊘
            </span>
            <Textarea
              rows={2}
              value={bullet}
              onChange={(e) => updateBullet(idx, e.target.value)}
              className="flex-1 min-h-[52px] text-xs py-1.5 min-w-0"
              placeholder={`Bullet point ${idx + 1}…`}
            />
            <button
              type="button"
              onClick={() => removeBullet(idx)}
              className="p-1 text-light-ink-muted dark:text-dark-ink-muted hover:text-red-500 transition-colors shrink-0 cursor-pointer mt-1"
              title="Remove bullet"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={addBullet}
          className="gap-1 p-0 h-auto font-sans text-xs text-terracotta"
        >
          <Plus className="w-3 h-3" />
          Add bullet
        </Button>
      </div>
    </div>
  );
};

/* ─── Main ProjectsEditor Component ─────────────────────────────────── */
export const ProjectsEditor: React.FC = () => {
  const { projects: contextProjects, refresh } = useSiteData();
  const [projects, setProjects] = useState<ProjectEntry[]>(() => {
    if (contextProjects && contextProjects.length > 0) {
      return contextProjects.map((p, idx) => ({
        id: p.id || crypto.randomUUID(),
        title: p.title || '',
        subtitle: p.subtitle || '',
        category: p.category || 'Distributed Systems',
        summary: p.description || '',
        overview: p.overview || p.description || '',
        kanji: p.kanji || '案',
        badge: p.badge || 'ENGINEERING ARCHIVE',
        image: p.image || './images/sumi-os-workspace.jpg',
        sections:
          p.architectureDetails && p.architectureDetails.length > 0
            ? p.architectureDetails.map((a) => ({
                id: crypto.randomUUID(),
                heading: a.title,
                bullets: a.points || [''],
              }))
            : [newSection()],
        techStacks: p.tags || [],
        githubLink: p.links?.github || '',
        liveLink: p.links?.live || '',
        isFeatured: typeof p.isFeatured === 'boolean' ? p.isFeatured : idx < 3,
        displayOrder: typeof p.displayOrder === 'number' ? p.displayOrder : idx,
      }));
    }
    return [];
  });
  const [activeTab, setActiveTab] = useState<ProjectsTab>('featured');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync from SiteDataContext
  useEffect(() => {
    if (contextProjects && contextProjects.length > 0) {
      setProjects(
        contextProjects.map((p, idx) => ({
          id: p.id || crypto.randomUUID(),
          title: p.title || '',
          subtitle: p.subtitle || '',
          category: p.category || 'Distributed Systems',
          summary: p.description || '',
          overview: p.overview || p.description || '',
          kanji: p.kanji || '案',
          badge: p.badge || 'ENGINEERING ARCHIVE',
          image: p.image || './images/sumi-os-workspace.jpg',
          sections:
            p.architectureDetails && p.architectureDetails.length > 0
              ? p.architectureDetails.map((a) => ({
                  id: crypto.randomUUID(),
                  heading: a.title,
                  bullets: a.points || [''],
                }))
              : [newSection()],
          techStacks: p.tags || [],
          githubLink: p.links?.github || '',
          liveLink: p.links?.live || '',
          isFeatured: typeof p.isFeatured === 'boolean' ? p.isFeatured : idx < 3,
          displayOrder: typeof p.displayOrder === 'number' ? p.displayOrder : idx,
        })),
      );
    }
  }, [contextProjects]);

  const updateProject = (id: string, patch: Partial<ProjectEntry>) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );

  /**
   * Real-time Star Toggle: Updates local state and syncs directly to Supabase
   */
  const toggleFeatured = async (id: string) => {
    const current = projects.find((p) => p.id === id);
    if (!current) return;
    const willBeFeatured = !current.isFeatured;

    if (willBeFeatured) {
      const currentCount = projects.filter((p) => p.isFeatured).length;
      if (currentCount >= 3) {
        toast.info('Maximum 3 Selected Works allowed on the Home Page.');
        return;
      }
    }

    // 1. Immediately update local state
    const updated = projects.map((p) =>
      p.id === id ? { ...p, isFeatured: willBeFeatured } : p,
    );
    setProjects(updated);

    // 2. Immediately write to localStorage
    try {
      localStorage.setItem('portfolio_projects_cache', JSON.stringify(updated));
    } catch {}

    // 3. Immediately persist to Supabase
    if (supabase) {
      try {
        const { error } = await supabase
          .from('projects')
          .update({
            is_featured: willBeFeatured,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;

        toast.success(
          willBeFeatured
            ? `"${current.title || 'Project'}" added to Home Showcase!`
            : `"${current.title || 'Project'}" removed from Home Showcase!`,
        );
        await refresh();
      } catch (err) {
        console.error('Failed to update is_featured:', err);
        toast.error('Failed to sync database: ' + formatErrorMessage(err));
      }
    }
  };

  /**
   * Sync Order across database
   */
  const syncOrderToDatabase = async (list: ProjectEntry[]) => {
    try {
      localStorage.setItem('portfolio_projects_cache', JSON.stringify(list));
    } catch {}

    const client = supabase;
    if (client) {
      try {
        const promises = list.map((p, idx) =>
          client
            .from('projects')
            .update({ display_order: idx, updated_at: new Date().toISOString() })
            .eq('id', p.id),
        );
        await Promise.all(promises);
        await refresh();
      } catch (err) {
        console.warn('Order sync warning:', err);
      }
    }
  };

  const moveProject = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= projects.length) return;
    const copy = [...projects];
    const [item] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, item);
    const reordered = copy.map((p, idx) => ({ ...p, displayOrder: idx }));
    setProjects(reordered);
    await syncOrderToDatabase(reordered);
  };

  const moveFeaturedProject = async (id: string, direction: 'up' | 'down') => {
    const featuredList = projects.filter((p) => p.isFeatured);
    const currIdx = featuredList.findIndex((p) => p.id === id);
    if (currIdx === -1) return;
    const targetIdx = direction === 'up' ? currIdx - 1 : currIdx + 1;
    if (targetIdx < 0 || targetIdx >= featuredList.length) return;

    const reorderedFeatured = [...featuredList];
    const [item] = reorderedFeatured.splice(currIdx, 1);
    reorderedFeatured.splice(targetIdx, 0, item);

    const nonFeatured = projects.filter((p) => !p.isFeatured);
    const combined = [...reorderedFeatured, ...nonFeatured].map((p, idx) => ({
      ...p,
      displayOrder: idx,
    }));

    setProjects(combined);
    await syncOrderToDatabase(combined);
  };

  const deleteProject = async (id: string) => {
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    if (expandedId === id) setExpandedId(null);

    if (supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id);
        toast.info('Project deleted from database.');
        await refresh();
      } catch (err) {
        toast.error('Failed to delete project: ' + formatErrorMessage(err));
      }
    }
  };

  const handleAddNew = () => {
    const created = newProject(projects.length);
    setProjects((prev) => [...prev, created]);
    setExpandedId(created.id);
    setActiveTab('all');
  };

  /* ─── Robust Drag & Drop Handling ─── */
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

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const fromIndex =
      draggedIndex !== null
        ? draggedIndex
        : Number(e.dataTransfer.getData('text/plain'));

    setDraggedIndex(null);
    setDragOverIndex(null);

    if (isNaN(fromIndex) || fromIndex === dropIndex) return;

    if (activeTab === 'all') {
      await moveProject(fromIndex, dropIndex);
    } else {
      const featured = projects.filter((p) => p.isFeatured);
      const nonFeatured = projects.filter((p) => !p.isFeatured);
      if (
        fromIndex < 0 ||
        fromIndex >= featured.length ||
        dropIndex < 0 ||
        dropIndex >= featured.length
      )
        return;

      const reorderedFeatured = [...featured];
      const [item] = reorderedFeatured.splice(fromIndex, 1);
      reorderedFeatured.splice(dropIndex, 0, item);

      const combined = [...reorderedFeatured, ...nonFeatured].map((p, idx) => ({
        ...p,
        displayOrder: idx,
      }));

      setProjects(combined);
      await syncOrderToDatabase(combined);
      toast.success('Home Showcase order updated!');
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  /* ─── Save All ─── */
  const handleSaveAll = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');
    setErrorMsg('');

    try {
      if (!supabase) throw new Error('Supabase is not configured.');

      const rows = projects.map((p, idx) => ({
        id: p.id,
        title: p.title || `Project ${idx + 1}`,
        subtitle: p.subtitle,
        category: p.category,
        summary: p.summary,
        description: p.summary,
        overview: p.overview || p.summary,
        kanji: p.kanji || '案',
        badge: p.badge || 'ENGINEERING ARCHIVE',
        image: p.image || './images/sumi-os-workspace.jpg',
        tech_stacks: p.techStacks,
        sections: p.sections,
        github_link: p.githubLink,
        live_link: p.liveLink,
        is_featured: p.isFeatured,
        display_order: idx,
        is_published: true,
        updated_at: new Date().toISOString(),
      }));

      // Cache directly to localStorage
      try {
        localStorage.setItem('portfolio_projects_cache', JSON.stringify(projects));
      } catch {}

      const { error } = await supabase
        .from('projects')
        .upsert(rows, { onConflict: 'id' });
      if (error) throw error;

      await refresh();
      setSaveState('success');
      toast.success('All projects saved & synchronized with database!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      const msg = formatErrorMessage(err);
      setErrorMsg(msg);
      setSaveState('error');
      toast.error(msg || 'Failed to save projects.');
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  const featuredProjects = projects.filter((p) => p.isFeatured);
  const displayedList = activeTab === 'featured' ? featuredProjects : projects;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-light-ink dark:text-dark-ink font-normal">
            Projects &amp; Engineering Works
          </h2>
          <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted mt-1">
            Manage your Home Showcase (up to 3) and full archive. Click and drag or use arrows to reorder.
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
            Add Project
          </Button>

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

      {/* Tabs using Shadcn Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as ProjectsTab)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full sm:w-auto sm:inline-flex h-auto p-1 gap-1">
          <TabsTrigger value="featured" className="gap-1.5 sm:gap-2 py-2 px-2.5 sm:px-3.5 justify-center">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-terracotta" />
            <span className="text-xs font-medium">
              <span className="hidden md:inline">Selected Works </span>
              <span className="sm:hidden">Showcase</span>
              <span className="hidden sm:inline md:hidden">Home Showcase</span>
              <span className="hidden md:inline">(Showcase)</span>
            </span>
            <Badge variant="terracotta" className="py-0 px-1.5 text-[10px] shrink-0 font-mono">
              {featuredProjects.length}/3
            </Badge>
          </TabsTrigger>

          <TabsTrigger value="all" className="gap-1.5 sm:gap-2 py-2 px-2.5 sm:px-3.5 justify-center">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs font-medium">
              <span className="hidden sm:inline">All </span>Projects<span className="hidden md:inline"> Catalog</span>
            </span>
            <Badge variant="secondary" className="py-0 px-1.5 text-[10px] shrink-0 font-mono">
              {projects.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Projects List Container */}
      <div className="space-y-4">
        {displayedList.map((project, idx) => {
          const isExpanded = expandedId === project.id;
          const isDragging = draggedIndex === idx;
          const isOver = dragOverIndex === idx;

          return (
            <div
              key={project.id}
              draggable={!isExpanded}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={`relative bg-light-surface-card dark:bg-dark-surface border rounded-xl transition-all duration-200 classical-card-frame shadow-xs ${
                isExpanded
                  ? 'border-terracotta/40 dark:border-terracotta/40 ring-1 ring-terracotta/20'
                  : 'border-light-border dark:border-dark-border hover:border-terracotta/40'
              } ${isDragging ? 'opacity-30 scale-[0.99] border-dashed border-terracotta' : ''} ${
                isOver ? 'border-terracotta ring-2 ring-terracotta/30' : ''
              }`}
            >
              <CornerBrackets size="sm" />

              {/* ── Impeccable Responsive Mini-Card Header ── */}
              <div className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 select-none">
                {/* Left: Drag Handle, Arrows, Number & Title */}
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
                      onClick={() =>
                        activeTab === 'featured'
                          ? moveFeaturedProject(project.id, 'up')
                          : moveProject(idx, idx - 1)
                      }
                      disabled={idx === 0}
                      className="p-0.5 rounded text-light-ink-subtle hover:text-terracotta disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        activeTab === 'featured'
                          ? moveFeaturedProject(project.id, 'down')
                          : moveProject(idx, idx + 1)
                      }
                      disabled={idx === displayedList.length - 1}
                      className="p-0.5 rounded text-light-ink-subtle hover:text-terracotta disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Order Num */}
                  <Badge variant="terracotta" className="font-mono text-xs px-2 py-0.5 shrink-0 mt-0.5 sm:mt-0">
                    {String(idx + 1).padStart(2, '0')}
                  </Badge>

                  {/* Title & Info */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : project.id)}
                    className="flex flex-col min-w-0 cursor-pointer group/title flex-1"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif text-sm sm:text-base font-medium text-light-ink dark:text-dark-ink group-hover/title:text-terracotta transition-colors">
                        {project.title || 'Untitled Project'}
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono py-0 shrink-0">
                        {project.category}
                      </Badge>
                      {project.kanji && (
                        <span className="font-serif text-xs text-terracotta font-semibold shrink-0">
                          {project.kanji}
                        </span>
                      )}
                    </div>
                    {project.subtitle && (
                      <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted truncate mt-0.5">
                        {project.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Quick Actions */}
                <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-light-border/40 dark:border-dark-border/40" draggable={false}>
                  {/* Star Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleFeatured(project.id)}
                    className={`p-1.5 sm:p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                      project.isFeatured
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-500 hover:bg-amber-500/25'
                        : 'border-light-border dark:border-dark-border text-light-ink-subtle hover:text-amber-500'
                    }`}
                    title={
                      project.isFeatured
                        ? 'Selected for Home Showcase (click to remove and sync DB)'
                        : 'Feature on Home Showcase (max 3)'
                    }
                  >
                    <Star
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        project.isFeatured ? 'fill-amber-500' : ''
                      }`}
                    />
                    <span className="text-[11px] font-sans sm:hidden font-medium">
                      {project.isFeatured ? 'Featured' : 'Feature'}
                    </span>
                  </button>

                  {/* Expand / Collapse Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedId(isExpanded ? null : project.id)}
                    className="gap-1 h-8 px-2.5"
                  >
                    <span>{isExpanded ? 'Collapse' : 'Edit'}</span>
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
                    onClick={() => deleteProject(project.id)}
                    className="h-8 w-8 p-0 text-light-ink-muted hover:text-red-500 hover:bg-red-500/10 shrink-0"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Expandable Form Body */}
              {isExpanded && (
                <div
                  draggable={false}
                  className="p-4 sm:p-6 border-t border-light-border dark:border-dark-border bg-light-surface-raised/40 dark:bg-dark-surface-card/60 space-y-6"
                >
                  {/* Grid 1: Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <Label className="text-terracotta mb-1.5">
                        Title <span className="text-light-ink-subtle dark:text-dark-ink-subtle font-normal">(table primary identifier)</span>
                      </Label>
                      <Input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateProject(project.id, { title: e.target.value })}
                        placeholder="e.g. Sumi OS & Workspace"
                        className="font-semibold"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5">Category</Label>
                      <select
                        className="flex h-9 w-full rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface-muted px-3 py-1 text-xs sm:text-sm text-light-ink dark:text-dark-ink focus:outline-none focus:border-terracotta"
                        value={project.category}
                        onChange={(e) => updateProject(project.id, { category: e.target.value })}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Grid 2: Subtitle, Kanji, Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-6">
                      <Label className="mb-1.5">Subtitle / Tagline (Resizable)</Label>
                      <Textarea
                        rows={2}
                        className="min-h-[58px]"
                        value={project.subtitle}
                        onChange={(e) => updateProject(project.id, { subtitle: e.target.value })}
                        placeholder="e.g. Contemplative Digital Environment & Local Intelligence"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Label className="mb-1.5">Kanji Symbol</Label>
                      <Input
                        type="text"
                        value={project.kanji}
                        onChange={(e) => updateProject(project.id, { kanji: e.target.value })}
                        placeholder="e.g. 墨"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Label className="mb-1.5">Badge Label</Label>
                      <Input
                        type="text"
                        value={project.badge}
                        onChange={(e) => updateProject(project.id, { badge: e.target.value })}
                        placeholder="e.g. DISTRIBUTED DESKTOP"
                      />
                    </div>
                  </div>

                  {/* Summary & Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1.5">Summary (Card Narrative - Resizable)</Label>
                      <Textarea
                        rows={3}
                        className="min-h-[85px]"
                        value={project.summary}
                        onChange={(e) => updateProject(project.id, { summary: e.target.value })}
                        placeholder="One-to-two sentence overview of the system…"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5">Overview (Modal Narrative - Resizable)</Label>
                      <Textarea
                        rows={3}
                        className="min-h-[85px]"
                        value={project.overview}
                        onChange={(e) => updateProject(project.id, { overview: e.target.value })}
                        placeholder="Detailed architecture and rationale breakdown…"
                      />
                    </div>
                  </div>

                  {/* Image Uploader */}
                  <ImageUploader
                    value={project.image}
                    onChange={(image) => updateProject(project.id, { image })}
                  />

                  {/* Sections (Highlight Cards) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sections (Highlight Cards for Case Study)</Label>
                        <p className="font-sans text-[11px] text-light-ink-muted dark:text-dark-ink-muted">
                          Each section represents one architectural focus card with resizable bullet points.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateProject(project.id, {
                            sections: [...project.sections, newSection()],
                          })
                        }
                        className="text-terracotta hover:text-terracotta hover:bg-terracotta/10 text-xs h-7"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add Section
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {project.sections.map((sec) => (
                        <SectionCardEditor
                          key={sec.id}
                          section={sec}
                          onChange={(patch) =>
                            updateProject(project.id, {
                              sections: project.sections.map((s) =>
                                s.id === sec.id ? { ...s, ...patch } : s,
                              ),
                            })
                          }
                          onRemove={() =>
                            updateProject(project.id, {
                              sections: project.sections.filter((s) => s.id !== sec.id),
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Official Tech Stack Badges */}
                  <TechTagInput
                    tags={project.techStacks}
                    onChange={(techStacks) => updateProject(project.id, { techStacks })}
                  />

                  {/* Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1.5">GitHub Repository URL</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-light-ink-subtle pointer-events-none" />
                        <Input
                          type="url"
                          className="pl-8"
                          value={project.githubLink}
                          onChange={(e) => updateProject(project.id, { githubLink: e.target.value })}
                          placeholder="https://github.com/…"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="mb-1.5">Live Deployment URL</Label>
                      <div className="relative">
                        <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-light-ink-subtle pointer-events-none" />
                        <Input
                          type="url"
                          className="pl-8"
                          value={project.liveLink}
                          onChange={(e) => updateProject(project.id, { liveLink: e.target.value })}
                          placeholder="https://your-project.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer Bar */}
                  <div className="pt-4 mt-8 border-t border-light-border/80 dark:border-dark-border/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-light-ink-muted dark:text-dark-ink-muted">
                      <span className="font-mono text-[10px] text-terracotta font-semibold uppercase tracking-wider">
                        STATUS:
                      </span>
                      <span>
                        {project.isFeatured ? 'Featured on Home Showcase' : 'Archived in All Projects'}
                      </span>
                      <span className="text-light-ink-subtle">·</span>
                      <span className="font-mono text-[10px]">
                        Order #{idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedId(null)}
                        className="text-light-ink-muted hover:text-light-ink dark:hover:text-dark-ink text-xs h-8"
                      >
                        Collapse Card
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setExpandedId(null);
                          toast.success(`Changes to "${project.title || 'Project'}" ready to save.`);
                        }}
                        className="gap-1.5 h-8 px-3 text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-bamboo" />
                        <span>Done Editing</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {displayedList.length === 0 && (
        <div className="text-center py-16 text-light-ink-muted dark:text-dark-ink-muted font-sans text-sm rounded-xl border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface p-8">
          {activeTab === 'featured' ? (
            <>
              <Star className="w-8 h-8 text-amber-500/60 mx-auto mb-2" />
              <p className="font-serif text-base text-light-ink dark:text-dark-ink mb-1">
                No Selected Works Chosen for Home Showcase
              </p>
              <p className="text-xs mb-4">
                Switch to &ldquo;All Projects Catalog&rdquo; and click the Star icon on up to 3 projects to display them on the homepage.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('all')}
              >
                Go to All Projects Catalog →
              </Button>
            </>
          ) : (
            <>
              <p>No projects in the catalog yet.</p>
              <Button
                type="button"
                variant="link"
                onClick={handleAddNew}
                className="mt-2"
              >
                Add your first project
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
