import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";

export async function POSt(request) {

    try {
        const { userId, productId } = await request.json();
        await inngest.send({
            name: "wishlist/updated",
            data: { userId, productId, action: "remove" }
        });
        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}