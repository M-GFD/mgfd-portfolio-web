const defaultCanvas = () => (typeof document === 'undefined' ? null : document.createElement('canvas'));

/** true si el navegador puede crear un contexto WebGL (2 o 1). Nunca lanza. */
export function canUseWebGL(create: () => HTMLCanvasElement | null = defaultCanvas): boolean {
  try {
    const canvas = create();
    if (!canvas) return false;
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
