// components/Footer.jsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useEffect, useState, useMemo } from "react";

const Footer = () => {
  const [currentDate, setCurrentDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fix 1 & 7: Move date logic to useEffect to prevent Hydration Mismatch
  useEffect(() => {
    // Set initial date on client mount
    setCurrentDate(new Date());

    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours + minutes / 60;

      let open = false;
      if (day === 1) open = false; // Monday
      else if (day >= 2 && day <= 5) { // Tuesday - Friday
        open = (currentTime >= 9 && currentTime <= 13) || (currentTime >= 15 && currentTime <= 19.5);
      } else if (day === 6) { // Saturday
        open = currentTime >= 9 && currentTime <= 19.5;
      } else if (day === 0) { // Sunday
        open = currentTime >= 9 && currentTime <= 13;
      }
      setIsOpen(open);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Fix 2: useMemo to identify "today" for highlighting without recalculating on every scroll
  const currentDayIndex = useMemo(() => currentDate?.getDay() ?? -1, [currentDate]);

  return (
    <footer className="bg-gray-900 text-gray-100 pt-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Image
              src={assets.logo}
              alt="Boucherie D'or Logo"
              width={160}
              height={60}
              className="h-12 w-auto"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium quality Halal meats sourced from local farms. Serving the
              Provence-Alpes-Côte d'Azur region since 2006.
            </p>
          </div>

          {/* Quick Links - Fix 8: hover:text-orange-500 -> hover:text-amber-400 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {["Products", "Featured", "About Us", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/#${item.toLowerCase().replace(" ", "")}`}
                    className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Fix 6: env variable corrected */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <address className="text-gray-400 not-italic space-y-2 text-sm">
              <p><span className="text-gray-200 font-medium">Addresse:</span> {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}</p>
              <p><span className="text-gray-200 font-medium">Tél:</span> {process.env.NEXT_PUBLIC_COMPANY_PHONE}</p>
              <p><span className="text-gray-200 font-medium">Email:</span> {process.env.NEXT_PUBLIC_COMPANY_EMAIL}</p>
              <Link
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-amber-500 hover:text-amber-400 font-medium transition-colors"
              >
                Get Directions →
              </Link>
            </address>
          </div>

          {/* Opening Hours - Fix 7: Dark background highlight colors */}
          <div className="md:col-span-2 space-y-4 bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Opening Hours
              </h3>
              {currentDate && (
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isOpen ? "bg-green-900/30 text-green-400 border-green-500/30" : "bg-red-900/30 text-red-400 border-red-500/30"
                }`}>
                  {isOpen ? "● Open Now" : "○ Closed"}
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm">
              {/* Mon */}
              <div className={`flex justify-between p-2 rounded-lg ${currentDayIndex === 1 ? "bg-amber-900/20 border border-amber-500/20" : ""}`}>
                <span className={currentDayIndex === 1 ? "text-amber-400 font-bold" : "text-gray-400"}>Monday</span>
                <span className="text-gray-500 italic">Closed</span>
              </div>
              {/* Tue-Fri */}
              <div className={`flex justify-between p-2 rounded-lg ${[2,3,4,5].includes(currentDayIndex) ? "bg-amber-900/20 border border-amber-500/20" : ""}`}>
                <span className={[2,3,4,5].includes(currentDayIndex) ? "text-amber-400 font-bold" : "text-gray-400"}>Tuesday - Friday</span>
                <span className="text-gray-300 text-right">9:00 AM - 1:00 PM<br/>3:00 PM - 7:30 PM</span>
              </div>
              {/* Sat */}
              <div className={`flex justify-between p-2 rounded-lg ${currentDayIndex === 6 ? "bg-amber-900/20 border border-amber-500/20" : ""}`}>
                <span className={currentDayIndex === 6 ? "text-amber-400 font-bold" : "text-gray-400"}>Saturday</span>
                <span className="text-gray-300">9:00 AM - 7:30 PM</span>
              </div>
              {/* Sun */}
              <div className={`flex justify-between p-2 rounded-lg ${currentDayIndex === 0 ? "bg-amber-900/20 border border-amber-500/20" : ""}`}>
                <span className={currentDayIndex === 0 ? "text-amber-400 font-bold" : "text-gray-400"}>Sunday</span>
                <span className="text-gray-300">9:00 AM - 1:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social & Legal - Fix 3, 4 & 5 */}
        <div className="border-t border-gray-800 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex space-x-6">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer" // Fix 5
              className="text-gray-500 hover:text-amber-400 transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer" // Fix 5
              className="text-gray-500 hover:text-amber-400 transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-gray-500">
            <div className="flex gap-4">
              <Link href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-amber-400 transition-colors">Terms of Service</Link> {/* Fix 3 */}
            </div>
            <p>© {new Date().getFullYear()} Boucherie D&apos;or. All rights reserved.</p> {/* Fix 4 */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;