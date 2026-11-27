import { BufferAttribute, ExtrudeGeometry, Shape, ShapeGeometry, type BufferGeometry } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** Punto de un cuadrante de superelipse |x|^n + |y|^n = 1, parametrizado por el ángulo de la normal. */
function superellipsePoint(theta: number, n: number): [number, number] {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const p = 1 / (n - 1);
  const x = Math.sign(c) * Math.abs(c) ** p;
  const y = Math.sign(s) * Math.abs(s) ** p;
  const norm = (Math.abs(x) ** n + Math.abs(y) ** n) ** (1 / n);
  return [x / norm, y / norm];
}

/**
 * Rectángulo centrado con esquinas de superelipse (squircle, n = 4 por defecto).
 * Muestrear por ángulo de la normal reparte el giro en partes iguales: 90° / segments por tramo,
 * así que no quedan facetas visibles en las curvas del cuerpo.
 */
export function squircleShape(
  w: number,
  h: number,
  r: number,
  opts: { n?: number; segments?: number } = {},
): Shape {
  const n = opts.n ?? 4;
  const segments = opts.segments ?? 24;
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  const cx = w / 2 - radius;
  const cy = h / 2 - radius;
  const centers: [number, number][] = [
    [cx, cy],
    [-cx, cy],
    [-cx, -cy],
    [cx, -cy],
  ];

  const shape = new Shape();
  let first = true;
  for (let q = 0; q < 4; q++) {
    const [ox, oy] = centers[q];
    for (let j = 0; j <= segments; j++) {
      const theta = ((q + j / segments) * Math.PI) / 2;
      const [x, y] = superellipsePoint(theta, n);
      const px = ox + radius * x;
      const py = oy + radius * y;
      if (first) {
        shape.moveTo(px, py);
        first = false;
      } else {
        shape.lineTo(px, py);
      }
    }
  }
  shape.closePath();
  return shape;
}

/**
 * Cuerpo extruido con bisel: esquinas squircle y normales suavizadas (sin facetas en los reflejos).
 * Centrado en el origen; la profundidad total (bisel incluido) es `depth`.
 */
export function squircleBody(w: number, h: number, r: number, depth: number, bevel = 0.012): BufferGeometry {
  const core = Math.max(0.002, depth - 2 * bevel);
  let g: BufferGeometry = new ExtrudeGeometry(
    squircleShape(w - 2 * bevel, h - 2 * bevel, Math.max(0.001, r - bevel)),
    { depth: core, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 8, curveSegments: 24 },
  );
  g.translate(0, 0, -core / 2);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g, 1e-5);
  g.computeVertexNormals();
  return g;
}

/** Plano squircle con UV 0..1 sobre la caja (para pantallas y paneles). */
export function squirclePlane(w: number, h: number, r: number, segments = 12): BufferGeometry {
  const g = new ShapeGeometry(squircleShape(w, h, r, { segments }));
  const pos = g.getAttribute('position');
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
  }
  g.setAttribute('uv', new BufferAttribute(uv, 2));
  return g;
}
