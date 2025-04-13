const dotenv = require("dotenv");

dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/secretlink",
  secretTTL: {
    0: 0, // Destroy immediately after viewing
    600: 600, // 10 minutes
    3600: 3600, // 1 hour
    86400: 86400, // 24 hours
    604800: 604800, // 7 days
  },
};

module.exports = { config };
