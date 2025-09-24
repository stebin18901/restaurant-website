import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import healthRoutes from "./routes/health.js"



dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

// Routes

app.use("/api/admin", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/settings", settingRoutes);


export default app;
