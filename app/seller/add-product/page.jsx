// app/seller/add-product/page.jsx

"use client";
import React, { useState, useEffect } from "react";
import { successIcon } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import Loading from "@/components/Loading";
import { compressImage, validateImage } from "@/utils/imageProcessor";

const AddProduct = () => {
  const { getToken } = useAppContext();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories");
        setCategories(data);
        if (data.length > 0) setCategory(data[0]._id);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (offerPrice && parseFloat(offerPrice) >= parseFloat(price)) {
      toast.error("Offer price must be lower than regular price");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    if (offerPrice) formData.append("offerPrice", offerPrice);
    formData.append("unit", unit);
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const token = await getToken();
      const { data } = await axios.post("/api/products/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.custom((t) => (
          <div className={`${t.visible ? "animate-enter" : "animate-leave"} bg-green-50 border border-green-200 p-4 rounded-lg shadow-lg flex items-center space-x-3`}>
            {successIcon()}
            <div>
              <h3 className="text-sm font-medium text-green-800">Product added successfully!</h3>
              <p className="text-sm text-green-700 mt-1">Your product is now live in the marketplace.</p>
            </div>
          </div>
        ));
        setFiles([]);
        setName("");
        setDescription("");
        setCategory(categories.length > 0 ? categories[0]._id : "");
        setPrice("");
        setOfferPrice("");
        setUnit("kg");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleFileInputChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const validationError = validateImage(file);
      if (validationError) {
        if (validationError.type === "size") {
          toast.custom((t) => (
            <div className={`${t.visible ? "animate-enter" : "animate-leave"} bg-red-50 border border-red-200 p-4 rounded-lg shadow-lg`}>
              <p className="text-red-700 text-sm">{validationError.message}</p>
              <a href={validationError.helpLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                Compress your image →
              </a>
            </div>
          ));
        } else {
          toast.error(validationError.message);
        }
        e.target.value = "";
        return;
      }
      const compressedFile = await compressImage(file);
      const newFiles = [...files];
      newFiles[index] = compressedFile;
      setFiles(newFiles);
    } catch (error) {
      toast.error(error.message || "Failed to process image");
      e.target.value = "";
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all text-sm bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-6">
      {isSubmitting && <Loading />}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to list a product</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Product Images</h2>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 text-xs text-blue-700 space-y-1">
              <p className="font-medium text-blue-800">📸 Image requirements</p>
              <p>Max 4 images · 2MB per image · JPG, PNG, WEBP · Recommended 800×800px</p>
              <a href="https://www.iloveimg.com/compress-image" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                Compress images →
              </a>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <label htmlFor={`image${index}`} className="block w-full h-full cursor-pointer">
                    <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-orange-400 transition-colors flex items-center justify-center overflow-hidden">
                      {files[index] ? (
                        <>
                          <Image src={URL.createObjectURL(files[index])} alt="Preview" width={200} height={200} className="object-cover w-full h-full" />
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); removeImage(index); }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <div className="text-gray-300 p-2">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </label>
                  <input id={`image${index}`} type="file" onChange={(e) => handleFileInputChange(e, index)} className="hidden" accept="image/*" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Product Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left */}
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Product Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Premium Angus Beef Steak"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Description *</label>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={inputClass}
                    placeholder="Describe your product in detail..."
                    required
                  />
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Unit *</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClass} required>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="piece">Piece</option>
                    <option value="liter">Liter</option>
                    <option value="pack">Pack</option>
                    <option value="bottle">Bottle</option>
                    <option value="box">Box</option>
                    <option value="gram">Gram (g)</option>
                    <option value="pound">Pound (lb)</option>
                    <option value="ounce">Ounce (oz)</option>
                    <option value="carton">Carton</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Regular Price *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{currency}</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={`${inputClass} pl-8`}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Offer Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{currency}</span>
                      <input
                        type="number"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        className={`${inputClass} pl-8`}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Adding Product...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Product</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;