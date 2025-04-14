const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { config } = require("./config");
const { Secret } = require("./models/Secret");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(config.mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Secret Link API is running" });
});

// API Routes
app.post("/api/secrets", async (req, res) => {
  try {
    const { encryptedContent, expiration } = req.body;
    console.log("Received encryptedContent:", encryptedContent);

    if (!encryptedContent || !expiration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // const ttl = config.secretTTL[expiration];
    // if (!ttl) {
    //   return res.status(400).json({ error: "Invalid expiration time" });
    // }

    const secret = new Secret({
      encryptedContent,
      expiresAt: 0,
    });

    await secret.save();
    res.status(201).json({ id: secret._id });
  } catch (error) {
    console.error("Error creating secret:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/secrets/:id", async (req, res) => {
  try {
    const secret = await Secret.findById(req.params.id);

    if (!secret) {
      return res
        .status(404)
        .json({ error: "Secret not found or already viewed" });
    }

    res.json({ encryptedContent: secret.encryptedContent });
  } catch (error) {
    console.error("Error retrieving secret:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
