import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Star,
  Github,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { supabase, formatErrorMessage, uploadProjectImage, withTimeout } from '../../../lib/supabase';
import { useSiteData, Project } from '../../../context/SiteDataContext';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { EditorCardShell } from '../shared/EditorCardShell';
import { TechTagSelector } from '../shared/TechTagSelector';
import { EmblemKanjiSelector } from '../shared/EmblemKanjiSelector';
import { BulletListEditor } from '../shared/BulletListEditor';
import { useAdminDirty } from '../shared/useAdminDirty';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { toast } from 'sonner';

export interface ProjectEntry {
  id: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  statusLabel: string;
  summary: string;
  overview: string;
  kanji: string;
  badge: string;
  image: string;
  bullets: string[];
  techStacks: string[];
  githubLink: string;
  liveLink: string;
  isFeatured: boolean;
  displayOrder: number;
}

const mapProjectsFromContext = (contextProjects: Project[]): ProjectEntry[] => {
  return contextProjects.map((p, idx) => ({
    id: p.id || crypto.randomUUID(),
    title: p.title || '',
    subtitle: p.subtitle || '',
    startDate: p.startDate || '',
    endDate: p.endDate || '',
    isActive: typeof p.isActive === 'boolean' ? p.isActive : idx === 0,
    statusLabel: p.statusLabel || (p.isActive ? 'ACTIVE / 稼働中' : 'COMPLETED / 完了'),
    summary: p.description || '',
    overview: p.overview || p.description || '',
    kanji: p.kanji || '案',
    badge: p.badge || 'ENGINEERING ARCHIVE',
    image: p.image || './images/sumi-os-workspace.jpg',
    bullets: Array.isArray(p.bullets) && p.bullets.length > 0 ? p.bullets : [''],
    techStacks: p.tags || [],
    githubLink: p.links?.github || '',
    liveLink: p.links?.live || '',
    isFeatured: typeof p.isFeatured === 'boolean' ? p.isFeatured : idx < 3,
    displayOrder: typeof p.displayOrder === 'number' ? p.displayOrder : idx,
  }));
};

const newProject = (order: number = 0): ProjectEntry => ({
  id: crypto.randomUUID(),
  title: '',
  subtitle: '',
  startDate: '',
  endDate: '',
  isActive: order === 0,
  statusLabel: order === 0 ? 'ACTIVE / 稼働中' : 'COMPLETED / 完了',
  summary: '',
  overview: '',
  kanji: '案',
  badge: 'ENGINEERING ARCHIVE',
  image: '',
  bullets: [''],
  techStacks: [],
  githubLink: '',
  liveLink: '',
  isFeatured: false,
  displayOrder: order,
});

