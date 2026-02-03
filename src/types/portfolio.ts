export interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  technologies?: string[];
  tags?: string[];
  reversed: boolean;
  createdAt?: string;
}

export interface Technology {
  name: string;
  icon: string;
  color: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}