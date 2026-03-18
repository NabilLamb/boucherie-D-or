// app/my-orders/loading.jsx

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mt-20 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 mb-4 border border-gray-100 shadow-sm">
          <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}