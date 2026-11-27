/*
 * Medición de fluidez del scroll. Pegar en la consola de Chrome con la página abierta (build de producción).
 * Recorre la página de arriba abajo en 3 s con window.scrollTo (Lenis sincroniza con el scroll nativo)
 * y reporta fps promedio, p95 del tiempo de cuadro y cuadros de más de 33 ms.
 * Objetivo: promedio ≥ 55 fps y menos de 3 cuadros > 33 ms.
 */
(async () => {
  const DURATION = 3000;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const scrollTo = (y) => window.scrollTo(0, y);

  scrollTo(0);
  await new Promise((r) => setTimeout(r, 400));

  const frames = [];
  let last = performance.now();
  const start = last;

  await new Promise((resolve) => {
    const tick = (now) => {
      frames.push(now - last);
      last = now;
      const t = Math.min(1, (now - start) / DURATION);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      scrollTo(eased * max);
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });

  frames.shift();
  const sorted = [...frames].sort((a, b) => a - b);
  const total = frames.reduce((s, d) => s + d, 0);
  const result = {
    frames: frames.length,
    avgFps: +(1000 / (total / frames.length)).toFixed(1),
    p95ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(1),
    over33ms: frames.filter((d) => d > 33).length,
    maxMs: +sorted[sorted.length - 1].toFixed(1),
  };
  console.table(result);
  return result;
})();
