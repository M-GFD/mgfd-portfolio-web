import Image from 'next/image';

export default function Hero() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="relative w-full max-w-4xl mx-auto mb-6">
          <Image
            src="/images/hero/title.png"
            alt="Creating Digital Experiences"
            width={855}
            height={81}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Specializing in UI/UX design and graphic design.
        </p>
      </div>
    </section>
  );
}