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
import {
  BagIcon,
  CartIcon,
  HeartIcon,
  UserIcon,
  DashboardIcon,
  MenuIcon,
  CloseIcon,
  // TranslationIcon removed - as it's no longer used
} from "@/components/Icons";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { openSignIn } = useClerk();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // isLanguageOpen state removed
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // languages array removed to clean up the component

  const mainLinks = [
    { path: "/#products", id: "products", name: "Our Products" },
    { path: "/#featuredProducts", id: "featuredProducts", name: "Featured Products" },
    { path: "/#aboutUs", id: "aboutUs", name: "About Us" },
    { path: "/#contactUs", id: "contactUs", name: "Contact Us" },
  ];

  const cartCount = Object.keys(cartItems).filter(id => cartItems[id] > 0).length;
  const wishlistCount = wishlist.length;

  const iconLinks = [
    {
      path: "/cart",
      name: "Cart",
      icon: <CartIcon className="w-5 h-5 stroke-current" />,
      notification: cartCount,
    },
    {
      path: "/my-orders",
      name: "Orders",
      icon: <BagIcon className="w-5 h-5 stroke-current" />,
    },
    {
      path: "/my-liked",
      name: "Liked",
      icon: <HeartIcon className="w-5 h-5 stroke-current" />,
      notification: wishlistCount,
    },
  ];

  const mobileIconLinks = iconLinks;

  useEffect(() => {
    setMounted(true);
    if (pathname === "/") {
      const handleScroll = () => {
        const sections = mainLinks.map((link) => ({
          id: link.id,
          element: document.getElementById(link.id),
        }));
        let current = "home";
        const scrollPos = window.scrollY + window.innerHeight / 3;
        sections.forEach(({ id, element }) => {
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPos > offsetTop && scrollPos < offsetTop + offsetHeight) {
              current = id;
            }
          }
        });
        setActiveSection(current);
      };
      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [pathname]);

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
      const offsetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - 96;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      window.history.replaceState(null, null, `#${sectionId}`);
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.substring(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 500);
      }
    }
  }, []);

  const isActive = (sectionId) => mounted && activeSection === sectionId;

  return (
    <nav className="fixed w-full top-0 bg-white/95 backdrop-blur-sm border-b border-red-100 shadow-lg z-[60] py-3 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="hover:scale-105 transition-transform duration-300 shrink-0"
        >
          <Image
            src={assets.logo}
            alt="Boucherie D'or"
            width={200}
            height={80}
            className="w-32 sm:w-40 md:w-48"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          <div className="flex gap-6 lg:gap-10">
            {mainLinks.map(({ path, id, name }) => (
              <Link
                key={id}
                href={path}
                onClick={(e) => handleSectionClick(e, id)}
                className={`relative pb-1.5 transition-colors text-lg ${
                  isActive(id)
                    ? "text-red-800 font-bold"
                    : "text-gray-800 hover:text-red-700"
                } group shrink-0`}
              >
                {name}
                {isActive(id) ? (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-red-800" />
                ) : (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all group-hover:w-full" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop right section */}
        <div className="hidden lg:flex items-center gap-4">
          
          {/* Language selector block removed for a cleaner UI */}

          {isSeller && (
            <button
              onClick={() => router.push("/seller/add-product")} // Updated to your new path from T12
              className="bg-red-800 hover:bg-red-900 text-white px-6 py-2.5 rounded-full transition-all shadow-md text-sm font-semibold flex items-center gap-2"
            >
              <DashboardIcon className="w-5 h-5" />
              Dashboard
            </button>
          )}

          {user && (
            <>
              {iconLinks.map(({ path, name, icon, notification }) => (
                <Link
                  key={path}
                  href={path}
                  className={`relative p-2 rounded-full hover:bg-red-50 transition-colors ${
                    pathname === path ? "text-red-800" : "text-gray-800"
                  }`}
                  title={name}
                >
                  {notification > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                      {notification > 9 ? "9+" : notification}
                    </span>
                  )}
                  <span className="[&>svg]:w-6 [&>svg]:h-6">{icon}</span>
                  <span className="sr-only">{name}</span>
                </Link>
              ))}
            </>
          )}

          {user ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-red-100",
                  userButtonTrigger: "focus:shadow-none",
                },
              }}
            />
          ) : (
            <button
              onClick={openSignIn}
              className="flex items-center gap-2 text-gray-800 hover:text-red-800 group"
            >
              <div className="p-2 rounded-full bg-red-50 group-hover:bg-red-100 transition-colors">
                <UserIcon className="w-6 h-6" />
              </div>
              <span className="font-medium text-lg">Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile right section */}
        <div className="lg:hidden flex items-center gap-3">
          {user && (
            <>
              {mobileIconLinks.map(({ path, name, icon, notification }) => (
                <Link
                  key={path}
                  href={path}
                  className={`relative p-2 rounded-full hover:bg-red-50 transition-colors ${
                    pathname === path ? "text-red-800" : "text-gray-800"
                  }`}
                  title={name}
                >
                  {notification > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                      {notification > 9 ? "9+" : notification}
                    </span>
                  )}
                  <span className="[&>svg]:w-5 [&>svg]:h-5">{icon}</span>
                  <span className="sr-only">{name}</span>
                </Link>
              ))}
            </>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-800 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <CloseIcon className="w-6 h-6 stroke-current" />
            ) : (
              <MenuIcon className="w-6 h-6 stroke-current" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-red-50 shadow-xl">
          <div className="flex flex-col p-4 gap-4">
            {user ? (
              <div className="px-4">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 border-2 border-red-100",
                    },
                  }}
                />
              </div>
            ) : (
              <button
                onClick={() => { openSignIn(); setIsMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-red-800"
              >
                <div className="p-2 rounded-full bg-red-50">
                  <UserIcon className="w-6 h-6" />
                </div>
                <span className="font-medium text-lg">Sign In</span>
              </button>
            )}

            {mainLinks.map(({ id, name, path }) => (
              <Link
                key={id}
                href={path}
                onClick={(e) => handleSectionClick(e, id)}
                className={`py-3 px-4 rounded-lg text-base ${
                  isActive(id)
                    ? "bg-red-800 text-white font-semibold"
                    : "text-gray-800 hover:bg-red-50"
                } transition-colors`}
              >
                {name}
              </Link>
            ))}

            {isSeller && (
              <button
                onClick={() => { router.push("/seller/add-product"); setIsMenuOpen(false); }}
                className="w-full bg-red-800 text-white px-6 py-3 rounded-full hover:bg-red-900 transition-colors font-semibold flex items-center justify-center gap-2 text-sm"
              >
                <DashboardIcon className="w-5 h-5" />
                Seller Dashboard
              </button>
            )}
            
            {/* Language mobile section removed */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;