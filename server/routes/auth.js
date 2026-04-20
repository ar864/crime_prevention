import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/User.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const created = await User.create({ username, password });
    return res.status(201).json({ 
      message: "User registered", 
      user: { username: created.username, role: created.role, createdAt: created.createdAt } 
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET || "replace-this-secret", {
      expiresIn: "8h"
    });

    return res.json({ 
      token, 
      user: { username: user.username, role: user.role } 
    });
  } catch (error) {
    next(error);
  }
});

export default router;
