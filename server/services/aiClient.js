import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function predictRisk(input) {
  const response = await axios.post(`${process.env.AI_SERVICE_URL || "http://127.0.0.1:8000"}/predict`, input, {
    timeout: 5000
  });

  return response.data;
}
