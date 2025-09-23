import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  image: { type: String },
  size: { type: String },  // e.g. "Small, Medium, Large"
  badge: { type: String }, // e.g. "Best Seller"
  isVeg: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Item", ItemSchema);
