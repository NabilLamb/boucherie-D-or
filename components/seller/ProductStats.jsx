// components/seller/ProductStats.js

"use client";
import { Line, Bar } from "react-chartjs-2";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const chartOptions = (yLabel) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1f2937",
      titleColor: "#f9fafb",
      bodyColor: "#d1d5db",
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "#f3f4f6" },
      ticks: { color: "#9ca3af", fontSize: 11 },
      title: { display: true, text: yLabel, color: "#9ca3af", font: { size: 11 } },
    },
    x: {
      grid: { display: false },
      ticks: { color: "#9ca3af", fontSize: 11 },
    },
  },
});

const ProductStats = ({ stats }) => {
  if (!stats) return null;

  const hasSalesData = stats.monthlySales?.some((s) => s > 0);
  const hasTopProducts = stats.topProducts?.length > 0;

  const EmptyState = ({ text }) => (
    <div className="flex flex-col items-center justify-center h-full text-gray-300 py-8">
      <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p className="text-sm">{text}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Monthly Sales Trend</h3>
        <div className="h-60 sm:h-72">
          {hasSalesData ? (
            <Line
              data={{
                labels: monthNames,
                datasets: [{
                  label: "Units Sold",
                  data: stats.monthlySales,
                  borderColor: "#f97316",
                  backgroundColor: "rgba(249,115,22,0.08)",
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: "#f97316",
                  pointRadius: 4,
                  pointHoverRadius: 6,
                }],
              }}
              options={chartOptions("Units Sold")}
            />
          ) : (
            <EmptyState text="No sales data yet" />
          )}
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Top Selling Products</h3>
        <div className="h-60 sm:h-72">
          {hasTopProducts ? (
            <Bar
              data={{
                labels: stats.topProducts.map((p) => p.name),
                datasets: [{
                  label: "Units Sold",
                  data: stats.topProducts.map((p) => p.sales),
                  backgroundColor: "rgba(249,115,22,0.85)",
                  borderRadius: 6,
                  borderSkipped: false,
                }],
              }}
              options={{
                ...chartOptions("Units Sold"),
                scales: {
                  ...chartOptions("Units Sold").scales,
                  x: { ...chartOptions("Units Sold").scales.x, ticks: { autoSkip: false, color: "#9ca3af", fontSize: 10 } },
                },
              }}
            />
          ) : (
            <EmptyState text="No top products data yet" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductStats;