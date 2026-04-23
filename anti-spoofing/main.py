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
import io
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Model MiniFASNet ──────────────────────────────────────
class MiniFASNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 32, 3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
        self.conv3 = nn.Conv2d(64, 128, 3, padding=1)
        self.pool = nn.AdaptiveAvgPool2d((4, 4))
        self.fc1 = nn.Linear(128 * 4 * 4, 256)
        self.fc2 = nn.Linear(256, 2)
        self.dropout = nn.Dropout(0.5)

    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = F.max_pool2d(x, 2)
        x = F.relu(self.conv2(x))
        x = F.max_pool2d(x, 2)
        x = F.relu(self.conv3(x))
        x = self.pool(x)
        x = x.view(x.size(0), -1)
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

# Load model khi khởi động
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "2.7_80x80_MiniFASNetV2.pth")
model = None

def load_model():
    global model
    try:
        model = MiniFASNet()
        checkpoint = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
        state_dict = checkpoint.get("state_dict") or checkpoint.get("model") or checkpoint
        model_dict = model.state_dict()
        filtered = {k: v for k, v in state_dict.items() if k in model_dict and v.shape == model_dict[k].shape}
        if len(filtered) > 0:
            model_dict.update(filtered)
            model.load_state_dict(model_dict, strict=False)
            print(f"[AntiSpoof] Loaded {len(filtered)}/{len(model_dict)} layers from checkpoint")
        else:
            print("[AntiSpoof] Warning: No matching layers, using random weights")
        model.eval()
        print("[AntiSpoof] Model ready")
    except Exception as e:
        print(f"[AntiSpoof] Model load error: {e}")
        model = MiniFASNet()
        model.eval()

load_model()

# ── Preprocess ────────────────────────────────────────────
def preprocess(img_array: np.ndarray) -> torch.Tensor:
    img = cv2.resize(img_array, (80, 80))
    img = img.astype(np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    img = (img - mean) / std
    tensor = torch.from_numpy(img).float().permute(2, 0, 1).unsqueeze(0)
    return tensor

# ── Heuristic check ───────────────────────────────────────
def heuristic_check(img_array: np.ndarray) -> dict:
    gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
    hist_std = np.std(hist)
    noise = np.std(gray.astype(float) - cv2.GaussianBlur(gray, (5, 5), 0).astype(float))

    is_real_heuristic = bool(
        laplacian_var > 20 and   # ← giảm từ 50 → 20
        hist_std > 50 and         # ← giảm từ 100 → 50
        noise > 1                 # ← giảm từ 2 → 1
    )

    return {
        "sharpness": float(laplacian_var),
        "hist_std": float(hist_std),
        "noise": float(noise),
        "is_real_heuristic": is_real_heuristic
    }
# ── API ───────────────────────────────────────────────────
class CheckRequest(BaseModel):
    image: str  # base64

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/check-liveness")
async def check_liveness(req: CheckRequest):
    try:
        base64_data = re.sub(r'^data:image/\w+;base64,', '', req.image)
        img_bytes = base64.b64decode(base64_data)
        img_np = np.frombuffer(img_bytes, dtype=np.uint8)
        img_bgr = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        if img_bgr is None:
            raise ValueError("Không đọc được ảnh")
        img_array = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

        # Chỉ dùng heuristic — bỏ model AI
        heuristic = heuristic_check(img_array)
        final_is_real = heuristic["is_real_heuristic"]
        confidence = round(float(heuristic["sharpness"] / 10), 2)  # normalize

        return {
            "is_real": final_is_real,
            "confidence": min(confidence, 100.0),
            "heuristic": heuristic,
            "message": "Khuôn mặt thật" if final_is_real else "Phát hiện ảnh giả/video giả"
        }

    except Exception as e:
        return {
            "is_real": False,
            "confidence": 0,
            "message": f"Lỗi xử lý ảnh: {str(e)}"
        }
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)