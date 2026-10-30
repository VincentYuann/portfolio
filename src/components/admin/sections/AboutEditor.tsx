import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Loader2,
  User,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { supabase, formatErrorMessage, withTimeout, uploadProfileAvatar } from '../../../lib/supabase';
import { useSiteData, AboutMenuItem } from '../../../context/SiteDataContext';
import { EditorSectionHeader, SaveState } from '../shared/EditorSectionHeader';
import { useAdminDirty } from '../shared/useAdminDirty';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { toast } from 'sonner';
import { DEFAULT_ABOUT_MENU } from '../../../lib/constants';

export const AboutEditor: React.FC = () => {
  const { profile: contextProfile, refresh } = useSiteData();

  // Collapsible cards state
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    portrait: false,
    menu: false,
  });

  const toggle = (section: string) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Form State
  const [aboutImageUrl, setAboutImageUrl] = useState<string>('');
  const [aboutDescription, setAboutDescription] = useState<string>(
    'Education, engineering background, and future aspirations.'
  );
  const [education, setEducation] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [menuItems, setMenuItems] = useState<AboutMenuItem[]>(DEFAULT_ABOUT_MENU);

  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { notifyDirty, notifyClean } = useAdminDirty('about');

  // Sync state from context
  useEffect(() => {
    if (contextProfile) {
      setAboutImageUrl(contextProfile.about_image_url || contextProfile.avatar_url || '');
      if (contextProfile.about_description) {
        setAboutDescription(contextProfile.about_description);
      }
      setEducation(contextProfile.education || '');
      setLocation(contextProfile.location || '');
      if (Array.isArray(contextProfile.about_menu) && contextProfile.about_menu.length > 0) {
        setMenuItems(contextProfile.about_menu);
      }
    }
  }, [contextProfile]);

  // Photo Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB.');
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

  // Menu item mutations
  const updateMenuItem = (index: number, patch: Partial<AboutMenuItem>) => {
    notifyDirty();
    setMenuItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item))
    );
  };

  const updateMenuSubItems = (index: number, text: string) => {
    notifyDirty();
    const items = text.split('\n').filter((line) => line.trim().length > 0);
    setMenuItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, items } : item))
    );
  };

  const addMenuItem = () => {
    notifyDirty();
    const newItem: AboutMenuItem = {
      id: `section_${Date.now()}`,
      title: 'New Section',
      kanji: '新',
      items: ['Add content item here...'],
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const deleteMenuItem = (index: number) => {
    notifyDirty();
    setMenuItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');

    try {
      if (!supabase) throw new Error('Supabase not configured');

      await withTimeout(
        (async () => {
          // Save about me fields & menu to profile table
          const { error: profileErr } = await supabase
            .from('profile')
            .update({
              about_image_url: aboutImageUrl,
              about_description: aboutDescription,
              about_menu: menuItems,
              education: education,
              location: location,
              updated_at: new Date().toISOString(),
            })
            .eq('name', 'Vincent Yuan');

          if (profileErr) throw profileErr;
        })(),
        15000,
        'Save request timed out. Please check your network and try again.'
      );

      await refresh();
      notifyClean();
      setSaveState('success');
      toast.success('About Me & Menu updated successfully!');
      setTimeout(() => setSaveState('idle'), 2500);
    } catch (err) {
      setSaveState('error');
      toast.error('Failed to save: ' + formatErrorMessage(err));
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Universal Section Header */}
      <EditorSectionHeader
        title="About Me &amp; Story Menu"
        subtitle="Manage your vertical portrait photo, credentials, and custom menu sections (Education, Background, Achievements, Vision)."
        saveState={saveState}
        onSave={handleSave}
        saveLabel="Save About Me"
      />

      {/* ── CARD 1: Portrait Image & Credentials ── */}
      <div className="rounded-[3px] border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggle('portrait')}
          className="w-full flex items-center justify-between p-4 sm:p-5 text-left border-b border-light-border/60 dark:border-dark-border/60 hover:bg-light-surface-muted/40 dark:hover:bg-dark-canvas/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-terracotta dark:text-ochre" />
            <h3 className="font-serif text-sm sm:text-base font-medium text-light-ink dark:text-dark-ink">
              Vertical Portrait Photo &amp; Location
            </h3>
          </div>
          {collapsed.portrait ? (
            <ChevronRight className="w-4 h-4 text-light-ink-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-light-ink-muted" />
          )}
        </button>

        {!collapsed.portrait && (
          <div className="p-4 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Photo Preview Frame (Vertical Rectangle) */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="w-36 h-48 sm:w-40 sm:h-52 rounded-[3px] overflow-hidden border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-canvas shadow-xs relative group">
                  <img
                    src={aboutImageUrl || './images/photo.png'}
                    alt="Portrait Preview"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs bg-white/90 text-black hover:bg-white border-none cursor-pointer"
                    >
                      Change Photo
                    </Button>
                  </div>
                </div>
                <span className="font-mono text-2xs text-light-ink-muted dark:text-dark-ink-muted mt-2">
                  Vertical Aspect (3:4)
                </span>
              </div>

              {/* Photo URL & Upload Action */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <Label className="text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted mb-1 block">
                    Upload New Portrait
                  </Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="h-9 text-xs flex items-center gap-2 border-light-border dark:border-dark-border cursor-pointer"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />
                    )}
                    <span>
                      {uploadingImage
                        ? 'Uploading...'
                        : 'Upload Image (PNG, JPG, WebP < 5MB)'}
                    </span>
                  </Button>
                </div>

                <div>
                  <Label className="text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted mb-1 block">
                    Portrait Image URL
                  </Label>
                  <Input
                    value={aboutImageUrl}
                    onChange={(e) => {
                      notifyDirty();
                      setAboutImageUrl(e.target.value);
                    }}
                    placeholder="https://... or ./images/photo.png"
                    className="font-mono text-xs h-9"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <Label className="text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted mb-1 block">
                      Education Credential
                    </Label>
                    <Input
                      value={education}
                      onChange={(e) => {
                        notifyDirty();
                        setEducation(e.target.value);
                      }}
                      placeholder="Drexel University · Math & CS (GPA 3.52)"
                      className="font-mono text-xs h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted mb-1 block">
                      City / Location
                    </Label>
                    <Input
                      value={location}
                      onChange={(e) => {
                        notifyDirty();
                        setLocation(e.target.value);
                      }}
                      placeholder="Philadelphia, PA"
                      className="font-mono text-xs h-9"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Label className="text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted mb-1 block">
                    Section Subtitle / Description
                  </Label>
                  <Input
                    value={aboutDescription}
                    onChange={(e) => {
                      notifyDirty();
                      setAboutDescription(e.target.value);
                    }}
                    placeholder="Education, engineering background, and future aspirations."
                    className="font-sans text-xs h-9"
                  />
                  <p className="text-2xs text-light-ink-muted/80 dark:text-dark-ink-muted/80 mt-1">
                    Displayed below the &quot;About Me&quot; section heading. Easily customizable when your story evolves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 2: Editorial Menu Sections (Customly Configurable) ── */}
      <div className="rounded-[3px] border border-light-border dark:border-dark-border bg-light-surface-card dark:bg-dark-surface-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggle('menu')}
          className="w-full flex items-center justify-between p-4 sm:p-5 text-left border-b border-light-border/60 dark:border-dark-border/60 hover:bg-light-surface-muted/40 dark:hover:bg-dark-canvas/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-terracotta dark:text-ochre" />
            <h3 className="font-serif text-sm sm:text-base font-medium text-light-ink dark:text-dark-ink">
              Story Menu Sections ({menuItems.length})
            </h3>
          </div>
          {collapsed.menu ? (
            <ChevronRight className="w-4 h-4 text-light-ink-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-light-ink-muted" />
          )}
        </button>

        {!collapsed.menu && (
          <div className="p-4 sm:p-6 space-y-6">
            <p className="text-xs text-light-ink-muted dark:text-dark-ink-muted">
              Configure the titles and sub-content items shown in the right-hand menu. Sub-content items can be written with one bullet point per line.
            </p>

            <div className="space-y-5">
              {menuItems.map((section, idx) => (
                <div
                  key={section.id || idx}
                  className="p-4 sm:p-5 rounded-[2px] border border-light-border dark:border-dark-border bg-light-surface/60 dark:bg-dark-canvas/50 space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-semibold text-terracotta dark:text-ochre">
                      #{String(idx + 1).padStart(2, '0')} SECTION
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMenuItem(idx)}
                      className="text-light-ink-muted hover:text-red-500 h-7 px-2 text-xs cursor-pointer"
                      title="Delete this section"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      <span>Remove</span>
                    </Button>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted mb-1 block">
                      Main Title
                    </Label>
                    <Input
                      value={section.title}
                      onChange={(e) => updateMenuItem(idx, { title: e.target.value })}
                      placeholder="e.g. Education, About, One Achievement..."
                      className="font-serif text-sm h-9"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted mb-1 block">
                      Sub-Contents (One bullet point per line)
                    </Label>
                    <Textarea
                      value={section.items.join('\n')}
                      onChange={(e) => updateMenuSubItems(idx, e.target.value)}
                      placeholder="-- Item 1&#10;-- Item 2"
                      rows={4}
                      className="font-sans text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addMenuItem}
              className="w-full h-10 text-xs font-mono font-medium border-dashed border-light-border dark:border-dark-border flex items-center justify-center gap-2 hover:border-terracotta dark:hover:border-ochre cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-terracotta dark:text-ochre" />
              <span>Add Menu Section</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
