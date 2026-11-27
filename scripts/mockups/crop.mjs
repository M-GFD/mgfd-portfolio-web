// Recorta pantallas limpias del material existente para usarlas dentro de los equipos 3D.
// Salida: public/images/mockups/<proyecto>/<device>-NN.webp (WebP q85).
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC = 'public/images';
const OUT = 'public/images/mockups';

/** Tamaño final de la textura por equipo (proporción de su pantalla). */
const TARGET = {
  laptop: { width: 1600, height: 1000 }, // 16:10
  phone: { width: 780, height: 1688 }, // ~19.5:9
};

/**
 * box = región en píxeles de la imagen fuente.
 * trim = recortar márgenes blancos del tablero (pantallas sueltas sobre fondo blanco).
 */
const JOBS = [
  // POLI: pantalla del mockup armado (bezel excluido).
  { project: 'poli', device: 'laptop', n: 1, src: 'project-03.webp', box: [134, 106, 778, 503] },

  // 1190 Sports: pantallas de notebook y de celular de los mockups existentes.
  { project: '1190', device: 'laptop', n: 1, src: '1190_asset_02.webp', box: [143, 35, 723, 435] },
  { project: '1190', device: 'laptop', n: 2, src: '1190_asset_05.webp', box: [1137, 352, 561, 356] },
  { project: '1190', device: 'phone', n: 1, src: '1190_asset_05.webp', box: [431, 242, 298, 640] },

  // Novogas: pantallas del tablero de escritorio (dark mode) y del tablero móvil.
  { project: 'novogas', device: 'laptop', n: 1, src: 'novogas_desktop.webp', box: [802, 796, 388, 222], trim: true },
  { project: 'novogas', device: 'laptop', n: 2, src: 'novogas_desktop.webp', box: [407, 796, 388, 222], trim: true },
  { project: 'novogas', device: 'laptop', n: 3, src: 'novogas_desktop.webp', box: [802, 1043, 388, 222], trim: true },
  { project: 'novogas', device: 'phone', n: 1, src: 'novogas_mobile.webp', box: [1092, 1332, 118, 246], trim: true },
  { project: 'novogas', device: 'phone', n: 2, src: 'novogas_mobile.webp', box: [1356, 1332, 118, 246], trim: true },
  { project: 'novogas', device: 'phone', n: 3, src: 'novogas_mobile.webp', box: [1620, 1332, 118, 246], trim: true },
];

for (const job of JOBS) {
  const [left, top, width, height] = job.box;
  const dir = join(OUT, job.project);
  mkdirSync(dir, { recursive: true });

  let img = sharp(join(SRC, job.src)).extract({ left, top, width, height });
  if (job.trim) {
    // Materializa el recorte antes de trim (sharp aplica trim sobre la imagen entera).
    img = sharp(await img.png().toBuffer()).trim({ background: '#ffffff', threshold: 24 });
  }
  const target = TARGET[job.device];
  const out = join(dir, `${job.device}-${String(job.n).padStart(2, '0')}.webp`);
  const info = await sharp(await img.png().toBuffer())
    .resize({ ...target, fit: 'cover', position: 'top', kernel: 'lanczos3' })
    .sharpen({ sigma: 0.8 })
    .webp({ quality: 85 })
    .toFile(out);
  console.log(`${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB  (fuente ${width}x${height})`);
}
