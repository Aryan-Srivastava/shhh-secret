const mongoose = require("mongoose");

const secretSchema = new mongoose.Schema(
  {
    encryptedContent: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for expiration
secretSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Secret = mongoose.model("Secret", secretSchema);

module.exports = { Secret };
