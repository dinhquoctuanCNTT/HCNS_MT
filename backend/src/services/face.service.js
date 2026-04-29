import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const canvas = require("canvas");
const faceapi = require("face-api.js");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODELS_PATH = path.join(__dirname, "../../models");
let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return;
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromDisk(MODELS_PATH), // đổi: nhẹ hơn 5x
    faceapi.nets.faceLandmark68TinyNet.loadFromDisk(MODELS_PATH), // đổi: tiny version
    faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH), // giữ nguyên
  ]);
  modelsLoaded = true;
  console.log("[FaceService] Models loaded successfully");
}
// ✅ Resize + convert sang jpeg để giảm kích thước xử lý
async function toJpegBuffer(buffer) {
  try {
    return await sharp(buffer)
      .resize(640, 640, { fit: "inside" }) // ← resize về 640px
      .jpeg({ quality: 85 }) // ← convert sang jpeg
      .toBuffer();
  } catch (e) {
    return buffer; // fallback nếu sharp lỗi
  }
}

export async function extractDescriptor(image) {
  await loadModels();
  let img;
  if (Buffer.isBuffer(image)) {
    const jpegBuffer = await toJpegBuffer(image);
    img = await canvas.loadImage(jpegBuffer);
  } else if (typeof image === "string") {
    img = await canvas.loadImage(image);
  } else {
    throw new Error("image phải là Buffer hoặc đường dẫn file");
  }
  const detection = await faceapi
    .detectSingleFace(
      img,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }),
    )
    .withFaceLandmarks(true)
    .withFaceDescriptor();
  if (!detection) throw new Error("Không phát hiện được khuôn mặt trong ảnh");
  return detection.descriptor;
}

export async function extractDescriptorFromBase64(base64String) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  return extractDescriptor(buffer);
}

export function compareFaces(descriptor1, descriptor2, threshold = 0.6) {
  if (!descriptor1 || !descriptor2)
    throw new Error("Cả hai descriptor đều phải có giá trị");
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  const confidence = Math.max(0, Math.round((1 - distance / threshold) * 100));
  return {
    distance: parseFloat(distance.toFixed(4)),
    isSamePerson: distance < threshold,
    confidence,
  };
}
