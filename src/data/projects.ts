import { Project } from '@/types/portfolio';

export const projects: Project[] = [
  {
    id: 1,
    title: '1190 Sports — Challenges',
    subtitle: 'Deck design, compositing and sports image treatment',
    description:
      'Complete concept decks design, image research, selection and processing for rights deals, sponsorships and sports broadcasting campaigns.',
    fullDescription: `Proyecto enfocado en la creación de decks completos para 1190 Sports.

Incluyó investigación visual, selección de fotografías, tratamiento de imagen y composiciones de alto impacto para presentaciones comerciales (PowerPoint) vinculadas a derechos de imagen y patrocinios en Argentina, Perú y Brasil.

Además, se desarrollaron múltiples piezas para OTT, YouTube y redes sociales (thumbnails, banners, posters y formatos derivados), optimizando producción mediante sistema multi-cut.`,
    image: 'https://via.placeholder.com/1280x720/0f172a/ffffff?text=1190+Sports+Challenges',
    technologies: ['Photoshop', 'Illustrator', 'PowerPoint'],
    tags: ['Sports', 'Decks', 'Compositing'],
    reversed: false,
  },
  {
    id: 2,
    title: 'Wilson System',
    subtitle: 'Sistema multi-formato para piezas simultáneas',
    description:
      'Producción simultánea de campañas en múltiples tamaños para acelerar la salida de artes en social media y plataformas digitales.',
    fullDescription: `Implementación del sistema "Wilson" para diseñar de forma simultánea múltiples piezas de campaña en diferentes resoluciones.

Se aplicó en contenidos como Franco Mastantuono y Superclásico para asegurar coherencia visual entre formatos desktop, mobile, banners y miniaturas.

Resultado: reducción de tiempos de producción y mayor consistencia de marca entre canales.`,
    image: 'https://via.placeholder.com/1280x720/111827/ffffff?text=Wilson+System',
    technologies: ['Photoshop', 'Figma'],
    tags: ['Workflow', 'Automation', 'Social Media'],
    reversed: true,
  },
  {
    id: 3,
    title: 'Social Media & YouTube Arts',
    subtitle: 'Campañas visuales para video y redes',
    description:
      'Dirección de arte y ejecución para miniaturas, posters y piezas promocionales orientadas a engagement.',
    fullDescription: `Desarrollo de piezas promocionales para social media y YouTube con foco en CTR y recordación.

Se trabajaron versiones para laptop y mobile, priorizando legibilidad, jerarquía tipográfica y contraste en contextos de consumo rápido.`,
    image: 'https://via.placeholder.com/1280x720/1f2937/ffffff?text=Social+Media+%26+YouTube+Arts',
    technologies: ['Photoshop', 'Figma'],
    tags: ['YouTube', 'Social', 'Campaign'],
    reversed: false,
  },
  {
    id: 4,
    title: 'AFA Play — OTT Arts',
    subtitle: 'Key visuals y composiciones para plataforma OTT',
    description:
      'Artes promocionales para contenidos OTT con foco en fútbol argentino y narrativa de alto impacto visual.',
    fullDescription: `Creación de key visuals para campañas OTT de AFA Play.

Se diseñaron conceptos con jugadores destacados, versiones para home hero, social push y material promocional de temporada.

Se incluyeron variantes por torneo, equipos y objetivos de comunicación.`,
    image: 'https://via.placeholder.com/1280x720/0b1120/ffffff?text=AFA+Play+OTT+Arts',
    technologies: ['Photoshop', 'Illustrator'],
    tags: ['OTT', 'Sports', 'Key Visual'],
    reversed: true,
  },
  {
    id: 5,
    title: '1190 Sports — Corporate Decks',
    subtitle: 'Presentaciones institucionales y comerciales',
    description:
      'Diseño de decks institucionales con estructura modular para partners, portfolio, clientes y propuesta de valor.',
    fullDescription: `Diseño de presentaciones para 1190 Sports: quiénes somos, portfolio, partners y clientes.

Se definieron estilos visuales, retícula y componentes reutilizables para asegurar consistencia en propuestas comerciales.`,
    image: 'https://via.placeholder.com/1280x720/1e293b/ffffff?text=1190+Sports+Decks',
    technologies: ['PowerPoint', 'Photoshop'],
    tags: ['Decks', 'B2B', 'Branding'],
    reversed: false,
  },
  {
    id: 6,
    title: 'Novogas — CX & UX/UI',
    subtitle: 'Diseño de experiencia para ecosistema gas-tech',
    description:
      'Diseño UX/UI para plataforma digital y app mobile orientada a usuarios y empresas de distribución de gas.',
    fullDescription: `Proyecto de UX/UI para Novogas abarcando login, navegación, paneles operativos y experiencia mobile.

Se definieron flujos de usuario, componentes de interfaz y lineamientos visuales para mejorar claridad operativa y experiencia de uso.`,
    image: 'https://via.placeholder.com/1280x720/f97316/ffffff?text=Novogas+CX+%26+UX%2FUI',
    technologies: ['Figma', 'Design System'],
    tags: ['UX/UI', 'SaaS', 'Energy'],
    reversed: true,
  },
  {
    id: 7,
    title: 'Novogas Web App',
    subtitle: 'Dashboard operativo con mapa y analítica',
    description:
      'Web app para empresas distribuidoras: monitoreo de cilindros, estado por zonas y métricas clave de operación.',
    fullDescription: `Diseño del home y esquema completo de la web app de Novogas.

Incluye vistas de registro, login, mapa interactivo, analytics, formularios y estados operativos en dark/light mode.`,
    image: 'https://via.placeholder.com/1280x720/0f172a/ffffff?text=Novogas+Web+App',
    technologies: ['Figma', 'UX Research'],
    tags: ['Web App', 'Dashboard', 'Maps'],
    reversed: false,
  },
  {
    id: 8,
    title: 'Novogas Mobile App',
    subtitle: 'Monitoreo de consumo en tiempo real para usuarios',
    description:
      'App móvil para seguimiento de gas, alertas, pedidos de recambio y gestión de saldo.',
    fullDescription: `Diseño de app mobile para usuarios finales con monitoreo en tiempo real del estado del cilindro.

Se diseñaron vistas en light y dark mode, componentes de estado, indicadores de consumo y acciones de recarga/pedido.`,
    image: 'https://via.placeholder.com/1280x720/1f2937/ffffff?text=Novogas+Mobile+App',
    technologies: ['Figma', 'Mobile UI'],
    tags: ['Mobile App', 'IoT', 'UX'],
    reversed: true,
  },
  {
    id: 9,
    title: 'Umbrella E-commerce',
    subtitle: 'Freelance UX/UI project',
    description:
      'Diseño end-to-end de e-commerce: catálogo, producto, carrito, checkout y perfil de usuario.',
    fullDescription: `Proyecto freelance UX/UI para Umbrella e-commerce.

Se desarrolló esquema completo en modo claro y oscuro: home, fichas de producto, carrito, perfil y checkout con flujo completo de compra.`,
    image: 'https://via.placeholder.com/1280x720/f59e0b/ffffff?text=Umbrella+E-commerce',
    technologies: ['Figma', 'Prototyping'],
    tags: ['E-commerce', 'Freelance', 'UX/UI'],
    reversed: false,
  },
  {
    id: 10,
    title: 'POLI Studio',
    subtitle: 'Graphic Designer — Branding & visual campaigns',
    description:
      'Más de 2 años creando piezas visuales para startups y emprendedores con foco en calidad y dirección de arte.',
    fullDescription: `Experiencia en POLI Studio trabajando en corrección de color, propuestas creativas y revisión de diseños para múltiples clientes.

Participación en campañas visuales, piezas para redes y mejoras iterativas de comunicación gráfica orientada a negocio.`,
    image: 'https://via.placeholder.com/1280x720/f97316/ffffff?text=POLI+Studio',
    technologies: ['Photoshop', 'Illustrator', 'Social Design'],
    tags: ['Graphic Design', 'Branding', 'Agency'],
    reversed: true,
  },
];
