import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, BookOpen } from 'lucide-react';
import { KanjiPickerModal } from '../KanjiPickerModal';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface EmblemKanjiSelectorProps {
  kanji: string;
  kanjiSubtitle?: string;
  logoUrl?: string;
  onKanjiChange: (char: string, romaji?: string) => void;
  onKanjiSubtitleChange?: (subtitle: string) => void;
  onLogoUrlChange?: (url: string) => void;
  onUploadImage?: (file: File) => Promise<string | null>;
  showLogoOption?: boolean;
  label?: string;
  className?: string;
}

export const EmblemKanjiSelector: React.FC<EmblemKanjiSelectorProps> = ({
  kanji,
  kanjiSubtitle = '',
  logoUrl = '',
  onKanjiChange,
  onKanjiSubtitleChange,
  onLogoUrlChange,
  onUploadImage,
  showLogoOption = true,
  label = 'Emblem Seal & Kanji Identity',
  className = '',
}) => {
  const [kanjiModalOpen, setKanjiModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hasLogo = showLogoOption && Boolean(logoUrl?.trim());

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage || !onLogoUrlChange) return;

    setUploading(true);
    try {
      const url = await onUploadImage(file);
      if (url) {
        onLogoUrlChange(url);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-xs font-medium text-light-ink dark:text-dark-ink flex items-center justify-between">
        <span>{label}</span>
      </Label>

      <div className="p-3 sm:p-4 rounded-xl bg-light-surface/50 dark:bg-dark-surface/50 border border-light-border dark:border-dark-border space-y-3">
        {/* Top Header: Seal Box + Kanji Browse & Romaji Subtitle Stack */}
        <div className="flex items-start gap-3">
          {/* Visual Seal Preview Box */}
          <div className="relative shrink-0 flex items-center justify-center w-14 h-14 rounded-xl border border-terracotta/70 bg-light-surface dark:bg-dark-surface overflow-hidden shadow-inner">
            {hasLogo ? (
              <img
                src={logoUrl}
                alt="Emblem preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-1 select-none bg-light-surface/40 dark:bg-dark-surface/40">
                <span className="font-serif font-black text-terracotta text-2xl leading-none tracking-normal">
                  {kanji || '木'}
                </span>
                {kanjiSubtitle && (
                  <span className="text-[10px] font-mono tracking-wider text-ochre uppercase font-bold leading-none mt-1 truncate max-w-[48px]">
                    {kanjiSubtitle}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Controls Column */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Browse Kanji Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setKanjiModalOpen(true)}
              className="w-full text-xs h-8 px-2.5 border-light-border dark:border-dark-border hover:border-terracotta/50 hover:text-terracotta cursor-pointer justify-start font-medium"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-ochre shrink-0" />
              <span className="truncate">Kanji: {kanji || 'None'}</span>
            </Button>

            {/* Romaji Subtitle Input */}
            {onKanjiSubtitleChange && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-light-ink-muted dark:text-dark-ink-muted uppercase shrink-0 font-medium">
                  Tag:
                </span>
                <Input
                  type="text"
                  value={kanjiSubtitle}
                  onChange={(e) => onKanjiSubtitleChange(e.target.value)}
                  placeholder="ROMAJI"
                  className="text-xs h-7.5 font-mono uppercase flex-1 min-w-0 text-center"
                  maxLength={10}
                  title="Romaji / Subtitle Tag"
                />
              </div>
            )}
          </div>
        </div>

        {/* Logo URL / File Upload Row (when logo option enabled) */}
        {showLogoOption && onLogoUrlChange && (
          <div className="space-y-1.5 pt-2.5 border-t border-light-border/40 dark:border-dark-border/40">
            <div className="flex items-center gap-1.5">
              <Input
                type="url"
                value={logoUrl}
                onChange={(e) => onLogoUrlChange(e.target.value)}
                placeholder="Logo URL (e.g. https://...)"
                className="text-xs font-mono h-8 flex-1 min-w-0"
              />

              {onUploadImage && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-xs h-8 px-2.5 shrink-0 border-light-border dark:border-dark-border hover:border-terracotta/50 hover:text-terracotta cursor-pointer"
                    title="Upload image file"
                  >
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 sm:mr-1 text-ochre" />
                        <span className="hidden sm:inline">Upload</span>
                      </>
                    )}
                  </Button>
                </>
              )}

              {hasLogo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onLogoUrlChange('')}
                  className="text-xs h-8 px-2 text-light-ink-muted hover:text-red-500 cursor-pointer shrink-0"
                  title="Clear logo image to use Kanji character"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
            <p className="font-sans text-[10px] text-light-ink-subtle dark:text-dark-ink-subtle leading-tight">
              {hasLogo
                ? 'Custom logo active. Clear URL to revert to Japanese Kanji seal.'
                : 'Displaying Kanji seal. Enter URL or upload image to override with custom logo.'}
            </p>
          </div>
        )}
      </div>

      <KanjiPickerModal
        isOpen={kanjiModalOpen}
        selectedChar={kanji}
        onSelect={(char, preset) => {
          onKanjiChange(char, preset?.romaji);
          if (onKanjiSubtitleChange && preset?.romaji && !kanjiSubtitle) {
            onKanjiSubtitleChange(preset.romaji.toUpperCase().slice(0, 5));
          }
          setKanjiModalOpen(false);
        }}
        onClose={() => setKanjiModalOpen(false)}
      />
    </div>
  );
};
