/**
 * Pantallas que se muestran dentro de los equipos 3D de cada proyecto.
 * Generadas por `npm run mockups:capture` (Vertic, FEG) y `npm run mockups:crop` (resto).
 * La primera ruta de cada equipo es la pantalla por defecto; el resto se cicla en la escena.
 */
export type DeviceKind = 'laptop' | 'tablet' | 'phone';

export type ProjectScreens = {
  projectId: number;
  devices: Partial<Record<DeviceKind, string[]>>;
};

const m = (project: string, file: string) => `/images/mockups/${project}/${file}.webp`;

export const mockupScreens: ProjectScreens[] = [
  {
    projectId: 6, // Vertic
    devices: {
      laptop: [m('vertic', 'laptop-01')],
      tablet: [m('vertic', 'tablet-01')],
      phone: [m('vertic', 'phone-01')],
    },
  },
  {
    projectId: 5, // FEG
    devices: {
      laptop: [m('feg', 'laptop-01')],
      tablet: [m('feg', 'tablet-01')],
      phone: [m('feg', 'phone-01')],
    },
  },
  {
    projectId: 1, // 1190 Sports
    devices: {
      laptop: [m('1190', 'laptop-01'), m('1190', 'laptop-02')],
      phone: [m('1190', 'phone-01')],
    },
  },
  {
    projectId: 2, // Novogas
    devices: {
      laptop: [m('novogas', 'laptop-01'), m('novogas', 'laptop-02'), m('novogas', 'laptop-03')],
      phone: [m('novogas', 'phone-01'), m('novogas', 'phone-02'), m('novogas', 'phone-03')],
    },
  },
  {
    projectId: 3, // POLI Design Studio
    devices: {
      laptop: [m('poli', 'laptop-01')],
    },
  },
];

export function screensFor(projectId: number): ProjectScreens {
  const found = mockupScreens.find((s) => s.projectId === projectId);
  if (!found) throw new Error(`No hay pantallas de mockup para el proyecto ${projectId}`);
  return found;
}
