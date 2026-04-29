from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import re
import numpy as np
import cv2
import torch
import torch.nn as nn
import torch.nn.functional as F
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Model MiniFASNet ──────────────────────────────────────────────────────────
class MiniFASNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 32, 3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
        self.conv3 = nn.Conv2d(64, 128, 3, padding=1)
        self.pool  = nn.AdaptiveAvgPool2d((4, 4))
        self.fc1   = nn.Linear(128 * 4 * 4, 256)
        self.fc2   = nn.Linear(256, 2)
        self.dropout = nn.Dropout(0.5)

    def forward(self, x):
        x = F.relu(self.conv1(x)); x = F.max_pool2d(x, 2)
        x = F.relu(self.conv2(x)); x = F.max_pool2d(x, 2)
        x = F.relu(self.conv3(x)); x = self.pool(x)
        x = x.view(x.size(0), -1)
        x = F.relu(self.fc1(x)); x = self.dropout(x)
        return self.fc2(x)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "2.7_80x80_MiniFASNetV2.pth")
model = None

def load_model():
    global model
    try:
        model = MiniFASNet()
        checkpoint  = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
        state_dict  = checkpoint.get("state_dict") or checkpoint.get("model") or checkpoint
        model_dict  = model.state_dict()
        filtered    = {k: v for k, v in state_dict.items()
                       if k in model_dict and v.shape == model_dict[k].shape}
        if filtered:
            model_dict.update(filtered)
            model.load_state_dict(model_dict, strict=False)
            print(f"[AntiSpoof] Loaded {len(filtered)}/{len(model_dict)} layers")
        else:
            print("[AntiSpoof] Warning: No matching layers, using random weights")
        model.eval()
        print("[AntiSpoof] Model ready")
    except Exception as e:
        print(f"[AntiSpoof] Model load error: {e}")
        model = MiniFASNet(); model.eval()

load_model()

# ── Heuristic liveness check ──────────────────────────────────────────────────
def heuristic_check(img_array: np.ndarray) -> dict:
    gray          = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    hist_std      = float(np.std(cv2.calcHist([gray], [0], None, [256], [0, 256])))
    noise         = float(np.std(
        gray.astype(float) - cv2.GaussianBlur(gray, (5, 5), 0).astype(float)
    ))
    is_real = bool(laplacian_var > 20 and hist_std > 50 and noise > 1)
    return {
        "sharpness":         float(laplacian_var),
        "hist_std":          hist_std,
        "noise":             noise,
        "is_real_heuristic": is_real,
    }

# ── Clothing detection ────────────────────────────────────────────────────────
# Phương pháp: dùng OpenCV face detector để tìm khuôn mặt,
# sau đó crop vùng ảnh nằm DƯỚI khuôn mặt (vùng ngực/áo),
# rồi phân tích màu chủ đạo trong vùng đó bằng HSV color range.

# Load Haar Cascade face detector (có sẵn trong OpenCV, không cần download thêm)
FACE_CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
face_cascade = cv2.CascadeClassifier(FACE_CASCADE_PATH)

