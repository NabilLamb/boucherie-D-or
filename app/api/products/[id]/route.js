// app/api/products/[id]/route.js

import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { uploadToCloudinary } from "@/lib/cloudinary";
import connectDB from "@/config/db";
import mongoose from "mongoose";

// GET - Single Product with Caching
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const product = await Product.findById(id).populate('category');

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, product },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[PRODUCT_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update Product (Shared Admin Access)
export async function PUT(request, { params }) {
  try {
    await connectDB();

    // Verify user is a seller
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Seller authorization required" },
        { status: 401 }
      );
    }

    const { id } = params;
    const formData = await request.formData();
    const category = formData.get("category");

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID format" },
        { status: 400 }
      );
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Process images
    const existingImages = JSON.parse(formData.get('existingImages')) || [];
    const newImages = formData.getAll('image');

    const uploadedImages = await Promise.all(
      newImages.filter(file => file.size > 0).map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const result = await uploadToCloudinary(buffer);
        return result.secure_url;
      })
    );

    const updateData = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price')),
      unit: formData.get('unit'),
      image: [...existingImages, ...uploadedImages].slice(0, 4)
    };

    const offerPrice = formData.get('offerPrice');
    updateData.offerPrice = offerPrice ? parseFloat(offerPrice) : null;

    // Update the product (Any seller can update any product)
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("[PRODUCT_PUT_ERROR]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Remove Product (Shared Admin Access)
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Verify user is a seller
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Seller authorization required" }, { status: 401 });
    }

    const { id } = params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Delete the product (Any seller can delete any product)
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("[PRODUCT_DELETE_ERROR]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}