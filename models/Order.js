import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    items: [{
        product: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    address: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        postalCode: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
        additionalInfo: String
    },
    status: { 
        type: String, 
        required: true,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    date: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;