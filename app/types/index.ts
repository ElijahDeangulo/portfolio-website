// Types and Interfaces for the Portfolio Website

export interface Project {
  title: string;
  logo: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  features: string[];
  impact: string;
  github?: string;
  website?: string;
}

export type ProjectId = 'ar-automation' | 'pricing-intelligence' | 'revenue-intelligence' | 'special-miracle';

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface ThemeToggleProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  isClient: boolean;
  isSpotifyExpanded: boolean;
}

export interface MusicPlayerProps {
  playlistId?: string;
  youtubeVideoId?: string;
  youtubeStartTime?: string;
  onExpandedChange?: (expanded: boolean) => void;
}

export interface TypingAnimationProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
}

export interface FloatingElementsProps {
  section: string;
}

export interface FeaturedProjectsCarouselProps {
  mousePosition: { x: number; y: number };
  getSectionTransform: (speed: number) => any;
  onProjectClick?: (projectId: string) => void;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface ParallaxEffects {
  scrollY: number;
  mousePosition: MousePosition;
  getSectionTransform: (speed: number) => React.CSSProperties;
  getElementTransform: (speed: number, mouseMultiplier?: number) => React.CSSProperties;
  getHeroElementTransform: (direction?: 'left' | 'right' | 'up' | 'down', speed?: number) => React.CSSProperties;
  getExperienceElementTransform: (index: number, delay?: number) => React.CSSProperties;
  getExperienceSectionPushTransform: () => React.CSSProperties;
  getHeroExitTransform: () => React.CSSProperties;
  getFeaturedProjectsFadeTransform: () => React.CSSProperties;
} 