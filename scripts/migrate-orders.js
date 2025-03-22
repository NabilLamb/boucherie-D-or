import 'dotenv/config';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

async function migrateOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const orders = await Order.find({
      "items.productSnapshot": { $exists: false }
    }).lean();

    let migratedCount = 0;
    
    for (const order of orders) {
      const itemsWithSnapshots = await Promise.all(
        order.items.map(async (item) => {
          if (!item.productSnapshot) {
            const product = await Product.findById(item.product);
            return {
              ...item,
              productSnapshot: product ? {
                name: product.name,
                price: product.price,
                offerPrice: product.offerPrice,
                image: product.image,
                unit: product.unit,
                category: product.category
              } : null
            };
          }
          return item;
        })
      );

      await Order.updateOne(
        { _id: order._id },
        { $set: { items: itemsWithSnapshots } }
      );
      
      migratedCount++;
    }

    console.log(`Successfully migrated ${migratedCount} orders`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateOrders();