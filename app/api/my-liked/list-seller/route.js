"use server";
import connectDB from "@/config/db";
import Wishlist from "@/models/Wishlist";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";
import { ObjectId } from "mongodb";

export async function GET(request) {
    try {
        await connectDB();

        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized" });
        }

        const wishlistStats = await Wishlist.aggregate([
            // Convert product string to ObjectId
            { $addFields: { productId: { $toObjectId: "$product" } } },
            // Join with products
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productInfo",
                },
            },
            { $unwind: "$productInfo" },
            // Match seller's products
            { $match: { "productInfo.userId": userId } },
            // Group by product + time period (e.g., month)
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
            // Structure for frontend
            {
                $project: {
                    _id: 0,
                    product: {
                        id: "$_id.productId",
                        name: "$_id.name",
                        category: "$_id.category",
                        image: "$_id.image",
                    },
                    month: "$_id.month", // For trend analysis
                    totalLikes: 1,
                    firstLikeDate: 1,
                    lastLikeDate: 1,
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: wishlistStats
        });

    } catch (error) {
        console.error("Seller wishlist stats error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}