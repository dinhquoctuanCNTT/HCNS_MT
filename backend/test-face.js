import {
  extractDescriptor,
  compareFaces,
} from "./src/services/face.service.js";

async function test() {
  try {
    console.log("🔄 Đang load models...");

    const descriptor1 = await extractDescriptor("E:/anh1.jpg");
    console.log("✅ Ảnh 1 - descriptor OK, độ dài:", descriptor1.length);

    const descriptor2 = await extractDescriptor("E:/anh2.jpg");
    console.log("✅ Ảnh 2 - descriptor OK, độ dài:", descriptor2.length);

    const result = compareFaces(descriptor1, descriptor2);
    console.log("\n📊 Kết quả so sánh:");
    console.log("  Khoảng cách:", result.distance);
    console.log("  Cùng người:", result.isSamePerson ? "✅ CÓ" : "❌ KHÔNG");
    console.log("  Độ tin cậy:", result.confidence + "%");
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
  }
}

test();
