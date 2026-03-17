// components/seller/Footer.jsx

import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const SellerFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-10 py-4 border-t border-gray-200 mt-8">
      <div className="flex items-center gap-4">
        <Image
          className="hidden md:block"
          src={assets.logo}
          alt="Boucherie D'or logo"
          width={80}
          height={30}
        />
        <div className="hidden md:block h-7 w-px bg-gray-300" />
        <p className="py-4 text-center text-xs md:text-sm text-gray-500">
          © {currentYear} Boucherie D&apos;or. All rights reserved.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <a
          href="https://www.facebook.com/profile.php?id=100063739235616"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <Image src={assets.facebook_icon} alt="Facebook" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <Image src={assets.twitter_icon} alt="Twitter" />
        </a>
        <a
          href="https://www.instagram.com/boucherie_dor/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <Image src={assets.instagram_icon} alt="Instagram" />
        </a>
      </div>
    </div>
  );
};

export default SellerFooter;
