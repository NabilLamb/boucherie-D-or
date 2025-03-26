// app/api/product/edit/[id]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";

export async function PUT(request, { params }) {
  await connectDB();
  const { id } = params;
  
  try {
    const { userId } = getAuth(request);
    const formData = await request.formData();
    
    const updateData = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      price: formData.get('price'),
      offerPrice: formData.get('offerPrice') || null,
      unit: formData.get('unit'),
      images: JSON.parse(formData.get('existingImages')) || [],
    };

    // Handle new images
    const newImages = formData.getAll('images');
    newImages.forEach(image => {
      if (image instanceof File) {
        updateData.images.push(image);
      }
    });

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Edit product error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}