// src/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  const uri =
    process.env.MONGO_URI ||
    "mongodb+srv://anilssajjanshetty_db_user:jPf2T7UGKRbyO4Wc@cluster0.fumr6hy.mongodb.net/student_management?retryWrites=true&w=majority&appName=Cluster0";

  if (!uri) {
    console.error("❌ MONGO_URI missing from environment variables");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
