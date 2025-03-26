import connectDB from "@/config/db";
import Wishlist from "@/models/Wishlist";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        await connectDB();
        const { userId } = getAuth(request);
        const wishlist = await Wishlist.find({ user: userId })
            .populate('product')
            .sort({ createdAt: -1 });
        return NextResponse.json({ success: true, wishlist });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}