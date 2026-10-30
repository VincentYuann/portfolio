import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload,
  Loader2,
  User,
  Compass,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { supabase, formatErrorMessage, withTimeout, uploadProfileAvatar } from '../../../lib/supabase';
import { useSiteData } from '../../../context/SiteDataContext';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { KanjiPickerModal } from '../modals/KanjiPickerModal';
import { useAdminDirty } from '../shared/useAdminDirty';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
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

const mapPillarsFromContext = (contextPillars: any[]): PillarEntry[] => {
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
  return [
    { position: 1, kanji: '間', romaji: 'MA', title: 'Spatial Clarity & Focus', tag: 'MINIMAL ARCHITECTURE', description: 'Intentional negative space and low cognitive load. Removing noise to elevate signal.' },
    { position: 2, kanji: '匠', romaji: 'SHOKUNIN', title: 'Artisanal Craftsmanship', tag: 'METICULOUS DETAIL', description: 'Obsessive care for pixel alignment, smooth framerates, type contrast, and robust typing.' },
    { position: 3, kanji: '侘', romaji: 'WABI-SABI', title: 'Authentic Materiality', tag: 'TACTILE INTERFACES', description: 'Respecting honest digital texture, warm palettes, and timeless structural integrity.' },
  ];
};

export const PhilosophyEditor: React.FC = () => {
  const { pillars: contextPillars, profile: contextProfile, refresh } = useSiteData();

  // Collapsible cards state
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    about: false,
    principles: false,
  });

  const toggle = (section: string) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // About Me profile state
  const [careerObjective, setCareerObjective] = useState<string>(
    contextProfile?.career_objective || ''
  );
  const [aboutMe, setAboutMe] = useState<string>(
    contextProfile?.about_me || ''
  );
  const [aboutImageUrl, setAboutImageUrl] = useState<string>(
    contextProfile?.about_image_url || './images/photo.png'
  );
  const [education, setEducation] = useState<string>(
    contextProfile?.education || 'Drexel University · CS & Math'
  );
  const [location, setLocation] = useState<string>(
    contextProfile?.location || 'Philadelphia, PA'
  );

  // Pillars state
  const [pillars, setPillars] = useState<PillarEntry[]>(() =>
    mapPillarsFromContext(contextPillars)
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [kanjiPickerTargetPos, setKanjiPickerTargetPos] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const resetData = useCallback(() => {
    if (contextProfile) {
      setCareerObjective(contextProfile.career_objective || '');
      setAboutMe(contextProfile.about_me || '');
      setAboutImageUrl(contextProfile.about_image_url || './images/photo.png');
      setEducation(contextProfile.education || 'Drexel University · CS & Math');
      setLocation(contextProfile.location || 'Philadelphia, PA');
    }
    setPillars(mapPillarsFromContext(contextPillars));
  }, [contextProfile, contextPillars]);

  useEffect(() => {
    resetData();
  }, [resetData]);

  const handleSaveRef = useRef<() => void>(() => {});

  const { notifyDirty, notifyClean } = useAdminDirty('philosophy', resetData, () => {
    handleSaveRef.current();
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image must be under 8 MB');
      return;
    }

    setUploadingImage(true);
    try {
      const url = await uploadProfileAvatar(file);
      if (url) {
        notifyDirty();
        setAboutImageUrl(url);
        toast.success('Portrait photo uploaded to Supabase Storage!');
      }
    } catch (err) {
      toast.error('Failed to upload photo: ' + formatErrorMessage(err));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const updatePillar = (pos: number, patch: Partial<PillarEntry>) => {
    notifyDirty();
    setPillars((prev) =>
      prev.map((p) => (p.position === pos ? { ...p, ...patch } : p))
    );
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
          // 1. Save pillars to philosophy_pillars table
          if (rows.length > 0) {
            const { error: pillarErr } = await supabase
              .from('philosophy_pillars')
              .upsert(rows, { onConflict: 'position' });
            if (pillarErr) throw pillarErr;
          }

          // 2. Save about me fields to profile table
          const { error: profileErr } = await supabase
            .from('profile')
            .update({
              career_objective: careerObjective,
              about_me: aboutMe,
              about_image_url: aboutImageUrl,
              education: education,
              location: location,
              updated_at: new Date().toISOString(),
            })
            .eq('id', 1);

          if (profileErr) throw profileErr;
        })(),
        15000,
        'Save request timed out. Please check your network and try again.'
      );

      await refresh();
      notifyClean();
      setSaveState('success');
      toast.success('About Me & Principles saved & synced to homepage!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      setSaveState('error');
      toast.error('Failed to save: ' + formatErrorMessage(err));
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  handleSaveRef.current = handleSave;

  const activePickerChar =
    pillars.find((p) => p.position === kanjiPickerTargetPos)?.kanji || '';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Universal Section Header */}
      <EditorSectionHeader
        title="About Me & Principles"
        subtitle="Manage your portrait photo, career objective, biography, and the 3 core engineering principles."
        saveState={saveState}
        onSave={handleSave}
        saveLabel="Save About Me"
      />

      {/* Card 1: About Me Biography & Portrait */}
      <div className="rounded-[3px] border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface-card shadow-xs overflow-hidden transition-colors">
        <button
          type="button"
          onClick={() => toggle('about')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-light-surface/50 dark:hover:bg-dark-surface-raised/50 transition-colors cursor-pointer select-none"
          aria-expanded={!collapsed.about}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[3px] bg-light-surface-raised dark:bg-dark-surface-muted border border-light-border dark:border-dark-border flex items-center justify-center text-terracotta dark:text-ochre shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono text-xs sm:text-sm font-semibold text-light-ink dark:text-dark-ink tracking-wide uppercase">
                Biography &amp; Career Objective
              </h3>
              <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted hidden sm:block">
                Portrait image, university credentials, and concise personal summary.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!collapsed.about ? (
              <ChevronDown className="w-4 h-4 text-terracotta dark:text-ochre" />
            ) : (
              <ChevronRight className="w-4 h-4 text-light-ink-subtle" />
            )}
          </div>
        </button>

        {!collapsed.about && (
          <div className="p-4 sm:p-6 border-t border-light-border/60 dark:border-dark-border/60 space-y-5">
            {/* Portrait Photo Section */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-light-ink dark:text-dark-ink uppercase font-mono">
                Portrait Photo
              </Label>
              <div className="flex flex-wrap items-center gap-4 p-3 rounded-[3px] bg-light-surface-raised dark:bg-dark-surface-muted border border-light-border dark:border-dark-border">
                <img
                  src={aboutImageUrl || './images/photo.png'}
                  alt="Portrait Preview"
                  className="w-20 h-24 object-cover rounded-[2px] border border-light-border dark:border-dark-border shadow-2xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = './images/photo.png';
                  }}
                />
                <div className="space-y-2 flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-mono h-8 border-light-border dark:border-dark-border hover:border-terracotta dark:hover:border-ochre cursor-pointer"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 mr-1.5 text-terracotta dark:text-ochre" />
                          <span>Upload Photo</span>
                        </>
                      )}
                    </Button>
                    {aboutImageUrl && aboutImageUrl !== './images/photo.png' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          notifyDirty();
                          setAboutImageUrl('./images/photo.png');
                        }}
                        className="text-xs font-mono h-8 text-light-ink-muted hover:text-red-500 cursor-pointer"
                      >
                        Reset to Default
                      </Button>
                    )}
                  </div>
                  <Input
                    value={aboutImageUrl}
                    onChange={(e) => {
                      notifyDirty();
                      setAboutImageUrl(e.target.value);
                    }}
                    placeholder="Or paste image URL (https://...)"
                    className="text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Education & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted">
                  Education / University
                </Label>
                <Input
                  value={education}
                  onChange={(e) => {
                    notifyDirty();
                    setEducation(e.target.value);
                  }}
                  placeholder="Drexel University · CS & Math"
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted">
                  Location
                </Label>
                <Input
                  value={location}
                  onChange={(e) => {
                    notifyDirty();
                    setLocation(e.target.value);
                  }}
                  placeholder="Philadelphia, PA"
                  className="text-xs"
                />
              </div>
            </div>

            {/* Career Objective */}
            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted">
                Career Objective
              </Label>
              <Textarea
                rows={3}
                value={careerObjective}
                onChange={(e) => {
                  notifyDirty();
                  setCareerObjective(e.target.value);
                }}
                placeholder="What roles or engineering challenges are you seeking? (e.g. Seeking software engineering internships...)"
                className="text-xs sm:text-sm leading-relaxed"
              />
            </div>

            {/* About Me Story */}
            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted">
                About Me / Background
              </Label>
              <Textarea
                rows={5}
                value={aboutMe}
                onChange={(e) => {
                  notifyDirty();
                  setAboutMe(e.target.value);
                }}
                placeholder="Your personal story, focus areas, and approach to software development..."
                className="text-xs sm:text-sm leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>

      {/* Card 2: 3 Core Engineering Principles (Pillars) */}
      <div className="rounded-[3px] border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface-card shadow-xs overflow-hidden transition-colors">
        <button
          type="button"
          onClick={() => toggle('principles')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-light-surface/50 dark:hover:bg-dark-surface-raised/50 transition-colors cursor-pointer select-none"
          aria-expanded={!collapsed.principles}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[3px] bg-light-surface-raised dark:bg-dark-surface-muted border border-light-border dark:border-dark-border flex items-center justify-center text-terracotta dark:text-ochre shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono text-xs sm:text-sm font-semibold text-light-ink dark:text-dark-ink tracking-wide uppercase">
                Core Engineering Principles (3 Pillars)
              </h3>
              <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted hidden sm:block">
                The 3 foundational tenets displayed alongside your bio cards.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-light-ink dark:text-dark-ink font-semibold px-2 py-0.5 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
              {pillars.length} PILLARS
            </span>
            {!collapsed.principles ? (
              <ChevronDown className="w-4 h-4 text-terracotta dark:text-ochre" />
            ) : (
              <ChevronRight className="w-4 h-4 text-light-ink-subtle" />
            )}
          </div>
        </button>

        {!collapsed.principles && (
          <div className="p-4 sm:p-6 border-t border-light-border/60 dark:border-dark-border/60 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {pillars.map((p, idx) => (
                <div
                  key={p.position}
                  className="p-4 rounded-[3px] border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-light-border/50 dark:border-dark-border/50">
                    <span className="text-xs font-mono font-bold text-terracotta dark:text-ochre">
                      PILLAR 0{idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-sm font-bold text-light-ink dark:text-dark-ink">
                        {p.kanji}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setKanjiPickerTargetPos(p.position)}
                        className="h-6 px-1.5 text-xs text-light-ink-muted hover:text-terracotta dark:hover:text-ochre cursor-pointer"
                        title="Pick Kanji Emblem"
                      >
                        <BookOpen className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted">
                      Title
                    </Label>
                    <Input
                      value={p.title}
                      onChange={(e) => updatePillar(p.position, { title: e.target.value })}
                      placeholder="e.g. Spatial Clarity"
                      className="text-xs font-semibold h-8"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted">
                      Category Tag
                    </Label>
                    <Input
                      value={p.tag}
                      onChange={(e) => updatePillar(p.position, { tag: e.target.value.toUpperCase() })}
                      placeholder="e.g. MINIMAL ARCHITECTURE"
                      className="text-[11px] font-mono uppercase h-8"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted">
                      Description
                    </Label>
                    <Textarea
                      rows={3}
                      value={p.description}
                      onChange={(e) => updatePillar(p.position, { description: e.target.value })}
                      placeholder="Concise explanation of this engineering tenet..."
                      className="text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kanji Picker Modal */}
      <KanjiPickerModal
        isOpen={kanjiPickerTargetPos !== null}
        onClose={() => setKanjiPickerTargetPos(null)}
        selectedChar={activePickerChar}
        onSelect={(kanjiChar: string) => {
          if (kanjiPickerTargetPos !== null) {
            updatePillar(kanjiPickerTargetPos, { kanji: kanjiChar });
          }
          setKanjiPickerTargetPos(null);
        }}
      />
    </div>
  );
};
