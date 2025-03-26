"use server"
import connectDB from "@/config/db";
import Wishlist from "@/models/Wishlist";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        await connectDB();
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const wishlist = await Wishlist.find({ user: userId })
            .populate({
                path: 'product',
                select: 'name description price offerPrice image category unit'
            })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            wishlist: wishlist.filter(item => item.product !== null)
        });
    } catch (error) {
        console.error("Wishlist list error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}