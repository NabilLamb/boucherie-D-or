import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { motion } from "framer-motion";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Premium Halal Meats - Quality You Can Taste!",
      offer: "Special Offer: 20% Off All Beef Cuts",
      buttonText1: "Shop Now",
      buttonText2: "Explore Cuts",
      imgSrc: assets.meatsHeader,
    },
    {
      id: 2,
      title: "Fresh Vegetables and Fruits - Direct from the Farm",
      offer: "Limited Time: Buy 5kg Get 1kg Free",
      buttonText1: "Order Now",
      buttonText2: "View Selection",
      imgSrc: assets.VegetablesFruitsHeader,
    },
    {
      id: 3,
      title: "Complete Your Kitchen - Premium Tools & Accessories",
      offer: "Bundle Deals Available",
      buttonText1: "Discover Tools",
      buttonText2: "See Offers",
      imgSrc: assets.KitchenToolsHeader,
    },
    {
      id: 5,
      title: "Traditional Wood Ovens",
      offer: "Experience the Best of Both Worlds in Baking",
      buttonText1: "Explore Wood Ovens",
      buttonText2: "Discover Electric Ovens",
      imgSrc: assets.WoodOvensHeader,
},
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-orange-600 pb-1">{slide.offer}</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6">
                <button className="md:px-10 px-7 md:py-2.5 py-2 bg-orange-600 rounded-full text-white font-medium">
                  {slide.buttonText1}
                </button>
                <button className="group flex items-center gap-2 px-6 py-2.5 font-medium">
                  {slide.buttonText2}
                  <Image
                    className="group-hover:translate-x-1 transition"
                    src={assets.arrow_icon}
                    alt="arrow_icon"
                  />
                </button>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <Image
                className="md:w-72 w-48"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
                width={500}
                height={500}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-orange-600" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;