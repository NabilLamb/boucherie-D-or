// app/seller/product-list/page.jsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import ProductStats from "@/components/seller/ProductStats";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // For controlled ConfirmDialog
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const toastRef = useRef(null);
  // Sales stats state expects: monthlySales, topProducts, totalSales, totalRevenue
  const [salesStats, setSalesStats] = useState({
    monthlySales: [],
    topProducts: [],
    totalSales: 0,
    totalRevenue: 0,
  });

  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  // Basic product statistics calculations
  const totalProducts = products.length;
  const categoriesCount = [...new Set(products.map((p) => p.category))].length;
  const averagePrice =
    products.reduce((acc, curr) => acc + (curr.offerPrice || curr.price), 0) /
    (totalProducts || 1);

  const fetchSellerProduct = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/products/seller-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        const sortedProducts = data.products.sort((a, b) => b.date - a.date);
        setProducts(sortedProducts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch sales data from the API route
  const fetchSalesData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/products/sales", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(data);
      if (data.success) {
        setSalesStats({
          monthlySales: data.monthlySales,
          topProducts: data.topProducts,
          totalSales: data.totalSales,
          totalRevenue: data.totalRevenue,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load sales data");
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
      fetchSalesData();
    }
  }, [user]);

  // When user clicks Delete, open the confirm dialog and store the product id.
  const showDeleteConfirm = (productId) => {
    setSelectedProductId(productId);
    setConfirmVisible(true);
  };

  // Called when user clicks Yes on the confirm dialog.
  const onAccept = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/products/${selectedProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchSellerProduct();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setConfirmVisible(false);
      setSelectedProductId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-gray-50">
      <Toast ref={toastRef} />
      <ConfirmDialog
        visible={confirmVisible}
        onHide={() => setConfirmVisible(false)}
        content={() => (
          <div
            className="flex flex-col items-center p-5 bg-white shadow-lg rounded-lg"
            style={{ minWidth: "400px" }}
          >
            {/* Red Warning Icon */}
            <div className="bg-red-100 rounded-full p-4 -mt-8 flex justify-center items-center">
              <i className="pi pi-exclamation-triangle text-red-600 text-4xl" />
            </div>

            {/* Dialog Content */}
            <h3 className="text-xl font-bold mt-4 mb-2">Delete Product</h3>
            <p className="text-gray-600 mb-4 text-center">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3 w-full justify-end">
              <Button
                label="Cancel"
                outlined
                onClick={() => setConfirmVisible(false)}
                className="px-4 py-2"
              />
              <Button
                label="Delete"
                severity="danger"
                onClick={onAccept}
                className="px-4 py-2"
              />
            </div>
          </div>
        )}
      />

      <div className="w-full md:p-8 p-4">
        {/* Sales Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {currency}
              {salesStats.totalRevenue?.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Render ProductStats with fetched sales stats */}
        <ProductStats stats={salesStats} />

        {/* Product Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-10">
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
                          {product.category?.name}
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
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/seller/edit-product/${product._id}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => showDeleteConfirm(product._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              router.push(`/product/${product._id}`)
                            }
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md transition-colors"
                          >
                            View
                          </button>
                        </div>
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
