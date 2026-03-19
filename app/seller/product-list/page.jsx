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

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className="p-2.5 bg-orange-50 rounded-lg flex-shrink-0 text-xl">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-0.5 truncate">{value}</p>
    </div>
  </div>
);

const ProductList = () => {
  const { router, getToken, user } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [search, setSearch] = useState("");
  const toastRef = useRef(null);
  const [salesStats, setSalesStats] = useState({ monthlySales: [], topProducts: [], totalSales: 0, totalRevenue: 0 });

  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  const totalProducts = products.length;
  const categoriesCount = [...new Set(products.map((p) => p.category?.name).filter(Boolean))].length;
  const averagePrice = products.reduce((acc, curr) => acc + (curr.offerPrice || curr.price), 0) / (totalProducts || 1);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const fetchSellerProduct = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/products/seller-list", { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) setProducts(data.products.sort((a, b) => b.date - a.date));
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/products/sales", { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) setSalesStats({ monthlySales: data.monthlySales, topProducts: data.topProducts, totalSales: data.totalSales, totalRevenue: data.totalRevenue });
    } catch { /* silent */ }
  };

  useEffect(() => {
    if (user) { fetchSellerProduct(); fetchSalesData(); }
  }, [user]);

  const showDeleteConfirm = (id) => { setSelectedProductId(id); setConfirmVisible(true); };

  const onAccept = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/products/${selectedProductId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) { toast.success("Product deleted"); fetchSellerProduct(); }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setConfirmVisible(false);
      setSelectedProductId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toast ref={toastRef} />
      <ConfirmDialog
        visible={confirmVisible}
        onHide={() => setConfirmVisible(false)}
        content={() => (
          <div className="flex flex-col items-center p-5 bg-white shadow-lg rounded-xl" style={{ minWidth: "min(320px, 90vw)" }}>
            <div className="bg-red-100 rounded-full p-3 mb-3">
              <i className="pi pi-exclamation-triangle text-red-600 text-2xl" />
            </div>
            <h3 className="text-lg font-bold mb-1">Delete Product</h3>
            <p className="text-gray-500 text-sm mb-4 text-center">This action cannot be undone.</p>
            <div className="flex gap-2 w-full">
              <Button label="Cancel" outlined onClick={() => setConfirmVisible(false)} className="flex-1" />
              <Button label="Delete" severity="danger" onClick={onAccept} className="flex-1" />
            </div>
          </div>
        )}
      />

      <div className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Product Inventory</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your product listings</p>
          </div>
          <Link
            href="/seller/add-product"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard label="Total Products" value={totalProducts} icon="📦" />
          <StatCard label="Categories" value={categoriesCount} icon="🏷️" />
          <StatCard label="Avg. Price" value={`${currency}${averagePrice.toFixed(2)}`} icon="💰" />
          <StatCard label="Total Revenue" value={`${currency}${salesStats.totalRevenue?.toFixed(2) || "0.00"}`} icon="📈" />
        </div>

        {/* Charts */}
        <div className="mb-6">
          <ProductStats stats={salesStats} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-gray-800">Products ({filtered.length})</h2>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none w-full sm:w-48"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-sm font-medium">{search ? "No products match your search" : "No products found"}</p>
              {!search && (
                <button onClick={() => router.push("/seller/add-product")} className="mt-3 text-sm text-orange-500 hover:text-orange-600 font-medium">
                  Add your first product →
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 sm:px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                            <Image
                              src={product.image?.length > 0 ? product.image[0] : assets.default_img}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{product.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 hidden sm:table-cell">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                          {product.category?.name}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5">
                        {product.offerPrice ? (
                          <div>
                            <p className="text-sm font-semibold text-orange-600">{currency}{product.offerPrice}</p>
                            <p className="text-xs text-gray-400 line-through">{currency}{product.price}</p>
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-gray-900">{currency}{product.price}</p>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/seller/edit-product/${product._id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => showDeleteConfirm(product._id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => router.push(`/product/${product._id}`)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
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