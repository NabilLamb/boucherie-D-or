import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { motion } from "framer-motion";

const Banner = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-[#f5e6d3] my-16 rounded-xl overflow-hidden relative"
    >
      {/* Left Side - Meat Image */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="max-w-[300px] md:max-w-[400px] lg:max-w-[500px]"
      >
        <Image
          src={assets.PremiumAngusBeefSteak_image}
          alt="Premium Angus Beef"
          className="w-64 rotate-[-15deg] hover:rotate-0 transition-transform duration-300"
        />
      </motion.div>

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 px-4 md:px-0 z-10">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold max-w-[320px] text-[#3a1f0a]"
        >
          Crafted with Passion, <span className="text-[#c2410c]">Perfection</span> in Every Cut
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-[400px] text-lg font-medium text-[#5a3921]"
        >
          Experience premium quality meats, expertly butchered and prepared to elevate your culinary creations
        </motion.p>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center justify-center gap-2 px-8 py-3 bg-[#c2410c] rounded-lg text-white shadow-lg hover:bg-[#9c320a] transition-all duration-300"
        >
          <span className="font-semibold text-lg">Shop Now</span>
          <Image 
            className="group-hover:translate-x-2 transition-transform" 
            src={assets.arrow_icon_white} 
            alt="arrow_icon_white" 
            width={20}
            height={20}
          />
        </motion.button>
      </div>

      {/* Right Side - Butcher/Oven Image */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="hidden md:block max-w-[400px] lg:max-w-[500px] relative"
      >
        <Image
          src={assets.abdel_oven}
          alt="Artisan Butcher"
          className="rounded-lg transform -scale-x-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5e6d3] via-transparent to-[#f5e6d3] w-full h-full" />
      </motion.div>

      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10 bg-[url('/path/to/grill-pattern.png')]" />
    </motion.div>
  );
};

export default Banner;