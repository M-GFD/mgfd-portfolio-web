import type { ThreeElements } from '@react-three/fiber';

export type GroupProps = ThreeElements['group'];

export type DeviceProps = {
  screen: string;
  screens?: string[];
  /** Índice entero de la captura visible (se toma módulo la cantidad de capturas). */
  cycle?: number;
} & Omit<GroupProps, 'children'>;

export function screenState({ screen, screens, cycle }: Pick<DeviceProps, 'screen' | 'screens' | 'cycle'>) {
  const urls = screens && screens.length > 0 ? screens : [screen];
  const n = urls.length;
  const active = (((cycle ?? 0) % n) + n) % n;
  return { urls, active };
}
