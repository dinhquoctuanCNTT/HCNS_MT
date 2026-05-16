import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import {
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
  getMyTickets,
  createSupportTicket,
  getQrCode,
} from "./userService";
import AvatarUpload from "./components/AvatarUpload";
import "./ProfilePage.css";

type TabKey = "info" | "address" | "security" | "notify" | "support";

interface Settings {
  notify_email: boolean;
  notify_push: boolean;
  language: string;
  theme: string;
}

interface Ticket {
  id: number;
  title: string;
  content: string;
  status: "open" | "pending" | "resolved" | "closed";
  admin_reply: string | null;
  created_at: string;
}

function StatusTicketBadge({ status }: { status: Ticket["status"] }) {
  const map = {
    open: { label: "Chờ xử lý", cls: "pf-ticket-badge--open" },
    pending: { label: "Đang xử lý", cls: "pf-ticket-badge--pending" },
    resolved: { label: "Đã giải quyết", cls: "pf-ticket-badge--resolved" },
    closed: { label: "Đã đóng", cls: "pf-ticket-badge--closed" },
  };
  const s = map[status] || map.open;
  return <span className={`pf-ticket-badge ${s.cls}`}>{s.label}</span>;
}

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // ── Form state ─────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    fullName: user?.full_name || "",
    phone: user?.phone || "",
    dateOfBirth: user?.date_of_birth?.slice(0, 10) || "",
    address: user?.address || "",
    gender: user?.gender || "",
    jobTitle: user?.job_title || "",
    departmentName: user?.department_name || "",
    // Mới
    national_id: user?.national_id || "",
    country: user?.country || "",
    city: user?.city || "",
    ward: user?.ward || "",
    alley: user?.alley || "",
    house_number: user?.house_number || "",
  });

  // ── Password state ─────────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // ── Settings state ─────────────────────────────────────────────────────────
  const [settings, setSettings] = useState<Settings>({
    notify_email: true,
    notify_push: true,
    language: "vi",
    theme: "light",
  });

  // ── Support state ──────────────────────────────────────────────────────────
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketForm, setTicketForm] = useState({ title: "", content: "" });
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [qrCode, setQrCode] = useState("");

  // ── UI state ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ── Load settings + tickets + qr ──────────────────────────────────────────
  useEffect(() => {
    getSettings()
      .then((r) => r.settings && setSettings(r.settings))
      .catch(() => {});
    getMyTickets()
      .then((r) => setTickets(r.tickets || []))
      .catch(() => {});
    getQrCode()
      .then((r) => r.qr_code && setQrCode(r.qr_code))
      .catch(() => {});
  }, []);

  const showFeedback = (type: "success" | "error", msg: string) => {
    if (type === "success") {
      setSuccess(msg);
      setError("");
    } else {
      setError(msg);
      setSuccess("");
    }
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 4000);
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      showFeedback("error", "Họ tên không được để trống");
      return;
    }
    try {
      setSaving(true);
      const data = await updateProfile(form);
      updateUser(data.user);
      showFeedback("success", "Thông tin đã được cập nhật thành công");
    } catch (err: any) {
      showFeedback("error", err.response?.data?.message || "Lỗi server");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = await updateProfile(form);
      updateUser(data.user);
      showFeedback("success", "Địa chỉ đã được cập nhật thành công");
    } catch (err: any) {
      showFeedback("error", err.response?.data?.message || "Lỗi server");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwForm.current_password || !pwForm.new_password) {
      showFeedback("error", "Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (pwForm.new_password !== pwForm.confirm_password) {
      showFeedback("error", "Mật khẩu mới không khớp");
      return;
    }
    if (pwForm.new_password.length < 6) {
      showFeedback("error", "Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    try {
      setSaving(true);
      await changePassword({
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      setPwForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      showFeedback("success", "Đổi mật khẩu thành công");
    } catch (err: any) {
      showFeedback("error", err.response?.data?.message || "Lỗi server");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateSettings(settings);
      showFeedback("success", "Cài đặt đã được lưu");
    } catch {
      showFeedback("error", "Lỗi khi lưu cài đặt");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.content) {
      showFeedback("error", "Vui lòng nhập tiêu đề và nội dung");
      return;
    }
    try {
      setSaving(true);
      await createSupportTicket(ticketForm);
      setTicketForm({ title: "", content: "" });
      setShowTicketForm(false);
      const r = await getMyTickets();
      setTickets(r.tickets || []);
      showFeedback("success", "Đã gửi yêu cầu hỗ trợ thành công");
    } catch {
      showFeedback("error", "Lỗi khi gửi yêu cầu");
    } finally {
      setSaving(false);
    }
  };

  // ── Tab config ─────────────────────────────────────────────────────────────
  const TABS: { key: TabKey; icon: React.ReactNode; label: string }[] = [
    {
      key: "info",
      label: "Thông tin cơ bản",
      icon: (
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
      ),
    },
    {
      key: "address",
      label: "Địa chỉ & CCCD",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      ),
    },
    {
      key: "security",
      label: "Bảo mật",
      icon: (
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
      ),
    },
    {
      key: "notify",
      label: "Thông báo & Cài đặt",
      icon: (
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
      ),
    },
    {
      key: "support",
      label: "Hỗ trợ",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
    },
  ];

  const ActionBar = ({
    onCancel,
    label = "Lưu thay đổi",
  }: {
    onCancel?: () => void;
    label?: string;
  }) => (
    <>
      <hr className="pf-divider" />
      <div className="pf-action-bar">
        <span className="pf-action-hint">
          Thay đổi sẽ được lưu sau khi nhấn nút bên dưới
        </span>
        <button
          type="button"
          className="pf-btn-cancel"
          onClick={onCancel || (() => navigate(-1))}
        >
          Huỷ
        </button>
        <button type="submit" className="pf-btn-save" disabled={saving}>
          {saving ? (
            <>
              <span className="pf-spinner" />
              Đang lưu...
            </>
          ) : (
            label
          )}
        </button>
      </div>
    </>
  );

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

            <nav className="pf-side-nav">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`pf-nav-item ${activeTab === t.key ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(t.key);
                    setSuccess("");
                    setError("");
                  }}
                >
                  {t.icon}
                  {t.label}
                  {t.key === "support" &&
                    tickets.filter((tk) => tk.status === "open").length > 0 && (
                      <span className="pf-nav-dot" />
                    )}
                </button>
              ))}
            </nav>
          </div>

          {/* QR card */}
          {qrCode && (
            <div className="pf-qr-card">
              <div className="pf-qr-label">Mã QR của bạn</div>
              <div className="pf-qr-value">{qrCode}</div>
              <div className="pf-qr-hint">Dùng để chấm công</div>
            </div>
          )}

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

        {/* ── Main ── */}
        <main className="pf-main">
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

          {/* ── Tab: Thông tin cơ bản ── */}
          {activeTab === "info" && (
            <form onSubmit={handleSubmitInfo}>
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
                </div>
              </div>

              <div className="pf-card">
                <div className="pf-card-head">
                  <span className="pf-card-title">Thông tin công việc</span>
                </div>
                <div className="pf-grid">
                  <div className="pf-field">
                    <label>Mã nhân viên</label>
                    <input
                      value={user?.employee_code || ""}
                      disabled
                      placeholder="—"
                    />
                  </div>
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
                  <div className="pf-field">
                    <label>Vai trò</label>
                    <input value={user?.role || ""} disabled placeholder="—" />
                  </div>
                </div>
                <ActionBar />
              </div>
            </form>
          )}

          {/* ── Tab: Địa chỉ & CCCD ── */}
          {activeTab === "address" && (
            <form onSubmit={handleSubmitAddress}>
              <div className="pf-card">
                <div className="pf-card-head">
                  <span className="pf-card-title">Giấy tờ tùy thân</span>
                </div>
                <div className="pf-grid">
                  <div className="pf-field">
                    <label>Số CCCD</label>
                    <input
                      name="national_id"
                      value={form.national_id}
                      onChange={handleChange}
                      placeholder="Nhập số CCCD"
                    />
                  </div>
                  <div className="pf-field">
                    <label>Tên tài khoản</label>
                    <input
                      name="username"
                      value={(form as any).username || ""}
                      onChange={handleChange}
                      placeholder="Nhập tên tài khoản"
                    />
                  </div>
                </div>
              </div>

              <div className="pf-card">
                <div className="pf-card-head">
                  <span className="pf-card-title">Địa chỉ chi tiết</span>
                </div>
                <div className="pf-grid">
                  <div className="pf-field">
                    <label>Quốc gia</label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Việt Nam"
                    />
                  </div>
                  <div className="pf-field">
                    <label>Thành phố / Tỉnh</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Hà Nội"
                    />
                  </div>
                  <div className="pf-field">
                    <label>Phường / Xã</label>
                    <input
                      name="ward"
                      value={form.ward}
                      onChange={handleChange}
                      placeholder="Phường..."
                    />
                  </div>
                  <div className="pf-field">
                    <label>Ngõ / Hẻm</label>
                    <input
                      name="alley"
                      value={form.alley}
                      onChange={handleChange}
                      placeholder="Ngõ..."
                    />
                  </div>
                  <div className="pf-field">
                    <label>Số nhà</label>
                    <input
                      name="house_number"
                      value={form.house_number}
                      onChange={handleChange}
                      placeholder="Số nhà..."
                    />
                  </div>
                  <div className="pf-field">
                    <label>Địa chỉ đầy đủ (cũ)</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Địa chỉ..."
                    />
                  </div>
                </div>
                <ActionBar label="Lưu địa chỉ" />
              </div>
            </form>
          )}

          {/* ── Tab: Bảo mật ── */}
          {activeTab === "security" && (
            <form onSubmit={handleChangePassword}>
              <div className="pf-card">
                <div className="pf-card-head">
                  <span className="pf-card-title">Đổi mật khẩu</span>
                </div>
                <div className="pf-grid" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="pf-field">
                    <label>Mật khẩu hiện tại</label>
                    <div className="pf-pw-wrap">
                      <input
                        type={showPw.current ? "text" : "password"}
                        value={pwForm.current_password}
                        onChange={(e) =>
                          setPwForm((p) => ({
                            ...p,
                            current_password: e.target.value,
                          }))
                        }
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button
                        type="button"
                        className="pf-pw-eye"
                        onClick={() =>
                          setShowPw((p) => ({ ...p, current: !p.current }))
                        }
                      >
                        {showPw.current ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                  <div className="pf-field">
                    <label>Mật khẩu mới</label>
                    <div className="pf-pw-wrap">
                      <input
                        type={showPw.new ? "text" : "password"}
                        value={pwForm.new_password}
                        onChange={(e) =>
                          setPwForm((p) => ({
                            ...p,
                            new_password: e.target.value,
                          }))
                        }
                        placeholder="Ít nhất 6 ký tự"
                      />
                      <button
                        type="button"
                        className="pf-pw-eye"
                        onClick={() =>
                          setShowPw((p) => ({ ...p, new: !p.new }))
                        }
                      >
                        {showPw.new ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                  <div className="pf-field">
                    <label>Xác nhận mật khẩu mới</label>
                    <div className="pf-pw-wrap">
                      <input
                        type={showPw.confirm ? "text" : "password"}
                        value={pwForm.confirm_password}
                        onChange={(e) =>
                          setPwForm((p) => ({
                            ...p,
                            confirm_password: e.target.value,
                          }))
                        }
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        className="pf-pw-eye"
                        onClick={() =>
                          setShowPw((p) => ({ ...p, confirm: !p.confirm }))
                        }
                      >
                        {showPw.confirm ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Strength indicator */}
                {pwForm.new_password && (
                  <div className="pf-pw-strength">
                    <div
                      className={`pf-pw-bar ${pwForm.new_password.length >= 12 ? "strong" : pwForm.new_password.length >= 8 ? "medium" : "weak"}`}
                    />
                    <span className="pf-pw-strength-label">
                      {pwForm.new_password.length >= 12
                        ? "Mạnh"
                        : pwForm.new_password.length >= 8
                          ? "Trung bình"
                          : "Yếu"}
                    </span>
                  </div>
                )}

                <ActionBar
                  label="Đổi mật khẩu"
                  onCancel={() =>
                    setPwForm({
                      current_password: "",
                      new_password: "",
                      confirm_password: "",
                    })
                  }
                />
              </div>
            </form>
          )}

          {/* ── Tab: Thông báo & Cài đặt ── */}
          {activeTab === "notify" && (
            <div>
              <div className="pf-card">
                <div className="pf-card-head">
                  <span className="pf-card-title">Thông báo</span>
                </div>
                <div className="pf-toggle-list">
                  <div className="pf-toggle-item">
                    <div>
                      <div className="pf-toggle-label">Email thông báo</div>
                      <div className="pf-toggle-desc">
                        Nhận thông báo qua email
                      </div>
                    </div>
                    <label className="pf-switch">
                      <input
                        type="checkbox"
                        checked={settings.notify_email}
                        onChange={(e) =>
                          setSettings((p) => ({
                            ...p,
                            notify_email: e.target.checked,
                          }))
                        }
                      />
                      <span className="pf-switch-slider" />
                    </label>
                  </div>
                  <div className="pf-toggle-item">
                    <div>
                      <div className="pf-toggle-label">Push notification</div>
                      <div className="pf-toggle-desc">
                        Nhận thông báo đẩy trên thiết bị
                      </div>
                    </div>
                    <label className="pf-switch">
                      <input
                        type="checkbox"
                        checked={settings.notify_push}
                        onChange={(e) =>
                          setSettings((p) => ({
                            ...p,
                            notify_push: e.target.checked,
                          }))
                        }
                      />
                      <span className="pf-switch-slider" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pf-card">
                <div className="pf-card-head">
                  <span className="pf-card-title">Tuỳ chỉnh</span>
                </div>
                <div className="pf-grid">
                  <div className="pf-field">
                    <label>Ngôn ngữ</label>
                    <select
                      value={settings.language}
                      onChange={(e) =>
                        setSettings((p) => ({ ...p, language: e.target.value }))
                      }
                    >
                      <option value="vi">🇻🇳 Tiếng Việt</option>
                      <option value="en">🇺🇸 English</option>
                    </select>
                  </div>
                  <div className="pf-field">
                    <label>Giao diện</label>
                    <select
                      value={settings.theme}
                      onChange={(e) =>
                        setSettings((p) => ({ ...p, theme: e.target.value }))
                      }
                    >
                      <option value="light">☀️ Sáng</option>
                      <option value="dark">🌙 Tối</option>
                    </select>
                  </div>
                </div>
                <hr className="pf-divider" />
                <div className="pf-action-bar">
                  <span className="pf-action-hint">
                    Cài đặt áp dụng ngay sau khi lưu
                  </span>
                  <button
                    type="button"
                    className="pf-btn-save"
                    onClick={handleSaveSettings}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="pf-spinner" />
                        Đang lưu...
                      </>
                    ) : (
                      "Lưu cài đặt"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Hỗ trợ ── */}
          {activeTab === "support" && (
            <div>
              <div className="pf-card">
                <div className="pf-card-head">
                  <span className="pf-card-title">Yêu cầu hỗ trợ</span>
                  <button
                    type="button"
                    className="pf-btn-save"
                    style={{ padding: "6px 14px", fontSize: 12 }}
                    onClick={() => setShowTicketForm((p) => !p)}
                  >
                    {showTicketForm ? "Huỷ" : "+ Gửi yêu cầu mới"}
                  </button>
                </div>

                {showTicketForm && (
                  <form
                    onSubmit={handleCreateTicket}
                    className="pf-ticket-form"
                  >
                    <div className="pf-field">
                      <label>Tiêu đề</label>
                      <input
                        value={ticketForm.title}
                        onChange={(e) =>
                          setTicketForm((p) => ({
                            ...p,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Nhập tiêu đề vấn đề..."
                      />
                    </div>
                    <div className="pf-field" style={{ marginTop: 10 }}>
                      <label>Nội dung</label>
                      <textarea
                        className="pf-textarea"
                        value={ticketForm.content}
                        onChange={(e) =>
                          setTicketForm((p) => ({
                            ...p,
                            content: e.target.value,
                          }))
                        }
                        placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                        rows={4}
                      />
                    </div>
                    <div className="pf-action-bar" style={{ marginTop: 12 }}>
                      <button
                        type="button"
                        className="pf-btn-cancel"
                        onClick={() => setShowTicketForm(false)}
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
                            Đang gửi...
                          </>
                        ) : (
                          "📤 Gửi yêu cầu"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="pf-card">
                <div className="pf-card-head">
                  <span className="pf-card-title">Lịch sử yêu cầu</span>
                  <span className="pf-card-hint">{tickets.length} yêu cầu</span>
                </div>

                {tickets.length === 0 ? (
                  <div className="pf-empty">
                    <div className="pf-empty-icon">📭</div>
                    <div>Chưa có yêu cầu hỗ trợ nào</div>
                  </div>
                ) : (
                  <div className="pf-ticket-list">
                    {tickets.map((t) => (
                      <div key={t.id} className="pf-ticket-item">
                        <div className="pf-ticket-top">
                          <span className="pf-ticket-title">{t.title}</span>
                          <StatusTicketBadge status={t.status} />
                        </div>
                        <div className="pf-ticket-content">{t.content}</div>
                        {t.admin_reply && (
                          <div className="pf-ticket-reply">
                            <span className="pf-ticket-reply-label">
                              💬 Phản hồi:
                            </span>{" "}
                            {t.admin_reply}
                          </div>
                        )}
                        <div className="pf-ticket-date">
                          {new Date(t.created_at).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
