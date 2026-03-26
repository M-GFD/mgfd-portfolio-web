import { Technology } from '@/types/portfolio';

/** Orden del menú desplegable bajo el carrusel (debe coincidir con archivos en `public/images/`). */
export const SELECTABLE_TECH_ORDER = [
  'Photoshop',
  'Illustrator',
  'Figma',
  'Kling',
  'Gemini',
  'Antigravity',
  'Cursor',
  'Slack',
] as const;

export const technologies: Technology[] = [
  {
    name: 'Figma',
    icon: '🎨',
    color: '#F24E1E',
  },
  {
    name: 'Photoshop',
    icon: '🖼️',
    color: '#31A8FF',
  },
  {
    name: 'Illustrator',
    icon: '✏️',
    color: '#FF9A00',
  },
  {
    name: 'Gemini',
    icon: '⚛️',
    color: '#61DAFB',
  },
  {
    name: 'Antigravity',
    icon: '▲',
    color: '#000000',
    imageExt: 'svg',
  },
  {
    name: 'Cursor',
    icon: '▲',
    color: '#000000',
  },
  {
    name: 'Kling',
    icon: '▲',
    color: '#000000',
  },
  {
    name: 'Slack',
    icon: '▲',
    color: '#000000',
  },
];