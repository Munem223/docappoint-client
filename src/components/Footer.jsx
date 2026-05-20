import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl">🩺</div>
            <div className="text-2xl font-bold">
              <span className="text-blue-400">Doc</span>
              <span>Appoint</span>
            </div>
          </div>

          {/* Social Icons - Fixed version */}
          <div className="flex gap-6 text-3xl">
            <a href="#" className="hover:text-blue-400 transition">📘</a>
            <a href="#" className="hover:text-blue-400 transition">𝕏</a>
            <a href="#" className="hover:text-blue-400 transition">📷</a>
            <a href="#" className="hover:text-blue-400 transition">📺</a>
          </div>

          <p className="text-gray-400 text-sm">© 2026 DocAppoint. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;