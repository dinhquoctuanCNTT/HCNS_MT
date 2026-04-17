// face.service.js — đổi require → import, module.exports → export
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const canvas = require("canvas"); // canvas chưa hỗ trợ ESM
const faceapi = require("face-api.js"); // face-api.js cũng vậy

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODELS_PATH = path.join(__dirname, "../../models");
let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return;
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH),
    faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH),
    faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH),
  ]);
  modelsLoaded = true;
  console.log("[FaceService] Models loaded successfully");
}

export async function extractDescriptor(image) {
  await loadModels();
  let img;
  if (Buffer.isBuffer(image)) {
    img = await canvas.loadImage(image);
  } else if (typeof image === "string") {
    img = await canvas.loadImage(image);
  } else {
    throw new Error("image phải là Buffer hoặc đường dẫn file");
  }
  const detection = await faceapi
    .detectSingleFace(
      img,
      new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }),
    )
    .withFaceLandmarks()
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
