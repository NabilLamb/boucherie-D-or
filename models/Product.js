import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    offerPrice: {
        type: Number,
        required: false
    },
    image: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ["kg", "piece", "liter", "pack"],
        default: "kg"
    },
    date: {
        type: Number, // Store as timestamp (milliseconds)
        default: () => Date.now()
    },
});

const Product = mongoose.models.product || mongoose.model('product', productSchema);

export default Product;
