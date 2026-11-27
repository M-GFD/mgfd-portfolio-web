# Rediseño del portfolio _mgfd_ — diseño

Fecha: 2026-11-26 · Estado: borrador para aprobación

## 1. Intención

Mateo no está conforme con cómo se ve ni cómo se siente el sitio actual. El rediseño busca que el portfolio transmita nivel premium en dos frentes:

- **Visual:** contraste, sombreado, ritmo y acabado de los mockups.
- **Sensación:** scroll y animaciones muy fluidos, sin el viaje en profundidad (eje Z) actual.

Los proyectos son el centro: cada uno se muestra en dispositivos 3D realistas (notebook, tablet y celular) con acabado fiel hasta en las esquinas y curvas de los cuerpos.

## 2. Objetivos

1. **Proyectos:** se presentan en escenas fijadas, una por proyecto, con mockups 3D en tiempo real.
2. **Navegación:** solo en X e Y. Se elimina la pila en profundidad (`PremiumScrollJourney`) y la órbita móvil (`CircularScrollOrbit`).
3. **Espaciado:** ultra-profesional entre secciones, con un ritmo premium consistente.
4. **About:** nuevo diseño, sin cambiar una sola palabra del texto.
5. **Componentes:** más contraste y mejor sombreado.
6. **Video de fondo:** calidad base 1080p con look cinematográfico.
7. **Fluidez:** objetivo de 60 fps o más en el scroll de escritorio, sin tirones visibles.

## 3. No-objetivos

- No se cambian los textos: Hero, About, proyectos ni footer, en ES ni en EN.
- No se cambia la tipografía actual.
- No se tocan el blog, la API, el Experience Gate ni el audio, salvo los ajustes de estilo necesarios para que convivan con el nuevo diseño.
- No se agregan secciones ni contenido nuevo (estadísticas, testimonios, etc.).

## 4. Anti-objetivos (lo que lo haría un fracaso aunque funcione)

- **Mockups que parezcan de juguete:** bordes duros sin bisel, plástico sin reflejos, pantallas planas sin vidrio.
- **Un sitio "lindo" que se arrastra:** el 3D o el video bajando los fps, scroll pesado o carga larga antes de ver algo.
- **Movimiento hacia adelante o atrás en la navegación de la página.**
- **Texto ilegible sobre el video.**
- **Celulares que se calientan o traban.**

## 5. Restricciones y datos del proyecto

- **Stack:** Next.js 16 (App Router), React 19, Tailwind v4, animejs, framer-motion, sharp. Todavía no hay three.js.
- **i18n propio:** `LanguageContext`, con mensajes en `es.json` y `en.json`.
- **Video actual:**
  - `public/images/portfolio_vid_bg.mp4`: 848×478, unos 26 s, 4,7 MB. Es el que se usa hoy (`src/lib/background-media.ts`).
  - `portfolio_vid_bg.webm`: VP9 **1920×1080**, 20 MB. Era el fondo original; se reemplazó por el MP4 por compatibilidad con iOS (commit `9249cd9`).
  - Hay que comparar los dos para decidir cuál es la mejor fuente.
- **Lección de rendimiento ya medida:** `filter` CSS y `mix-blend-mode` sobre el `<video>` bajaron el scroll a unos 56 fps. Todo el grade va grabado en el archivo de video, no en CSS.
- **Máquina local:** RTX 2060 (6 GB) para el upscale con IA. Chrome está instalado, lo que permite capturas headless sin descargar nada.
- **Material por proyecto:**
  - **Vertic:** capturar https://vertictechnology.com/ en tres tamaños.
  - **FEG:** capturar https://feg.ar/ en tres tamaños.
  - **1190 Sports:** 7 piezas (`1190_asset_01..07`, de 835 a 1769 px de ancho), para notebook y tablet.
  - **Novogas:**
    - **Escritorio:** `novogas_desktop` (2400×2280).
    - **Celular:** `novogas_mobile` es un tablero de flujo con decenas de pantallas de unos 105×235 px cada una. Recortadas, van a verse blandas dentro del celular 3D.
  - **POLI Design Studio:** solo existe como mockup armado (`project-03`, 1047×762). Decisión de Mateo: **recortar la pantalla del mockup** (queda en unos 780×470 px).

## 6. Enfoques considerados

### Mockups

1. **3D en tiempo real con three.js** ← **elegido por Mateo.** Las curvas, los biseles y los reflejos del cuerpo se ven reales en movimiento. Cuesta unos 200 KB de JS (con carga diferida) y más trabajo de GPU.
2. Equipos en CSS/SVG. Son livianos y nítidos, pero al girar se nota que son planos. Se descartó porque no cumple el realismo de los cuerpos.

### Recorrido de proyectos

1. **A · Escenas fijadas** ← **elegido por Mateo.** Cada proyecto queda fijo en pantalla mientras los equipos entran en X/Y y se componen. Después sale y entra el siguiente.
2. B · Galería horizontal fijada.
3. C · Editorial alternado con scroll libre (queda como base de la versión móvil).

### About

