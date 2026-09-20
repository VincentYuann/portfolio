import React, { useState, useEffect } from 'react';
import {
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Tag,
  BookOpen,
  Upload,
  Loader2,
} from 'lucide-react';
import {
  supabase,
  formatErrorMessage,
  withTimeout,
  uploadHobbyImage,
} from '../../../lib/supabase';
import { useSiteData, HobbyItem, DEFAULT_HOBBIES } from '../../../context/SiteDataContext';
import { CornerBrackets } from '../../CornerBrackets';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { KanjiPickerModal } from '../KanjiPickerModal';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { toast } from 'sonner';

const MAX_IMAGES_PER_HOBBY = 5;

const newHobbyTemplate = (pos: number): HobbyItem => ({
  id: `hobby-${Date.now()}`,
  title: 'New Pursuit',
  kanji: '技',
  category: 'Craft',
  subtitle: 'Personal discipline and creative focus',
  images: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBIQr3bTk3yvKCBXiAYi_kPdrzrSDIS4QJkYLWaCRKFOh_Iyvqgn2IkCe1PeeRqs_ScybEjUyNSBVPfSoqCDoXz-iTNgSOXxxNxKheHSrcnFQZE-bhBwH5mmkRJxXWbCWlus4MxGuYXevVL7oTqwrTcvbKPWwGtZj2VEYvaUrcisA4rRI0jgNhTBKtJgVQFJ86vzJ-h43U6tuThqzyw2TBz0s1ypULVS2GnMSJ5B4Q19cWnTVqag0yRHw',
  ],
  whyDescription:
    'Practicing this pursuit cultivates the discipline, patience, and deliberate focus that translates directly into robust software architecture.',
  metadata: [
    { label: 'Focus', value: 'Discipline & Balance' },
  ],
  displayOrder: pos,
});

