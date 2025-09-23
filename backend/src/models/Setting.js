// models/Setting.js
import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  open: String,
  close: String,
});

const settingsSchema = new mongoose.Schema({
  general: {
    restaurantOpen: { type: Boolean, default: true },
    cardPayment: { type: Boolean, default: true },
    cashPayment: { type: Boolean, default: true },
    delivery: { type: Boolean, default: true },
    collection: { type: Boolean, default: true },
  },
  restaurant: {
    name: String,
    address: String,
    phone: String,
    email: String,
    description: String,
  },
  hours: {
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema,
    sunday: daySchema,
  },
  offers: {
    monday: { type: Boolean, default: false },
    tuesday: { type: Boolean, default: false },
    wednesday: { type: Boolean, default: false },
    thursday: { type: Boolean, default: false },
    friday: { type: Boolean, default: false },
    saturday: { type: Boolean, default: false },
    sunday: { type: Boolean, default: false },
  },
  delivery: {
    radius: Number,
    type: { type: String, enum: ["free", "flat", "km", "postcode"], default: "free" },
    flatRate: Number,
    restrictedPostcodes: [String],
    allowedPostcodes: [String],
  },
});

export default mongoose.model("Setting", settingsSchema);
