// app/api/my-liked/list-seller/route.js

import connectDB from "@/config/db";
import Wishlist from "@/models/Wishlist";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";

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

    const wishlistStats = await Wishlist.aggregate([
      { $addFields: { productId: { $toObjectId: "$product" } } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      { $match: { "productInfo.userId": userId } },
      {
        $group: {
          _id: {
            productId: "$productInfo._id",
            name: "$productInfo.name",
            category: "$productInfo.category",
            image: "$productInfo.image",
            month: { $month: "$createdAt" },
          },
          totalLikes: { $sum: 1 },
          firstLikeDate: { $min: "$createdAt" },
          lastLikeDate: { $max: "$createdAt" },
        },
      },
      {
        $project: {
          _id: 0,
          product: {
            id: "$_id.productId",
            name: "$_id.name",
            category: "$_id.category",
            image: "$_id.image",
          },
          month: "$_id.month",
          totalLikes: 1,
          firstLikeDate: 1,
          lastLikeDate: 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, data: wishlistStats });
  } catch (error) {
    console.error("[SELLER_WISHLIST_ERROR]", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}