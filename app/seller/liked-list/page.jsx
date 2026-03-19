
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { getImageSource } from "@/utils/images";
import Loading from "@/components/Loading";
import Footer from "@/components/seller/Footer";

const WishlistStats = dynamic(() => import("@/components/seller/WishlistStats"), { ssr: false });

export default function Page() {
  const [stats, setStats] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const [likedRes, catRes] = await Promise.all([
          axios.get("/api/my-liked/list-seller", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/categories"),
        ]);

        // Build id → { name, type } map
        const map = {};
        (catRes.data || []).forEach((cat) => { map[cat._id] = { name: cat.name, type: cat.type }; });
        setCategoryMap(map);
        setStats(likedRes.data?.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  // Resolve a category field (could be an id string or already an object) to display text
  const resolveCategoryLabel = (category) => {
    if (!category) return "—";
    // Already an object with name (API populated it)
    if (typeof category === "object" && category.name) {
      return category.type ? `${category.name} (${category.type})` : category.name;
    }
    // It's an id string — look up in our map
    const cat = categoryMap[category];
    if (cat) return cat.type ? `${cat.name} (${cat.type})` : cat.name;
    // Fallback: still an id we couldn't resolve
    return category;
  };

  if (loading) return <Loading />;

  const totalLikes = stats.reduce((acc, item) => acc + item.totalLikes, 0);
  const topProduct = stats.reduce((a, b) => (a.totalLikes > b.totalLikes ? a : b), stats[0]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full py-4 sm:py-6 px-3 sm:px-6 space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Favorites</h1>
          <p className="text-sm text-gray-500 mt-0.5">Insights into your most loved products</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-lg flex-shrink-0">📊</div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">Tracked Products</p>
                <p className="text-xl font-bold text-gray-900">{stats.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg text-lg flex-shrink-0">❤️</div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">Total Likes</p>
                <p className="text-xl font-bold text-gray-900">{totalLikes}</p>
              </div>
            </div>
          </div>
          {topProduct && (
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg text-lg flex-shrink-0">⭐</div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Top Product</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{topProduct.product.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-green-500">📈</span> Monthly Trend
            </h3>
            <WishlistStats stats={stats} type="trend" />
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-yellow-500">🏆</span> Top Products
            </h3>
            <WishlistStats stats={stats} type="top" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800">Product Details</h3>
          </div>
          {stats.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No favorites data yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-50/80">
                  <tr>
                    {["Product", "Category", "Likes", "First Liked", "Last Liked"].map((h) => (
                      <th key={h} className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.map((item) => (
                    <tr key={`${item.product.id}-${item.month}`} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 sm:px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={getImageSource(item.product.image?.[0])}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = "/placeholder-product.jpg"; }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{item.product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {resolveCategoryLabel(item.product.category)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5">
                        <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                          <span className="text-red-400">♥</span> {item.totalLikes}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 text-xs text-gray-500">{format(new Date(item.firstLikeDate), "MMM dd, yyyy")}</td>
                      <td className="px-4 sm:px-6 py-3.5 text-xs text-gray-500">{format(new Date(item.lastLikeDate), "MMM dd, yyyy")}</td>
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
}