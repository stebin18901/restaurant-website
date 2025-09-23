import express from "express";
import { loginAdmin, createAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/create", createAdmin); // For initial admin setup

export default router;
