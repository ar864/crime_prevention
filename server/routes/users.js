import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToDelete.username === req.user.username) {
      return res.status(403).json({ message: "Cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
