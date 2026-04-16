import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startOverdueJob } from "./jobs/overdue.job.js"; // ✅ thêm dòng này

dotenv.config();

const port = Number(process.env.PORT || 3002);

const startServer = async () => {
  try {
    await connectDB();

    startOverdueJob(); // ✅ giờ sẽ không báo lỗi nữa

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Cannot start server:", error.message);
  }
};

startServer();