1. **A · Editorial dividido** ← **elegido por Mateo.**
2. B · Manifiesto tipográfico.
3. C · Bento.

## 7. Diseño

### 7.1 Estructura y scroll

- **Orden:** Hero → About + Herramientas → Proyectos → Footer. Es el actual, sin la pila Z.
- **Flujo:** documento con flujo normal. `PremiumScrollJourney`, `CircularScrollOrbit` y `depth-stack` se retiran del layout.
- **Proyectos:** usan `position: sticky` dentro de un contenedor alto. El progreso de scroll de cada escena maneja la animación.
- **Scroll suave:** en escritorio con puntero fino, usando Lenis. Nativo en pantallas táctiles y con `prefers-reduced-motion`. *(Decisión de diseño de Claude.)*
- **Navegación del header:** sigue llevando a `#about` y `#works`.

### 7.2 Ritmo y espaciado

- **Escala de espaciado única:** tokens con `clamp()` (por ejemplo, 8 · 16 · 24 · 40 · 64 · 104 · 168).
- **Separación entre secciones:** `clamp(120px, 18vh, 220px)`.
- **Dentro de cada sección:** escalones más chicos. Es más aire entre secciones que adentro.
- **Grilla:** 12 columnas en escritorio, con un ancho máximo de contenido de unos 1240 px y márgenes laterales consistentes.

### 7.3 Contraste y sombreado

- **Superficies por niveles:** fondo, elevación 1 y elevación 2.
  - Cada nivel tiene un borde de luz interior de 1 px (`inset 0 1px 0 rgba(255,255,255,.08–.14)`).
  - Lleva una sombra en dos capas: ambiente amplia y suave, más una de contacto corta y densa.
- **Texto:** contraste AA o más sobre el peor cuadro del video. Para eso se apoya en el scrim (degradados ya existentes, ajustados) y en el grade del video.
- **Botones y foco:** estados claros de hover, foco visible (`focus-visible`) y presión.

### 7.4 Hero

- **Estructura sin cambios:** título SVG, MorphingText y botón.
- **Mejoras:** más contraste, una entrada más pulida y el ritmo de espaciado nuevo.
- Sin la intro de profundidad. Entra con fundido y desplazamiento en Y.

### 7.5 About (A · Editorial dividido)

- **Retrato:** vertical, grande, a la izquierda. Usa `profile_03`; si el encuadre no alcanza, se evalúan `profile_01/02`. Lleva luz de borde suave y sombra profunda.
- **Texto, a la derecha:**
  - Antetítulo "Sobre mí" pequeño.
  - El título "¿Qué hay de mí?".
  - `p1` a mayor tamaño, como entrada.
  - `p2` y `p3` en tamaño de lectura.
- **Herramientas:** debajo, como una fila de íconos en piezas elevadas.
- **Celular:** el retrato va arriba y el texto debajo.
- **Text Reveal:** se conserva solo si no compromete la legibilidad. *(Decisión de diseño de Claude.)*

### 7.6 Proyectos: escenas fijadas

- **Contenedor:** uno por proyecto, de unos 220vh, con un viewport fijo de 100vh.
- **Columna de texto (DOM):** título, subtítulo, descripción (los textos actuales) y el link a la web cuando existe.
- **Lienzo 3D:** ocupa el resto de la pantalla.
- **Coreografía de la escena según el progreso (0→1):**
  - **0–0,35:** los equipos entran desde los costados y desde abajo (X/Y), con una leve rotación propia que revela biseles y reflejos.
  - **0,35–0,75:** composición en reposo. El texto queda legible y las pantallas pueden alternar imágenes; por ejemplo, 1190 cicla sus piezas.
  - **0,75–1:** los equipos salen en X/Y y entra la escena siguiente.
- **Indicador fino de progreso:** por ejemplo, "2 / 5".
- **Equipos por proyecto:**

  | Proyecto | Equipos | Material |
  |---|---|---|
  | Vertic | notebook, tablet y celular | capturas de su web |
  | FEG | notebook, tablet y celular | capturas de su web |
  | 1190 Sports | notebook y tablet | piezas 1190 |
  | Novogas | notebook y celular | `novogas_desktop` y recortes de `novogas_mobile` |
  | POLI | notebook | recorte de `project-03` |

  Proponer algo más es libre si el material lo justifica.
- **Orden de proyectos:** el actual (Vertic, FEG, 1190, Novogas, POLI).
- **Carrusel y lightbox actuales:** se retiran. Los links a las webs se mantienen como botones.
- **Celular (<1024 px):** escenas sin fijar. Los proyectos van apilados y los equipos entran con un parallax suave.

### 7.7 Mockups 3D

