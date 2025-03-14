"use client";
import { useEffect } from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutUs from "@/components/AboutUs";
import ContactUs from "@/components/ContactUs";

const Home = () => {
  // useEffect(() => {
  //   if (typeof window !== "undefined" && window.location.hash === "#products") {
  //     const element = document.getElementById("products");
  //     if (element) {
  //       // Add slight delay to ensure scroll position is registered
  //       setTimeout(() => {
  //         element.scrollIntoView({ behavior: "smooth" });
  //       window.history.replaceState(null, null, " ");
  //       }, 100);
  //     }
  //   }
  // }, []);

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-24">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <AboutUs />
        <ContactUs />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
