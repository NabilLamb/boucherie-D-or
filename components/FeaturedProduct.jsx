import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { motion } from "framer-motion";

const products = [
  {
    id: 1,
    image: assets.abdel_meal,
    title: "Premium Beef Rib Steak",
    description: "Aged to perfection, ideal for grilling and special occasions.",
  },
  {
    id: 2,
    image: assets.annais_meal,
    title: "Stuffed Veal Shank",
    description: "Traditional recipe with herbs and secret spices stuffing.",
  },
  {
    id: 3,
    image: assets.abdel_oven,
    title: "Artisan Wood-Fired Ovens",
    description: "Traditional baking with modern temperature control.",
  },
];

const FeaturedProduct = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const hoverVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  return (
    <div className="mt-14 bg-gray-50 py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center mb-16"
      >
        <h2 className="text-4xl font-semibold text-gray-800">Featured Products</h2>
        <div className="w-32 h-1.5 bg-orange-600 mt-4 rounded-full" />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto"
      >
        {products.map(({ id, image, title, description }) => (
          <motion.div 
            key={id}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            className="group relative overflow-hidden rounded-2xl shadow-xl h-[600px]"
          >
            <motion.div
              variants={hoverVariants}
              className="h-full w-full"
            >
              <Image
                src={image}
                alt={title}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                width={800}
                height={800}
                priority
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-8 flex flex-col justify-end">
              <div className="space-y-4 text-white">
                <h3 className="text-3xl font-bold">{title}</h3>
                <p className="text-lg leading-relaxed opacity-90">{description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-orange-600 px-8 py-4 rounded-lg text-lg font-medium w-fit mt-6 shadow-md hover:shadow-orange-200/30 transition-all"
                >
                  Shop Now
                  <Image 
                    src={assets.redirect_icon} 
                    alt="Arrow" 
                    className="h-5 w-5"
                    width={20}
                    height={20}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturedProduct;