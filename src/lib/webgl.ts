const defaultCanvas = () => (typeof document === 'undefined' ? null : document.createElement('canvas'));

/** true si el navegador puede crear un contexto WebGL2 (three r163+ ya no acepta WebGL1). Nunca lanza. */
export function canUseWebGL(create: () => HTMLCanvasElement | null = defaultCanvas): boolean {
  try {
    const canvas = create();
    if (!canvas) return false;
    return Boolean(canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}
