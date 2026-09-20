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

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-3.5 rounded-lg bg-light-surface/40 dark:bg-dark-surface/40 border border-light-border dark:border-dark-border">
        {/* Square Visual Preview Box (64px) */}
        <div className="relative shrink-0 flex items-center justify-center w-16 h-16 rounded-xl border border-terracotta/70 bg-light-surface dark:bg-dark-surface overflow-hidden shadow-inner mx-auto sm:mx-0">
          {hasLogo ? (
            <img
              src={logoUrl}
              alt="Emblem preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-1 select-none bg-light-surface/40 dark:bg-dark-surface/40">
              <span className="font-serif font-black text-terracotta text-2xl sm:text-3xl leading-none tracking-normal">
                {kanji || '木'}
              </span>
              {kanjiSubtitle && (
                <span className="text-[10px] font-mono tracking-wider text-ochre uppercase font-bold leading-none mt-1">
                  {kanjiSubtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Controls & Inputs */}
        <div className="flex-1 w-full space-y-2.5">
          {/* Kanji Picker Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setKanjiModalOpen(true)}
              className="text-xs h-8 border-light-border dark:border-dark-border hover:border-terracotta/50 hover:text-terracotta cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-ochre" />
              <span>Browse Kanji Library ({kanji || 'None'})</span>
            </Button>

            {onKanjiSubtitleChange && (
              <div className="flex items-center gap-1.5 flex-1 min-w-[140px]">
                <Input
                  type="text"
                  value={kanjiSubtitle}
                  onChange={(e) => onKanjiSubtitleChange(e.target.value)}
                  placeholder="Subtitle (e.g. AI, SYS)"
                  className="text-xs h-8 font-mono uppercase"
                  maxLength={8}
                />
              </div>
            )}
          </div>

          {/* Logo URL / File Upload Row */}
          {showLogoOption && onLogoUrlChange && (
            <div className="space-y-1.5 pt-1 border-t border-light-border/40 dark:border-dark-border/40">
              <div className="flex items-center gap-2">
                <Input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => onLogoUrlChange(e.target.value)}
                  placeholder="Custom Logo Image URL (e.g. https://... or ./images/...)"
                  className="text-xs font-mono h-8 flex-1"
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
                          <Upload className="w-3.5 h-3.5 mr-1 text-ochre" />
                          <span>Upload</span>
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
                    className="text-xs h-8 px-2 text-light-ink-muted hover:text-red-500 cursor-pointer"
                    title="Clear logo image to use Kanji character"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
              <p className="font-sans text-[11px] text-light-ink-subtle dark:text-dark-ink-subtle">
                {hasLogo
                  ? 'Custom logo active. Clear URL to revert to the Japanese Kanji seal.'
                  : 'Displaying Kanji seal. Enter a URL or upload an image to use a company/brand logo.'}
              </p>
            </div>
          )}
        </div>
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
