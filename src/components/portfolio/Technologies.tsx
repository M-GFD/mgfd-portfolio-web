import Image from 'next/image';
import { technologies } from '@/constants/technologies';

export default function Technologies() {
  return (
    <section id="technologies" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Technologies & Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-16 h-16 mb-4">
                  <Image
                    src={`/images/${tech.name.toLowerCase()}.png`}
                    alt={tech.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-black">{tech.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}