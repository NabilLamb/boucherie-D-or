// models/Wishlist.js
import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

WishlistSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);