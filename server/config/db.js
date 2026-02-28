const mongoose = require("mongoose");

/**
 * Connect to MongoDB using the MONGO_URI from environment variables.
 * Mongoose 7+ uses the new connection string parser and unified topology by default,
 * so no need for useNewUrlParser or useUnifiedTopology options.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit with failure — app cannot run without DB
  }
};

module.exports = connectDB;
