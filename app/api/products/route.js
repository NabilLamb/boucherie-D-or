// app/api/products/route.js

import connectDB from "@/config/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

const ITEMS_PER_PAGE = 12;

export const GET = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const exclude = searchParams.get("exclude");
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      50,
      parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE))
    );

    // Build filter object
    const filter = {};

    if (category) filter.category = category;
    if (exclude) filter._id = { $ne: exclude };

    // Search across name and description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name type")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    // Return response with Cache-Control headers
    return Response.json(
      {
        products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("[PRODUCTS_GET_ERROR]", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
};