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
    offerPrice: Number,
    image: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true,
        enum: ["kg", "piece", "liter", "pack", "bottle", "box", "gram", "pound", "ounce", "carton"],
        default: "kg"
    },
    date: {
        type: Number,
        default: () => Date.now()
    },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;