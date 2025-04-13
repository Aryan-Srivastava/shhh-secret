const Secret = require("../models/Secret");
const { config } = require("../config");

exports.createSecret = async (req, res) => {
  try {
    const { encryptedSecret, ttl } = req.body;

    if (!encryptedSecret) {
      return res.status(400).json({ error: "Encrypted secret is required" });
    }

    const expiresAt = ttl ? new Date(Date.now() + ttl * 1000) : null;

    const secret = new Secret({
      encryptedSecret,
      expiresAt,
      viewed: false,
    });

    await secret.save();
    res.json({ id: secret._id });
  } catch (error) {
    console.error("Error creating secret:", error);
    res.status(500).json({ error: "Failed to create secret" });
  }
};

exports.getSecret = async (req, res) => {
  const session = await Secret.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const secret = await Secret.findOne({ _id: id, viewed: false }).session(
      session
    );

    if (!secret) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "Secret not found or already viewed" });
    }

    if (secret.expiresAt && secret.expiresAt < new Date()) {
      await Secret.deleteOne({ _id: id }).session(session);
      await session.commitTransaction();
      return res.status(404).json({ error: "Secret has expired" });
    }

    // Mark as viewed and save before sending the response
    secret.viewed = true;
    await secret.save({ session });

    // Only delete if it's meant to be destroyed immediately
    if (!secret.expiresAt) {
      await Secret.deleteOne({ _id: id }).session(session);
    }

    await session.commitTransaction();
    res.json({ encryptedSecret: secret.encryptedSecret });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error retrieving secret:", error);
    res.status(500).json({ error: "Failed to retrieve secret" });
  } finally {
    session.endSession();
  }
};
