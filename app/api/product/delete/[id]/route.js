// app/api/product/delete/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";

export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = params;
  
  try {
    const { userId } = getAuth(request);
    const deletedProduct = await Product.findOneAndDelete({
      _id: id,
      userId
    });

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}