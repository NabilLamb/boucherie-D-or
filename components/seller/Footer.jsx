// components/seller/Footer.jsx

import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const SellerFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full px-4 sm:px-8 py-4 border-t border-gray-200 bg-white mt-auto">
      <div className="flex items-center gap-3">
        <Image
          className="hidden sm:block"
          src={assets.logo}
          alt="Boucherie D'or logo"
          width={72}
          height={28}
        />
        <div className="hidden sm:block h-6 w-px bg-gray-200" />
        <p className="text-xs text-gray-400">
          © {currentYear} Boucherie D&apos;or. All rights reserved.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {[
          { href: "https://www.facebook.com/profile.php?id=100063739235616", src: assets.facebook_icon, label: "Facebook" },
          { href: "https://www.instagram.com/boucherie_dor/", src: assets.instagram_icon, label: "Instagram" },
        ].map(({ href, src, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <Image src={src} alt={label} width={20} height={20} />
          </a>
        ))}
      </div>
    </footer>
  );
};

export default SellerFooter;