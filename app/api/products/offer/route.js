import connectDB from "@/config/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export const GET = async (req) => {
  try {
    await connectDB();
    
    // Find all categories with type 'offer'
    const offerCategories = await Category.find({ type: 'offer' });
    
    // If no offer categories exist, return empty array
    if (offerCategories.length === 0) {
      return new Response(JSON.stringify({ products: [] }), { status: 200 });
    }

    // Get ALL products that belong to any of the offer categories
    const products = await Product.find({
      category: { $in: offerCategories.map(cat => cat._id) }
    })
    .populate('category', 'name type')
    .sort('-createdAt') // Sort by newest first
    .lean(); // Convert to plain JavaScript objects

    return new Response(JSON.stringify({ products }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to fetch offer products" 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};