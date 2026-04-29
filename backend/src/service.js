import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startOverdueJob } from "./jobs/overdue.job.js";

dotenv.config();

const PORT = Number(process.env.PORT || 3001);
const HOST = "0.0.0.0"; // ← nhận kết nối từ mọi IP (điện thoại, LAN...)

const startServer = async () => {
  try {
    await connectDB();
    startOverdueJob();

    app.listen(PORT, HOST, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
      console.log(`LAN access:          http://10.10.0.36:${PORT}`);
    });
  } catch (error) {
    console.error("Cannot start server:", error.message);
  }
};

startServer();
