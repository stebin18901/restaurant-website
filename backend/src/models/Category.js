import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // URL or file path
}, { timestamps: true });

export default mongoose.model("Category", CategorySchema);
