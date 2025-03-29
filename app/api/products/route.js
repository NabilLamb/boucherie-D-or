import connectDB from "@/config/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

// app/api/products/route.js
export const GET = async (req) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const query = {};
    const categoryType = searchParams.get('categoryType');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sort = searchParams.get('sort') || '-date';

    if (categoryType) {
      const categories = await Category.find({ type: categoryType });
      if (categories.length > 0) {
        query.category = { $in: categories.map(cat => cat._id) };
      }
    }

    const products = await Product.find(query)
      .populate('category', 'name type')
      .sort(sort)
      .limit(limit);

    return new Response(JSON.stringify({ products }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};