import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";

export const GET = async (req) => {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    await connectDB();

    try {

        const products = await Product.find({})
        .populate('category', 'name')
        .sort('-date');
        
        const sellerProductIds = products.map(p => p._id.toString());


        // Find completed orders that include the seller's products
        const orders = await Order.find({
            status: 'Order Placed',
            'items.product': { $in: sellerProductIds }
        }).lean();

        // Get seller's product IDs from product field in orders
        const sellerProducts = [...new Set(
            orders.flatMap(order =>
                order.items.map(item => item.product.toString())
            )
        )];

        // Process sales data
        const salesData = [];
        const monthlySales = Array(12).fill(0);
        let totalRevenue = 0;

        orders.forEach(order => {
            let orderContainsSellerProducts = false;

            order.items.forEach(item => {
                if (sellerProducts.includes(item.product.toString())) {
                    orderContainsSellerProducts = true;

                    const saleEntry = {
                        date: new Date(order.date).toISOString(),
                        productId: item.product,
                        productName: item.productSnapshot.name,
                        quantity: item.quantity
                    };

                    salesData.push(saleEntry);

                    // Aggregate monthly sales
                    const month = new Date(order.date).getMonth();
                    monthlySales[month] += item.quantity;
                }
            });

            if (orderContainsSellerProducts) {
                totalRevenue += order.amount;
            }
        });

        // Get top products
        const productSalesMap = salesData.reduce((acc, entry) => {
            if (!acc[entry.productId]) {
                acc[entry.productId] = {
                    name: entry.productName,
                    sales: 0
                };
            }
            acc[entry.productId].sales += entry.quantity;
            return acc;
        }, {});

        const topProducts = Object.values(productSalesMap)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);

        return new Response(JSON.stringify({
            success: true,
            monthlySales,
            totalSales: salesData.reduce((sum, entry) => sum + entry.quantity, 0),
            totalRevenue,
            topProducts
        }), { status: 200 });

    } catch (error) {
        console.error("Sales data error:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch sales data" }), {
            status: 500
        });

    }

}