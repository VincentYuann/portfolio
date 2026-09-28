import { TypographyVariantId } from '../context/VariantContext';

export const VARIANT_FONT_URLS: Record<TypographyVariantId, string> = {
  v1: 'https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;600&family=Chakra+Petch:wght@400;600;700&family=Mulish:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Zen+Old+Mincho:wght@400;700;900&display=swap',
  v2: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@500;700;800&display=swap',
  v3: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=IBM+Plex+Mono:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap',
  v4: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap',
  v5: 'https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;500;600;700&family=Chakra+Petch:wght@400;500;600;700&family=Mulish:ital,wght@0,400;0,600;0,700;1,400&display=swap',
  v6: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;600;700&family=Unbounded:wght@500;600;700;800&display=swap',
  v7: 'https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap',
};

const loadedVariants = new Set<string>();

/**
 * Dynamically streams font stylesheets on-demand when switching typography variants,
 * keeping the initial page load lean (~25 KB vs 1.59 MB).
 */
export const loadVariantFonts = (variantId: TypographyVariantId): void => {
  if (typeof document === 'undefined') return;
  if (loadedVariants.has(variantId)) return;

  const linkId = `google-font-variant-${variantId}`;
  if (document.getElementById(linkId)) {
    loadedVariants.add(variantId);
    return;
  }

  const url = VARIANT_FONT_URLS[variantId];
  if (!url) return;

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
  loadedVariants.add(variantId);
};
