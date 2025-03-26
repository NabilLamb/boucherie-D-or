// app/api/my-liked/create/route.js
import { NextResponse } from "next/server";
import Wishlist from "@/models/Wishlist";
import connectDB from "@/config/db";

export async function POST(request) {
  await connectDB();
  
  try {
    const { userId, productId } = await request.json();
    
    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await Wishlist.findOne({ 
      user: userId, 
      product: productId 
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Product already in favorites" },
        { status: 400 }
      );
    }

    const newItem = await Wishlist.create({ 
      user: userId, 
      product: productId 
    });

    return NextResponse.json({ 
      success: true, 
      data: await newItem.populate('product') 
    });

  } catch (error) {
    console.error("Create wishlist error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message.includes('duplicate') 
          ? "Already in favorites" 
          : "Server error" 
      },
      { status: 500 }
    );
  }
}