import express from "express";
import rateLimit from "express-rate-limit";
import { sendContactEmail } from "../email/emailFunction/sendContactEmail.js";

const router = express.Router();

// IP rate limiter
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidName = (name) => {
  // only letters + spaces allowed
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
};

// email cooldown store
const emailCooldown = new Map();

const isEmailOnCooldown = (email) => {
  const last = emailCooldown.get(email);
  if (!last) return false;

  const now = Date.now();
  const cooldown = 2 * 60 * 1000; // 2 min

  return now - last < cooldown;
};

const markEmail = (email) => {
  emailCooldown.set(email, Date.now());
};

router.post("/", contactLimiter, async (req, res) => {
  console.log("🔥 CONTACT ROUTE HIT");

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }
       // name validation
    if (name.length > 30) {
      return res.status(400).json({ error: "Name too long (max 30 chars)" });
    }

    if (!isValidName(name)) {
      return res.status(400).json({
        error: "Name can only contain letters and spaces",
      });
    }

    // email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // message validation
    if (message.length > 300) {
      return res.status(400).json({
        error: "Message too long (max 300 characters)",
      });
    }


    if (isEmailOnCooldown(email)) {
      return res.status(429).json({
        error: "Please wait before sending another message.",
      });
    }

    await sendContactEmail({ name, email, message });

    markEmail(email);

    return res.json({ success: true });
  }catch (err) {
  console.error("❌ EMAIL ERROR FULL:", err);
  return res.status(500).json({
    error: err.message || "Email failed",
  });
}
});

export default router;