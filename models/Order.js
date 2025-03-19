import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true, index: true},
    items: [{
        product: {type: String, required: true},
        quantity: {type: Number, required: true},
    }],
    amount: {type: Number, required: true},
    address: {type: String, required: true},   
    status: {type: String, required: true},
    date : {type: Date, required: true},
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;