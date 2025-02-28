import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true, 
        ref: "user" 
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
    images: { 
        type: [String], 
        required: true 
    },
    category: { 
        type: String, 
        required: true,
        enum: [
            "Meats",
            "Kitchen Tools",
            "Drinks",
            "Snacks",
            "Vegetables",
            "Charcuteries & Cheeses",
            "Fruits",
            "Baked Goods",
            "Cooking Accessories",
            "Prepared Foods",
            "Dairy & Eggs",
            "Pantry Essentials"
        ]
    },
    subCategory: {
        type: String,
        required: true,
        enum: [
            // Meats
            "Beef", "Lamb", "Poultry", "Goat", "Veal",
            
            // Kitchen Tools
            "Cutlery", "Food Preparation", "Cookware", "Baking Tools",
            
            // Drinks
            "Water", "Soda", "Juices", "Energy Drinks",
            
            // Snacks
            "Savory Snacks", "Sweet Snacks", "Nuts & Seeds",
            
            // Vegetables
            "Organic Produce", "Leafy Greens", "Root Vegetables", "Herbs",
            
            // Charcuteries & Cheeses
            "Cured Meats", "Cheeses", "Dips & Spreads",
            
            // Fruits
            "Citrus Fruits", "Tropical Fruits", "Berries", "Organic Fruits",
            
            // Baked Goods
            "Breads", "Pastries", "Cakes", "Artisan Breads",
            
            // Cooking Accessories
            "Grilling Accessories",
            
            // Prepared Foods
            "Marinated Meats", "Ready Meals", "Salad Kits",
            
            // Dairy & Eggs
            "Milk", "Eggs", "Yogurt",
            
            // Pantry Essentials
            "Oils & Vinegars", "Spices", "Grains & Pulses"
        ]
    },
    unit: {
        type: String,
        required: true,
        enum: ["kg", "piece", "liter", "pack"],
        default: "kg"
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
});

const Product = mongoose.models.product || mongoose.model('product', productSchema);

export default Product;