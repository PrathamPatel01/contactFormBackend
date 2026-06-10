import "./config/env.js";

import express from "express";
import cors from "cors";
import contactRoute from "./routes/contactRoute.js";

const app = express();

/**
 * Middlewares
 */
app.use(cors({ origin: "*" }));
app.use(express.json());

/**
 * Debug ENV (remove later in production)
 */
console.log("🔥 ENV CHECK:");
console.log("EMAIL_USER =", process.env.EMAIL_USER ? "LOADED" : "MISSING");
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

/**
 * Routes
 */
app.use("/contact", contactRoute);

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

/**
 * 404 fallback
 */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/**
 * IMPORTANT: NO app.listen() on Vercel
 */
export default app;