import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Address from "@/models/Address";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {

        await connectDB();

        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);


        await connectDB();

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "not authorized" });
        }

        Address.length

        const orders = await Order.find({ userId })
            .populate({
                path: 'items.product',
                select: 'name price offerPrice image'
            })
            .populate({
                path: 'address',
                select: 'fullName phone postalCode city address additionalInfo'
            })
            .sort({ date: -1 });

            return NextResponse.json({success: true, orders});

    } catch (error) {
        return NextResponse.json({success: false, message: error.message});
    }
}