// src/routes/health.js
import express from "express";
const router = express.Router();
router.get("/health", (req, res) => res.json({ ok: true }));
export default router;

// mount in app.js: app.use("/api", healthRoutes);
