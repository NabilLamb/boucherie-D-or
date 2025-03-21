import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Image
              src={assets.logo}
              alt="Boucherie D'or Logo"
              width={160}
              height={60}
              className="h-12 w-auto"
            />
            <p className="text-gray-400 text-sm">
              Premium quality meats sourced from local farms. Serving the Provence-Alpes-Côte d'Azur region since 2006.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/#products" className="text-gray-400 hover:text-orange-500 transition-colors">Our Products</Link></li>
              <li><Link href="/#featuredProducts" className="text-gray-400 hover:text-orange-500 transition-colors">Featured Products</Link></li>
              <li><Link href="/#aboutUs" className="text-gray-400 hover:text-orange-500 transition-colors">About Us</Link></li>
              <li><Link href="/#contactUs" className="text-gray-400 hover:text-orange-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="text-gray-400 space-y-2 text-sm">
              <p>ZA Jonquier Morelle</p>
              <p>Lavoisier Avenue</p>
              <p>84850 Camaret-sur-Aigues</p>
              <p>Phone: +33 4 90 62 49 06</p>
              <p>Email: contact@boucheriedor.fr</p>
              <Link 
                href="/#map" 
                className="inline-block mt-4 text-orange-500 hover:text-orange-400 transition-colors"
              >
                Get Directions →
              </Link>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
            <dl className="text-gray-400 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Mon-Fri</dt>
                <dd>8:00 - 19:00</dd>
              </div>
              <div className="flex justify-between">
                <dt>Saturday</dt>
                <dd>8:00 - 20:00</dd>
              </div>
              <div className="flex justify-between">
                <dt>Sunday</dt>
                <dd>Closed</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Social & Legal */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            <div className="flex space-x-6">
              <Link href="https://www.facebook.com/profile.php?id=100063739235616" className="text-gray-400 hover:text-orange-500 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link href="https://www.instagram.com/boucherie_dor/" className="text-gray-400 hover:text-orange-500 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </Link>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-center">
              {/* <Link href="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                Privacy Policy
              </Link> */}
              <Link href="/#team" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                Terms of Service
              </Link>
              <span className="text-gray-600 text-sm">© 2025 Boucherie D'or</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;