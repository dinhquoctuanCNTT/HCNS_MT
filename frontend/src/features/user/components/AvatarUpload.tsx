import { useRef, useState } from "react";
import { useAuthStore } from "../../auth/auth.store";
import { uploadAvatar } from "../userService";

const AvatarUpload = () => {
  const { user, token, setAuth } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(
    user?.avatar_url ? `${user.avatar_url}` : "/default-avatar.png",
  );
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      setUploading(true);
      const data = await uploadAvatar(file);
      setAuth(token, { ...user!, avatar_url: data.avatarUrl });
      setPreview(`${data.avatarUrl}`);
    } catch {
      alert("Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{ position: "relative", width: 96, height: 96, cursor: "pointer" }}
      onClick={() => fileRef.current?.click()}
    >
      <img
        src={preview}
        alt="avatar"
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #e0e0e0",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity 0.2s",
          color: "#fff",
          fontSize: 12,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.opacity = uploading ? "1" : "0")
        }
      >
        {uploading ? "Đang tải..." : "Đổi ảnh"}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarUpload;
