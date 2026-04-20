import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import { User } from "./models/User.js";

dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function seedAdmin() {
  try {
    const adminUser = process.env.ADMIN_USER || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    const existingAdmin = await User.findOne({ username: adminUser });
    if (!existingAdmin) {
      await User.create({
        username: adminUser,
        password: adminPassword,
        role: "admin"
      });
      console.log("Admin user seeded to database");
    }
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
  }
}

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("MongoDB connected");
    await seedAdmin();
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error("Retrying MongoDB connection in 10 seconds...");
    setTimeout(connectDatabase, 10000);
  }
}
