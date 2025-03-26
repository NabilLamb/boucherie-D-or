// components/seller/ProductStats.js
"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';

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

const ProductStats = ({ salesData }) => {
  if (!salesData || !salesData.length) return <div className="text-gray-500 text-center py-8">No sales data available</div>;

  // Process sales data
  const processData = () => {
    const monthlySales = Array(12).fill(0);
    const productSales = {};

    salesData.forEach(entry => {
      const month = new Date(entry.date).getMonth();
      monthlySales[month] += entry.quantity;
      
      if (!productSales[entry.productId]) {
        productSales[entry.productId] = {
          name: entry.productName,
          sales: 0
        };
      }
      productSales[entry.productId].sales += entry.quantity;
    });

    return {
      monthlySales,
      topProducts: Object.values(productSales).sort((a, b) => b.sales - a.sales).slice(0, 5)
    };
  };

  const { monthlySales, topProducts } = processData();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales Trend</h3>
        <div className="h-80">
          <Line 
            data={{
              labels: monthNames,
              datasets: [{
                label: 'Units Sold',
                data: monthlySales,
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
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        <div className="h-80">
          <Bar
            data={{
              labels: topProducts.map(p => p.name),
              datasets: [{
                label: 'Units Sold',
                data: topProducts.map(p => p.sales),
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
      </div>
    </div>
  );
};

export default ProductStats;