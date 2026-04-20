import express from "express";
import cors from "cors";
import morgan from "morgan";

import incidentsRouter from "./routes/incidents.js";
import predictRouter from "./routes/predict.js";
import authRouter from "./routes/auth.js";
import policeStationsRouter from "./routes/policeStations.js";
import alertsRouter from "./routes/alerts.js";
import usersRouter from "./routes/users.js";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "backend" });
});

app.use("/api/auth", authRouter);
app.use("/api/incidents", incidentsRouter);
app.use("/api/predict-risk", predictRouter);
app.use("/api/police-stations", policeStationsRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/users", usersRouter);



app.use((err, _req, res, _next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    details: err.response?.data || null
  });
});

export default app;
