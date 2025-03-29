// components/seller/ProductStats.js
"use client";
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const ProductStats = ({ stats }) => {
  // Check if the stats object has the required data
  if (!stats) return <div className="text-center py-8">Loading stats...</div>;

  const hasSalesData = stats.monthlySales && stats.monthlySales.some(s => s > 0);
  const hasTopProducts = stats.topProducts && stats.topProducts.length > 0;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales Trend</h3>
        
        {hasSalesData ? (
          <div className="h-80">
          <Line 
            data={{
              labels: monthNames,
              datasets: [{
                label: 'Units Sold',
                data: stats.monthlySales,
                borderColor: '#3B82F6',
                tension: 0.4
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Units Sold' } },
                x: { title: { display: true, text: 'Month' } }
              }
            }}
          />
        </div>
        ): (
          <div className="text-gray-500 text-center py-8">
            No sales data available
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        {hasTopProducts ? (
          <div className="h-80">
          <Bar
            data={{
              labels: stats.topProducts.map(p => p.name),
              datasets: [{
                label: 'Units Sold',
                data: stats.topProducts.map(p => p.sales),
                backgroundColor: '#10B981',
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Units Sold' } },
                x: { ticks: { autoSkip: false } }
              }
            }}
          />
        </div>
        ):(
          <div className="text-gray-500 text-center py-8">
            No top products data available
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductStats;
