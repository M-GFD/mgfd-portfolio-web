import Image from 'next/image';

const technologies = [
  { name: 'Figma', icon: '/images/figma.png' },
  { name: 'Gemini', icon: '/images/gemini.png' },
  { name: 'Illustrator', icon: '/images/illustrator.png' },
  { name: 'Kling', icon: '/images/kling.png' },
  { name: 'Photoshop', icon: '/images/photoshop.png' },
  { name: 'Slack', icon: '/images/slack.png' },
  { name: 'X Design', icon: '/images/x-design.png' },
  { name: 'Z AI', icon: '/images/z ai.png' },
];

const projects = [
  {
    title: '1190 Sports / OTT Arts',
    image: '/images/project-1.png',
    description:
      'Artes para OTT y piezas de campaña para AFA Play, trabajando composiciones de alto impacto para deportes en vivo.',
    objective:
      'Intención visual: hero deportivo, contraste fuerte y foco en jugadores para comunicar “contenido exclusivo”.',
    tools: ['Photoshop', 'Illustrator', 'Figma'],
  },
  {
    title: 'Novogas Web App',
    image: '/images/project-2.png',
    description:
      'Diseño del dashboard web para monitoreo de cilindros, altas semanales y mapa operativo en tiempo real.',
    objective:
      'Intención visual: interfaz clara sobre laptop, priorizando datos de operación y contexto geográfico.',
    tools: ['Photoshop', 'Illustrator', 'Figma', 'X Design', 'Gemini'],
  },
  {
    title: 'Doninas Website',
    image: '/images/project-3.png',
    description:
      'Diseño visual para sitio de marca alimenticia con estética cálida y navegación simple para usuarios finales.',
    objective:
      'Intención visual: destacar producto principal dentro de un mockup de desktop con identidad de marca.',
    tools: ['Photoshop', 'Illustrator', 'Figma'],
  },
  {
    title: 'Temps Studio Branding / Visual',
    image: '/images/project-4.png',
    description:
      'Desarrollo de identidad gráfica y aplicación visual para marca creativa, enfocada en presencia digital.',
    objective:
      'Intención visual: branding protagonista, composición centrada y lectura rápida de marca.',
    tools: ['Photoshop', 'Illustrator', 'Figma', 'Gemini', 'Kling', 'Slack', 'X Design', 'Z AI'],
  },
];

function ToolBadges({ names }: { names: string[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {names.map((name) => {
        const tech = technologies.find((item) => item.name === name);
        if (!tech) return null;

        return (
          <span
            key={name}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs"
          >
            <Image src={tech.icon} alt={name} width={16} height={16} className="h-4 w-4 rounded-sm" />
            {name}
          </span>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#24272f] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,173,79,0.35),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(157,98,255,0.35),transparent_35%)]" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm">
              <Image src="/images/favicon.png" alt="MGFD marca" width={88} height={26} className="h-5 w-auto" />
              <span className="text-white/80">www.mgfd.com.ar</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Portfolio de Mateo G. Fontana Dalmasso
            </h1>
            <p className="max-w-2xl text-lg text-white/80">
              UX/UI & Graphic Designer. Esta versión replica la intención del portfolio original:
              portada protagonista, perfil personal, proyectos en mockups y stack visual de
              herramientas.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#proyectos"
                className="rounded-full bg-[#4ed7ff] px-6 py-3 font-semibold text-[#10192a] transition hover:brightness-95"
              >
                Ver proyectos
              </a>
              <a
                href="#herramientas"
                className="rounded-full border border-white/35 bg-white/5 px-6 py-3 font-semibold text-white"
              >
                Herramientas
              </a>
            </div>
          </div>

          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/20 bg-black/20 p-3 backdrop-blur sm:col-span-2">
              <Image
                src="/images/title-image.svg"
                alt="Portada principal del portfolio"
                width={980}
                height={520}
                priority
                className="h-auto w-full rounded-2xl"
              />
            </div>
            <div className="rounded-3xl border border-white/20 bg-black/20 p-3">
              <Image
                src="/images/profile.png"
                alt="Retrato de Mateo Fontana Dalmasso"
                width={700}
                height={700}
                className="h-auto w-full rounded-2xl object-cover"
              />
            </div>
            <div className="relative rounded-3xl border border-white/20 bg-black/20 p-3">
              <Image
                src="/images/_mgfd_logo.svg"
                alt="Isotipo MGFD"
                width={160}
                height={70}
                className="mb-4 h-8 w-auto"
              />
              <p className="text-sm text-white/75">
                Dirección visual basada en fondos oscuros, gradientes cálidos y acentos neón para
                destacar cada pieza.
              </p>
              <Image
                src="/images/gemini.png"
                alt="Detalle visual"
                width={56}
                height={56}
                className="absolute bottom-3 right-3 h-10 w-10 opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="proyectos" className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-3xl font-bold md:text-4xl">Proyectos y propósito visual</h2>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              className="overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5"
            >
              <Image
                src={project.image}
                alt={project.title}
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-semibold">{project.title}</h3>
                <p className="mt-3 text-white/80">{project.description}</p>
                <p className="mt-2 text-sm text-[#8de6ff]">{project.objective}</p>
                <ToolBadges names={project.tools} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="herramientas" className="border-y border-white/10 bg-black/15">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="mb-8 text-3xl font-bold md:text-4xl">Herramientas utilizadas</h2>
          <p className="mb-8 max-w-3xl text-white/80">
            En línea con el portfolio original, cada proyecto combina diseño gráfico, producto e IA
            aplicada. Estas son las herramientas utilizadas en las piezas mostradas.
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center gap-2 rounded-xl border border-white/15 bg-white/5 p-4"
              >
                <Image src={tech.icon} alt={tech.name} width={64} height={64} className="h-10 w-10" />
                <span className="text-xs text-white/80">{tech.name}</span>
              </div>
            ))}
          </div>
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
