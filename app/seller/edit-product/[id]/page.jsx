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
    axios.get("/api/categories").then(({ data }) => setCategories(data)).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          const p = data.product;
          setExistingImages(p.image || []);
          setName(p.name);
          setDescription(p.description);
          setCategory(p.category._id);
          setPrice(p.price);
          setOfferPrice(p.offerPrice || "");
          setUnit(p.unit);
        }
      } catch {
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
      setIsSubmitting(false);
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
    existingImages.forEach((img) => formData.append("existingImages", img));
    files.forEach((file) => formData.append("image", file));

    try {
      const token = await getToken();
      const { data } = await axios.put(`/api/products/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.custom((t) => (
          <div className={`${t.visible ? "animate-enter" : "animate-leave"} bg-green-50 border border-green-200 p-4 rounded-lg shadow-lg flex items-center gap-3`}>
            {successIcon()}
            <div>
              <h3 className="text-sm font-medium text-green-800">Product updated successfully!</h3>
              <p className="text-sm text-green-700 mt-0.5">Changes are now live.</p>
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
    if (isExisting) setExistingImages(existingImages.filter((_, i) => i !== index));
    else { const n = [...files]; n.splice(index, 1); setFiles(n); }
  };

  const handleFileInputChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const err = validateImage(file);
      if (err) {
        toast.error(err.message);
        e.target.value = "";
        return;
      }
      const compressed = await compressImage(file);
      const n = [...files];
      n[index] = compressed;
      setFiles(n);
    } catch (error) {
      toast.error(error.message || "Failed to process image");
      e.target.value = "";
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all text-sm bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
  const totalImages = existingImages.length + files.filter(Boolean).length;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.push("/seller/product-list")}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-sm text-gray-500">Update product details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-800">Product Images</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{totalImages}/4</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {/* Existing images */}
              {existingImages.map((image, index) => (
                <div key={`existing-${index}`} className="relative aspect-square rounded-lg overflow-hidden group">
                  <Image src={image} alt="Product" width={200} height={200} className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <button
                    type="button"
                    onClick={() => removeImage(index, true)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1.5 rounded">Current</span>
                </div>
              ))}

              {/* New image slots */}
              {[...Array(4 - existingImages.length)].map((_, index) => (
                <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden">
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
                        <div className="text-gray-300">
                          <svg className="w-6 h-6 sm:w-7 sm:h-7 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
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

          {/* Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Product Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Product Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Description *</label>
                  <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} required />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                    {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
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
                      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={`${inputClass} pl-8`} min="0" step="0.01" required />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Offer Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{currency}</span>
                      <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} className={`${inputClass} pl-8`} min="0" step="0.01" />
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
            className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            {isSubmitting ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /><span>Updating...</span></>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg><span>Update Product</span></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;