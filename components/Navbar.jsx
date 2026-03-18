// components/Navbar.jsx

"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useClerk, UserButton } from "@clerk/nextjs";
import { BagIcon, CartIcon, HeartIcon, UserIcon, DashboardIcon, MenuIcon, CloseIcon } from "@/components/Icons";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { openSignIn } = useClerk();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const mainLinks = [
    { path: "/#products", id: "products", name: "Our Products" },
    { path: "/#featuredProducts", id: "featuredProducts", name: "Featured Products" },
    { path: "/#aboutUs", id: "aboutUs", name: "About Us" },
    { path: "/#contactUs", id: "contactUs", name: "Contact Us" },
  ];

  const cartCount = Object.keys(cartItems).filter(id => cartItems[id] > 0).length;
  const iconLinks = [
    { path: "/cart", name: "Cart", icon: <CartIcon className="w-5 h-5" />, notification: cartCount },
    { path: "/my-orders", name: "Orders", icon: <BagIcon className="w-5 h-5" /> },
    { path: "/my-liked", name: "Liked", icon: <HeartIcon className="w-5 h-5" />, notification: wishlist.length },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSectionClick = (e, sectionId) => {
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
      setIsMenuOpen(false);
      return;
    }
    e.preventDefault();
    setIsMenuOpen(false);
    const target = document.getElementById(sectionId);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 96, behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <nav className="fixed w-full top-0 bg-white/95 backdrop-blur-sm border-b border-red-100 shadow-lg z-[60] py-3 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="shrink-0">
          <Image src={assets.logo} alt="Boucherie D'or" width={160} height={60} className="w-32 sm:w-40" priority />
        </Link>

        <div className="hidden lg:flex gap-8 items-center flex-1 justify-center">
          {mainLinks.map(({ id, name, path }) => (
            <Link key={id} href={path} onClick={(e) => handleSectionClick(e, id)} className="text-gray-800 hover:text-red-700 font-medium">{name}</Link>
          ))}
        </div>

        {/* Fix 2: Desktop Right Section Hydration Gate */}
        <div className="hidden lg:flex items-center gap-4">
          {!mounted ? null : user ? (
            <>
              {iconLinks.map(({ path, icon, notification }) => (
                <Link key={path} href={path} className="relative p-2 text-gray-800 hover:text-red-800">
                  {notification > 0 && <span className="absolute -top-1 -right-1 bg-red-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{notification}</span>}
                  {icon}
                </Link>
              ))}
              <UserButton />
            </>
          ) : (
            <button onClick={openSignIn} className="flex items-center gap-2 text-gray-800 hover:text-red-800">
              <UserIcon className="w-6 h-6" />
              <span className="font-medium">Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile View Hydration Gate */}
        <div className="lg:hidden flex items-center gap-3">
          {mounted && user && (
            iconLinks.map(({ path, icon }) => (
              <Link key={path} href={path} className="p-2 text-gray-800">{icon}</Link>
            ))
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-800">
            {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t p-4 flex flex-col gap-4">
          {mounted && (user ? <UserButton /> : <button onClick={openSignIn}>Sign In</button>)}
          {mainLinks.map(link => (
            <Link key={link.id} href={link.path} onClick={(e) => handleSectionClick(e, link.id)}>{link.name}</Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;