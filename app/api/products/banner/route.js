import connectDB from "@/config/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export const GET = async (req) => {
  try {
    await connectDB();
    
    // Find all categories with type 'banner'
    const bannerCategories = await Category.find({ type: 'banner' });
    
    // If no banner categories exist, return empty array
    if (bannerCategories.length === 0) {
      return new Response(JSON.stringify({ products: [] }), { status: 200 });
    }

    // Get products that belong to any of the banner categories
    const products = await Product.find({
      category: { $in: bannerCategories.map(cat => cat._id) }
    })
    .populate('category', 'name type')
    .sort('-createdAt'); // Sort by newest first

    return new Response(JSON.stringify({ products }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to fetch banner products" 
    }), { status: 500 });
  }
};