export const ProjectsEditor: React.FC = () => {
  const { projects: contextProjects, refresh } = useSiteData();
  const [projects, setProjects] = useState<ProjectEntry[]>(() => {
    if (contextProjects && contextProjects.length > 0) {
      return mapProjectsFromContext(contextProjects);
    }
    return [];
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const resetProjects = useCallback(() => {
    if (contextProjects && contextProjects.length > 0) {
      setProjects(mapProjectsFromContext(contextProjects));
    }
  }, [contextProjects]);

  // Sync from context
  useEffect(() => {
    resetProjects();
  }, [resetProjects]);

  const projectsRef = useRef(projects);
  projectsRef.current = projects;

  const handleSaveRef = useRef<() => void>(() => {});

  const { notifyDirty, notifyClean } = useAdminDirty('projects', resetProjects, () => {
    handleSaveRef.current();
  });

  // Drag and drop handlers
  const handleDragStart = (idx: number) => (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const handleDragOver = (idx: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== idx) {
      setDragOverIdx(idx);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDrop = (targetIdx: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    notifyDirty();
    const copy = [...projects];
    const [moved] = copy.splice(draggedIdx, 1);
    copy.splice(targetIdx, 0, moved);

    const reordered = copy.map((p, idx) => ({ ...p, displayOrder: idx }));
    setProjects(reordered);
    setDraggedIdx(null);
    setDragOverIdx(null);
    toast.success(`Moved "${moved.title || 'Project'}" to position #${targetIdx + 1}`);
  };

  const updateProject = (id: string, patch: Partial<ProjectEntry>) => {
    notifyDirty();
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  };

  const addProject = () => {
    notifyDirty();
    const created = newProject(projects.length);
    setProjects((prev) => [created, ...prev]);
    setExpandedId(created.id);
  };

  const deleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;

    const originalList = [...projects];
    const updatedList = projects.filter((p) => p.id !== id);

    setProjects(updatedList);
    notifyDirty();

    toast(`Deleted "${target.title || 'Untitled Project'}"`, {
      description: 'Click undo to restore this project.',
      duration: 6000,
      action: {
        label: 'Undo',
        onClick: () => {
          setProjects(originalList);
          notifyDirty();
          toast.success(`Restored "${target.title || 'Project'}"`);
        },
      },
    });
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    notifyDirty();
    const copy = [...projects];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);

    const reordered = copy.map((p, idx) => ({ ...p, displayOrder: idx }));
    setProjects(reordered);
  };

  const toggleFeatured = (id: string) => {
    const current = projects.find((p) => p.id === id);
    if (!current) return;

    const willBeFeatured = !current.isFeatured;
    if (willBeFeatured) {
      const currentCount = projects.filter((p) => p.isFeatured).length;
      if (currentCount >= 3) {
        toast.info('Maximum 3 featured projects displayed on the homepage showcase.');
        return;
      }
    }

    updateProject(id, { isFeatured: willBeFeatured });
    toast.success(
      willBeFeatured
        ? `Starred "${current.title || 'Project'}" for Homepage Showcase`
        : `Removed "${current.title || 'Project'}" from Homepage Showcase`,
    );
  };

  const handleSaveAll = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');

    try {
      if (!supabase) throw new Error('Supabase not configured');

      const updates = projects.map((p, idx) => ({
        id: p.id,
        title: p.title || `Project ${idx + 1}`,
        subtitle: p.subtitle || '',
        category: p.badge || '',
        start_date: p.startDate || '',
        end_date: p.endDate || '',
        is_active: Boolean(p.isActive),
        status_label: p.statusLabel || (p.isActive ? 'ACTIVE / 稼働中' : 'COMPLETED / 完了'),
        description: p.overview || p.summary || '',
        overview: p.overview || p.summary || '',
        kanji: p.kanji || '案',
        badge: p.badge || 'ENGINEERING ARCHIVE',
        image: p.image || './images/sumi-os-workspace.jpg',
        tech_stacks: p.techStacks || [],
        bullets: p.bullets.filter(Boolean),
        github_link: p.githubLink || '',
        live_link: p.liveLink || '',
        display_order: typeof p.displayOrder === 'number' ? p.displayOrder : idx,
        is_featured: Boolean(p.isFeatured),
        updated_at: new Date().toISOString(),
      }));

      await withTimeout(
        (async () => {
          // 1. Prune removed projects in Supabase by primary key 'id'
          const { data: existing } = await supabase.from('projects').select('id');
          if (existing && existing.length > 0) {
            const currentIdSet = new Set(updates.map((u) => u.id));
            const toDelete = existing
              .filter((row) => !currentIdSet.has(row.id))
              .map((row) => row.id);
            if (toDelete.length > 0) {
              const { error: delErr } = await supabase.from('projects').delete().in('id', toDelete);
              if (delErr) console.warn('Could not prune removed projects:', delErr);
            }
          }

          // 2. Upsert current projects by primary key 'id'
          if (updates.length > 0) {
            const { error } = await supabase.from('projects').upsert(updates, { onConflict: 'id' });
            if (error) throw error;
          }
        })(),
        15000,
        'Save request timed out. Please check your network and try again.'
      );

      await refresh();
      notifyClean();
      setSaveState('success');
      toast.success('All projects saved successfully to Supabase!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      setSaveState('error');
      toast.error('Failed to save projects: ' + formatErrorMessage(err));
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  handleSaveRef.current = handleSaveAll;

  const handleUploadImageFile = async (projectId: string, file: File): Promise<string | null> => {
    try {
      const url = await uploadProjectImage(file);
      updateProject(projectId, { image: url });
      toast.success('Project image uploaded to Supabase Storage!');
      return url;
    } catch (err) {
      toast.error('Failed to upload image: ' + formatErrorMessage(err));
      return null;
    }
  };

  const featuredCount = projects.filter((p) => p.isFeatured).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Universal Section Header */}
      <EditorSectionHeader
        title="Projects & Works"
        subtitle={`Manage portfolio projects, case study architecture, and star up to 3 to feature on the homepage (${featuredCount}/3 featured).`}
        saveState={saveState}
        onSave={handleSaveAll}
        saveLabel="Save All Projects"
        onAdd={addProject}
        addLabel="Add Project"
      />

      {/* Unified Projects Card Stack */}
      <div className="space-y-4 sm:space-y-5">
        {projects.map((project, originalIdx) => {
          const isExpanded = expandedId === project.id;

          return (
            <EditorCardShell
              key={project.id}
              ordinal={originalIdx + 1}
              title={project.title}
              subtitle={`${project.startDate || 'Start'} - ${project.endDate || (project.isActive ? 'Present' : 'Completed')}${project.subtitle ? ` · ${project.subtitle}` : ''}`}
              badge={
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFeatured(project.id);
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[32px] rounded-md font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      project.isFeatured
                        ? 'bg-ochre/15 text-ochre border border-ochre/40'
                        : 'bg-light-surface dark:bg-dark-surface text-light-ink-muted dark:text-dark-ink-muted border border-light-border dark:border-dark-border hover:text-ochre hover:border-ochre/40'
                    }`}
                    title={project.isFeatured ? 'Featured on homepage showcase' : 'Click to feature on homepage'}
                  >
                    <Star className={`w-3.5 h-3.5 ${project.isFeatured ? 'fill-ochre text-ochre' : ''}`} />
                    <span>{project.isFeatured ? 'Featured' : 'Archive'}</span>
                  </button>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[32px] rounded-md font-mono text-[11px] font-semibold uppercase tracking-wider ${
                      project.isActive
                        ? 'bg-terracotta/15 border border-terracotta/40 text-terracotta dark:text-terracotta-soft'
                        : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-ink-muted dark:text-dark-ink-muted'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        project.isActive ? 'bg-terracotta' : 'bg-stone-400 dark:bg-neutral-500'
                      }`}
                    />
                    <span>{project.isActive ? 'ACTIVE / 稼働中' : 'COMPLETED / 完了'}</span>
                  </span>
                </div>
              }
              emblem={
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-terracotta/40 bg-terracotta/5 dark:bg-terracotta/10 flex items-center justify-center p-0.5 overflow-hidden select-none shrink-0">
                  <span className={`font-serif font-bold text-terracotta leading-tight text-center ${
                    (project.kanji?.length || 0) > 2
                      ? 'text-[10px] tracking-tighter leading-none'
                      : (project.kanji?.length || 0) === 2
                      ? 'text-[11px] sm:text-xs tracking-tight'
                      : 'text-sm sm:text-base'
                  }`}>
                    {project.kanji || '案'}
                  </span>
                </div>
              }
              isExpanded={isExpanded}
              onToggleExpand={() => setExpandedId(isExpanded ? null : project.id)}
              onMoveUp={() => moveProject(originalIdx, 'up')}
              onMoveDown={() => moveProject(originalIdx, 'down')}
              canMoveUp={originalIdx > 0}
              canMoveDown={originalIdx < projects.length - 1}
              onDelete={() => deleteProject(project.id)}
              draggable={!isExpanded}
              onDragStart={handleDragStart(originalIdx)}
              onDragOver={handleDragOver(originalIdx)}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop(originalIdx)}
              isDragging={draggedIdx === originalIdx}
              isOver={dragOverIdx === originalIdx}
            >
              {/* 2-Column Responsive Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 pt-2">
                {/* Left Column (Metadata & Identity) */}
                <div className="md:col-span-5 space-y-4">
                  <div>
                    <Label htmlFor={`proj-${project.id}-title`} required>
                      Project Title
                    </Label>
                    <Input
                      id={`proj-${project.id}-title`}
                      value={project.title}
                      onChange={(e) => updateProject(project.id, { title: e.target.value })}
                      placeholder="e.g. Sumi OS & Distributed Runtime"
                      className="mt-1 font-serif text-sm font-medium"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`proj-${project.id}-sub`}>
                      Subtitle / Focus Area
                    </Label>
                    <Input
                      id={`proj-${project.id}-sub`}
                      value={project.subtitle}
                      onChange={(e) => updateProject(project.id, { subtitle: e.target.value })}
                      placeholder="e.g. Sensory Computing & Systems Logic"
                      className="mt-1 text-xs"
                    />
                  </div>

                  {/* Dates & Active Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`proj-${project.id}-start`} className="text-xs font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-light-ink-muted" />
                        <span>Start Date</span>
                      </Label>
                      <Input
                        id={`proj-${project.id}-start`}
                        value={project.startDate}
                        onChange={(e) => updateProject(project.id, { startDate: e.target.value })}
                        placeholder="e.g. May 2024"
                        className="mt-1 text-xs font-mono"
                      />
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 p-2 min-h-[38px] rounded-md bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={project.isActive}
                          onChange={(e) => updateProject(project.id, { isActive: e.target.checked })}
                          className="rounded text-terracotta focus:ring-terracotta h-4 w-4"
                        />
                        <span className="text-xs font-medium text-light-ink dark:text-dark-ink">
                          Active Project
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`proj-${project.id}-end`} className="text-xs font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-light-ink-muted" />
                      <span>End Date</span>
                    </Label>
                    <Input
                      id={`proj-${project.id}-end`}
                      value={project.endDate}
                      disabled={project.isActive}
                      onChange={(e) => updateProject(project.id, { endDate: e.target.value })}
                      placeholder={project.isActive ? 'Present (Active)' : 'e.g. Dec 2024'}
                      className="mt-1 text-xs font-mono disabled:opacity-60"
                    />
                  </div>

                  {/* GitHub & Live Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`proj-${project.id}-gh`} className="text-xs font-medium flex items-center gap-1">
                        <Github className="w-3 h-3 text-light-ink-muted" />
                        <span>GitHub Link</span>
                      </Label>
                      <Input
                        id={`proj-${project.id}-gh`}
                        type="url"
                        value={project.githubLink}
                        onChange={(e) => updateProject(project.id, { githubLink: e.target.value })}
                        placeholder="https://github.com/..."
                        className="mt-1 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`proj-${project.id}-live`} className="text-xs font-medium flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 text-light-ink-muted" />
                        <span>Live Demo URL</span>
                      </Label>
                      <Input
                        id={`proj-${project.id}-live`}
                        type="url"
                        value={project.liveLink}
                        onChange={(e) => updateProject(project.id, { liveLink: e.target.value })}
                        placeholder="https://..."
                        className="mt-1 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Universal Emblem & Media Artwork */}
                  <EmblemKanjiSelector
                    kanji={project.kanji}
                    logoUrl={project.image}
                    onKanjiChange={(char) => updateProject(project.id, { kanji: char })}
                    onLogoUrlChange={(url) => updateProject(project.id, { image: url })}
                    onUploadImage={(file) => handleUploadImageFile(project.id, file)}
                    label="Project Emblem & Cover Image"
                  />
                </div>

                {/* Right Column (Narrative & Architecture Highlights) */}
                <div className="md:col-span-7 space-y-5">
                  <div>
                    <Label htmlFor={`proj-${project.id}-desc`} className="text-xs font-medium">
                      Project Narrative Summary
                    </Label>
                    <Textarea
                      id={`proj-${project.id}-desc`}
                      rows={3}
                      value={project.summary}
                      onChange={(e) =>
                        updateProject(project.id, {
                          summary: e.target.value,
                          overview: e.target.value,
                        })
                      }
                      placeholder="Concise overview of the system architecture, core engineering decisions, and problems solved…"
                      className="mt-1 text-xs leading-relaxed"
                    />
                  </div>

                  {/* Universal Tech Stack Tags */}
                  <TechTagSelector
                    tags={project.techStacks}
                    onChange={(tags) => updateProject(project.id, { techStacks: tags })}
                    label="Core Technologies & Stack"
                  />

                  {/* Universal Bullet List Editor for Architecture Highlights */}
                  <BulletListEditor
                    bullets={project.bullets}
                    onChange={(bullets) => updateProject(project.id, { bullets })}
                    label="Key Architectural Highlights & Contributions"
                    placeholder="e.g. Implemented zero-copy shared memory ring buffer reducing message latency to <12μs…"
                  />
                </div>
              </div>
            </EditorCardShell>
          );
        })}

        {projects.length === 0 && (
          <div className="text-center py-12 border border-dashed border-light-border dark:border-dark-border rounded-xl bg-light-surface/30 dark:bg-dark-surface/30">
            <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted">
              No projects found. Click "+ Add Project" above to create one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
