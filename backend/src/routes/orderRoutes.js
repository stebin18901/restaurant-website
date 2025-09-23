// backend/src/routes/orderRoutes.js
import express from "express";
import { createOrder, getOrders, updateOrderStatus, getOrderById } from "../controllers/orderController.js";
const router = express.Router();

router.post("/", createOrder);             // place order
router.get("/", getOrders);                // admin: fetch orders
router.put("/:id/status", updateOrderStatus); // update order status
router.get("/:id", getOrderById);

export default router;
