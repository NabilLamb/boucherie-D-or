"use client";
import React, { useState, useEffect } from "react";
import { successIcon } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { categories } from "@/assets/categoriesData";
import Loading from "@/components/Loading";
import { compressImage, validateImage } from "@/utils/imageProcessor";

const AddProduct = () => {
  const { getToken } = useAppContext();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("BEEF");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (offerPrice && parseFloat(offerPrice) >= parseFloat(price)) {
      toast.error("Offer price must be lower than regular price");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", showNewCategory ? newCategory : category);
    formData.append("price", price);
    offerPrice && formData.append("offerPrice", offerPrice);
    formData.append("unit", unit);

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const token = await getToken();
      const { data } = await axios.post("/api/product/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.custom((t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} 
            bg-green-50 border border-green-200 p-4 rounded-lg shadow-lg flex items-center space-x-3`}
          >
            {successIcon()}
            <div>
              <h3 className="text-sm font-medium text-green-800">
                Product added successfully!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Your product is now live in the marketplace.
              </p>
            </div>
          </div>
        ));

        // Reset form fields
        setFiles([]);
        setName("");
        setDescription("");
        setCategory("BEEF");
        setPrice("");
        setOfferPrice("");
        setUnit("kg");
        setShowNewCategory(false);
        setNewCategory("");
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
        // Custom toast for size errors with compression link
        if (validationError.type === "size") {
          toast.custom((t) => (
            <div
              className={`${t.visible ? "animate-enter" : "animate-leave"} 
          bg-red-50 border border-red-200 p-4 rounded-lg shadow-lg`}
            >
              <div className="flex flex-col space-y-2">
                <p className="text-red-700">{validationError.message}</p>
                <div className="text-sm">
                  <span className="text-gray-600">
                    Need to compress your image?{" "}
                  </span>
                  <a
                    href={validationError.helpLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Click here to compress it
                  </a>
                </div>
              </div>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {isSubmitting && <Loading />}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-10 border-b pb-4">
            Add New Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Image Upload Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Product Images
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">📸 Image Requirements:</p>
                <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
                  <li>Maximum 4 images</li>
                  <li>Max file size: 2MB per image</li>
                  <li>Formats: JPG, PNG, WEBP</li>
                  <li>Recommended size: 800x800px</li>
                </ul>
                <p className="text-sm text-blue-800 mt-2">
                  Need to resize or compress images?{" "}
                  <a
                    href="https://www.iloveimg.com/compress-image"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-blue-900"
                  >
                    Use our recommended tool
                  </a>
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="relative aspect-square group rounded-xl overflow-hidden"
                  >
                    <label
                      htmlFor={`image${index}`}
                      className="block w-full h-full cursor-pointer"
                    >
                      <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-500 transition-all flex items-center justify-center overflow-hidden">
                        {files[index] ? (
                          <>
                            <Image
                              src={URL.createObjectURL(files[index])}
                              alt="Preview"
                              width={400}
                              height={400}
                              className="object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                removeImage(index);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <div className="p-4 text-gray-400">
                            <svg
                              className="w-8 h-8 mx-auto"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      id={`image${index}`}
                      type="file"
                      onChange={(e) => handleFileInputChange(e, index)}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Tip: Use high-quality images with clear product visibility.
              </p>
            </div>

            {/* Product Details Section */}
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Premium Angus Beef Steak"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Description *
                    </label>
                    <textarea
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Detailed product description..."
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Category *
                      </label>
                      {!showNewCategory ? (
                        <div className="flex gap-2">
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            {categories.map((cat) => (
                              <option key={cat.name} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setShowNewCategory(true)}
                            className="whitespace-nowrap px-4 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            + New
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Enter new category"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewCategory(false);
                              setNewCategory("");
                            }}
                            className="px-4 text-red-600 hover:text-red-700 font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Unit *
                      </label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      >
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Regular Price *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            {currency}
                          </span>
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Offer Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            {currency}
                          </span>
                          <input
                            type="number"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

              <div className="border-t pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Adding Product...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span>Add Product</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
