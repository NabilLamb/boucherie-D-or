const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

console.log("MongoDB URI:", mongoURI); // Debugging

if (!mongoURI) {
  console.error("❌ Error: MONGODB_URI is not defined in the .env file.");
  process.exit(1);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
