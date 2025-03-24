import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Address from "@/models/Address";
import connectDB from "@/config/db";

export async function GET(request) {
    try {
      await connectDB();
      
      const { userId } = getAuth(request);
  
      if (!userId) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
  
      const orders = await Order.find({ userId })
        
        .populate({
          path: 'address',
          select: 'fullName phone postalCode city address additionalInfo'
        })
        .sort({ date: -1 });
  
      return NextResponse.json({ success: true, orders }, { status: 200 });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  }