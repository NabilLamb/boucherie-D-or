// app/api/my-liked/delete/route.js
import { NextResponse } from "next/server";
import Wishlist from "@/models/Wishlist";
import connectDB from "@/config/db";

export async function POST(request) {
    try {
        await connectDB();
        const { userId, productId } = await request.json();
        
        if (!userId || !productId) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const result = await Wishlist.deleteOne({ 
            user: userId, 
            product: productId 
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Item not found in wishlist" },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            message: "Removed from favorites" 
        });

    } catch (error) {
        console.error("Delete wishlist error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}