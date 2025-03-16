"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { assets, BagIcon, CartIcon, HeartIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user, cartItems } = useAppContext();
  const { openSignIn } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const mainLinks = [
    { path: "/", id: "home", name: "Home" },
    { path: "/#products", id: "products", name: "Our Products" },
    {
      path: "/#featuredProducts",
      id: "featuredProducts",
      name: "Featured Products",
    },
    { path: "/#aboutUs", id: "aboutUs", name: "About Us" },
    { path: "/#contactUs", id: "contactUs", name: "Contact Us" },
  ];

  const iconLinks = [
    {
      path: "/cart",
      name: "Cart",
      icon: <CartIcon className="w-5 h-5 stroke-current" />,
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
      handleScroll(); // Initial check
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [pathname]);

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (sectionId === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      window.history.replaceState(null, null, " ");
      setActiveSection("home");
      return;
    }

    const target = document.getElementById(sectionId);
    if (target) {
      const yOffset = -80; // Adjust for navbar height
      const y =
        target.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
      window.history.replaceState(null, null, `#${sectionId}`);
    }
  };

  const isActive = (sectionId) => {
    if (!mounted) return false;
    return activeSection === sectionId;
  };

  return (
    <nav className="fixed w-full top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 py-4 px-6 md:px-16 lg:px-32">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => handleSectionClick(e, "home")}
          className="hover:scale-105 transition-transform"
        >
          <Image
            src={assets.logo}
            alt="Butcher's Shop"
            width={160}
            height={60}
            className="w-32 md:w-40"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          <div className="flex gap-6 lg:gap-8">
            {mainLinks.map(({ path, id, name }) => (
              <Link
                key={id}
                href={path}
                onClick={(e) => handleSectionClick(e, id)}
                className={`relative pb-1 transition-colors ${
                  isActive(id)
                    ? "text-red-700 font-semibold"
                    : "text-gray-700 hover:text-red-700"
                }`}
              >
                {name}
                {isActive(id) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700 animate-underline" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-6">
          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition-colors text-sm"
            >
              Seller Dashboard
            </button>
          )}

          <div className="flex items-center gap-6">
            {iconLinks.map(({ path, name, icon }) => (
              <Link
                key={path}
                href={path}
                className={`relative ${
                  pathname === path
                    ? "text-red-700"
                    : "text-gray-700 hover:text-red-700"
                }`}
              >
                {path === "/cart" && cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
                {icon}
                <span className="sr-only">{name}</span>
              </Link>
            ))}

            {user ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonTrigger: "focus:shadow-none",
                  },
                }}
              />
            ) : (
              <button
                onClick={openSignIn}
                className="flex items-center gap-2 text-gray-700 hover:text-red-700"
              >
                <Image
                  src={assets.user_icon}
                  alt="Account"
                  width={24}
                  height={24}
                  className="stroke-current"
                />
                <span className="font-medium">Account</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
          {/* Always visible icons */}
          <div className="flex gap-4">
            {iconLinks.map(({ path, name, icon }) => (
              <Link
                key={path}
                href={path}
                className={`relative ${
                  pathname === path
                    ? "text-red-700"
                    : "text-gray-700 hover:text-red-700"
                }`}
              >
                {path === "/cart" && cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
                {icon}
                <span className="sr-only">{name}</span>
              </Link>
            ))}
          </div>

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-7 h-7",
                userButtonTrigger: "focus:shadow-none",
              },
            }}
          />

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-700 hover:text-red-700"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="flex flex-col p-4 gap-3">
              {mainLinks.map(({ id, name, path }) => (
                <Link
                  key={id}
                  href={path}
                  onClick={(e) => handleSectionClick(e, id)}
                  className={`py-2 px-4 rounded-lg ${
                    isActive(id)
                      ? "bg-red-50 text-red-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {name}
                </Link>
              ))}

              {isSeller && (
                <button
                  onClick={() => {
                    router.push("/seller");
                    setIsMenuOpen(false);
                  }}
                  className="mt-2 bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition-colors text-sm"
                >
                  Seller Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
