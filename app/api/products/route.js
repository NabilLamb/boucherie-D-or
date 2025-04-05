import connectDB from "@/config/db";
import Product from "@/models/Product";

export const GET = async (req) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const category = searchParams.get('category');
    const exclude = searchParams.get('exclude');
    const limit = parseInt(searchParams.get('limit')) || 8;

    // First get same category products
    let products = [];
    if (category) {
      products = await Product.find({ 
        category, 
        _id: { $ne: exclude } 
      })
      .populate('category', 'name type')
      .limit(limit)
      .exec();
    }

    // If needed, fill with other categories
    if (products.length < limit) {
      const additional = await Product.find({
        _id: { $ne: exclude },
        category: { $ne: category }
      })
      .populate('category', 'name type')
      .limit(limit - products.length)
      .exec();

      products = [...products, ...additional];
    }

    return new Response(JSON.stringify({ 
      products,
      total: products.length 
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};