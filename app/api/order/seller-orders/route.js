// app/api/order/seller-orders/route.js

import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import "@/models/Address";

export async function GET(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    const orders = await Order.find({})
      .populate({
        path: "address",
        select: "fullName phoneNumber area city state zipcode",
      })
      .sort({ date: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("[SELLER_ORDERS_ERROR]", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}