import { useEffect, useCallback } from 'react';

export function useAdminDirty(sectionName: string, onDiscard?: () => void, onSave?: () => void) {
  const notifyDirty = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('portfolio-admin-dirty', {
        detail: { section: sectionName, dirty: true },
      })
    );
  }, [sectionName]);

  const notifyClean = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('portfolio-admin-clean', {
        detail: { section: sectionName },
      })
    );
  }, [sectionName]);

  // Handle global discard event
  useEffect(() => {
    if (!onDiscard) return;
    const handleDiscard = (e: Event) => {
      const customEvent = e as CustomEvent<{ section?: string }>;
      if (!customEvent.detail?.section || customEvent.detail.section === sectionName) {
        onDiscard();
        notifyClean();
      }
    };

    window.addEventListener('portfolio-admin-discard', handleDiscard);
    return () => window.removeEventListener('portfolio-admin-discard', handleDiscard);
  }, [sectionName, onDiscard, notifyClean]);

  // Handle global save keyboard event (Ctrl+S / Cmd+S)
  useEffect(() => {
    if (!onSave) return;
    const handleSave = () => {
      onSave();
    };

    window.addEventListener('portfolio-admin-save', handleSave);
    return () => window.removeEventListener('portfolio-admin-save', handleSave);
  }, [onSave]);

  return {
    notifyDirty,
    notifyClean,
  };
}
