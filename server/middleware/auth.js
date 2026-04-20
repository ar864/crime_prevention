import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing or invalid auth token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "replace-this-secret");
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired auth token" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  return next();
}