def detect_clothing(img_rgb: np.ndarray) -> dict:
    """
    1. Detect khuôn mặt bằng Haar Cascade
    2. Crop vùng phía dưới khuôn mặt (vùng áo)
    3. Phân tích màu HSV để xác định loại áo
    """
    h, w = img_rgb.shape[:2]
    img_bgr  = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    gray     = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    # ── Bước 1: Detect khuôn mặt ────────────────────────────────────────────
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=4,
        minSize=(60, 60),
    )

    if len(faces) == 0:
        # Không tìm thấy mặt → dùng phần dưới cùng ảnh làm fallback
        clothing_region = img_rgb[int(h * 0.55):h, int(w * 0.1):int(w * 0.9)]
    else:
        # Lấy khuôn mặt lớn nhất
        fx, fy, fw, fh = max(faces, key=lambda r: r[2] * r[3])

        # Vùng áo = ngay dưới cằm, chiều cao ≈ 1.5× chiều cao khuôn mặt
        y_start = fy + fh                          # đáy khuôn mặt
        y_end   = min(y_start + int(fh * 1.5), h)  # xuống 1.5× chiều cao mặt
        x_start = max(fx - int(fw * 0.3), 0)
        x_end   = min(fx + fw + int(fw * 0.3), w)

        if y_end <= y_start or x_end <= x_start:
            clothing_region = img_rgb[int(h * 0.55):h, :]
        else:
            clothing_region = img_rgb[y_start:y_end, x_start:x_end]

    if clothing_region.size == 0:
        return {"clothing_type": "unknown", "clothing_confidence": 0.0}

    # ── Bước 2: Phân tích màu HSV ────────────────────────────────────────────
    hsv = cv2.cvtColor(
        cv2.cvtColor(clothing_region, cv2.COLOR_RGB2BGR),
        cv2.COLOR_BGR2HSV,
    )
    total_pixels = hsv.shape[0] * hsv.shape[1]

    # Định nghĩa dải màu HSV cho từng loại áo
    # (lower_hsv, upper_hsv, label)
    color_ranges = [
        # Áo xanh dương / navy blue
        (np.array([100, 50,  30]),  np.array([130, 255, 255]), "blue_shirt"),
        # Áo xanh lá cây
        (np.array([40,  50,  50]),  np.array([90,  255, 255]), "green_shirt"),
        # Áo đỏ (2 dải vì đỏ bao quanh H=0/180)
        (np.array([0,   80,  50]),  np.array([10,  255, 255]), "red_shirt"),
        (np.array([165, 80,  50]),  np.array([180, 255, 255]), "red_shirt"),
        # Áo trắng
        (np.array([0,   0,   180]), np.array([180, 40,  255]), "white_shirt"),
        # Áo đen
        (np.array([0,   0,   0]),   np.array([180, 255, 60]),  "black_shirt"),
        # Áo vàng / cam
        (np.array([10,  80,  80]),  np.array([40,  255, 255]), "yellow_shirt"),
    ]

    scores: dict[str, float] = {}
    for lower, upper, label in color_ranges:
        mask       = cv2.inRange(hsv, lower, upper)
        pixel_count = int(np.sum(mask > 0))
        ratio       = pixel_count / total_pixels
        # Tích lũy vì red_shirt có 2 dải
        scores[label] = scores.get(label, 0.0) + ratio

    if not scores:
        return {"clothing_type": "unknown", "clothing_confidence": 0.0}

    best_label      = max(scores, key=scores.__getitem__)
    best_confidence = round(scores[best_label], 4)

    # Ngưỡng tối thiểu 8% — nếu không có màu nào đủ rõ → unknown
    if best_confidence < 0.08:
        return {"clothing_type": "unknown", "clothing_confidence": round(best_confidence, 4)}

    return {
        "clothing_type":       best_label,
        "clothing_confidence": best_confidence,
        "all_scores":          {k: round(v, 4) for k, v in scores.items()},  # debug
    }

# ── API Schema ────────────────────────────────────────────────────────────────
class CheckRequest(BaseModel):
    image: str  # base64

# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/check-liveness")
async def check_liveness(req: CheckRequest):
    """
    Kiểm tra liveness + nhận diện đồng phục.
    Response:
    {
        "is_real": true,
        "confidence": 0.98,
        "clothing_type": "blue_shirt",
        "clothing_confidence": 0.85,
        "message": "..."
    }
    """
    try:
        # Decode base64 → numpy array
        base64_data = re.sub(r'^data:image/\w+;base64,', '', req.image)
        img_bytes   = base64.b64decode(base64_data)
        img_np      = np.frombuffer(img_bytes, dtype=np.uint8)
        img_bgr     = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        if img_bgr is None:
            raise ValueError("Không đọc được ảnh")
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

        # ── 1. Liveness check (heuristic) ─────────────────────────────────
        heuristic      = heuristic_check(img_rgb)
        final_is_real  = heuristic["is_real_heuristic"]
        liveness_conf  = round(min(float(heuristic["sharpness"] / 10), 100.0), 2)

        # ── 2. Clothing detection ──────────────────────────────────────────
        clothing = detect_clothing(img_rgb)

        return {
            "is_real":             final_is_real,
            "confidence":          liveness_conf,
            "clothing_type":       clothing["clothing_type"],
            "clothing_confidence": clothing["clothing_confidence"],
            "heuristic":           heuristic,
            "message":             "Khuôn mặt thật" if final_is_real else "Phát hiện ảnh giả/video giả",
        }

    except Exception as e:
        return {
            "is_real":             False,
            "confidence":          0,
            "clothing_type":       "unknown",
            "clothing_confidence": 0.0,
            "message":             f"Lỗi xử lý ảnh: {str(e)}",
        }

# ── Endpoint riêng để test đồng phục (không cần liveness) ─────────────────────
@app.post("/check-uniform")
async def check_uniform(req: CheckRequest):
    """
    Chỉ nhận diện đồng phục, không kiểm tra liveness.
    Dùng để test riêng.
    """
    try:
        base64_data = re.sub(r'^data:image/\w+;base64,', '', req.image)
        img_bytes   = base64.b64decode(base64_data)
        img_np      = np.frombuffer(img_bytes, dtype=np.uint8)
        img_bgr     = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        if img_bgr is None:
            raise ValueError("Không đọc được ảnh")
        img_rgb  = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        clothing = detect_clothing(img_rgb)
        return {
            "has_uniform":         clothing["clothing_type"] != "unknown",
            "clothing_type":       clothing["clothing_type"],
            "clothing_confidence": clothing["clothing_confidence"],
            "all_scores":          clothing.get("all_scores", {}),
        }
    except Exception as e:
        return {
            "has_uniform":         False,
            "clothing_type":       "unknown",
            "clothing_confidence": 0.0,
            "message":             str(e),
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)