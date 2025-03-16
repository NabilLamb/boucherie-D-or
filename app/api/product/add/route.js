import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  try {
    // Authentication and Authorization
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401 }
      );
    }

    // Form Data Handling
    const formData = await req.formData();

    // Validate required fields
    const requiredFields = ["name", "description", "category", "price", "unit"];
    const missingFields = requiredFields.filter(field => !formData.get(field));

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`
        },
        { status: 400 }
      );
    }

    // Price Validation
    const price = parseFloat(formData.get("price"));
    const offerPrice = formData.get("offerPrice")
      ? parseFloat(formData.get("offerPrice"))
      : null;

    if (offerPrice && offerPrice >= price) {
      return NextResponse.json(
        { success: false, message: "Offer price must be lower than regular price" },
        { status: 400 }
      );
    }

    // Prepare product data
    const productData = {
      name: formData.get("name").trim(),
      description: formData.get("description").trim(),
      category: formData.get("category").trim(),
      price,
      offerPrice,
      unit: formData.get("unit"),
      userId,
      date: Date.now(),
    };

    // Image Handling
    const files = formData.getAll("images");
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      );
    }

    // Validate image count
    if (files.length > 4) {
      return NextResponse.json(
        { success: false, message: "Maximum 4 images allowed" },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    const imageUploads = await Promise.all(
      files.map(async (file) => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { resource_type: "image" },
              (error, result) => error ? reject(error) : resolve(result)
            );
            stream.end(Buffer.from(arrayBuffer));
          });
        } catch (error) {
          console.error("Image upload error:", error);
          throw new Error("Failed to upload one or more images");
        }
      })
    );

    // Extract image URLs
    const imageUrls = imageUploads.map((result) => result.secure_url);

    // Database operations
    await connectDB();
    const newProduct = await Product.create({
      ...productData,
      image: imageUrls,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: newProduct
      },
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