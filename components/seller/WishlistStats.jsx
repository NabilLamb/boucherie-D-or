// components/seller/WishlistStats.jsx

"use client";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Fixed palette — stable across renders, no hydration mismatch
const LINE_COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
  "#F97316", "#6366F1",
];

const WishlistStats = ({ stats, type }) => {
  if (!stats || !stats.length) {
    return (
      <div className="text-gray-500 text-center py-8">
        No wishlist data available
      </div>
    );
  }

  const processChartData = () => {
    const trendMap = {};
    const productMap = {};

    stats.forEach((entry) => {
      const key = entry.product.id;
      if (!key) return;

      if (!trendMap[key]) {
        trendMap[key] = {
          label: entry.product.name,
          data: Array(12).fill(0),
          tension: 0.3,
        };
      }
      trendMap[key].data[entry.month - 1] += entry.totalLikes;

      if (!productMap[key]) {
        productMap[key] = { ...entry.product, totalLikes: 0 };
      }
      productMap[key].totalLikes += entry.totalLikes;
    });

    // Assign stable colors from the fixed palette
    const trendData = Object.values(trendMap).map((dataset, index) => ({
      ...dataset,
      borderColor: LINE_COLORS[index % LINE_COLORS.length],
    }));

    return { trendData, productData: Object.values(productMap) };
  };

  const { trendData, productData } = processChartData();

  if (type === "trend") {
    return (
      <div className="relative h-80">
        <Line
          data={{ labels: MONTH_NAMES, datasets: trendData }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Number of Likes" },
              },
              x: { title: { display: true, text: "Month" } },
            },
          }}
        />
      </div>
    );
  }

  if (type === "top") {
    const top = [...productData]
      .sort((a, b) => b.totalLikes - a.totalLikes)
      .slice(0, 10);

    return (
      <div className="relative h-80">
        <Bar
          data={{
            labels: top.map((p) => p.name),
            datasets: [
              {
                label: "Total Likes",
                data: top.map((p) => p.totalLikes),
                backgroundColor: "#3B82F6",
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Total Likes" },
              },
            },
          }}
        />
      </div>
    );
  }

  return null;
};

export default WishlistStats;
