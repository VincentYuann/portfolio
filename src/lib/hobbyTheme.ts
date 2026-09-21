/**
 * Centralized theme color mappings for hobby categories
 */
export const getCategoryStyle = (category?: string, idx: number = 0): string => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('food') || cat.includes('culinary') || cat.includes('tea') || cat.includes('coffee') || cat.includes('plant') || cat.includes('dining')) {
    return 'bg-bamboo/10 dark:bg-bamboo/20 border-bamboo/30 text-bamboo dark:text-[#87A889]';
  }
  if (cat.includes('anime') || cat.includes('visual') || cat.includes('art') || cat.includes('story') || cat.includes('animation')) {
    return 'bg-terracotta/10 dark:bg-terracotta/20 border-terracotta/30 text-terracotta dark:text-[#ff7d63]';
  }
  if (cat.includes('craft') || cat.includes('wood') || cat.includes('build') || cat.includes('hardware') || cat.includes('gaming') || cat.includes('game')) {
    return 'bg-ochre/10 dark:bg-ochre/20 border-ochre/30 text-ochre dark:text-[#E5B88F]';
  }
  if (cat.includes('music') || cat.includes('sound') || cat.includes('photo') || cat.includes('camera') || cat.includes('trading') || cat.includes('market') || cat.includes('fitness') || cat.includes('gym')) {
    return 'bg-[#3B4E6B]/10 dark:bg-[#3B4E6B]/25 border-[#3B4E6B]/30 text-[#3B4E6B] dark:text-[#8EA8C3]';
  }
  const fallbacks = [
    'bg-bamboo/10 dark:bg-bamboo/20 border-bamboo/30 text-bamboo dark:text-[#87A889]',
    'bg-terracotta/10 dark:bg-terracotta/20 border-terracotta/30 text-terracotta dark:text-[#ff7d63]',
    'bg-ochre/10 dark:bg-ochre/20 border-ochre/30 text-ochre dark:text-[#E5B88F]',
    'bg-[#3B4E6B]/10 dark:bg-[#3B4E6B]/25 border-[#3B4E6B]/30 text-[#3B4E6B] dark:text-[#8EA8C3]',
  ];
  return fallbacks[idx % fallbacks.length];
};
