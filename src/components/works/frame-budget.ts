/**
 * Vigila el tiempo de cuadro del lienzo mientras se scrollea y avisa UNA vez si la GPU no llega:
 * `streak` ventanas seguidas de `window` cuadros con promedio por encima de `budget` segundos.
 * Los intervalos mayores a `maxFrame` se ignoran: son reposo entre ráfagas del frameloop a demanda o
 * tirones aislados de carga (texturas, shaders), no falta sostenida de potencia de la GPU.
 */
export function createFrameBudget({ window = 30, budget = 0.024, maxFrame = 0.1, streak = 2 } = {}) {
  let samples: number[] = [];
  let over = 0;
  let tripped = false;
  return (dt: number): boolean => {
    if (tripped || dt > maxFrame) return false;
    samples.push(dt);
    if (samples.length < window) return false;
    const avg = samples.reduce((s, d) => s + d, 0) / samples.length;
    samples = [];
    over = avg > budget ? over + 1 : 0;
    if (over < streak) return false;
    tripped = true;
    return true;
  };
}
