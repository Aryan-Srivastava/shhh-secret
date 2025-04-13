const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { config } = require("./config");
const { Secret } = require("./models/Secret");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(config.mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.post("/api/secrets", async (req, res) => {
  try {
    const { encryptedContent, expiration } = req.body;

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
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
