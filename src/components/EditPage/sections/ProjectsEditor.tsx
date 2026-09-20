import React, { useState, useEffect } from 'react';
import {
  Star,
  Github,
  ExternalLink,
} from 'lucide-react';
import { supabase, formatErrorMessage, uploadProjectImage } from '../../../lib/supabase';
import { useSiteData } from '../../../context/SiteDataContext';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { EditorCardShell } from '../shared/EditorCardShell';
import { TechTagSelector } from '../shared/TechTagSelector';
import { EmblemKanjiSelector } from '../shared/EmblemKanjiSelector';
import { BulletListEditor } from '../shared/BulletListEditor';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner';

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
  bullets: string[];
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

const newProject = (order: number = 0): ProjectEntry => ({
  id: crypto.randomUUID(),
  title: '',
  subtitle: '',
  category: 'Distributed Systems',
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

type ProjectsTab = 'featured' | 'all';

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
        bullets: Array.isArray(p.bullets) && p.bullets.length > 0 ? p.bullets : [''],
        techStacks: p.tags || [],
        githubLink: p.links?.github || '',
        liveLink: p.links?.live || '',
        isFeatured: typeof p.isFeatured === 'boolean' ? p.isFeatured : idx < 3,
        displayOrder: typeof p.displayOrder === 'number' ? p.displayOrder : idx,
      }));
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<ProjectsTab>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  // Sync from context
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
          bullets: Array.isArray(p.bullets) && p.bullets.length > 0 ? p.bullets : [''],
          techStacks: p.tags || [],
          githubLink: p.links?.github || '',
          liveLink: p.links?.live || '',
          isFeatured: typeof p.isFeatured === 'boolean' ? p.isFeatured : idx < 3,
          displayOrder: typeof p.displayOrder === 'number' ? p.displayOrder : idx,
        })),
      );
    }
  }, [contextProjects]);

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
  });

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
        toast.info('Maximum 3 featured projects allowed on the Home Page showcase.');
        return;
      }
    }

    updateProject(id, { isFeatured: willBeFeatured });
    toast.success(
      willBeFeatured
        ? `Starred "${current.title || 'Project'}" for Featured Showcase`
        : `Removed "${current.title || 'Project'}" from Featured Showcase`,
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
        category: p.category || 'Distributed Systems',
        summary: p.summary || '',
        description: p.summary || '',
        overview: p.overview || p.summary || '',
        kanji: p.kanji || '案',
        badge: p.badge || 'ENGINEERING ARCHIVE',
        image: p.image || './images/sumi-os-workspace.jpg',
        tech_stacks: p.techStacks || [],
        sections: [
          {
            heading: 'Key Architectural Highlights',
            bullets: p.bullets.filter(Boolean),
          },
        ],
        github_link: p.githubLink || '',
        live_link: p.liveLink || '',
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from('projects').upsert(updates, { onConflict: 'title' });
      if (error) throw error;

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

  const displayedProjects =
    activeTab === 'featured' ? projects.filter((p) => p.isFeatured) : projects;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Universal Section Header */}
      <EditorSectionHeader
        title="Projects & Works"
        subtitle="Curate engineering projects, technical architectures, and live showcases."
        saveState={saveState}
        onSave={handleSaveAll}
        saveLabel="Save All Projects"
        onAdd={addProject}
        addLabel="New Project"
        extraActions={
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as ProjectsTab)}
            className="w-auto shrink-0"
          >
            <TabsList className="h-9 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
              <TabsTrigger value="all" className="text-xs px-3">
                All ({projects.length})
              </TabsTrigger>
              <TabsTrigger value="featured" className="text-xs px-3 gap-1">
                <Star className="w-3 h-3 text-ochre fill-current" />
                Featured ({projects.filter((p) => p.isFeatured).length}/3)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      {/* Projects Card Stack */}
      <div className="space-y-4 sm:space-y-5">
        {displayedProjects.map((project) => {
          const isExpanded = expandedId === project.id;
          const originalIdx = projects.findIndex((p) => p.id === project.id);

          return (
            <EditorCardShell
              key={project.id}
              ordinal={originalIdx + 1}
              title={project.title}
              subtitle={project.category ? `${project.category} · ${project.subtitle || 'No subtitle'}` : project.subtitle}
              badge={
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFeatured(project.id);
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      project.isFeatured
                        ? 'bg-ochre/15 text-ochre border border-ochre/40'
                        : 'bg-light-surface dark:bg-dark-surface text-light-ink-muted dark:text-dark-ink-muted border border-light-border dark:border-dark-border hover:text-ochre'
                    }`}
                    title={project.isFeatured ? 'Featured on Home Showcase' : 'Click to feature on Home'}
                  >
                    <Star className={`w-3 h-3 ${project.isFeatured ? 'fill-ochre text-ochre' : ''}`} />
                    <span>{project.isFeatured ? 'Featured' : 'Archive'}</span>
                  </button>
                  <span className="hidden sm:inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-light-surface dark:bg-dark-surface text-light-ink-muted dark:text-dark-ink-muted border border-light-border dark:border-dark-border">
                    {project.category}
                  </span>
                </div>
              }
              emblem={
                <span className="font-serif font-bold text-terracotta text-base leading-none">
                  {project.kanji || '案'}
                </span>
              }
              isExpanded={isExpanded}
              onToggleExpand={() => setExpandedId(isExpanded ? null : project.id)}
              onMoveUp={() => moveProject(originalIdx, 'up')}
              onMoveDown={() => moveProject(originalIdx, 'down')}
              canMoveUp={originalIdx > 0}
              canMoveDown={originalIdx < projects.length - 1}
              onDelete={() => deleteProject(project.id)}
            >
              {/* 2-Column Responsive Layout (md:grid-cols-12 for optimal tablet/desktop flow) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 pt-2">
                {/* Left Column (Metadata & Identity) */}
                <div className="md:col-span-5 space-y-4">
                  <div>
                    <Label htmlFor={`proj-${project.id}-title`} className="text-xs font-medium">
                      Project Title *
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
                    <Label htmlFor={`proj-${project.id}-sub`} className="text-xs font-medium">
                      Subtitle / Role Headline
                    </Label>
                    <Input
                      id={`proj-${project.id}-sub`}
                      value={project.subtitle}
                      onChange={(e) => updateProject(project.id, { subtitle: e.target.value })}
                      placeholder="e.g. Kyoto-Inspired Sensory Computing"
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`proj-${project.id}-cat`} className="text-xs font-medium">
                      Category
                    </Label>
                    <select
                      id={`proj-${project.id}-cat`}
                      value={project.category}
                      onChange={(e) => updateProject(project.id, { category: e.target.value })}
                      className="mt-1 w-full h-8.5 px-3 rounded-md bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-xs font-sans text-light-ink dark:text-dark-ink focus:border-terracotta focus:outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
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

                  {/* Universal Emblem & Kanji Selector */}
                  <EmblemKanjiSelector
                    kanji={project.kanji}
                    logoUrl={project.image}
                    onKanjiChange={(char) => updateProject(project.id, { kanji: char })}
                    onLogoUrlChange={(url) => updateProject(project.id, { image: url })}
                    onUploadImage={(file) => handleUploadImageFile(project.id, file)}
                    label="Project Emblem & Cover Artwork"
                  />
                </div>

                {/* Right Column (Narrative & Architecture Highlights) */}
                <div className="md:col-span-7 space-y-5">
                  <div>
                    <Label htmlFor={`proj-${project.id}-desc`} className="text-xs font-medium">
                      Executive Overview &amp; Narrative Summary
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
                      placeholder="High-level engineering narrative explaining why this project was built and the core architectural problem solved…"
                      className="mt-1 text-xs leading-relaxed"
                    />
                  </div>

                  {/* Universal Tech Stack Tags */}
                  <TechTagSelector
                    tags={project.techStacks}
                    onChange={(tags) => updateProject(project.id, { techStacks: tags })}
                    label="Core Technologies & Substrates"
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

        {displayedProjects.length === 0 && (
          <div className="text-center py-12 border border-dashed border-light-border dark:border-dark-border rounded-xl bg-light-surface/30 dark:bg-dark-surface/30">
            <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted">
              {activeTab === 'featured'
                ? 'No featured projects selected. Star up to 3 projects from the "All" tab to showcase them.'
                : 'No projects found. Click "+ New Project" above to create one.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
