"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import {
  ChartPieIcon,
  HeartIcon,
  UsersIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const page = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/my-liked/list-seller");
        setStats(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Customer Favorites Analytics
          </h1>

          {loading ? (
            <Loading />
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <ChartPieIcon className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-gray-500">Total Products</p>
                      <p className="text-2xl font-bold">{stats.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <HeartIcon className="w-8 h-8 text-red-500" />
                    <div>
                      <p className="text-gray-500">Total Likes</p>
                      <p className="text-2xl font-bold">
                        {stats.reduce((sum, item) => sum + item.count, 0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <UsersIcon className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-gray-500">Unique Users</p>
                      <p className="text-2xl font-bold">
                        {stats.reduce(
                          (sum, item) => sum + item.users.length,
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left">Product</th>
                      <th className="px-6 py-4 text-center">Likes</th>
                      <th className="px-6 py-4 text-center">Unique Users</th>
                      {/* <th className="px-6 py-4 text-right">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={getImageSource(item.product.image[0])}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <span className="font-medium">
                              {item.product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">{item.count}</td>
                        <td className="px-6 py-4 text-center">
                          {item.users.length}
                        </td>
                        {/* <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default page;
