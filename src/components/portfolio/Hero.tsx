import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-6">
            Creating Digital Experiences
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12">
            I craft modern, user-centered web applications that combine beautiful design with powerful functionality.
          </p>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
          >
            View My Work
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}