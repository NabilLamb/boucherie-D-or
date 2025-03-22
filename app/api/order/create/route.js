import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";
import User from "@/models/user";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { address, items } = await request.json();

    console.log("Received order create request with data:", { address, items });

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
    }

    let amount = 0;
    const itemsWithSnapshots = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({
          success: false,
          message: `Product with ID ${item.product} not found`
        }, { status: 404 });
      }

      
      itemsWithSnapshots.push({
        product: item.product,
        productSnapshot: {
          name: product.name,
          price: product.price,
          offerPrice: product.offerPrice || null,
          image: product.image,
          unit: product.unit || "kg",
          category: product.category
        },
        quantity: item.quantity
      });

      amount += product.offerPrice ?
        product.offerPrice * item.quantity :
        product.price * item.quantity;
    }

    
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items: itemsWithSnapshots,
        amount,
        date: Date.now(),
      },
    });

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: `User not found` }, { status: 404 });
    }

    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order Placed" }, { status: 200 });
  } catch (error) {
    const requestBody = await request.json();
    const { userId } = getAuth(request);
    logger.error('Error placing order', {
      error: error.message,
      stack: error.stack,
      requestBody,
      userId,
    });
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}