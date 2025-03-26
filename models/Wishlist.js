import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: "User",
        required: true
    },
    product: {
        type: String,
        ref: "Product",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);