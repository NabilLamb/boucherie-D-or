import connectDB from "@/config/db";
import Category from "@/models/Category";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";


export const PUT = async (req, { params }) => {
  try {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);
    if (!isSeller) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    await connectDB();
    const body = await req.json();
    const category = await Category.findByIdAndUpdate(params.id, body, { new: true });
    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);
    if (!isSeller) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    await connectDB();
    await Category.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};