import React from 'react';
import { HeroAkariStudio } from './HeroAkariStudio';

import { ViewMode } from '../../../App';

interface HeroProps {
  onNavigate?: (view: ViewMode, sectionId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return <HeroAkariStudio onNavigate={onNavigate} />;
};
