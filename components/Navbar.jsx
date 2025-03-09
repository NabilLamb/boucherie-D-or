"use client";
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon, HeartIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user, cartItems } = useAppContext();
  const { openSignIn } = useClerk();

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
        <div className="flex items-center gap-8 max-md:hidden">
          <Link href="/" className="hover:text-red-700 transition font-medium">
            Home
          </Link>
          <Link href="/all-products" className="hover:text-red-700 transition font-medium">
            Our Meats
          </Link>
          <Link href="#about" className="hover:text-red-700 transition font-medium">
            About Us
          </Link>
          <Link href="#contact" className="hover:text-red-700 transition font-medium">
            Contact
          </Link>

          {/* Cart and Account Section */}
          <div className="flex items-center gap-6 ml-4">
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
                <UserButton appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonTrigger: "focus:shadow-none"
                  }
                }} />
              </div>
            ) : (
              <button
                onClick={openSignIn}
                className="flex items-center gap-2 hover:text-red-700"
              >
                <Image src={assets.user_icon} alt="Account" width={24} height={24} />
                <span className="font-medium">Account</span>
              </button>
            )}
          </div>

          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="ml-4 bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800 transition-colors text-sm"
            >
              Seller Dashboard
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" className="relative">
            <CartIcon className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          <UserButton afterSignOutUrl="/" appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonTrigger: "focus:shadow-none"
            }
          }} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;