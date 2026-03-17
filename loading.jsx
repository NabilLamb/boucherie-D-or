// app/loading.jsx

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white/60 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-orange-400 border-gray-200" />
    </div>
  );
}
