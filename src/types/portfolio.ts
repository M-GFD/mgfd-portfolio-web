export interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  image: string;
  technologies?: string[];
  tags?: string[];
  reversed: boolean;
  createdAt?: string;
  /** Imágenes por sección para mostrar en el modal (ej. Sistema multi-corte) */
  sectionImages?: { sectionTitle: string; images: string[] }[];
  /** Galería de imágenes de la card (se muestran en mini galería / modal) */
  galleryImages?: string[];
}

export interface Technology {
  name: string;
  icon: string;
  color: string;
  imageExt?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}
