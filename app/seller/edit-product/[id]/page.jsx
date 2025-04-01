"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { successIcon } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import Loading from "@/components/Loading";
import { compressImage, validateImage } from "@/utils/imageProcessor";

const EditProduct = () => {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAppContext();
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          const product = data.product;
          setExistingImages(product.image || []);
          setName(product.name);
          setDescription(product.description);
          setCategory(product.category._id);
          setPrice(product.price);
          setOfferPrice(product.offerPrice || "");
          setUnit(product.unit);
        }
      } catch (error) {
        toast.error("Failed to load product data");
        router.push("/seller/product-list");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getToken, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (offerPrice && parseFloat(offerPrice) >= parseFloat(price)) {
      toast.error("Offer price must be lower than regular price");
      return;
    }

    const formData = new FormData();
    formData.append("existingImages", JSON.stringify(existingImages));
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("unit", unit);
    if (offerPrice) formData.append("offerPrice", offerPrice);

    // Append existing images that haven't been removed
    existingImages.forEach((image) => {
      formData.append("existingImages", image);
    });

    // Append new files
    files.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const token = await getToken();
      const { data } = await axios.put(`/api/products/${id}`, formData, {
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
                Product updated successfully!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Changes are now live in the marketplace.
              </p>
            </div>
          </div>
        ));
        router.push("/seller/product-list");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
    }
  };

  const handleFileInputChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const validationError = validateImage(file);
      if (validationError) {
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

  if (loading === true) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => router.push("/seller/product-list")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Products
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-10 border-b pb-4">
            Edit Product
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
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((image, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative aspect-square group rounded-xl overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt="Existing product"
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, true)}
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
                  </div>
                ))}
                {[...Array(4 - existingImages.length)].map((_, index) => (
                  <div
                    key={`new-${index}`}
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

                      <div className="flex gap-2">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
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
                      <span>Updating Product...</span>
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Update Product</span>
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

export default EditProduct;
