"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  // Basic statistics calculations
  const totalProducts = products.length;
  const categoriesCount = [...new Set(products.map((p) => p.category))].length;
  const averagePrice =
    products.reduce((acc, curr) => acc + (curr.offerPrice || curr.price), 0) /
    (totalProducts || 1);

  const fetchSellerProduct = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/product/seller-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="w-full md:p-8 p-4">
        {loading && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <Loading />
          </div>
        )}
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">
              Total Products
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {totalProducts}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Categories</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {categoriesCount}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Avg. Price</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {currency}
              {averagePrice.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Product Inventory
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products found.</p>
              <button
                onClick={() => router.push("/seller")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 hidden md:table-cell">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Price
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={
                                product.image?.length > 0
                                  ? product.image[0]
                                  : assets.default_img
                              }
                              alt={product.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {product.unit}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.offerPrice ? (
                          <div className="flex flex-col">
                            <span className="text-red-600 font-medium">
                              {currency}
                              {product.offerPrice}
                            </span>
                            <span className="text-gray-400 line-through text-xs">
                              {currency}
                              {product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium">
                            {currency}
                            {product.price}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/product/${product._id}`)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end w-full"
                        >
                          View
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductList;