- **Librerías:** `three`, `@react-three/fiber`, `@react-three/drei`. Carga diferida (`dynamic import`) cuando la sección de proyectos se acerca al viewport.
- **Un solo contexto WebGL:** drei `View` / `View.Port` reparte escenas por elemento del DOM, tanto en escritorio como en celular.
- **Modelado procedural** (sin modelos descargados ni licencias):
  - **Perfiles:** curvas tipo squircle (superelipse) extruidas, con bisel suave de muchos segmentos. Las esquinas y curvas no muestran facetas a la distancia de presentación.
  - **Notebook:** tapa y base de aluminio con bisel y chaflán, bisagra, marco negro de pantalla y una muesca discreta. Inspiración genérica, sin logos ni marcas.
  - **Tablet:** cuerpo de cantos planos con radio grande, marco fino y cámara frontal.
  - **Celular:** marco metálico con radio continuo, vidrio frontal, isla de cámara y botones laterales.
- **Materiales:**
  - **Aluminio y marcos:** `MeshPhysicalMaterial` con metalness y roughness calibrados.
  - **Vidrio:** clearcoat más una capa de reflejo sobre la pantalla.
  - **Pantallas:** imágenes en sRGB, con mipmaps y anisotropía, y emisión leve.
- **Iluminación de estudio sin descargar HDRI:** drei `Environment` con `Lightformer` (softboxes). Sombras de contacto suaves bajo cada equipo.
- **Render:** tone mapping AgX o ACES, `frameloop="demand"` (redibuja solo en scroll o animación) y DPR limitado a [1, 2]. En celular, DPR y calidad menores.
- **Fallbacks:**
  - Sin WebGL: composición estática con capturas.
  - `prefers-reduced-motion`: composiciones en reposo, sin entradas.

### 7.8 Captura de material

- **Vertic y FEG:** Chrome headless (`chrome.exe --headless --screenshot`) a escala 2×.
  - **Notebook:** 1440×900.
  - **Tablet:** 834×1194.
  - **Celular:** 390×844.
  - Se descartan banners de cookies o pop-ups antes de capturar, si los hay.
- **Recortes:** con sharp. POLI desde `project-03` (corrigiendo la perspectiva si hace falta) y pantallas sueltas de `novogas_mobile`.
- **Salida:** WebP calidad ~85 en `public/images/mockups/<proyecto>/`.

### 7.9 Video cinematográfico 1080p

**Herramientas** (requieren descarga, con permiso explícito de Mateo):

| Archivo | Origen | Tamaño aprox. |
|---|---|---|
| `ffmpeg-release-essentials.zip` | gyan.dev | ~100 MB |
| `realesrgan-ncnn-vulkan-20220424-windows.zip` | GitHub, xinntao/Real-ESRGAN | ~45 MB |

Se guardan fuera del repo (en `tools/`, que queda ignorado, o en el scratchpad).

**Proceso:**
1. **Elegir la fuente:** se comparan cuadros del webm 1080p y del MP4 478p.
   - **Si el webm es nítido:** se usa como fuente, sin IA.
   - **Si es un reescalado blando:** se reescala el original con Real-ESRGAN (`realesr-general-x4v3` con denoise suave) y se baja a 1920×1080 con lanczos.
2. **Grade cinematográfico con ffmpeg:**
   - Curvas con negros profundos y altas suaves.
   - Saturación contenida y unificación de tono entre clips.
   - Viñeta.
   - Grano fino.
   - Todo **grabado en el archivo**, sin efectos en CSS.
3. **Codificación:**
   - **1080p H.264 High:** CRF ~20, `+faststart`, sin audio, unos 12–18 MB.
   - **720p para celular:** unos 5–7 MB.
   - Se sirve con `<source media>` o selección por ancho.
4. **Expectativa honesta:** si la fuente real es 478p, la IA reconstruye nitidez, pero no inventa detalle verdadero. El resultado se juzga a ojo antes de publicarse.

### 7.10 Rendimiento: presupuestos y verificación

- **Scroll de escritorio:** al menos 55 fps de promedio y menos de 3 cuadros largos en un recorrido completo, medido con el mismo método de rAF usado en producción.
- **Carga del 3D:** three/R3F no forma parte del bundle inicial.
- **Hero:** se ve antes de 2,5 s en conexión normal.
- **Celular:** sin escenas fijadas y con DPR ≤ 1,5. Se verifica en emulación móvil y en un recorrido completo.
- **Verificación final:** Chrome escritorio y móvil, ES y EN, reduced-motion y consola sin errores.

## 8. Entrega

- **Branch:** el trabajo se hace en `redesign`, con commits por etapa.
- **Revisión:** Vercel genera una URL de preview para revisarlo antes de mergear a `main`. *(Decisión de Claude: es un cambio grande y no conviene llevarlo directo a producción.)*
- **Orden sugerido:**
  1. Captura de material.
  2. Base de layout y ritmo, retirando la pila Z.
  3. About.
  4. Mockups 3D.
  5. Escenas de proyectos.
  6. Video.
  7. Pulido y verificación.

## 9. Queda a criterio del builder

- Radios, biseles y proporciones exactas de cada equipo, dentro del criterio de realismo del punto 7.7.
- La composición concreta de cada escena (posiciones y ángulos de reposo) y las curvas de easing.
- Los valores exactos de la escala de espaciado y de sombras.
- La duración de la escena por proyecto (en torno a 220vh) si las pruebas indican otra.
- Qué pantallas de `novogas_mobile` usar.
