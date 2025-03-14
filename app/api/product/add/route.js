import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { connectDB } from "@/config/db";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  try {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    // Validate required fields
    const requiredFields = ["name", "description", "category", "price"];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Parse product data
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      price: parseFloat(formData.get("price")),
      offerPrice: formData.get("offerPrice")
        ? parseFloat(formData.get("offerPrice"))
        : null,
      unit: formData.get("unit") || "kg", // Default to kg
    };

    // Image handling
    const files = formData.getAll("images");
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    const imageUploads = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) =>
              error ? reject(error) : resolve(result)
          );
          stream.end(Buffer.from(arrayBuffer));
        });
      })
    );

    const imageUrls = imageUploads.map((result) => result.secure_url);

    // Database operations
    await connectDB();
    const newProduct = await Product.create({
      ...productData,
      images: imageUrls,
      userId,
      date: Date.now(),
    });

    return NextResponse.json(
      { success: true, product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
};
