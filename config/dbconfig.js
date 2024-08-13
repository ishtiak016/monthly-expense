const mongoose = require("mongoose");

const mongoDbAtlasUrl = "mongodb://localhost:27017/expense-calculate";

const connectDb = async (options = {}) => {
  try {
    if (!mongoDbAtlasUrl) {
      throw new Error("MONGODB_ATLAS_URL is not set in environment variables.");
    }
    await mongoose.connect(mongoDbAtlasUrl, options);
    console.log("MongoDB connected successfully");
    mongoose.connection.on("error", (error) => {
      console.error("DB connection error", error);
    });
  } catch (error) {
    console.error("Could not connect to DB", error);
  }
};

module.exports = connectDb;
