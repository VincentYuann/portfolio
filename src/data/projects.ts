export interface Project {
  id: string;
  title: string;
  kanji: string;
  category?: string;
  badge?: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
  metrics?: { label: string; value: string }[];
  overview: string;
  bullets?: string[];
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  statusLabel?: string;
  links: {
    github?: string;
    live?: string;
    caseStudyText?: string;
  };
  isFeatured?: boolean;
  displayOrder?: number;
}

export const PROJECTS: Project[] = [];


