import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import { updateProfile } from "./userService";
import AvatarUpload from "./components/AvatarUpload";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

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
  const [activeTab, setActiveTab] = useState<"info" | "security" | "notify">(
    "info",
  );

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
      setSuccess("Thông tin đã được cập nhật thành công");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi server");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="pf-page">
      {/* ── Top bar ── */}
      <div className="pf-topbar">
        <button className="pf-back-btn" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Quay về
        </button>
        <div className="pf-topbar-breadcrumb">
          <span className="pf-topbar-sep">/</span>
          <span className="pf-topbar-title">Hồ sơ cá nhân</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="pf-body">
        {/* ── Sidebar ── */}
        <aside className="pf-sidebar">
          {/* Avatar card */}
          <div className="pf-side-card">
            <div className="pf-avatar-area">
              <div className="pf-avatar-wrap">
                <AvatarUpload />
              </div>
              <div className="pf-av-name">
                {form.fullName || "Chưa cập nhật"}
              </div>
              <div className="pf-av-email">{user?.email || ""}</div>
              {(form.jobTitle || form.departmentName) && (
                <div className="pf-av-tags">
                  {form.jobTitle && (
                    <span className="pf-tag pf-tag-job">{form.jobTitle}</span>
                  )}
                  {form.departmentName && (
                    <span className="pf-tag pf-tag-dept">
                      {form.departmentName}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Nav */}
            <nav className="pf-side-nav">
              <button
                className={`pf-nav-item ${activeTab === "info" ? "active" : ""}`}
                onClick={() => setActiveTab("info")}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle
                    cx="7"
                    cy="4.5"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M2 12c0-2.761 2.239-5 5-5s5 2.239 5 5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                Thông tin cá nhân
              </button>
              <button
                className={`pf-nav-item ${activeTab === "security" ? "active" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect
                    x="3"
                    y="6"
                    width="8"
                    height="6"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M5 6V4.5a2 2 0 014 0V6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                Bảo mật
              </button>
              <button
                className={`pf-nav-item ${activeTab === "notify" ? "active" : ""}`}
                onClick={() => setActiveTab("notify")}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1.5A4 4 0 003 5.5v2.5L2 9.5h10l-1-1.5V5.5A4 4 0 007 1.5z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 9.5a1.5 1.5 0 003 0"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                Thông báo
              </button>
            </nav>
          </div>

          {/* Stats mini card */}
          <div className="pf-stats-card">
            <div className="pf-stats-heading">Hoạt động</div>
            <div className="pf-stats-row">
              <div className="pf-stat">
                <div className="pf-stat-lbl">Nhiệm vụ</div>
                <div className="pf-stat-val">12</div>
              </div>
              <div className="pf-stat">
                <div className="pf-stat-lbl">Hoàn thành</div>
                <div className="pf-stat-val">9</div>
              </div>
            </div>
            <div className="pf-badge-ok">Đang hoạt động</div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="pf-main">
          {/* Feedback banners */}
          {success && (
            <div className="pf-feedback pf-feedback-success">
              <span className="pf-feedback-dot" />
              {success}
            </div>
          )}
          {error && (
            <div className="pf-feedback pf-feedback-error">
              <span className="pf-feedback-dot" />
              {error}
            </div>
          )}

          {activeTab === "info" && (
            <form onSubmit={handleSubmit}>
              {/* Basic info */}
              <div className="pf-card">
                <div className="pf-card-head">
                  <span className="pf-card-title">Thông tin cơ bản</span>
                  <span className="pf-card-hint">
                    Trường có dấu <span className="pf-req">*</span> là bắt buộc
                  </span>
                </div>
                <div className="pf-grid">
                  <div className="pf-field span-2">
                    <label>
                      Họ và tên <span className="pf-req">*</span>
                    </label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div className="pf-field">
                    <label>Email</label>
                    <input value={user?.email || ""} disabled placeholder="—" />
                  </div>
                  <div className="pf-field">
                    <label>Số điện thoại</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="pf-field">
                    <label>Ngày sinh</label>
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="pf-field">
                    <label>Giới tính</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <option value="">-- Chọn --</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="pf-field span-2">
                    <label>Địa chỉ</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                </div>
              </div>

              {/* Work info */}
              <div className="pf-card">
                <div className="pf-card-head">
                  <span className="pf-card-title">Thông tin công việc</span>
                </div>
                <div className="pf-grid">
                  <div className="pf-field">
                    <label>Chức vụ</label>
                    <input
                      name="jobTitle"
                      value={form.jobTitle}
                      onChange={handleChange}
                      placeholder="Nhập chức vụ"
                    />
                  </div>
                  <div className="pf-field">
                    <label>Phòng ban</label>
                    <input
                      name="departmentName"
                      value={form.departmentName}
                      onChange={handleChange}
                      placeholder="Nhập phòng ban"
                    />
                  </div>
                </div>

                <hr className="pf-divider" />

                <div className="pf-action-bar">
                  <span className="pf-action-hint">
                    Thay đổi sẽ được lưu sau khi nhấn nút bên dưới
                  </span>
                  <button
                    type="button"
                    className="pf-btn-cancel"
                    onClick={() => navigate(-1)}
                  >
                    Huỷ
                  </button>
                  <button
                    type="submit"
                    className="pf-btn-save"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="pf-spinner" />
                        Đang lưu...
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <div className="pf-card pf-placeholder-card">
              <p>Tính năng bảo mật đang được phát triển.</p>
            </div>
          )}

          {activeTab === "notify" && (
            <div className="pf-card pf-placeholder-card">
              <p>Cài đặt thông báo đang được phát triển.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
