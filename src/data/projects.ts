import { Project } from '@/types/portfolio';

// Bump when you replace image files (same names) so the browser loads the new versions
const IMG_V = 'v=4';

export const projects: Project[] = [
  {
    id: 1,
    title: '1190 Sports',
    subtitle: 'Deck design, Sistema multi-corte, social media, OTT y presentaciones corporativas',
    description:
      'Decks completos, sistema multi-formato Wilson, piezas para redes y YouTube, key visuals AFA Play OTT y presentaciones institucionales para 1190 Sports.',
    fullDescription: `Proyecto enfocado en la creación de decks completos para 1190 Sports: investigación visual, selección de fotografías, tratamiento de imagen y composiciones de alto impacto para presentaciones comerciales (PowerPoint) vinculadas a derechos de imagen y patrocinios en Argentina, Perú y Brasil.

Implementación del sistema "Wilson" para diseñar de forma simultánea múltiples piezas de campaña en diferentes resoluciones. Se aplicó en contenidos como Franco Mastantuono y Superclásico para asegurar coherencia visual entre formatos desktop, mobile, banners y miniaturas. Resultado: reducción de tiempos de producción y mayor consistencia de marca entre canales.

Desarrollo de piezas promocionales para social media y YouTube con foco en CTR y recordación (thumbnails, banners, posters), optimizando producción mediante sistema multi-cut. Creación de key visuals para campañas OTT de AFA Play con jugadores destacados, versiones para home hero, social push y material promocional de temporada.

Diseño de presentaciones institucionales: quiénes somos, portfolio, partners y clientes, con estilos visuales, retícula y componentes reutilizables para propuestas comerciales.`,
    image: `/images/project-01.png?${IMG_V}`,
    technologies: ['Photoshop', 'Illustrator', 'Figma', 'PowerPoint'],
    reversed: false,
    galleryImages: [
      `/images/1190_asset_01.png?${IMG_V}`,
      `/images/1190_asset_02.png?${IMG_V}`,
      `/images/1190_asset_03.png?${IMG_V}`,
      `/images/1190_asset_04.png?${IMG_V}`,
      `/images/1190_asset_05.png?${IMG_V}`,
      `/images/1190_asset_06.png?${IMG_V}`,
      `/images/1190_asset_07.png?${IMG_V}`,
    ],
    sectionImages: [
      {
        sectionTitle: 'Sistema multi-corte',
        images: [`/images/wilson mastantuono.png?${IMG_V}`, `/images/wilson_superclasico.png?${IMG_V}`],
      },
    ],
  },
  {
    id: 2,
    title: 'Novogas',
    subtitle: 'CX & UX/UI, Web App y Mobile App para ecosistema gas-tech',
    description:
      'Diseño UX/UI para plataforma digital y app móvil: login, navegación, paneles operativos, mapa interactivo, analytics y monitoreo de consumo en tiempo real.',
    fullDescription: `Proyecto de UX/UI para Novogas abarcando login, navegación, paneles operativos y experiencia mobile. Flujos de usuario, componentes de interfaz y lineamientos visuales para mejorar claridad operativa.

Diseño del home y esquema completo de la web app: vistas de registro, login, mapa interactivo, analytics, formularios y estados operativos en dark/light mode para empresas distribuidoras (monitoreo de cilindros, estado por zonas y métricas clave).

Diseño de app mobile para usuarios finales con monitoreo en tiempo real del estado del cilindro, vistas en light y dark mode, componentes de estado, indicadores de consumo y acciones de recarga/pedido.`,
    image: `/images/project-02.png?${IMG_V}`,
    technologies: ['Figma', 'Design System', 'UX Research', 'Mobile UI'],
    reversed: true,
    galleryImages: [`/images/novogas_desktop.png?${IMG_V}`, `/images/novogas_mobile.png?${IMG_V}`],
  },
  {
    id: 3,
    title: 'POLI Design Studio',
    subtitle: 'Graphic Designer — Branding & visual campaigns',
    description:
      'Más de 2 años creando piezas visuales para startups y emprendedores con foco en calidad y dirección de arte.',
    fullDescription: `Experiencia en POLI Studio trabajando en corrección de color, propuestas creativas y revisión de diseños para múltiples clientes.

Participación en campañas visuales, piezas para redes y mejoras iterativas de comunicación gráfica orientada a negocio.`,
    image: `/images/project-03.png?${IMG_V}`,
    technologies: ['Photoshop', 'Illustrator', 'Social Design'],
    reversed: false,
  },
  {
    id: 4,
    title: 'Temps Studio',
    subtitle: 'Soluciones audiovisuales y diseño',
    description:
      'Agencia de soluciones audiovisuales. Diseño gráfico. Diseño UX/UI. Diseño audiovisual con IA.',
    fullDescription: `Agencia de soluciones audiovisuales. Diseño gráfico. Diseño UX/UI. Diseño audiovisual con IA.`,
    image: `/images/project-04.png?${IMG_V}`,
    technologies: [],
    reversed: true,
  },
];
