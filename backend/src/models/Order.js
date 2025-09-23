// backend/src/models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  customerName: String,
  type: { type: String, enum: ["collection", "delivery"], default: "collection" },
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String,
    phone: String
  },
  paymentMode: { type: String, enum: ["cash", "online"], default: "cash" },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
