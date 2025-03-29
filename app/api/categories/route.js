import connectDB from "@/config/db";
import Category from "@/models/Category";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

// app/api/categories/route.js
export const GET = async (req) => {
  try {
    await connectDB();

    // Remove the aggregation and just find categories
    const categories = await Category.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);
    if (!isSeller) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    await connectDB();
    const body = await req.json();

    // Case-insensitive check for existing category
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${body.name}$`, 'i') }
    });

    if (existingCategory) {
      return new Response(JSON.stringify({
        error: "Category already exists (case-insensitive)"
      }), { status: 400 });
    }

    const category = await Category.create(body);

    return new Response(JSON.stringify(category), { status: 201 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};