import { Router } from "express";
import { Incident } from "../models/Incident.js";

import { requireAuth } from "../middleware/auth.js";
import { emitAlert } from "../services/alerts.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 }).limit(100);
    res.json(incidents);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const incident = await Incident.create(req.body);
    emitAlert({
      type: "incident",
      title: "New Incident Reported",
      message: `${incident.title} in ${incident.location?.area || "unknown area"}`,
      level: Number(incident.severity) >= 4 ? "high" : "medium",
      payload: incident
    });
    res.status(201).json(incident);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Incident.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Incident not found" });
    }

    emitAlert({
      type: "incident",
      title: "Incident Deleted",
      message: `${deleted.title} was deleted`,
      level: "info",
      payload: deleted
    });

    return res.json({ message: "Incident deleted", incident: deleted });
  } catch (error) {
    next(error);
  }
});

export default router;
