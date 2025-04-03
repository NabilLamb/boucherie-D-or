import connectDB from "@/config/db";
import Product from "@/models/Product";

export const GET = async (req) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get('ids')?.split(',') || [];
    
    const products = await Product.find({
      _id: { $in: ids }
    }).populate('category', 'name type');

    return new Response(JSON.stringify({ products }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};