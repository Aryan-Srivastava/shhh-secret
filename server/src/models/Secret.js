const mongoose = require("mongoose");

const secretSchema = new mongoose.Schema(
  {
    encryptedContent: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
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

// Delete secret after it's viewed
secretSchema.post("findOne", async function (doc) {
  if (doc && !doc.viewed) {
    doc.viewed = true;
    await doc.deleteOne();
  }
});

const Secret = mongoose.model("Secret", secretSchema);

module.exports = { Secret };
