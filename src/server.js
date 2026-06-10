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
 * Debug ENV (remove in production later)
 */
console.log("🔥 ENV CHECK:");
console.log("EMAIL_USER =", process.env.EMAIL_USER ? "LOADED" : "MISSING");
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

/**
 * Routes
 */
app.use("/contact", contactRoute);

/**
 * Health check route (for deployment + monitoring)
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

/**
 * 404 fallback (important for APIs)
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


export default app;