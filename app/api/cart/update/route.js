import { NextResponse } from 'next/server'; // Add this import
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/user";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { cartData } = await request.json();
        await connectDB();
        
        const user = await User.findByIdAndUpdate(
            userId,
            { cartItems: cartData },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}