import Image from 'next/image';

const projects = [
  {
    title: 'Graphic Designer at POLI Studio',
    description:
      'Más de 2 años trabajando para POLI Studio, creando piezas de alto impacto para startups y emprendedores: corrección de color, exploración creativa y mejoras visuales continuas para cada cliente.',
    highlights: [
      'Branding y social media',
      'Composición de piezas publicitarias',
      'Trabajo colaborativo con senior designers',
    ],
    image: '/images/project-1.png',
    imageAlt: 'Proyecto POLI Studio',
  },
  {
    title: 'Graphic Designer for 1190 Sports',
    description:
      'Diseño integral de decks, composiciones y artes de OTT (AFA Play), YouTube y redes sociales para ligas y clubes de Argentina, Perú y Brasil.',
    highlights: [
      'Misión: potenciar derechos deportivos con narrativa visual',
      'Sistema multiformato “Wilson” para generar artes en múltiples tamaños',
      'Piezas para campañas, miniaturas, banners y posters',
    ],
    image: '/images/project-2.png',
    imageAlt: 'Proyecto 1190 Sports',
  },
  {
    title: 'CX & UX/UI for Novogas',
    description:
      'Diseño UX/UI web y mobile para una app IoT de seguimiento de consumo de gas en tiempo real, con vistas para empresas y usuarios finales.',
    highlights: [
      'Mapa interactivo y panel web para gestión operativa',
      'App móvil con estados de cilindro y acciones de recambio',
      'Esquema completo de flujos en light mode y dark mode',
    ],
    image: '/images/project-3.png',
    imageAlt: 'Proyecto Novogas',
  },
  {
    title: 'Freelance UX/UI for Umbrella E‑Commerce',
    description:
      'Proyecto freelance de e-commerce con arquitectura completa de pantallas, checkout y cuenta de usuario en modo claro y oscuro.',
    highlights: [
      'Wireframes y prototipos completos',
      'Flujos de compra y perfil de usuario',
      'Sistema visual adaptable a dos temas',
    ],
    image: '/images/project-4.png',
    imageAlt: 'Proyecto Umbrella E‑Commerce',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#24272f] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,173,79,0.35),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(157,98,255,0.3),transparent_35%)]" />
        <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-[#ffc24b]/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#ff6b3d]/25 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm">
              <Image src="/images/_mgfd_logo.svg" alt="MGFD" width={18} height={18} />
              <span>www.mgfd.com.ar</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Portfolio UX/UI & Graphic Design
            </h1>
            <p className="text-lg text-white/80">
              Soy Mateo G. Fontana Dalmasso. Este portfolio reúne trabajos en OTT, producto
              digital, social media y diseño gráfico con una estética oscura + gradientes,
              inspirada en mi portfolio anterior.
            </p>
            <a
              href="#proyectos"
              className="inline-block rounded-full bg-[#4ed7ff] px-6 py-3 font-semibold text-[#10192a] transition hover:brightness-95"
            >
              Ver proyectos
            </a>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-white/20 bg-black/20 p-4 backdrop-blur">
              <Image
                src="/images/title-image.svg"
                alt="Portada del portfolio"
                width={720}
                height={420}
                className="h-auto w-full rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section id="proyectos" className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-3xl font-bold md:text-4xl">Experiencia y proyectos clave</h2>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              className="overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5"
            >
              <Image
                src={project.image}
                alt={project.imageAlt}
                width={900}
                height={520}
                className="h-auto w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-semibold">{project.title}</h3>
                <p className="mt-3 text-white/80">{project.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  {project.highlights.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-6 py-12 text-sm text-white/70">
        <p>
          ¿Querés trabajar conmigo? Contacto:{' '}
          <a href="mailto:hola@mgfd.com.ar" className="text-[#67e1ff]">
            hola@mgfd.com.ar
          </a>
        </p>
      </footer>
    </main>
  );
}
