import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { uploadToCloudinary } from "@/lib/cloudinary";
import connectDB from "@/config/db";
import mongoose from "mongoose";


//app\api\products\[id]\route.js
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    // Do NOT populate the category to keep it as an ObjectId
    const product = await Product.findById(id).populate('category');

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("[PRODUCT_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    // Authentication
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
        { 
          success: false, 
          message: "Invalid category ID format",
          received: category,
          expected: "Valid MongoDB ObjectId"
        },
        { status: 400 }
      );
    }

    // Validate existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Authorization check
    if (existingProduct.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized product modification" },
        { status: 403 }
      );
    }

    // Process images
    const existingImages = JSON.parse(formData.get('existingImages')) || [];
    const newImages = formData.getAll('image');

    // Validate image count
    if (existingImages.length + newImages.length > 4) {
      return NextResponse.json(
        { success: false, message: "Maximum 4 images allowed" },
        { status: 400 }
      );
    }

    // Upload new images
    const uploadedImages = await Promise.all(
      newImages.filter(file => file.size > 0).map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const result = await uploadToCloudinary(buffer);
        return result.secure_url;
      })
    );

    // Update product data
    const updateData = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price')),
      unit: formData.get('unit'),
      image: [...existingImages, ...uploadedImages].slice(0, 4)
    };

    // Handle offer price
    const offerPrice = formData.get('offerPrice');
    updateData.offerPrice = offerPrice ? parseFloat(offerPrice) : null;

    // Validate pricing
    if (updateData.offerPrice && updateData.offerPrice >= updateData.price) {
      return NextResponse.json(
        { success: false, message: "Offer price must be lower than regular price" },
        { status: 400 }
      );
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      product: updatedProduct
    });

  } catch (error) {
    console.error("[PRODUCT_PUT_ERROR]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Authentication
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Seller authorization required" },
        { status: 401 }
      );
    }

    const { id } = params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Authorization check
    if (product.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized product deletion" },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("[PRODUCT_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}