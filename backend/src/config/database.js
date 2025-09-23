import mongoose from "mongoose";

async function connectDB() {
  if (process.env.DB_TYPE === "mongo") {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ MongoDB Connected");
    } catch (err) {
      console.error("❌ MongoDB Connection Error:", err.message);
      process.exit(1);
    }
  } else {
    console.log("⚠ Using Local Storage (JSON file)");
    // We'll handle local storage later (using storageAdapter.js)
  }
}

export default connectDB;
