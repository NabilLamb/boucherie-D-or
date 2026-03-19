// components/Navbar.jsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "@/components/Icons";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { openSignIn } = useClerk();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const mainLinks = [
    { path: "/#products", id: "products", name: "Our Products" },
    { path: "/#featuredProducts", id: "featuredProducts", name: "Featured Products" },
    { path: "/#aboutUs", id: "aboutUs", name: "About Us" },
    { path: "/#contactUs", id: "contactUs", name: "Contact Us" },
  ];

  const cartCount = Object.keys(cartItems).filter((id) => cartItems[id] > 0).length;
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
      notification: 0,
    },
    {
      path: "/my-liked",
      name: "Liked",
      icon: <HeartIcon className="w-5 h-5 stroke-current" />,
      notification: wishlistCount,
    },
  ];

  // Scroll handler with requestAnimationFrame throttle
  useEffect(() => {
    let ticking = false;

    const updateNav = () => {
      setScrolled(window.scrollY > 20);
      if (pathname === "/") {
        const scrollPos = window.scrollY + window.innerHeight / 3;
        let current = "home";
        mainLinks.forEach(({ id }) => {
          const el = document.getElementById(id);
          if (el) {
            const { offsetTop, offsetHeight } = el;
            if (scrollPos > offsetTop && scrollPos < offsetTop + offsetHeight) {
              current = id;
            }
          }
        });
        setActiveSection(current);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateNav();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Body lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  useEffect(() => {
    setMounted(true);
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.substring(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, []);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const handleSectionClick = useCallback(
    (e, sectionId) => {
      if (pathname !== "/") {
        router.push(`/#${sectionId}`);
        closeMenu();
        return;
      }
      e.preventDefault();
      closeMenu();
      const target = document.getElementById(sectionId);
      if (target) {
        const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 96;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        window.history.replaceState(null, null, `#${sectionId}`);
        setActiveSection(sectionId);
      }
    },
    [pathname, router, closeMenu]
  );

  const isActive = (sectionId) => mounted && activeSection === sectionId;

  // Navbar background: transparent on homepage hero, solid elsewhere
  const navBg = "bg-white/95 backdrop-blur-sm shadow-lg border-b border-red-100";
  const linkColor = "text-gray-800 hover:text-red-700";
  const logoInvert = false;

  return (
    <>
      <nav className={`fixed w-full top-0 z-[60] py-3 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${navBg}`}>
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
              className={`w-32 sm:w-40 md:w-48 transition-all duration-300 ${logoInvert ? "brightness-0 invert" : ""}`}
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <div className="flex gap-6 lg:gap-10">
              {mainLinks.map(({ path, id, name }) => (
                <Link
                  key={id}
                  href={path}
                  onClick={(e) => handleSectionClick(e, id)}
                  className={`relative pb-1.5 transition-colors text-base group shrink-0 ${isActive(id) ? "text-red-800" : linkColor
                    }`}
                >
                  {name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-red-700 transition-all duration-300 ${isActive(id) ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop right section */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Dashboard button — desktop */}
            {isSeller && (
              <button
                onClick={() => router.push("/seller/add-product")}
                className="bg-red-800 hover:bg-red-900 text-white px-5 py-2.5 rounded-full transition-all shadow-md text-sm font-semibold flex items-center gap-2"
              >
                <DashboardIcon className="w-4 h-4" />
                Dashboard
              </button>
            )}

            {user ? (
              <>
                {iconLinks.map(({ path, name, icon, notification }) => (
                  <Link
                    key={path}
                    href={path}
                    className={`relative p-2 rounded-full hover:bg-red-50 transition-colors ${pathname === path ? "text-red-800" : linkColor
                      }`}
                    title={name}
                  >
                    {notification > 0 && (
                      <span className="absolute -top-0 -right-0 bg-red-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold z-10">
                        {notification > 9 ? "9+" : notification}
                      </span>
                    )}
                    <span className="[&>svg]:w-6 [&>svg]:h-6">{icon}</span>
                    <span className="sr-only">{name}</span>
                  </Link>
                ))}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 border-2 border-red-100",
                      userButtonTrigger: "focus:shadow-none",
                    },
                  }}
                />
              </>
            ) : (
              <button
                onClick={openSignIn}
                className="flex items-center gap-2 text-gray-800 hover:text-red-800 group"
              >
                <div className="p-2 rounded-full bg-red-50 group-hover:bg-red-100 transition-colors">
                  <UserIcon className="w-6 h-6" />
                </div>
                <span className="font-medium text-base">Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile right section */}
          <div className="lg:hidden flex items-center gap-2">
            {user && (
              <>
                {iconLinks.map(({ path, name, icon, notification }) => (
                  <Link
                    key={path}
                    href={path}
                    className={`relative p-2 rounded-full hover:bg-red-50 transition-colors ${pathname === path ? "text-red-800" : "text-gray-800"
                      }`}
                    title={name}
                  >
                    {/* FIX: smaller badge on mobile - w-4 h-4, text-[10px], z-10 */}
                    {notification > 0 && (
                      <span className="absolute -top-0 -right-0 bg-red-800 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold z-10 leading-none">
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
              onClick={toggleMenu}
              className="p-2 text-gray-800 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
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
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-red-50 shadow-xl z-50">
            <div className="flex flex-col p-4 gap-3">

              {/* User section */}
              {user ? (
                <div className="px-2 pb-2 border-b border-gray-100">
                  <UserButton
                    appearance={{
                      elements: { avatarBox: "w-8 h-8 border-2 border-red-100" },
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => { openSignIn(); closeMenu(); }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-red-800"
                >
                  <div className="p-2 rounded-full bg-red-50">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Sign In</span>
                </button>
              )}

              {/* Dashboard button — MOBILE (was missing before) */}
              {isSeller && (
                <button
                  onClick={() => { router.push("/seller/add-product"); closeMenu(); }}
                  className="w-full bg-red-800 text-white px-6 py-3 rounded-xl hover:bg-red-900 transition-colors font-semibold flex items-center justify-center gap-2 text-sm"
                >
                  <DashboardIcon className="w-4 h-4" />
                  Seller Dashboard
                </button>
              )}

              {/* Nav links */}
              {mainLinks.map(({ id, name, path }) => (
                <Link
                  key={id}
                  href={path}
                  onClick={(e) => handleSectionClick(e, id)}
                  className={`py-3 px-4 rounded-lg text-base transition-colors ${isActive(id)
                      ? "bg-red-800 text-white font-semibold"
                      : "text-gray-800 hover:bg-red-50"
                    }`}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop — click outside to close */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[55] lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;