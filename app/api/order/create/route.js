
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";
import User from "@/models/user";
import connectDB from "@/config/db";


// In your POST route handler
export async function POST(request) {
    try {
        // 1. Connect to database first
        await connectDB();

        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid data' });
        }

        // 2. Fixed amount calculation
        const amount = await items.reduce(async (accPromise, item) => {
            const acc = await accPromise;
            const product = await Product.findById(item.product);
            
            // 3. Handle missing product
            if (!product) {
                throw new Error(`Product ${item.product} not found`);
            }

            const price = product.offerPrice || product.price;
            return acc + (price * item.quantity);
        }, Promise.resolve(0)); // Start with resolved promise

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

        // Clear user cart
        const user = await User.findById(userId);
        user.cartItems = {};
        await user.save();

        return NextResponse.json({ success: true, message: 'Order Placed' });

    } catch (error) {
        console.error('Order creation error:', {
            message: error.message,
            stack: error.stack,
            userId,
            items
        });
        return NextResponse.json({ 
            success: false, 
            message: error.message || 'Internal server error' 
        });
    }
}