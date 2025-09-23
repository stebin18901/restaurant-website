import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Admin login
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (admin && (await admin.matchPassword(password))) {
    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: { id: admin._id, username: admin.username },
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

// (Optional) create initial admin
export const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  const exists = await Admin.findOne({ username });
  if (exists) return res.status(400).json({ message: "Admin already exists" });

  const admin = await Admin.create({ username, password });
  res.status(201).json({ success: true, admin });
};
