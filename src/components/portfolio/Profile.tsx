export default function Profile() {
  return (
    <section id="about" className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-white flex items-center justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden">
                <img
                  src="/images/profile.png"
                  alt="MGFD - Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-4xl font-bold text-black mb-4">About Me</h3>
            <p className="text-lg text-gray-600 mb-6">
              I'm a passionate designer and developer with expertise in creating digital experiences that connect brands with their audiences. With years of experience in UI/UX design and web development, I transform ideas into reality.
            </p>
            <p className="text-lg text-gray-600">
              My approach combines creative thinking with technical excellence, ensuring every project not only looks beautiful but also performs exceptionally well.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}