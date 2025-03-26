"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { getImageSource } from "@/utils/images";
import Loading from "@/components/Loading";

// Icons
import { ChartPieIcon } from "@heroicons/react/24/outline";
import { ArrowTrendingUpIcon, StarIcon } from "@heroicons/react/24/solid";
import Footer from "@/components/seller/Footer";

// Lazy load the chart component
const WishlistStats = dynamic(() => import("@/components/seller/WishlistStats"), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-50 animate-pulse rounded-xl" />,
});

export default function Page() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get("/api/my-liked/list-seller", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data?.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Customer Favorites Analytics
        </h1>
        <p className="text-gray-600">
          Insights into your most loved products
        </p>
      </header>

      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <ChartPieIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tracked Products</p>
                  <p className="text-2xl font-semibold">{stats.length}</p>
                </div>
              </div>
            </div>
            {/* Add more metric cards if needed */}
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Engagement Trend */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                Monthly Engagement Trend
              </h3>
              <WishlistStats stats={stats} type="trend" />
            </div>

            {/* Top Performing Products */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-yellow-500" />
                Top Performing Products
              </h3>
              <WishlistStats stats={stats} type="top" />
            </div>
          </div>

          {/* Single Table (No Duplication) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold">Product Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Product", "Category", "Likes", "First Liked", "Last Liked"].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.map((item) => (
                    <tr key={`${item.product.id}-${item.month}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={getImageSource(item.product.image?.[0])}
                            alt={item.product.name}
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-product.jpg";
                            }}
                          />
                          <span className="font-medium">
                            {item.product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {item.totalLikes}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {format(new Date(item.firstLikeDate), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {format(new Date(item.lastLikeDate), "MMM dd, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
}
