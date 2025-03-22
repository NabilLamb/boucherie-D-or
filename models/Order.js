import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' },
    items: [{
        product: { type: String, required: true, ref: 'Product' },
        productSnapshot: {
            name: String,
            price: Number,
            offerPrice: Number,
            image: [String],
            unit: String,
            category: String
        },
        quantity: { type: Number, required: true },
    }],
    amount: { type: Number, required: true },
    address: { type: String, ref: 'Address', required: true },
    status: {
        type: String,
        required: true,
        default: 'Order Placed'
    },
    date: { type: Number, required: true }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;