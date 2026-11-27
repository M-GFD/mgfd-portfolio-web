/**
 * Puente sin dependencias de three entre el DOM (scroll) y el lienzo 3D (carga diferida).
 * El lienzo registra su `invalidate`; las escenas lo piden al cambiar el progreso.
 */
let invalidateFn: ((frames?: number) => void) | null = null;

export function setSceneInvalidate(fn: ((frames?: number) => void) | null) {
  invalidateFn = fn;
}

/**
 * Pide dos cuadros: el <View> de drei decide si está fuera de pantalla con el estado del cuadro
 * anterior, así que una vista que acaba de entrar (salto de scroll, ancla) recién se dibuja en el segundo.
 */
export function requestSceneRender() {
  invalidateFn?.(2);
}
