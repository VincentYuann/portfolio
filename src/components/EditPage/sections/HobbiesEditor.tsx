import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Trash2,
  Plus,
  Image as ImageIcon,
  BookOpen,
  Upload,
  Loader2,
  Check,
} from 'lucide-react';
import {
  supabase,
  formatErrorMessage,
  withTimeout,
  uploadHobbyImage,
} from '../../../lib/supabase';
import { useSiteData, HobbyItem, DEFAULT_HOBBIES } from '../../../context/SiteDataContext';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { EditorCardShell } from '../shared/EditorCardShell';
import { KanjiPickerModal } from '../KanjiPickerModal';
import { useAdminDirty } from '../shared/useAdminDirty';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { toast } from 'sonner';

const MAX_IMAGES_PER_HOBBY = 5;

const getHobbiesFromData = (profileHobbies?: HobbyItem[], siteHobbies?: HobbyItem[]): HobbyItem[] => {
  if (Array.isArray(profileHobbies) && profileHobbies.length > 0) {
    return profileHobbies;
  }
  if (Array.isArray(siteHobbies) && siteHobbies.length > 0) {
    return siteHobbies;
  }
  return DEFAULT_HOBBIES;
};

const newHobbyTemplate = (pos: number): HobbyItem => ({
  id: `hobby-${Date.now()}`,
  title: 'New Hobby',
  kanji: '好',
  category: 'Interests',
  subtitle: 'What I enjoy doing and why',
  images: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBIQr3bTk3yvKCBXiAYi_kPdrzrSDIS4QJkYLWaCRKFOh_Iyvqgn2IkCe1PeeRqs_ScybEjUyNSBVPfSoqCDoXz-iTNgSOXxxNxKheHSrcnFQZE-bhBwH5mmkRJxXWbCWlus4MxGuYXevVL7oTqwrTcvbKPWwGtZj2VEYvaUrcisA4rRI0jgNhTBKtJgVQFJ86vzJ-h43U6tuThqzyw2TBz0s1ypULVS2GnMSJ5B4Q19cWnTVqag0yRHw',
  ],
  whyDescription:
    'A personal hobby that brings fun, balance, and joy to my daily routine.',
  metadata: [
    { label: 'Category', value: 'Personal Interest' },
  ],
  displayOrder: pos,
});

