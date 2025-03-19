
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";
import User from "@/models/user";
import connectDB from "@/config/db";


export async function POST(request) {
    try {
        await connectDB();
        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        // Validate address structure
        const requiredFields = ['fullName', 'phone', 'postalCode', 'city', 'address'];
        if (!address || !requiredFields.every(field => address[field])) {
            return NextResponse.json(
                { success: false, message: "Invalid address format" }, 
                { status: 400 }
            );
        }

        // Calculate amount and verify products
        let amount = 0;
        const itemsWithPrices = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.product);
            if (!product) throw new Error(`Product ${item.product} not found`);
            
            const price = product.offerPrice || product.price;
            amount += price * item.quantity;
            
            return {
                product: item.product,
                quantity: item.quantity,
                price: price
            };
        }));

        // Create order through Inngest
        await inngest.send({
            name: "order/created",
            data: {
                userId,
                address: {
                    fullName: address.fullName,
                    phone: address.phone,
                    postalCode: address.postalCode,
                    city: address.city,
                    address: address.address,
                    additionalInfo: address.additionalInfo || ''
                },
                items: itemsWithPrices,
                amount,
                date: Date.now()
            }
        });

        // Clear user cart
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        return NextResponse.json({ 
            success: true, 
            message: "Order placed successfully" 
        });

    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { success: false, message: error.message }, 
            { status: 500 }
        );
    }
}