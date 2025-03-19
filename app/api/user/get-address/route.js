import { getAuth } from "@clerk/nextjs/server";
import Address from "@/models/Address"; // Corrected import statement
import connectDB from "@/config/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const addresses = await Address.find({ userId })
            .sort({ createdAt: -1 }) // Newest first
            .lean();

        if (!addresses || addresses.length === 0) {
            return NextResponse.json(
                { 
                    success: true, 
                    message: "No addresses found",
                    data: [] 
                },
                { status: 200 }
            );
        }

        // Clean up response data
        const cleanedAddresses = addresses.map(address => ({
            id: address._id.toString(),
            fullName: address.fullName,
            phone: address.phone,
            postalCode: address.postalCode,
            city: address.city,
            address: address.address,
            additionalInfo: address.additionalInfo,
            createdAt: address.createdAt
        }));

        return NextResponse.json(
            { 
                success: true, 
                message: "Addresses retrieved successfully",
                data: cleanedAddresses 
            },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                message: error.message || "Server error",
                data: [] 
            },
            { status: 500 }
        );
    }
}