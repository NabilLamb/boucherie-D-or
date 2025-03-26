// app/api/my-liked/delete/route.js
"use server"
import { NextResponse } from "next/server";
import Wishlist from "@/models/Wishlist";

export async function POST(request) {
    try {
        const { userId, productId } = await request.json();
        
        // Validate input
        if (!userId || !productId) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Atomic delete operation
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