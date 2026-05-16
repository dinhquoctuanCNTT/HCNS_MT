import { connectDB, getPool } from "./src/config/db.js";
import { getDashboardStats } from "./src/modules/dashboard/dashboard.service.js";

async function run() {
  try {
    await connectDB();
    const stats = await getDashboardStats("2026-05-08");
    console.log("Success:", stats);
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    process.exit(0);
  }
}

run();
