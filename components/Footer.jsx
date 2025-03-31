import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";

const Footer = () => {
  function isOpenNow() {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    // Monday
    if (day === 1) return false;

    // Tuesday - Friday
    if (day >= 2 && day <= 5) {
      return (
        (currentTime >= 9 && currentTime <= 13) || // 9AM-1PM
        (currentTime >= 15 && currentTime <= 19.5) // 3PM-7:30PM
      );
    }

    // Saturday
    if (day === 6) {
      return currentTime >= 9 && currentTime <= 19.5; // 9AM-7:30PM
    }

    // Sunday
    if (day === 0) {
      return currentTime >= 9 && currentTime <= 13; // 9AM-1PM
    }

    return false;
  }
  return (
    <footer className="bg-gray-900 text-gray-100 pt-12 mt-24">
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
              Premium quality meats sourced from local farms. Serving the
              Provence-Alpes-Côte d'Azur region since 2006.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#products"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Our Products
                </Link>
              </li>
              <li>
                <Link
                  href="/#featuredProducts"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Featured Products
                </Link>
              </li>
              <li>
                <Link
                  href="/#aboutUs"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#contactUs"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="text-gray-400 space-y-2 text-sm">
              <p>Address: {process.env.NEXT_PUBLIC_ADDRESS}</p>
              <p>Phone: {process.env.NEXT_PUBLIC_COMPANY_PHONE}</p>
              <p>Email: {process.env.NEXT_PUBLIC_COMPANY_EMAIL}</p>
              <Link
                href="/#map"
                className="inline-block mt-4 text-orange-500 hover:text-orange-400 transition-colors"
              >
                Get Directions →
              </Link>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
            <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Opening Hours
            </h3>

            <div className="space-y-3">
              {/* Current status - moved to top */}
              <div className="pb-2">
                {isOpenNow() ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">We're open now</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">We're closed now</span>
                  </div>
                )}
              </div>

              {/* Monday */}
              <div
                className={`flex justify-between py-2 px-3 rounded-lg ${
                  new Date().getDay() === 1 ? "bg-red-50" : ""
                }`}
              >
                <span
                  className={`font-medium ${
                    new Date().getDay() === 1 ? "text-red-600" : "text-gray-300"
                  }`}
                >
                  Monday
                </span>
                <span className="text-gray-500">Closed</span>
              </div>

              {/* Tuesday - Friday (grouped) */}
              <div
                className={`flex justify-between py-2 px-3 rounded-lg ${
                  [2, 3, 4, 5].includes(new Date().getDay()) ? "bg-red-50" : ""
                }`}
              >
                <span
                  className={`font-medium ${
                    [2, 3, 4, 5].includes(new Date().getDay())
                      ? "text-red-600"
                      : "text-gray-300"
                  }`}
                >
                  Tuesday - Friday
                </span>
                <span className="text-gray-500 text-right">
                  9:00 AM - 1:00 PM
                  <br />
                  3:00 PM - 7:30 PM
                </span>
              </div>

              {/* Saturday */}
              <div
                className={`flex justify-between py-2 px-3 rounded-lg ${
                  new Date().getDay() === 6 ? "bg-red-50" : ""
                }`}
              >
                <span
                  className={`font-medium ${
                    new Date().getDay() === 6 ? "text-red-600" : "text-gray-300"
                  }`}
                >
                  Saturday
                </span>
                <span className="text-gray-500">9:00 AM - 7:30 PM</span>
              </div>

              {/* Sunday */}
              <div
                className={`flex justify-between py-2 px-3 rounded-lg ${
                  new Date().getDay() === 0 ? "bg-red-50" : ""
                }`}
              >
                <span
                  className={`font-medium ${
                    new Date().getDay() === 0 ? "text-red-600" : "text-gray-300"
                  }`}
                >
                  Sunday
                </span>
                <span className="text-gray-500">9:00 AM - 1:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social & Legal */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            <div className="flex space-x-6">
              <Link
                href="https://www.facebook.com/profile.php?id=100063739235616"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/boucherie_dor/"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </Link>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-center">
              <Link
                href="/#team"
                className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <span className="text-gray-600 text-sm">
                © 2025 Boucherie D'or
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
