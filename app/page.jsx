"use client";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutUs from "@/components/AboutUs";
import ContactUs from "@/components/ContactUs";
import ScrollToTop from "@/components/ScrollToTop";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-24">
        <HeaderSlider />
        <HomeProducts id="products" />
        <FeaturedProduct id="featuredProducts" />
        <AboutUs id="aboutUs" />
        <ContactUs id="contactUs" />
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Home;