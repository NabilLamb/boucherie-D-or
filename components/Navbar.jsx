"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { assets, BagIcon, CartIcon, HeartIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user, cartItems, wishlist } = useAppContext();
  const { openSignIn } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const mainLinks = [
    { path: "/#products", id: "products", name: "Our Products" },
    {
      path: "/#featuredProducts",
      id: "featuredProducts",
      name: "Featured Products",
    },
    { path: "/#aboutUs", id: "aboutUs", name: "About Us" },
    { path: "/#contactUs", id: "contactUs", name: "Contact Us" },
  ];

  // Compute notification counts.
  // Using number of unique items for cart. (Alternatively, sum quantities if needed.)
  const cartNotificationCount = Object.keys(cartItems).length;
  // For liked products, assume wishlist is an array.
  const wishlistNotificationCount = wishlist.length;

  const iconLinks = [
    {
      path: "/cart",
      name: "Cart",
      icon: <CartIcon className="w-5 h-5 stroke-current" />,
      notification: cartNotificationCount,
    },
    {
      path: "/my-orders",
      name: "Orders",
      icon: <BagIcon className="w-5 h-5 stroke-current" />,
    },
    {
      path: "/my-liked",
      name: "Liked",
      icon: <HeartIcon className="w-5 h-5 fill-current" />,
      notification: wishlistNotificationCount,
    },
  ];

  useEffect(() => {
    setMounted(true);
    if (pathname === "/") {
      const handleScroll = () => {
        const sections = mainLinks.map((link) => ({
          id: link.id,
          element: document.getElementById(link.id),
        }));
        let currentSection = "home";
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        sections.forEach(({ id, element }) => {
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (
              scrollPosition > offsetTop &&
              scrollPosition < offsetTop + offsetHeight
            ) {
              currentSection = id;
            }
          }
        });
        setActiveSection(currentSection);
      };
      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [pathname]);

  const handleSectionClick = (e, sectionId) => {
    const currentPath = pathname;
    if (currentPath !== "/") {
      router.push(`/#${sectionId}`);
      setIsMenuOpen(false);
      return;
    }
    e.preventDefault();
    setIsMenuOpen(false);
    const target = document.getElementById(sectionId);
    if (target) {
      const headerOffset = 96; // adjust according to your navbar height
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.replaceState(null, null, `#${sectionId}`);
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 500);
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
          className="hover:scale-105 transition-transform duration-300"
        >
          <Image
            src={assets.logo}
            alt="Butcher's Shop"
            width={200}
            height={80}
            className="w-32 sm:w-40 md:w-48"
            priority
          />
        </Link>

        {/* Desktop Navigation: Main Links */}
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
                } group`}
              >
                {name}
                {isActive(id) ? (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-red-800 animate-underline" />
                ) : (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all group-hover:w-full" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center gap-8">
          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="bg-red-800 hover:bg-red-900 text-white px-6 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-sm font-semibold flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Seller Dashboard
            </button>
          )}

          {iconLinks.map(({ path, name, icon, notification }) => (
            <Link
              key={path}
              href={path}
              className={`relative p-2 rounded-full hover:bg-red-50 transition-colors ${
                pathname === path ? "text-red-800" : "text-gray-800"
              }`}
            >
              {notification > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {notification}
                </span>
              )}
              <span className="[&>svg]:w-6 [&>svg]:h-6">{icon}</span>
              <span className="sr-only">{name}</span>
            </Link>
          ))}

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
                <Image
                  src={assets.user_icon}
                  alt="Account"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <span className="font-medium text-lg">Account</span>
            </button>
          )}
        </div>

        {/* Mobile Navigation: Only hamburger button visible */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-800 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-7 h-7 stroke-current text-gray-800"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-red-50 shadow-xl">
          <div className="flex flex-col p-4 gap-4">
            {user ? (
              <div className="px-4">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 border-2 border-red-100",
                      userButtonTrigger: "focus:shadow-none",
                    },
                  }}
                />
              </div>
            ) : (
              <button
                onClick={() => {
                  openSignIn();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-red-800"
              >
                <div className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors">
                  <Image
                    src={assets.user_icon}
                    alt="Account"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
                <span className="font-medium text-lg">Account</span>
              </button>
            )}

            {/* Main Links */}
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

            {/* Icons and Account Section */}
            <div className="flex flex-col gap-3 border-t pt-4">
              {iconLinks.map(({ path, name, icon, notification }) => (
                <Link
                  key={path}
                  href={path}
                  onClick={() => setIsMenuOpen(false)}
                  className="relative flex items-center gap-3 py-2 px-4 text-gray-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  {notification > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                      {notification}
                    </span>
                  )}
                  {icon}
                  <span>{name}</span>
                </Link>
              ))}
              {isSeller && (
                <button
                  onClick={() => {
                    router.push("/seller");
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-red-800 text-white px-6 py-3 rounded-full hover:bg-red-900 transition-colors font-semibold flex items-center justify-center gap-2 text-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Seller Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
