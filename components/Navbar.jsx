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
  const [productsInView, setProductsInView] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (pathname === "/") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setProductsInView(entry.isIntersecting);
        },
        { threshold: 0.5, rootMargin: "-100px 0px 0px 0px" }
      );

      const target = document.getElementById("products");
      if (target) observer.observe(target);

      return () => {
        if (target) observer.unobserve(target);
      };
    }
  }, [pathname]);

  const isActive = (path) => {
    if (!mounted) return false;
    
    // Special case for products section
    if (path === "/#products") {
      return pathname === "/" && (window.location.hash === "#products" || productsInView);
    }
    
    return pathname === path;
  };

  const handleProductsClick = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, null, " ");
      }
    }
  };

  const mainLinks = [
    { path: "/", name: "Home" },
    { path: "/#products", name: "Our Products" },
    { path: "/#featuredProducts", name: "Featured Products" },
    { path: "/#aboutUs", name: "About Us" },
    { path: "/#contactUs", name: "Contact Us" },
  ];

  const iconLinks = [
    { path: "/cart", name: "Cart" },
    { path: "/my-orders", name: "My Orders" },
    { path: "/my-liked", name: "My Liked" },
  ];

  return (
    <nav className="fixed w-full top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 py-4 px-6 md:px-16 lg:px-32 text-gray-700 mb-16">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Image
          className="cursor-pointer w-32 hover:scale-105 transition-transform"
          onClick={() => router.push("/")}
          src={assets.logo}
          alt="Butcher's Shop"
          width={160}
          height={60}
          priority
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8">
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={link.path === "/#products" ? handleProductsClick : undefined}
                className={`relative pb-1 transition-colors ${
                  isActive(link.path)
                    ? "text-red-700 font-semibold"
                    : "text-gray-700 hover:text-red-700"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700 animate-underline" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6 ml-auto">
            {isSeller && (
              <button
                onClick={() => router.push("/seller")}
                className="bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition-colors text-sm"
              >
                Seller Dashboard
              </button>
            )}

            <div className="flex items-center gap-6">
              <Link
                href="/cart"
                className={`relative ${isActive("/cart") ? "text-red-700" : "text-gray-700 hover:text-red-700"}`}
              >
                <CartIcon className={`w-6 h-6 ${isActive("/cart") ? "stroke-red-700" : "stroke-current"}`} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/my-orders"
                    className={`${isActive("/my-orders") ? "text-red-700" : "text-gray-700 hover:text-red-700"}`}
                  >
                    <BagIcon className={`w-6 h-6 ${isActive("/my-orders") ? "stroke-red-700" : "stroke-current"}`} />
                  </Link>
                  <Link
                    href="/my-liked"
                    className={`${isActive("/my-liked") ? "text-red-700" : "text-gray-700 hover:text-red-700"}`}
                  >
                    <HeartIcon className={`w-6 h-6 ${isActive("/my-liked") ? "fill-red-700" : "fill-current"}`} />
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                        userButtonTrigger: "focus:shadow-none",
                      },
                    }}
                  />
                </div>
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
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
          {iconLinks.map((link) => (
            pathname !== "/" && (
              <Link
                key={link.path}
                href={link.path}
                className={`relative ${isActive(link.path) ? "text-red-700" : "text-gray-700 hover:text-red-700"}`}
              >
                {link.path === "/cart" && cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
                {link.path === "/cart" && <CartIcon className="w-5 h-5 stroke-current" />}
                {link.path === "/my-orders" && <BagIcon className="w-5 h-5 stroke-current" />}
                {link.path === "/my-liked" && <HeartIcon className="w-5 h-5 fill-current" />}
              </Link>
            )
          ))}

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
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200">
            <div className="flex flex-col p-4 gap-4">
              {[...mainLinks, ...iconLinks].map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`py-2 ${
                    isActive(link.path)
                      ? "text-red-700 font-semibold"
                      : "text-gray-700 hover:text-red-700"
                  }`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (link.path === "/#products") handleProductsClick;
                  }}
                >
                  {link.name}
                </Link>
              ))}

              {isSeller && (
                <button
                  onClick={() => {
                    router.push("/seller");
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition-colors text-sm mt-2"
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