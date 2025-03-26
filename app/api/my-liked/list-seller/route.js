"use client";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Wishlist from "@/models/Wishlist";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();
        const { userId } = getAuth(request);
        const { isSeller } = await authSeller(userId);
        if (!isSeller) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        const wishlistStats = await Wishlist.aggregate([
            {
                $group: {
                    _id: "$product",
                    count: { $sum: 1 },
                    users: { $addToSet: "$user" }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            { $match: { "product": { $ne: null } } },
        ]);
        return NextResponse.json({ success: true, data: wishlistStats });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}