export const HobbiesEditor: React.FC = () => {
  const { hobbies: contextHobbies, profile: contextProfile, refresh } = useSiteData();

  // Local state for list of hobbies
  const [hobbies, setHobbies] = useState<HobbyItem[]>(() => {
    if (Array.isArray(contextProfile?.hobbies) && contextProfile.hobbies.length > 0) {
      return contextProfile.hobbies;
    }
    if (Array.isArray(contextHobbies) && contextHobbies.length > 0) {
      return contextHobbies;
    }
    return DEFAULT_HOBBIES;
  });

  // Collapsible cards state: all start closed by default
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    const initialList =
      Array.isArray(contextProfile?.hobbies) && contextProfile.hobbies.length > 0
        ? contextProfile.hobbies
        : Array.isArray(contextHobbies) && contextHobbies.length > 0
        ? contextHobbies
        : DEFAULT_HOBBIES;
    initialList.forEach((h, idx) => {
      map[h.id || idx] = true;
    });
    return map;
  });

  // New image URL input state per hobby
  const [newImageUrls, setNewImageUrls] = useState<Record<string, string>>({});

  // Uploading spinner tracker per hobby
  const [uploadingHobbyId, setUploadingHobbyId] = useState<string | null>(null);

  // Kanji picker modal target hobby id
  const [kanjiPickerTargetId, setKanjiPickerTargetId] = useState<string | null>(null);

  const [saveState, setSaveState] = useState<SaveState>('idle');

  // Sync from context when context changes
  useEffect(() => {
    if (Array.isArray(contextProfile?.hobbies) && contextProfile.hobbies.length > 0) {
      setHobbies(contextProfile.hobbies);
    } else if (Array.isArray(contextHobbies) && contextHobbies.length > 0) {
      setHobbies(contextHobbies);
    }
  }, [contextProfile, contextHobbies]);

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const notifyDirty = () => {
    window.dispatchEvent(new CustomEvent('portfolio-admin-dirty', { detail: { dirty: true } }));
  };

  const notifyClean = () => {
    window.dispatchEvent(new CustomEvent('portfolio-admin-clean'));
  };

  // Keyboard save listener (Cmd+S / Ctrl+S)
  useEffect(() => {
    const handleGlobalSave = () => handleSave();
    window.addEventListener('portfolio-admin-save', handleGlobalSave);
    return () => window.removeEventListener('portfolio-admin-save', handleGlobalSave);
  }, [hobbies]);

  // Update specific hobby
  const updateHobby = (id: string, patch: Partial<HobbyItem>) => {
    notifyDirty();
    setHobbies((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...patch } : h))
    );
  };

  // Move hobby up / down in order
  const moveHobby = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === hobbies.length - 1) return;
    notifyDirty();
    setHobbies((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
    });
  };

  // Add new hobby item
  const handleAddHobby = () => {
    notifyDirty();
    const created = newHobbyTemplate(hobbies.length + 1);
    setHobbies((prev) => [...prev, created]);
    setCollapsed((prev) => ({ ...prev, [created.id]: false }));
    toast.success('New pursuit card created. Click Save to persist.');
  };

  // Delete hobby
  const handleDeleteHobby = (id: string) => {
    if (hobbies.length <= 1) {
      toast.error('You must keep at least 1 pursuit card.');
      return;
    }
    notifyDirty();
    setHobbies((prev) => prev.filter((h) => h.id !== id));
    toast.info('Pursuit card removed. Click Save to persist.');
  };

  // Reset to default 5 pursuits
  const handleResetDefaults = () => {
    notifyDirty();
    setHobbies(DEFAULT_HOBBIES);
    toast.info('Reset pursuits to Vincent\'s 5 default hobbies. Click Save to persist.');
  };

  // Add image URL manually
  const handleAddImageUrl = (hobbyId: string) => {
    const url = (newImageUrls[hobbyId] || '').trim();
    if (!url) {
      toast.error('Please enter a valid image URL.');
      return;
    }

    const currentHobby = hobbies.find((h) => h.id === hobbyId);
    if (currentHobby && currentHobby.images.length >= MAX_IMAGES_PER_HOBBY) {
      toast.error(`Maximum ${MAX_IMAGES_PER_HOBBY} pictures allowed per pursuit.`);
      return;
    }

    notifyDirty();
    setHobbies((prev) =>
      prev.map((h) => {
        if (h.id === hobbyId) {
          return { ...h, images: [...h.images, url].slice(0, MAX_IMAGES_PER_HOBBY) };
        }
        return h;
      })
    );
    setNewImageUrls((prev) => ({ ...prev, [hobbyId]: '' }));
    toast.success('Image added to gallery.');
  };

  // Upload image file directly to Supabase Storage
  const handleFileUpload = async (hobbyId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentHobby = hobbies.find((h) => h.id === hobbyId);
    if (currentHobby && currentHobby.images.length >= MAX_IMAGES_PER_HOBBY) {
      toast.error(`Maximum ${MAX_IMAGES_PER_HOBBY} pictures allowed per pursuit.`);
      if (e.target) e.target.value = '';
      return;
    }

    setUploadingHobbyId(hobbyId);
    try {
      const url = await uploadHobbyImage(file);
      if (url) {
        notifyDirty();
        setHobbies((prev) =>
          prev.map((h) => {
            if (h.id === hobbyId) {
              return { ...h, images: [...h.images, url].slice(0, MAX_IMAGES_PER_HOBBY) };
            }
            return h;
          })
        );
        toast.success('Picture uploaded to Supabase Storage!');
      }
    } catch (err: unknown) {
      toast.error('Failed to upload picture: ' + formatErrorMessage(err));
    } finally {
      setUploadingHobbyId(null);
      if (e.target) e.target.value = '';
    }
  };

  // Remove image from a hobby
  const handleRemoveImage = (hobbyId: string, imgIndex: number) => {
    notifyDirty();
    setHobbies((prev) =>
      prev.map((h) => {
        if (h.id === hobbyId) {
          const updated = h.images.filter((_, idx) => idx !== imgIndex);
          return { ...h, images: updated };
        }
        return h;
      })
    );
  };

  // Add metadata key-value pair
  const handleAddMetadata = (hobbyId: string) => {
    notifyDirty();
    setHobbies((prev) =>
      prev.map((h) => {
        if (h.id === hobbyId) {
          const currentMeta = h.metadata || [];
          return { ...h, metadata: [...currentMeta, { label: 'Interest', value: 'Details' }] };
        }
        return h;
      })
    );
  };

  // Update metadata item
  const handleUpdateMetadata = (hobbyId: string, mIdx: number, patch: { label?: string; value?: string }) => {
    notifyDirty();
    setHobbies((prev) =>
      prev.map((h) => {
        if (h.id === hobbyId) {
          const currentMeta = [...(h.metadata || [])];
          if (currentMeta[mIdx]) {
            currentMeta[mIdx] = { ...currentMeta[mIdx], ...patch };
          }
          return { ...h, metadata: currentMeta };
        }
        return h;
      })
    );
  };

  // Delete metadata item
  const handleDeleteMetadata = (hobbyId: string, mIdx: number) => {
    notifyDirty();
    setHobbies((prev) =>
      prev.map((h) => {
        if (h.id === hobbyId) {
          const currentMeta = (h.metadata || []).filter((_, idx) => idx !== mIdx);
          return { ...h, metadata: currentMeta };
        }
        return h;
      })
    );
  };

  // Save to Supabase and LocalStorage
  const handleSave = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');

    try {
      if (!supabase) throw new Error('Supabase not configured');

      const cleanedHobbies = hobbies.map((h, idx) => ({
        ...h,
        displayOrder: idx + 1,
      }));

      // Cache locally immediately for zero-lag consistency
      try {
        localStorage.setItem('portfolio_hobbies_override', JSON.stringify(cleanedHobbies));
      } catch {}

      await withTimeout(
        (async () => {
          // Update hobbies column on profile table
          const { error } = await supabase
            .from('profile')
            .update({
              hobbies: cleanedHobbies,
              updated_at: new Date().toISOString(),
            })
            .eq('id', 1);

          if (error) {
            if (error.code === '42703' || error.message?.includes('hobbies')) {
              console.warn('hobbies column not in database yet; cached locally in localStorage');
            } else {
              throw error;
            }
          }
        })(),
        15000,
        'Save request timed out. Please check your connection and try again.'
      );

      await refresh();
      notifyClean();
      setSaveState('success');
      toast.success('Pursuits & Crafts saved and dynamically synced!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      setSaveState('error');
      toast.error('Failed to save pursuits: ' + formatErrorMessage(err));
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  const activePickerChar =
    hobbies.find((h) => h.id === kanjiPickerTargetId)?.kanji || '';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Universal Section Header */}
      <EditorSectionHeader
        title="Pursuits & Hobbies Editor"
        subtitle="Manage your 5 personal pursuits, upload up to 5 pictures per hobby to Supabase Storage, and edit reflections"
        saveState={saveState}
        onSave={handleSave}
        onAdd={handleAddHobby}
        addLabel="Add Pursuit"
      />

      {/* Hobbies Cards List */}
      <div className="space-y-4 sm:space-y-5">
        {hobbies.map((hobby, index) => {
          const isCollapsed = collapsed[hobby.id] ?? true;
          const isUploading = uploadingHobbyId === hobby.id;
          const imageCount = hobby.images.length;
          const canAddMoreImages = imageCount < MAX_IMAGES_PER_HOBBY;

          return (
            <div
              key={hobby.id || index}
              className="bg-light-surface-card/95 dark:bg-dark-surface/95 border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-6 shadow-sm relative overflow-visible classical-card-frame transition-all duration-200"
            >
              <CornerBrackets size="sm" />

              {/* Card Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleCollapse(hobby.id)}
                    className="p-1 rounded-md hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta transition-colors cursor-pointer"
                    aria-label={isCollapsed ? 'Expand pursuit card' : 'Collapse pursuit card'}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-terracotta" />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-terracotta">
                      {`0${index + 1}`}
                    </span>
                    <span className="font-serif text-base sm:text-lg font-medium text-light-ink dark:text-dark-ink truncate">
                      {hobby.title || 'Untitled Pursuit'}
                    </span>
                  </div>

                  {hobby.kanji && (
                    <Badge variant="outline" className="font-serif text-xs border-terracotta/40 text-terracotta">
                      {hobby.kanji}
                    </Badge>
                  )}

                  {hobby.category && (
                    <span className="hidden sm:inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-light-surface-raised dark:bg-dark-surface-raised text-light-ink-muted border border-light-border dark:border-dark-border uppercase">
                      {hobby.category}
                    </span>
                  )}

                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-terracotta/10 text-terracotta border border-terracotta/20">
                    {imageCount}/{MAX_IMAGES_PER_HOBBY} Photos
                  </span>
                </div>

                {/* Right controls: Move up/down, Delete */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveHobby(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveHobby(index, 'down')}
                    disabled={index === hobbies.length - 1}
                    className="p-1.5 rounded text-light-ink-muted dark:text-dark-ink-muted hover:text-terracotta hover:bg-light-surface-raised dark:hover:bg-dark-surface-raised disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteHobby(hobby.id)}
                    className="p-1.5 rounded text-light-ink-muted dark:text-dark-ink-muted hover:text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
                    title="Delete pursuit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Collapsible Content */}
              {!isCollapsed && (
                <div className="mt-6 pt-5 border-t border-light-border/60 dark:border-[#2D3039]/60 space-y-6 relative z-10 animate-in fade-in-50 duration-200">
                  {/* Row 1: Title, Kanji, Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-6 space-y-1.5">
                      <Label className="text-xs font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted">
                        Pursuit Title
                      </Label>
                      <Input
                        value={hobby.title}
                        onChange={(e) => updateHobby(hobby.id, { title: e.target.value })}
                        placeholder="e.g. Anime & Visual Storytelling"
                        className="bg-light-surface dark:bg-dark-surface text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-1.5">
                      <Label className="text-xs font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted">
                        Kanji Emblem
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={hobby.kanji || ''}
                          onChange={(e) => updateHobby(hobby.id, { kanji: e.target.value })}
                          placeholder="鑑賞"
                          className="bg-light-surface dark:bg-dark-surface font-serif text-sm w-20 text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setKanjiPickerTargetId(hobby.id)}
                          className="h-9 px-2.5 text-xs font-mono text-light-ink-muted hover:text-terracotta border-light-border dark:border-dark-border cursor-pointer shrink-0"
                          title="Choose Kanji Emblem"
                        >
                          <BookOpen className="w-3.5 h-3.5 mr-1 text-terracotta" />
                          Picker
                        </Button>
                      </div>
                    </div>

                    <div className="sm:col-span-3 space-y-1.5">
                      <Label className="text-xs font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted">
                        Category Tag
                      </Label>
                      <Input
                        value={hobby.category || ''}
                        onChange={(e) => updateHobby(hobby.id, { category: e.target.value })}
                        placeholder="e.g. Storytelling, Interactive, Discipline"
                        className="bg-light-surface dark:bg-dark-surface text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Subtitle */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted">
                      Subtitle / Focus Summary
                    </Label>
                    <Input
                      value={hobby.subtitle || ''}
                      onChange={(e) => updateHobby(hobby.id, { subtitle: e.target.value })}
                      placeholder="e.g. Character Arcs, World-Building & Sakuga Animation"
                      className="bg-light-surface dark:bg-dark-surface text-sm"
                    />
                  </div>

                  {/* Row 3: Supabase Storage Multi-Image Gallery Manager (Up to 5 pictures) */}
                  <div className="space-y-3 p-4 rounded-lg bg-light-surface-raised/70 dark:bg-dark-surface-raised/70 border border-light-border/60 dark:border-dark-border/60">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-terracotta" />
                        <span className="font-mono text-xs font-semibold text-light-ink dark:text-dark-ink uppercase tracking-wider">
                          Supabase Photo Gallery ({imageCount}/{MAX_IMAGES_PER_HOBBY})
                        </span>
                      </div>

                      {/* Direct File Upload Button */}
                      <label
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-terracotta/40 text-terracotta bg-terracotta/5 hover:bg-terracotta/15 cursor-pointer transition-colors shadow-2xs ${
                          !canAddMoreImages || isUploading ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading to Supabase...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Picture (Max 5)</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading || !canAddMoreImages}
                          onChange={(e) => handleFileUpload(hobby.id, e)}
                        />
                      </label>
                    </div>

                    {/* Image URL Thumbnails List */}
                    {imageCount > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                        {hobby.images.map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="relative p-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border/60 dark:border-dark-border/60 flex items-center gap-3 group/img shadow-2xs"
                          >
                            <img
                              src={imgUrl}
                              alt={`Preview ${imgIdx + 1}`}
                              className="w-12 h-12 rounded object-cover border border-light-border/40 dark:border-dark-border/40 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.opacity = '0.3';
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <span className="font-mono text-[10px] text-terracotta font-bold block">
                                Photo {imgIdx + 1} {imgIdx === 0 && '· Main Display'}
                              </span>
                              <p className="font-mono text-[11px] text-light-ink-muted dark:text-dark-ink-muted truncate">
                                {imgUrl}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(hobby.id, imgIdx)}
                              className="p-1 rounded text-light-ink-muted hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
                              title="Remove picture"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-mono text-light-ink-muted py-2 italic">
                        No pictures added yet. Upload a picture or paste an image URL below.
                      </p>
                    )}

                    {/* Add Image URL Row (Optional URL input) */}
                    {canAddMoreImages && (
                      <div className="flex items-center gap-2 pt-2">
                        <Input
                          value={newImageUrls[hobby.id] || ''}
                          onChange={(e) =>
                            setNewImageUrls((prev) => ({ ...prev, [hobby.id]: e.target.value }))
                          }
                          placeholder="Or paste external image URL (https://...)"
                          className="bg-light-surface dark:bg-dark-surface text-xs font-mono flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddImageUrl(hobby.id);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => handleAddImageUrl(hobby.id)}
                          variant="outline"
                          size="sm"
                          className="font-mono text-xs border-terracotta/40 text-terracotta hover:bg-terracotta/10 shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Add URL
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Row 4: Why I Do This Reflection Narrative */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                        "Why I Do This" Narrative Reflection
                      </Label>
                      <span className="text-[10px] font-mono text-light-ink-muted">
                        Explain how this pursuit grounds your approach to software engineering
                      </span>
                    </div>
                    <Textarea
                      rows={3}
                      value={hobby.whyDescription}
                      onChange={(e) => updateHobby(hobby.id, { whyDescription: e.target.value })}
                      placeholder="Explain how this hobby grounds your thinking, creativity, or discipline..."
                      className="bg-light-surface dark:bg-dark-surface text-sm leading-relaxed"
                    />
                  </div>

                  {/* Row 5: Key-Value Metadata Tags Manager */}
                  <div className="space-y-3 p-4 rounded-lg bg-light-surface-raised/70 dark:bg-dark-surface-raised/70 border border-light-border/60 dark:border-dark-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-terracotta" />
                        <span className="font-mono text-xs font-semibold text-light-ink dark:text-dark-ink uppercase tracking-wider">
                          Pursuit Details & Specs ({(hobby.metadata || []).length})
                        </span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleAddMetadata(hobby.id)}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs font-mono border-terracotta/40 text-terracotta hover:bg-terracotta/10 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Detail
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {(hobby.metadata || []).map((meta, mIdx) => (
                        <div
                          key={mIdx}
                          className="flex items-center gap-2 p-2 rounded bg-light-surface dark:bg-dark-surface border border-light-border/60 dark:border-dark-border/60"
                        >
                          <Input
                            value={meta.label}
                            onChange={(e) =>
                              handleUpdateMetadata(hobby.id, mIdx, { label: e.target.value })
                            }
                            placeholder="Label (e.g. Favorite Genre)"
                            className="w-1/3 text-xs font-medium"
                          />
                          <Input
                            value={meta.value}
                            onChange={(e) =>
                              handleUpdateMetadata(hobby.id, mIdx, { value: e.target.value })
                            }
                            placeholder="Value (e.g. Psychological, Sci-Fi)"
                            className="flex-1 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteMetadata(hobby.id, mIdx)}
                            className="p-1 rounded text-light-ink-muted hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
                            title="Delete detail"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Kanji Picker Modal */}
      <KanjiPickerModal
        isOpen={Boolean(kanjiPickerTargetId)}
        onClose={() => setKanjiPickerTargetId(null)}
        selectedChar={activePickerChar}
        onSelect={(kanjiChar: string) => {
          if (kanjiPickerTargetId) {
            updateHobby(kanjiPickerTargetId, { kanji: kanjiChar });
          }
          setKanjiPickerTargetId(null);
        }}
      />

      {/* Bottom Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-light-border/70 dark:border-[#2D3039]/80">
        <Button
          type="button"
          onClick={handleAddHobby}
          variant="outline"
          className="font-mono text-xs border-terracotta/50 text-terracotta hover:bg-terracotta/10 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Pursuit Card
        </Button>

        <Button
          type="button"
          onClick={handleResetDefaults}
          variant="ghost"
          className="font-mono text-xs text-light-ink-muted hover:text-terracotta cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset to Vincent's 5 Hobbies
        </Button>
      </div>
    </div>
  );
};
