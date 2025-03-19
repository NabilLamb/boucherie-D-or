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

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: `Product with ID ${item.product} not found` });
      }
      if (product.offerPrice) {
        amount += product.offerPrice * item.quantity;
      } else {
        amount += product.price * item.quantity;
      }
    }

    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount,
        date: Date.now(),
      },
    });

    const user = await User.findById(userId);
    if(!user){
        return NextResponse.json({success: false, message: `User with ID ${userId} not found`});
    }
    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ success: false, error: error });
  }
}