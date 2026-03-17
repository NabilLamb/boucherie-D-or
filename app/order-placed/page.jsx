// app/order-placed/page.jsx

"use client";

import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const OrderPlaced = () => {
  const { router } = useAppContext();
  const [countdown, setCountdown] = useState(5);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (cancelled) return;

    if (countdown === 0) {
      router.push("/my-orders");
      return;
    }

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, cancelled, router]);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6 px-4 text-center">
      {/* Spinner + checkmark */}
      <div className="flex justify-center items-center relative">
        <Image
          className="absolute p-5"
          src={assets.checkmark}
          alt="Order confirmed"
          width={96}
          height={96}
        />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-400 border-gray-200" />
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Order Placed Successfully
        </h1>
        <p className="text-gray-500 mt-2">
          Thank you! Your order is being processed.
        </p>
      </div>

      {!cancelled ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-400">
            Redirecting to your orders in{" "}
            <span className="font-semibold text-gray-600">{countdown}s</span>
          </p>
          <div className="flex gap-3">
            <Link
              href="/my-orders"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              View Orders Now
            </Link>
            <button
              onClick={() => setCancelled(true)}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Stay Here
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link
            href="/my-orders"
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            View My Orders
          </Link>
          <Link
            href="/"
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderPlaced;
