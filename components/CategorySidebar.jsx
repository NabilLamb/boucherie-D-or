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
    <div className="w-64 bg-white p-4 rounded-xl shadow-md border border-gray-100 sticky top-4">
      <h3 className="text-xl font-semibold mb-4">Categories</h3>
      <nav className="space-y-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleSelect(cat.name)}
            className={`w-full p-2 text-left rounded-lg transition-colors ${
              selectedCategory === cat.name || 
              (cat.name === 'All' && !selectedCategory)
                ? 'bg-orange-100 text-orange-600 font-semibold'
                : 'hover:bg-gray-50'
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