export const HobbiesEditor: React.FC = () => {
  const { hobbies: contextHobbies, profile: contextProfile, refresh } = useSiteData();

  // Local state for list of hobbies
  const [hobbies, setHobbies] = useState<HobbyItem[]>(() =>
    getHobbiesFromData(contextProfile?.hobbies, contextHobbies)
  );

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newImageUrls, setNewImageUrls] = useState<Record<string, string>>({});
  const [uploadingHobbyId, setUploadingHobbyId] = useState<string | null>(null);
  const [kanjiPickerTargetId, setKanjiPickerTargetId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const resetHobbies = useCallback(() => {
    setHobbies(getHobbiesFromData(contextProfile?.hobbies, contextHobbies));
  }, [contextProfile?.hobbies, contextHobbies]);

  // Sync from context when context changes
  useEffect(() => {
    resetHobbies();
  }, [resetHobbies]);

  const handleSaveRef = useRef<() => void>(() => {});

  const { notifyDirty, notifyClean } = useAdminDirty('hobbies', resetHobbies, () => {
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
    const copy = [...hobbies];
    const [moved] = copy.splice(draggedIdx, 1);
    copy.splice(targetIdx, 0, moved);

    const reordered = copy.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
    setHobbies(reordered);
    setDraggedIdx(null);
    setDragOverIdx(null);
    toast.success(`Moved "${moved.title || 'Hobby'}" to position #${targetIdx + 1}`);
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
    setHobbies((prev) => [created, ...prev]);
    setExpandedId(created.id);
    toast.success('New hobby card created. Click Save to persist.');
  };

  // Delete hobby with undo capability
  const handleDeleteHobby = (id: string) => {
    const target = hobbies.find((h) => h.id === id);
    if (!target) return;

    const originalList = [...hobbies];
    const updatedList = hobbies.filter((h) => h.id !== id);

    setHobbies(updatedList);
    notifyDirty();

    toast(`Deleted "${target.title || 'Hobby'}"`, {
      description: 'Click undo to restore this hobby card.',
      duration: 6000,
      action: {
        label: 'Undo',
        onClick: () => {
          setHobbies(originalList);
          notifyDirty();
          toast.success(`Restored "${target.title || 'Hobby'}"`);
        },
      },
    });
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
      toast.error(`Maximum ${MAX_IMAGES_PER_HOBBY} pictures allowed per hobby.`);
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
      toast.error(`Maximum ${MAX_IMAGES_PER_HOBBY} pictures allowed per hobby.`);
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

  // Set image as main hero image (move to index 0)
  const handleSetMainImage = (hobbyId: string, imgIndex: number) => {
    if (imgIndex === 0) return;
    notifyDirty();
    setHobbies((prev) =>
      prev.map((h) => {
        if (h.id === hobbyId) {
          const copy = [...h.images];
          const [selected] = copy.splice(imgIndex, 1);
          copy.unshift(selected);
          return { ...h, images: copy };
        }
        return h;
      })
    );
    toast.success('Selected image set as main display photo.');
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

      try {
        localStorage.setItem('portfolio_hobbies_override', JSON.stringify(cleanedHobbies));
      } catch {}

      await withTimeout(
        (async () => {
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
      toast.success('Hobbies & Interests saved and dynamically synced!');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (err: unknown) {
      setSaveState('error');
      toast.error('Failed to save hobbies: ' + formatErrorMessage(err));
      setTimeout(() => setSaveState('idle'), 6000);
    }
  };

  handleSaveRef.current = handleSave;

  const activePickerChar =
    hobbies.find((h) => h.id === kanjiPickerTargetId)?.kanji || '';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Universal Section Header */}
      <EditorSectionHeader
        title="Hobbies & Interests"
        subtitle="Manage your personal hobbies, upload photos (up to 5 per hobby) to Supabase Storage, and write notes about what you enjoy."
        saveState={saveState}
        onSave={handleSave}
        saveLabel="Save Hobbies"
        onAdd={handleAddHobby}
        addLabel="Add Hobby"
      />

      {/* Hobbies Cards List using Universal EditorCardShell */}
      <div className="space-y-4 sm:space-y-5">
        {hobbies.map((hobby, index) => {
          const isExpanded = expandedId === hobby.id;
          const isUploading = uploadingHobbyId === hobby.id;
          const imageCount = hobby.images.length;
          const canAddMoreImages = imageCount < MAX_IMAGES_PER_HOBBY;

          return (
            <EditorCardShell
              key={hobby.id || index}
              ordinal={index + 1}
              title={hobby.title || 'Untitled Hobby'}
              subtitle={hobby.subtitle}
              emblem={
                <span className="font-serif font-bold text-terracotta text-base leading-none">
                  {hobby.kanji || '好'}
                </span>
              }
              badge={
                <div className="flex items-center gap-1.5">
                  {hobby.category && (
                    <span className="font-mono text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-light-surface-raised dark:bg-dark-surface-raised text-light-ink-muted border border-light-border dark:border-dark-border uppercase">
                      {hobby.category}
                    </span>
                  )}
                  <span className="font-mono text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-terracotta/10 text-terracotta border border-terracotta/20 font-medium">
                    {imageCount}/{MAX_IMAGES_PER_HOBBY} Photos
                  </span>
                </div>
              }
              isExpanded={isExpanded}
              onToggleExpand={() => setExpandedId(isExpanded ? null : hobby.id)}
              onMoveUp={() => moveHobby(index, 'up')}
              onMoveDown={() => moveHobby(index, 'down')}
              canMoveUp={index > 0}
              canMoveDown={index < hobbies.length - 1}
              onDelete={() => handleDeleteHobby(hobby.id)}
              draggable={!isExpanded}
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver(index)}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop(index)}
              isDragging={draggedIdx === index}
              isOver={dragOverIdx === index}
            >
              <div className="space-y-5 pt-1">
                {/* Row 1: Title, Kanji, Category */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-6 space-y-1.5">
                    <Label className="text-xs font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted">
                      Hobby Title
                    </Label>
                    <Input
                      value={hobby.title}
                      onChange={(e) => updateHobby(hobby.id, { title: e.target.value })}
                      placeholder="e.g. Anime, Gaming, Fitness, Markets, Food"
                      className="bg-light-surface dark:bg-dark-surface text-sm font-serif font-medium"
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
                      className="bg-light-surface dark:bg-dark-surface text-xs font-mono uppercase"
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
                    className="bg-light-surface dark:bg-dark-surface text-xs"
                  />
                </div>

                {/* Row 3: Supabase Storage Multi-Image Gallery Manager (Up to 5 pictures) */}
                <div className="space-y-3 p-4 rounded-lg bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border/60 dark:border-dark-border/60">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-terracotta" />
                      <span className="font-mono text-xs font-semibold text-light-ink dark:text-dark-ink uppercase tracking-wider">
                        Photo Gallery ({imageCount}/{MAX_IMAGES_PER_HOBBY})
                      </span>
                    </div>

                    {/* Direct File Upload Button */}
                    <label
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border border-terracotta/40 text-terracotta bg-terracotta/5 hover:bg-terracotta/15 cursor-pointer transition-colors shadow-2xs ${
                        !canAddMoreImages || isUploading ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
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
                              Photo 0{imgIdx + 1} {imgIdx === 0 && '· Main Display'}
                            </span>
                            <p className="font-mono text-[11px] text-light-ink-muted dark:text-dark-ink-muted truncate">
                              {imgUrl}
                            </p>
                            {imgIdx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetMainImage(hobby.id, imgIdx)}
                                className="text-[10px] font-mono text-terracotta hover:underline mt-0.5 flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-2.5 h-2.5" /> Set as Main
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(hobby.id, imgIdx)}
                            className="p-1 rounded text-light-ink-muted hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-light-ink-muted py-2 italic">
                      No photos added yet. Upload a photo or enter a URL below.
                    </p>
                  )}

                  {/* Add Image URL Row */}
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

                {/* Row 4: What I Love About This Hobby */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono uppercase text-light-ink-muted dark:text-dark-ink-muted block">
                    What I Love About This Hobby
                  </Label>
                  <Textarea
                    rows={3}
                    value={hobby.whyDescription}
                    onChange={(e) => updateHobby(hobby.id, { whyDescription: e.target.value })}
                    placeholder="Share what makes this hobby fun, exciting, or meaningful to you..."
                    className="bg-light-surface dark:bg-dark-surface text-xs leading-relaxed"
                  />
                </div>
              </div>
            </EditorCardShell>
          );
        })}

        {hobbies.length === 0 && (
          <div className="text-center py-12 border border-dashed border-light-border dark:border-dark-border rounded-xl bg-light-surface/30 dark:bg-dark-surface/30">
            <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted">
              No hobby cards found. Click "+ Add Hobby" above to create one.
            </p>
          </div>
        )}
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
    </div>
  );
};
