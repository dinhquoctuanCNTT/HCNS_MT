import { loadModels } from "./src/services/face.service.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(
  "Models path sẽ là:",
  path.join(__dirname, "src/services/../../models"),
);

async function test() {
  try {
    console.log("Đang load models...");
    await loadModels();
    console.log("✅ Load models thành công!");
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
  }
}

test();
