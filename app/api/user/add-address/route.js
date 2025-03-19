import { getAuth } from "@clerk/nextjs/server";
import Address from "@/models/Address";
import User from "@/models/user";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {    
        // Get auth data correctly
        const { userId } = getAuth(request);
        
        // Validate request
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { address } = await request.json();
        
        // Validate address data
        if (!address || typeof address !== 'object') {
            return NextResponse.json(
                { success: false, message: "Invalid address data" },
                { status: 400 }
            );
        }

        await connectDB();

        // Create address with proper user reference
        const newAddress = await Address.create({
            ...address,
            userId
        });

        // Update user's addresses array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { addresses: newAddress._id } },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Sanitize response data
        const responseAddress = newAddress.toObject();
        delete responseAddress.__v;

        return NextResponse.json(
            { 
                success: true, 
                message: "Address added successfully", 
                address: responseAddress 
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                message: error.message || "Server error" 
            },
            { status: 500 }
        );
    }
}