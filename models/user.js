import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },

    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    imageUrl: { type: String, require: true },

    cartItems: { type: Object, default: {} }

}, { minimize: false });

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;
