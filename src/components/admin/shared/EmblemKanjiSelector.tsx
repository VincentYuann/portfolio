import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, BookOpen } from 'lucide-react';
import { KanjiPickerModal } from '../modals/KanjiPickerModal';
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
  variant?: 'boxed' | 'embedded';
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
  variant = 'boxed',
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

  const isEmbedded = variant === 'embedded';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-xs font-medium text-light-ink-muted dark:text-dark-ink-muted flex items-center justify-between">
          <span>{label}</span>
        </Label>
      )}

      <div className={isEmbedded ? 'pt-1.5 space-y-2.5' : 'pt-2 space-y-3'}>
        {/* Top Header: Seal Box + Kanji Browse & Romaji Subtitle Stack */}
        <div className="flex items-center gap-3">
          {/* Visual Seal Preview Box */}
          <div
            className={`relative shrink-0 flex items-center justify-center rounded-xl border border-terracotta/60 bg-terracotta/5 dark:bg-terracotta/10 overflow-hidden shadow-inner p-1 ${
              isEmbedded ? 'w-12 h-12' : 'w-14 h-14'
            }`}
          >
            {hasLogo ? (
              <img
                src={logoUrl}
                alt="Emblem preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center select-none text-center">
                <span
                  className={`font-serif font-black text-terracotta leading-tight break-all ${
                    (kanji?.length || 0) > 2
                      ? 'text-xs tracking-tighter'
                      : (kanji?.length || 0) === 2
                      ? isEmbedded ? 'text-sm leading-none' : 'text-base leading-none tracking-tight'
                      : isEmbedded ? 'text-2xl' : 'text-3xl'
                  }`}
                >
                  {kanji || '木'}
                </span>
              </div>
            )}
          </div>

          {/* Controls Column */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Browse Kanji Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setKanjiModalOpen(true)}
              className="w-full text-xs h-7.5 sm:h-8 px-2.5 sm:px-3 border-light-border dark:border-dark-border hover:border-terracotta/60 hover:text-terracotta cursor-pointer justify-between font-medium"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <BookOpen className="w-3.5 h-3.5 text-ochre shrink-0" />
                <span className="truncate text-xs">
                  Symbol:{' '}
                  <span className="font-serif font-bold text-terracotta text-sm ml-0.5">
                    {kanji || 'None'}
                  </span>
                </span>
              </div>
              <span className="text-xs font-mono text-terracotta font-semibold uppercase tracking-wider shrink-0">
                Browse →
              </span>
            </Button>

            {/* Romaji Subtitle Input */}
            {onKanjiSubtitleChange && (
              <Input
                type="text"
                value={kanjiSubtitle}
                onChange={(e) => onKanjiSubtitleChange(e.target.value)}
                placeholder="ROMAJI READING (e.g. MA)"
                className="text-xs h-7.5 font-mono uppercase w-full"
                maxLength={24}
                title="Romaji / Concept Tag"
              />
            )}
          </div>
        </div>

        {/* Logo URL / File Upload Row (when logo option enabled) */}
        {showLogoOption && onLogoUrlChange && (
          <div className="flex flex-col gap-1.5 pt-2.5 border-t border-light-border/40 dark:border-dark-border/40">
            <div className="flex items-center gap-1.5">
              <Input
                type="url"
                value={logoUrl}
                onChange={(e) => onLogoUrlChange(e.target.value)}
                placeholder="Logo URL (e.g. https://...)"
                aria-label="Emblem or company logo URL"
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
            <p className="font-sans text-xs text-light-ink-muted dark:text-dark-ink-muted leading-relaxed mt-1">
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
            onKanjiSubtitleChange(preset.romaji.toUpperCase());
          }
          setKanjiModalOpen(false);
        }}
        onClose={() => setKanjiModalOpen(false)}
      />
    </div>
  );
};
