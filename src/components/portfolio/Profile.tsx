export default function Profile() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <div className="text-6xl mb-2">👨‍💻</div>
                    <p className="text-gray-600 font-medium">MGFD</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                About Me
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                I'm a passionate web developer and designer with expertise in creating modern, 
                responsive, and user-friendly applications. My approach combines clean code with 
                stunning visuals to deliver exceptional digital experiences.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                With a strong foundation in both design and development, I bridge the gap between 
                creative vision and technical implementation. I believe in writing maintainable, 
                scalable code while never compromising on aesthetics.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <span className="px-4 py-2 bg-black text-white rounded-full text-sm">
                  Web Development
                </span>
                <span className="px-4 py-2 bg-black text-white rounded-full text-sm">
                  UI/UX Design
                </span>
                <span className="px-4 py-2 bg-black text-white rounded-full text-sm">
                  Creative Direction
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}