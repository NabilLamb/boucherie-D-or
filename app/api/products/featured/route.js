import connectDB from "@/config/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export const GET = async (req) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const query = {};
    const categoryType = searchParams.get('categoryType');
    const limit = parseInt(searchParams.get('limit')) || 4;

    if (categoryType) {
      // Find categories with the specified type
      const categories = await Category.find({ type: categoryType });
      if (categories.length > 0) {
        query.category = { $in: categories.map(cat => cat._id) };
      } else {
        // Return empty array if no categories found
        return new Response(JSON.stringify({ products: [] }), { status: 200 });
      }
    }

    const products = await Product.find(query)
      .populate('category', 'name type')
      .limit(limit)
      .sort('-createdAt');

    return new Response(JSON.stringify({ products }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};