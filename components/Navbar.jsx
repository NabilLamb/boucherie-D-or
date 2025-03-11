"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  assets,
  BagIcon,
  BoxIcon,
  CartIcon,
  HomeIcon,
  HeartIcon,
} from "@/assets/assets";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to determine active link
  const isActive = (path) => {
    if (!mounted) return false;
    if (path === "/#products") {
      return pathname === "/" && window.location.hash === "#products";
    }
    return pathname === path;
  };

  // Scroll handler
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

  return (
    <nav className="fixed w-full top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 py-3 px-6 md:px-16 lg:px-32 text-gray-700">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Image
          className="cursor-pointer w-32 hover:scale-105 transition-transform"
          onClick={() => router.push("/")}
          src={assets.logo}
          alt="Butcher's Shop"
          width={160}
          height={60}
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Centered Navigation Links */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8">
            <Link
              href="/"
              className={`relative pb-1 transition ${
                isActive("/")
                  ? "text-red-700 font-semibold"
                  : "hover:text-red-700"
              }`}
            >
              Home
              {isActive("/") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700"></span>
              )}
            </Link>
            <Link
              href="/#products"
              onClick={handleProductsClick}
              className={`relative pb-1 transition ${
                isActive("/#products")
                  ? "text-red-700 font-semibold"
                  : "hover:text-red-700"
              }`}
            >
              Our Products
              {isActive("/#products") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700"></span>
              )}
            </Link>
            <Link
              href="/about"
              className={`relative pb-1 transition ${
                isActive("/about")
                  ? "text-red-700 font-semibold"
                  : "hover:text-red-700"
              }`}
            >
              About Us
              {isActive("/about") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700"></span>
              )}
            </Link>
            <Link
              href="/contact"
              className={`relative pb-1 transition ${
                isActive("/contact")
                  ? "text-red-700 font-semibold"
                  : "hover:text-red-700"
              }`}
            >
              Contact
              {isActive("/contact") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700"></span>
              )}
            </Link>
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
              <Link href="/cart" className="relative hover:text-red-700">
                <CartIcon className="w-6 h-6 stroke-red-600" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/my-orders" className="hover:text-red-700">
                    <BagIcon className="w-6 h-6 stroke-gray-800" />
                  </Link>
                  <Link href="/my-liked" className="hover:text-red-700">
                    <HeartIcon className="w-6 h-6" filled />
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
                  className="flex items-center gap-2 hover:text-red-700"
                >
                  <Image
                    src={assets.user_icon}
                    alt="Account"
                    width={24}
                    height={24}
                  />
                  <span className="font-medium">Account</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <CartIcon className="w-5 h-5 stroke-red-600" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Liked and Orders Icons (Visible for Logged-in Users) */}
          {user && (
            <>
              <Link href="/my-orders" className="hover:text-red-700">
                <BagIcon className="w-5 h-5 stroke-gray-800" />
              </Link>
              <Link href="/my-liked" className="hover:text-red-700">
                <HeartIcon className="w-5 h-5" filled />
              </Link>
            </>
          )}

          {/* User Button */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-7 h-7", // Smaller avatar for mobile
                userButtonTrigger: "focus:shadow-none",
              },
            }}
          />

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:text-red-700"
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200">
            <div className="flex flex-col p-4 gap-4">
              <Link
                href="/"
                className={`py-2 ${
                  isActive("/")
                    ? "text-red-700 font-semibold"
                    : "hover:text-red-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/#products"
                onClick={(e) => {
                  setIsMenuOpen(false);
                  handleProductsClick(e);
                }}
                className={`py-2 ${
                  isActive("/#products")
                    ? "text-red-700 font-semibold"
                    : "hover:text-red-700"
                }`}
              >
                Our Products
              </Link>
              <Link
                href="/about"
                className={`py-2 ${
                  isActive("/about")
                    ? "text-red-700 font-semibold"
                    : "hover:text-red-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className={`py-2 ${
                  isActive("/contact")
                    ? "text-red-700 font-semibold"
                    : "hover:text-red-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

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
