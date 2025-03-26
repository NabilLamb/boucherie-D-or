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

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const WishlistStats = ({ stats, type }) => {
  if (!stats || !stats.length) {
    return <div className="text-gray-500 text-center py-8">No wishlist data available</div>;
  }

  // Helper function to process data
  const processChartData = () => {
    const trendData = {};
    const productData = {};

    stats.forEach((entry) => {
      const productKey = entry.product.id;
      if (!productKey) return; // Skip if no product ID

      // For monthly trend chart
      if (!trendData[productKey]) {
        trendData[productKey] = {
          label: entry.product.name,
          data: Array(12).fill(0),
          // random color for each product line
          borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          tension: 0.3,
        };
      }
      // Increment the corresponding month’s likes
      trendData[productKey].data[entry.month - 1] += entry.totalLikes;

      // For total likes per product (used in top products chart)
      if (!productData[productKey]) {
        productData[productKey] = {
          ...entry.product,
          totalLikes: 0,
        };
      }
      productData[productKey].totalLikes += entry.totalLikes;
    });

    return {
      trendData: Object.values(trendData),
      productData: Object.values(productData),
    };
  };

  const { trendData, productData } = processChartData();

  // RENDER LINE CHART (Monthly Trend)
  if (type === "trend") {
    return (
      <div className="relative h-80">
        <Line
          data={{
            labels: monthNames,
            datasets: trendData,
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Number of Likes" },
              },
              x: {
                title: { display: true, text: "Month" },
              },
            },
          }}
        />
      </div>
    );
  }

  // RENDER BAR CHART (Top Products)
  if (type === "top") {
    const topProducts = [...productData]
      .sort((a, b) => b.totalLikes - a.totalLikes)
      .slice(0, 10);

    return (
      <div className="relative h-80">
        <Bar
          data={{
            labels: topProducts.map((p) => p.name),
            datasets: [
              {
                label: "Total Likes",
                data: topProducts.map((p) => p.totalLikes),
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
              x: {
                ticks: { autoSkip: false },
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
