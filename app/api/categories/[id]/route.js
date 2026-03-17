// app/api/categories/[id]/route.js

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
    
    // NEXT.JS 15 FIX: Await params before accessing properties
    const { id } = await params; 
    
    const body = await req.json();
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    
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
    
    // NEXT.JS 15 FIX: Await params before accessing properties
    const { id } = await params;

    await Category.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};