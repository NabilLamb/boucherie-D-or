import React, { useState, useEffect } from "react";
import { categories as defaultCategories } from "@/assets/categoriesData";
import { useAppContext } from "@/context/AppContext";

const CategorySidebar = ({ 
  selectedCategory, 
  setSelectedCategory, 
  setCurrentPage 
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { categories: contextCategories } = useAppContext();

  const categories = [{ name: "All" }, ...(contextCategories || defaultCategories || [])];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSelect = (category) => {
    const newCategory = category === 'All' ? null : category;
    setSelectedCategory(newCategory);
    setCurrentPage(1);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-4 max-md:static max-md:mb-6">
      <h3 className="text-lg md:text-xl font-semibold mb-3">Categories</h3>
      <nav className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-1 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleSelect(cat.name)}
            className={`p-2 text-sm md:text-base rounded-md transition-colors ${
              selectedCategory === cat.name || 
              (cat.name === 'All' && !selectedCategory)
                ? 'bg-orange-100 text-orange-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </nav>
    </div>
  );
};
export default CategorySidebar;