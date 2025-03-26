"use server"
import { NextResponse } from "next/server";
import Wishlist from "@/models/Wishlist";  


export async function POST(request) {
    try {
        const { userId, productId } = await request.json();
        
        if (!userId || !productId) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existing = await Wishlist.findOne({ user: userId, product: productId });
        if (existing) {
            return NextResponse.json(
                { success: false, message: "Already exists" },
                { status: 400 }
            );
        }

        const newItem = await Wishlist.create({ 
            user: userId, 
            product: productId 
        });

        return NextResponse.json({ success: true, data: newItem });

    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: "Already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json({ success: false, message: error.message });
    }
}