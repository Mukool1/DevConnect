import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const DB_URI = process.env.DB_URI;
    if (!DB_URI) {
      throw new Error("DB_URI environment variable is missing!");
    }

    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to Database:", err.message);
    process.exit(1);
  }
};

export default connectDB;
