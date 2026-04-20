import app from "./app.js";
import { connectDatabase } from "./db.js";
import dotenv from "dotenv";
dotenv.config();


async function start() {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });

  await connectDatabase();
}

start();
