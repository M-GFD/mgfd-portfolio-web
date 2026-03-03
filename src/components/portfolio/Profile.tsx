export default function Profile() {
  return (
    <section id="about" className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Profile Image - SIN GRADIENTE VIOLETA */}
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src="/images/profile.png"
              alt="MGFD - Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-justify md:text-left">
            <h3 className="text-4xl font-bold text-black mb-4">What about me???</h3>
            <p className="text-justify text-gray-600 mb-6">
              My name is Mateo and I'm a designer with years of expertise in creating digital experiences, static graphic designing and, multimedia projects that connect brands with their audiences. AI enthusiastic. With years of experience in Graphic Design and UI/UX Design, I'm always trying to transform ideas of any kind into reality.
            </p>
            <p className="text-justify text-gray-600">
              My approach: user-centered creative thinking with technical skills, ensuring every project not only looks and feels good, but also, performs really with excelence at the same time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}