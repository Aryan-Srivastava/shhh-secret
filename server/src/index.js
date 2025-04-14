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
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// Connect to MongoDB with retry logic
const connectWithRetry = async (retryCount = 0) => {
  try {
    const mongoUri = process.env.MONGODB_URI || config.mongoUri;
    console.log("Attempting to connect to MongoDB with URI:", mongoUri);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    if (retryCount < 3) {
      // Retry after 5 seconds, up to 3 times
      console.log(`Retrying connection attempt ${retryCount + 1} of 3...`);
      setTimeout(() => connectWithRetry(retryCount + 1), 5000);
    } else {
      console.error("Failed to connect after 3 attempts. Exiting...");
      process.exit(1);
    }
  }
};

connectWithRetry();

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Secret Link API is running" });
});

// API Routes
app.post("/api/secrets", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { encryptedContent, expiration } = req.body;

    if (!encryptedContent) {
      console.log("Missing encryptedContent");
      return res.status(400).json({ error: "Encrypted content is required" });
    }

    if (!expiration) {
      console.log("Missing expiration");
      return res.status(400).json({ error: "Expiration time is required" });
    }

    // Calculate expiration time
    // const expiresAt = new Date(Date.now() + parseInt(expiration) * 1000);
    // console.log("Creating secret with expiration:", expiresAt);

    const secret = new Secret({
      encryptedContent,
      // expiresAt,
      viewed: false,
    });

    console.log("Saving secret to database");
    const savedSecret = await secret.save();
    console.log("Secret saved successfully with ID:", savedSecret._id);

    res.status(201).json({ id: savedSecret._id });
  } catch (error) {
    console.error("Error creating secret:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      error: "Failed to create secret",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

app.get("/api/secrets/:id", async (req, res) => {
  try {
    console.log("Fetching secret with ID:", req.params.id);
    const secret = await Secret.findById(req.params.id);

    if (!secret) {
      console.log("Secret not found");
      return res
        .status(404)
        .json({ error: "Secret not found or already viewed" });
    }

    console.log("Secret found, marking as viewed");
    secret.viewed = true;
    await secret.save();
    await Secret.deleteOne({ _id: secret._id });

    res.json({ encryptedContent: secret.encryptedContent });
  } catch (error) {
    console.error("Error retrieving secret:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      error: "Failed to retrieve secret",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  console.error("Error stack:", err.stack);
  res.status(500).json({
    error: "Something broke!",
    details: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Environment:", process.env.NODE_ENV);
  console.log("MongoDB URI:", process.env.MONGODB_URI ? "Set" : "Not set");
});
