import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { updateProfile } from "./userService";
import AvatarUpload from "./components/AvatarUpload";
// import ProfilePage from "./components/ProfilePage";
const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.full_name || "",
    phone: user?.phone || "",
    dateOfBirth: user?.date_of_birth?.slice(0, 10) || "",
    address: user?.address || "",
    gender: user?.gender || "",
    jobTitle: user?.job_title || "",
    departmentName: user?.department_name || "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError("Họ tên không được để trống");
      return;
    }
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const data = await updateProfile(form);
      updateUser(data.user);
      setSuccess("Cập nhật thành công!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi server");
    } finally {
      setSaving(false);
    }
  };

  const input: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 14,
    boxSizing: "border-box",
    outline: "none",
  };

  const label: React.CSSProperties = {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
    display: "block",
  };

  return (
    <div style={{ maxWidth: 540, margin: "40px auto", padding: "0 16px" }}>
      <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 28 }}>
        Tài khoản của tôi
      </h2>

      {/* Avatar */}
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}
      >
        <AvatarUpload />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div>
          <label style={label}>Họ và tên *</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            style={input}
          />
        </div>

        <div>
          <label style={label}>Email</label>
          <input
            value={user?.email || ""}
            disabled
            style={{ ...input, background: "#f5f5f5", color: "#999" }}
          />
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label style={label}>Số điện thoại</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={input}
            />
          </div>
          <div>
            <label style={label}>Ngày sinh</label>
            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              style={input}
            />
          </div>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label style={label}>Giới tính</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              style={input}
            >
              <option value="">-- Chọn --</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div>
            <label style={label}>Chức vụ</label>
            <input
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              style={input}
            />
          </div>
        </div>

        <div>
          <label style={label}>Phòng ban</label>
          <input
            name="departmentName"
            value={form.departmentName}
            onChange={handleChange}
            style={input}
          />
        </div>

        <div>
          <label style={label}>Địa chỉ</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            style={input}
          />
        </div>

        {error && (
          <p style={{ color: "#e24b4a", fontSize: 13, margin: 0 }}>{error}</p>
        )}
        {success && (
          <p style={{ color: "#1D9E75", fontSize: 13, margin: 0 }}>{success}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "10px 0",
            background: saving ? "#ccc" : "#533AB7",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            cursor: saving ? "not-allowed" : "pointer",
            fontWeight: 500,
            marginTop: 4,
          }}
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
