
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";
import User from "@/models/user";


export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address, items } = await request.json();
        
        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
        }

        // Calculate amount using items
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return NextResponse.json(
                    { success: false, message: `Product ${item.product} not found` },
                    { status: 404 }
                );
            }
            amount += (product.offerPrice || product.price) * item.quantity;
        }

        // Create order
        await inngest.send({
            name: "order/created",
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
        user.cartItems = {}
        await user.save();

        //Responce
        return NextResponse.json({ success: true, message: "Order created" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}