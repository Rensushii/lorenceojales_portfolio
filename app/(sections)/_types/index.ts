export interface ProjectModalContent {
  subtitle: string;
  problem?: string;
  solution?: string;
  results?: string;
  overview?: string;
  features?: string[];
  tech: string[];
  awardLink?: string;
  liveUrl?: string;
  fusion360?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  bgClass: string;
  image: string;
  gallery: string[];
  liveUrl?: string;
  modalContent: ProjectModalContent;
}

export type MedalBadge = 'silver' | 'participant' | 'gold' | 'bronze';

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  venue: string;
  date: string;
  badge: MedalBadge;
  image: string;
  description: string;
  link?: string;
}

export type CertificationCategory =
  | 'webinar'
  | 'icpep'
  | 'training'
  | 'seminar'
  | 'hackathon';

export interface Certification {
  title: string;
  date: string;
  categories: CertificationCategory[];
  imgUrl: string;
}

export interface ExperienceItem {
  date: string;
  title: string;
  org: string;
  details: string[];
}

export interface Education {
  title: string;
  org: string;
  date: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export interface NavLink {
  label: string;
  href: string;
}
