
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";
import User from "@/models/user";
import connectDB from "@/config/db";


export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid data' });
        }

        //Calculate amount using items
        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (product.offerPrice) {
                return await acc + product.offerPrice * item.quantity;
            } else {
                return await acc + product.price * item.quantity;
            }
        }, 0);

        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount,
                date: Date.now()
            }
        });

        // clear user cart
        const user = await User.findById(userId);
        user.cartItems = {};
        await user.save();

        return NextResponse.json({ success: true, message: 'Order Placed' });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });

    }
}