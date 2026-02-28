export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            About
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            GrowthMap helps ICT students discover the right career path
            through smart assessment tools and guidance.
          </p>
        </div>

        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/home" className="hover:text-white">Home</a></li>
            <li><a href="/quiz" className="hover:text-white">Assessment</a></li>
            <li><a href="/careers" className="hover:text-white">Careers</a></li>
            <li><a href="/skillgap" className="hover:text-white">Skill Gap</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Contact
          </h3>
          <p className="text-sm text-gray-400">Sri Lanka</p>
          <p className="text-sm text-gray-400">info@growthmap.lk</p>
        </div>

      </div>

      <div className="border-t border-slate-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} GrowthMap. All rights reserved.
      </div>
    </footer>
  );
}