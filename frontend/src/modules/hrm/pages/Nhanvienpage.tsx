import { useState, useEffect, useCallback, useRef } from "react";
import axiosClient from "@api/axiosClient";
import { useAuth } from "@auth/authContext";
import "../styles/nhanVien.css";

interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  employee_code: string | null;
  job_title: string | null;
  avatar_url: string | null;
  gender: string | null;
  date_of_birth: string | null;
  department_id: number | null;
  branch_id: number | null;
  department_name: string | null;
  branch_name: string | null;
  status: number;
  created_at: string;
}

interface EmployeeDetail extends Employee {
  national_id: string | null;
  cccd_date: string | null;
  cccd_place: string | null;
  address: string | null;
  city: string | null;
  ward: string | null;
  country: string | null;
  alley: string | null;
  house_number: string | null;
  face_descriptor: string | null;
}

interface Department { id: number; name: string; }
interface Branch     { id: number; name: string; }
interface Toast      { id: number; type: "success" | "error"; message: string; }

const TABS = [
  "Thông tin chung", "Hợp đồng lao động", "Kinh nghiệm", "Bằng cấp",
  "Bảo hiểm", "Quan hệ gia đình", "Hồ sơ", "Đào tạo",
  "Năng lực", "Kết quả đánh giá", "Lịch sử điều chuyển", "Face ID Status",
];

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  director: "Giám đốc",
  branch_manager: "QL Chi nhánh",
  department_head: "QL Phòng ban",
  employee: "Nhân viên",
};

const EMPTY_FORM = {
  full_name: "", email: "", phone: "", password: "",
  job_title: "", employee_code: "", gender: "",
  date_of_birth: "", department_id: "", branch_id: "",
  role: "employee", national_id: "", cccd_date: "",
  cccd_place: "", address: "", city: "", ward: "",
  alley: "", house_number: "",
  country: "Việt Nam", status: "1",
};

function fmtDateInput(iso: string | null) {
  if (!iso) return "";
  return iso.split("T")[0];
}

function initForm(emp: EmployeeDetail | null) {
  if (!emp) return { ...EMPTY_FORM };
  return {
    full_name:     emp.full_name     || "",
    email:         emp.email         || "",
    phone:         emp.phone         || "",
    password:      "",
    job_title:     emp.job_title     || "",
    employee_code: emp.employee_code || "",
    gender:        emp.gender        || "",
    date_of_birth: fmtDateInput(emp.date_of_birth),
    department_id: emp.department_id?.toString() || "",
    branch_id:     emp.branch_id?.toString()     || "",
    role:          emp.role          || "employee",
    national_id:   emp.national_id   || "",
    cccd_date:     fmtDateInput(emp.cccd_date),
    cccd_place:    emp.cccd_place    || "",
    address:       emp.address       || "",
    city:          emp.city          || "",
    ward:          emp.ward          || "",
    alley:         emp.alley         || "",
    house_number:  emp.house_number  || "",
    country:       emp.country       || "Việt Nam",
    status:        emp.status?.toString() || "1",
  };
}

function Toasts({ items }: { items: Toast[] }) {
  return (
    <div className="nv-toasts">
      {items.map((t) => (
        <div key={t.id} className={`nv-toast nv-toast--${t.type}`}>
          {t.type === "success" ? "✅" : "❌"} {t.message}
        </div>
      ))}
    </div>
  );
}

function ConfirmModal({
  title, desc, confirmLabel, onClose, onConfirm, loading,
}: {
  title: string; desc: string; confirmLabel: string;
  onClose: () => void; onConfirm: () => void; loading: boolean;
}) {
  return (
    <div className="nv-overlay" onClick={onClose}>
      <div className="nv-modal nv-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="nv-modal-header">
          <div className="nv-modal-title">Xác nhận</div>
          <button className="nv-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="nv-confirm-body">
          <div className="nv-confirm-icon">⚠️</div>
          <div className="nv-confirm-title">{title}</div>
          <div className="nv-confirm-desc">{desc}</div>
        </div>
        <div className="nv-modal-footer">
          <button className="nv-btn nv-btn--ghost" onClick={onClose} disabled={loading}>Huỷ</button>
          <button className="nv-btn nv-btn--danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NhanVienPage() {
  const { user } = useAuth();

  const [employees,    setEmployees]    = useState<Employee[]>([]);
  const [listTotal,    setListTotal]    = useState(0);
  const [listPage,     setListPage]     = useState(1);
  const [listLoading,  setListLoading]  = useState(false);
  const [departments,  setDepartments]  = useState<Department[]>([]);
  const [branches,     setBranches]     = useState<Branch[]>([]);

  const [search,       setSearch]       = useState("");
  const [deptFilter,   setDeptFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [detail,       setDetail]       = useState<EmployeeDetail | null>(null);
  const [detailLoading,setDetailLoading]= useState(false);
  const [isNew,        setIsNew]        = useState(false);
  const [activeTab,    setActiveTab]    = useState(0);
  const [saving,       setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const [form,           setForm]          = useState<any>({ ...EMPTY_FORM });
  const [avatarPreview,  setAvatarPreview] = useState("");
  const [avatarUploading,setAvatarUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const toastCounter = useRef(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (type: Toast["type"], message: string) => {
    const id = ++toastCounter.current;
    setToasts((p) => [...p, { id, type, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const canAdd    = ["admin", "director"].includes(user?.role || "");
  const canDelete = user?.role === "admin";
  const canEdit   = ["admin", "director", "branch_manager", "department_head"].includes(user?.role || "");

  useEffect(() => {
    axiosClient.get("/api/report/departments").then((r) => setDepartments(r.data)).catch(() => {});
    axiosClient.get("/api/report/branches").then((r) => setBranches(r.data)).catch(() => {});
  }, []);

  const LIST_LIMIT = 30;

  const loadList = useCallback(async (pg: number, append: boolean) => {
    try {
      setListLoading(true);
      const params: any = { page: pg, limit: LIST_LIMIT };
      if (search)      params.search       = search;
      if (deptFilter)  params.departmentId = deptFilter;
      const res = await axiosClient.get("/api/users/employees", { params });
      const newEmps: Employee[] = res.data.employees || [];
      setEmployees((prev) => append ? [...prev, ...newEmps] : newEmps);
      setListTotal(res.data.total || 0);
    } catch {
      showToast("error", "Lỗi tải danh sách");
    } finally {
      setListLoading(false);
    }
  }, [search, deptFilter]);

  useEffect(() => {
    setListPage(1);
    loadList(1, false);
  }, [loadList]);

  const handleLoadMore = () => {
    const next = listPage + 1;
    setListPage(next);
    loadList(next, true);
  };

  const fetchDetail = async (id: string) => {
    try {
      setDetailLoading(true);
      const res = await axiosClient.get(`/api/users/employees/${id}`);
      const emp = res.data.employee as EmployeeDetail;
      setDetail(emp);
      setForm(initForm(emp));
      setAvatarPreview(emp.avatar_url || "");
      setIsNew(false);
      setActiveTab(0);
    } catch {
      showToast("error", "Lỗi tải thông tin nhân viên");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedId(emp.id);
    fetchDetail(emp.id);
  };

  const handleNewEmployee = () => {
    setSelectedId(null);
    setDetail(null);
    setForm({ ...EMPTY_FORM });
    setAvatarPreview("");
    setIsNew(true);
    setActiveTab(0);
  };

  const handleCloseDetail = () => {
    setSelectedId(null);
    setDetail(null);
    setIsNew(false);
  };

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p: any) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    if (!detail) return;
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await axiosClient.post(`/api/users/employees/${detail.id}/avatar`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarPreview(res.data.avatarUrl);
      showToast("success", "Đã cập nhật ảnh đại diện");
    } catch {
      showToast("error", "Lỗi upload ảnh");
      setAvatarPreview(detail.avatar_url || "");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.full_name || !form.email) {
      showToast("error", "Vui lòng điền họ tên và email");
      return;
    }
    if (isNew && !form.password) {
      showToast("error", "Vui lòng nhập mật khẩu");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...form,
        department_id: form.department_id ? parseInt(form.department_id) : null,
        branch_id:     form.branch_id     ? parseInt(form.branch_id)     : null,
        status:        parseInt(form.status),
      };
      if (isNew) {
        const res = await axiosClient.post("/api/users/employees", payload);
        showToast("success", `Đã thêm nhân viên ${form.full_name}`);
        await loadList(1, false);
        setListPage(1);
        const newId = res.data.employee?.id;
        if (newId) { setSelectedId(newId); await fetchDetail(newId); }
      } else if (detail) {
        await axiosClient.put(`/api/users/employees/${detail.id}`, payload);
        showToast("success", "Đã lưu thay đổi");
        await loadList(1, false);
        setListPage(1);
        await fetchDetail(detail.id);
      }
    } catch (e: any) {
      showToast("error", e?.response?.data?.message || "Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setSaving(true);
      await axiosClient.delete(`/api/users/employees/${deleteTarget.id}`);
      showToast("success", `Đã xóa nhân viên ${deleteTarget.full_name}`);
      setDeleteTarget(null);
      if (selectedId === deleteTarget.id) handleCloseDetail();
      await loadList(1, false);
      setListPage(1);
    } catch (e: any) {
      showToast("error", e?.response?.data?.message || "Lỗi khi xóa");
    } finally {
      setSaving(false);
    }
  };

  const handleResetFace = async () => {
    if (!detail) return;
    try {
      setSaving(true);
      await axiosClient.delete(`/api/users/employees/${detail.id}/face`);
      showToast("success", "Đã xóa dữ liệu khuôn mặt");
      setDetail((p) => p ? { ...p, face_descriptor: null } : p);
    } catch {
      showToast("error", "Lỗi xóa khuôn mặt");
    } finally {
      setSaving(false);
    }
  };

  const showDetail = isNew || selectedId !== null;
  const deptName = detail?.department_name || (isNew ? "Chưa phân phòng" : "Phòng ban");

  // Filtered client-side by status
  const visibleEmployees = statusFilter
    ? employees.filter((e) => e.status.toString() === statusFilter)
    : employees;

  return (
    <div className="nv-split-page">

      {/* ════════ LEFT: DANH SÁCH ════════ */}
      <div className="nv-list-panel">
        <div className="nv-list-header">
          <span>Danh Sách</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button className="nv-list-info-btn" title="Thông tin">?</button>
            {canAdd && (
              <button className="nv-list-add-btn" onClick={handleNewEmployee} title="Thêm nhân viên mới">+</button>
            )}
          </div>
        </div>

        <div className="nv-list-filters">
          <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); }}>
            <option value="">Phòng ban</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">[Chọn trạng thái]</option>
            <option value="1">Đang làm việc</option>
            <option value="0">Đã nghỉ việc</option>
          </select>
          <div className="nv-list-search">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              placeholder="Tìm kiếm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="nv-list-scroll">
          {listLoading && employees.length === 0 ? (
            <div className="nv-list-info">Đang tải...</div>
          ) : visibleEmployees.length === 0 ? (
            <div className="nv-list-info">Không có nhân viên</div>
          ) : (
            visibleEmployees.map((emp) => {
              const initial = (emp.full_name.trim().split(" ").pop() || "?")[0].toUpperCase();
              return (
                <div
                  key={emp.id}
                  className={`nv-list-item ${selectedId === emp.id ? "nv-list-item--active" : ""}`}
                  onClick={() => handleSelectEmployee(emp)}
                >
                  <div className="nv-list-item-avatar">
                    {emp.avatar_url
                      ? <img src={emp.avatar_url} alt={emp.full_name} />
                      : <span>{initial}</span>
                    }
                  </div>
                  <div className="nv-list-item-info">
                    <div className="nv-list-item-name">{emp.full_name}</div>
                    <div className="nv-list-item-code">{emp.employee_code || emp.id}</div>
                  </div>
                  <div className={`nv-list-item-bar nv-list-item-bar--${emp.status === 1 ? "active" : "inactive"}`} />
                </div>
              );
            })
          )}
          {listTotal > employees.length && (
            <div className="nv-list-more">
              <button onClick={handleLoadMore} disabled={listLoading}>
                {listLoading ? "Đang tải..." : `Tải thêm (${listTotal - employees.length})`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ════════ RIGHT: CHI TIẾT ════════ */}
      <div className="nv-det-panel">
        {!showDetail ? (
          <div className="nv-det-empty">
            <div>👤</div>
            <p>Chọn nhân viên để xem chi tiết</p>
            {canAdd && (
              <button className="nv-btn nv-btn--primary" onClick={handleNewEmployee}>
                ➕ Thêm nhân viên mới
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="nv-det-header">
              <span className="nv-det-header-title">Chi Tiết</span>
              <div className="nv-det-header-actions">
                {canEdit && (
                  <button className="nv-det-save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Đang lưu..." : "💾 Lưu"}
                  </button>
                )}
                {canDelete && detail && (
                  <button className="nv-det-icon-btn nv-det-del-btn" onClick={() => setDeleteTarget(detail)} title="Xóa nhân viên">
                    🗑
                  </button>
                )}
                <button className="nv-det-icon-btn nv-det-icon-btn--min" title="Thu nhỏ">—</button>
                <button className="nv-det-icon-btn" onClick={handleCloseDetail} title="Đóng">✕</button>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="nv-det-body">
              {/* Top: photo + form fields */}
              <div className="nv-det-top">
                {/* Photo column */}
                <div className="nv-det-photo-col">
                  <div className="nv-det-photo">
                    {avatarUploading && <div className="nv-det-photo-overlay">Đang tải...</div>}
                    {avatarPreview
                      ? <img src={avatarPreview} alt="avatar" />
                      : <div className="nv-det-photo-placeholder">
                          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#b0bed4" strokeWidth="1.2">
                            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                          </svg>
                        </div>
                    }
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />

                  {/* Name / title / role display below photo */}
                  {(detail || isNew) && (
                    <div className="nv-det-photo-info">
                      <div className="nv-det-photo-name">{form.full_name || "—"}</div>
                      {form.job_title && <div className="nv-det-photo-title">{form.job_title}</div>}
                      {form.role && (
                        <span className="nv-det-photo-badge">{ROLE_LABEL[form.role] || form.role}</span>
                      )}
                    </div>
                  )}

                  {canEdit && (
                    <button
                      className="nv-det-upload-btn"
                      onClick={() => fileRef.current?.click()}
                      disabled={avatarUploading || isNew}
                      title={isNew ? "Lưu nhân viên trước khi upload ảnh" : "Thay đổi ảnh đại diện"}
                    >
                      {avatarUploading ? "Đang tải..." : "Upload New"}
                    </button>
                  )}
                </div>

                {/* Fields grid — 3 columns */}
                <div className="nv-det-fields">

                  {/* Row 1 */}
                  <div className="nv-det-fg">
                    <label>Họ và tên <span className="nv-req">*</span></label>
                    <input name="full_name" value={form.full_name} onChange={set} placeholder="Nhập họ và tên" />
                  </div>
                  <div className="nv-det-fg">
                    <label>Mã nhân viên <span className="nv-req">*</span></label>
                    <input name="employee_code" value={form.employee_code} onChange={set} placeholder="NV001" />
                  </div>
                  <div className="nv-det-fg">
                    <label>Ngày sinh <span className="nv-req">*</span></label>
                    <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={set} />
                  </div>

                  {/* Row 2 */}
                  <div className="nv-det-fg nv-det-fg--span2">
                    <label>Chức danh</label>
                    <input name="job_title" value={form.job_title} onChange={set} placeholder="Nhân viên hành chính" />
                  </div>
                  <div className="nv-det-fg">
                    <label>Cấp bậc chức vụ</label>
                    <select name="role" value={form.role} onChange={set}>
                      <option value="">Chọn cấp bậc chức vụ</option>
                      <option value="employee">Nhân viên</option>
                      <option value="department_head">QL Phòng ban</option>
                      <option value="branch_manager">QL Chi nhánh</option>
                      <option value="director">Giám đốc</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Row 3 */}
                  <div className="nv-det-fg">
                    <label>Mã phân ca</label>
                    <input readOnly value="" placeholder="Ca hành chính" className="nv-det-fg--readonly" />
                  </div>
                  <div className="nv-det-fg">
                    <label>Mã chấm công</label>
                    <input readOnly value="" placeholder="—" className="nv-det-fg--readonly" />
                  </div>
                  <div className="nv-det-fg">
                    <label>Ngày vào làm</label>
                    <input readOnly value={detail ? fmtDateInput(detail.created_at) : ""} type="date" className="nv-det-fg--readonly" />
                  </div>

                  {/* Row 4 */}
                  <div className="nv-det-fg">
                    <label>SDT di động <span className="nv-req">*</span></label>
                    <input name="phone" value={form.phone} onChange={set} placeholder="0987654321" />
                  </div>
                  <div className="nv-det-fg">
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={set}
                      disabled={!isNew} placeholder="email@example.com" />
                  </div>
                  <div className="nv-det-fg">
                    <label>Điện thoại</label>
                    <input readOnly value="" placeholder="—" className="nv-det-fg--readonly" />
                  </div>

                  {/* Row 5 */}
                  <div className="nv-det-fg">
                    <label>Nơi sinh</label>
                    <input readOnly value="" placeholder="—" className="nv-det-fg--readonly" />
                  </div>
                  <div className="nv-det-fg">
                    <label>Giới tính</label>
                    <select name="gender" value={form.gender} onChange={set}>
                      <option value="">-- Chọn --</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="nv-det-fg">
                    <label>Trạng thái <span className="nv-req">*</span></label>
                    <select name="status" value={form.status} onChange={set}>
                      <option value="1">Đang làm việc</option>
                      <option value="0">Đã nghỉ việc</option>
                    </select>
                  </div>

                  {/* Row 6 */}
                  <div className="nv-det-fg">
                    <label>Phòng ban</label>
                    <select name="department_id" value={form.department_id} onChange={set}>
                      <option value="">-- Chọn --</option>
                      {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="nv-det-fg">
                    <label>Chi nhánh</label>
                    <select name="branch_id" value={form.branch_id} onChange={set}>
                      <option value="">Chọn</option>
                      {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="nv-det-fg">
                    <label>Ngày bắt đầu tính thâm niên</label>
                    <input type="date" readOnly value="" className="nv-det-fg--readonly" />
                  </div>

                  {/* Row 7 */}
                  <div className="nv-det-fg nv-det-fg--span2">
                    <label>Ghi chú</label>
                    <input readOnly value="" placeholder="—" className="nv-det-fg--readonly" />
                  </div>
                  <div className="nv-det-fg">
                    <label>Ngày thôi việc</label>
                    <input type="date" readOnly value="" className="nv-det-fg--readonly" />
                  </div>

                  {/* Password — only on new */}
                  {isNew && (
                    <div className="nv-det-fg nv-det-fg--span3">
                      <label>Mật khẩu <span className="nv-req">*</span></label>
                      <input type="password" name="password" value={form.password} onChange={set} placeholder="Tối thiểu 6 ký tự" />
                    </div>
                  )}
                </div>
              </div>

              {/* ── Tabs ── */}
              {detailLoading ? (
                <div className="nv-loading" style={{ padding: 32, textAlign: "center" }}>Đang tải...</div>
              ) : (
                <>
                  <div className="nv-tabs-bar">
                    {TABS.map((tab, i) => (
                      <button
                        key={tab}
                        className={`nv-tab ${activeTab === i ? "nv-tab--active" : ""}`}
                        onClick={() => setActiveTab(i)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="nv-tab-content">
                    {activeTab === 11 ? (
                      /* ── Face ID Status tab ── */
                      <div className="nv-faceid-tab">
                        <div className="nv-faceid-card">
                          <div className="nv-faceid-visual">
                            <div className="nv-faceid-icon">
                              <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
                                {/* face scan lines */}
                                <rect x="8" y="8" width="18" height="4" rx="2" fill="#1565c0" opacity=".4"/>
                                <rect x="8" y="8" width="4" height="18" rx="2" fill="#1565c0" opacity=".4"/>
                                <rect x="54" y="8" width="18" height="4" rx="2" fill="#1565c0" opacity=".4"/>
                                <rect x="68" y="8" width="4" height="18" rx="2" fill="#1565c0" opacity=".4"/>
                                <rect x="8" y="68" width="18" height="4" rx="2" fill="#1565c0" opacity=".4"/>
                                <rect x="8" y="54" width="4" height="18" rx="2" fill="#1565c0" opacity=".4"/>
                                <rect x="54" y="68" width="18" height="4" rx="2" fill="#1565c0" opacity=".4"/>
                                <rect x="68" y="54" width="4" height="18" rx="2" fill="#1565c0" opacity=".4"/>
                                {/* face */}
                                <circle cx="40" cy="32" r="10" stroke="#1565c0" strokeWidth="2"/>
                                <path d="M24 58c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="#1565c0" strokeWidth="2" strokeLinecap="round"/>
                                {/* scan line */}
                                <line x1="18" y1="40" x2="62" y2="40" stroke="#1565c0" strokeWidth="1.5" strokeDasharray="4 3" opacity=".6"/>
                              </svg>
                            </div>
                            <div className="nv-faceid-camera">
                              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#666" strokeWidth="1.8">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                <circle cx="12" cy="13" r="4"/>
                              </svg>
                            </div>
                          </div>

                          {detail ? (
                            detail.face_descriptor ? (
                              <div className="nv-faceid-verified">
                                <div className="nv-faceid-status nv-faceid-status--ok">
                                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                  Face ID Verified
                                </div>
                                {canEdit && (
                                  <button className="nv-faceid-manage-btn" onClick={handleResetFace} disabled={saving}>
                                    {saving ? "Đang xử lý..." : "Manage Face Data"}
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="nv-faceid-verified">
                                <div className="nv-faceid-status nv-faceid-status--no">
                                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                  </svg>
                                  Chưa đăng ký khuôn mặt
                                </div>
                                <p className="nv-faceid-hint">Nhân viên cần đăng ký khuôn mặt qua ứng dụng di động để sử dụng tính năng chấm công.</p>
                              </div>
                            )
                          ) : (
                            <div className="nv-faceid-verified">
                              <p className="nv-faceid-hint">Chọn nhân viên để xem trạng thái Face ID.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : activeTab === 0 ? (
                      <div>
                        {/* Row 1: 4-col basic */}
                        <div className="nv-tab-grid-4">
                          <div className="nv-det-fg">
                            <label>Cư trú</label>
                            <select><option value="">Chọn cư trú</option></select>
                          </div>
                          <div className="nv-det-fg">
                            <label>Dân tộc</label>
                            <input readOnly defaultValue="Kinh" />
                          </div>
                          <div className="nv-det-fg">
                            <label>Tôn giáo</label>
                            <select><option value="">Chọn</option></select>
                          </div>
                          <div className="nv-det-fg">
                            <label>Quốc tịch</label>
                            <input name="country" value={form.country} onChange={set} />
                          </div>
                        </div>

                        {/* CCCD + Address */}
                        <div className="nv-tab-section-title">Giấy tờ tùy thân</div>
                        <div className="nv-tab-grid-3">
                          <div className="nv-det-fg">
                            <label>Số CCCD / CMND</label>
                            <input name="national_id" value={form.national_id} onChange={set} placeholder="012345678901" />
                          </div>
                          <div className="nv-det-fg">
                            <label>Ngày cấp</label>
                            <input type="date" name="cccd_date" value={form.cccd_date} onChange={set} />
                          </div>
                          <div className="nv-det-fg">
                            <label>Nơi cấp</label>
                            <input name="cccd_place" value={form.cccd_place} onChange={set} />
                          </div>
                        </div>

                        <div className="nv-tab-section-title">Địa chỉ</div>
                        <div className="nv-tab-grid-3">
                          <div className="nv-det-fg">
                            <label>Thành phố / Tỉnh</label>
                            <input name="city" value={form.city} onChange={set} placeholder="Hà Nội" />
                          </div>
                          <div className="nv-det-fg">
                            <label>Phường / Xã</label>
                            <input name="ward" value={form.ward} onChange={set} placeholder="Phường Cầu Giấy" />
                          </div>
                          <div className="nv-det-fg">
                            <label>Ngõ / Hẻm</label>
                            <input name="alley" value={form.alley ?? ""} onChange={set} placeholder="Ngõ 10, Hẻm 5..." />
                          </div>
                          <div className="nv-det-fg">
                            <label>Số nhà</label>
                            <input name="house_number" value={form.house_number ?? ""} onChange={set} placeholder="12A" />
                          </div>
                          <div className="nv-det-fg nv-det-fg--span2">
                            <label>Địa chỉ chi tiết</label>
                            <input name="address" value={form.address} onChange={set} placeholder="Số nhà, ngõ, đường..." />
                          </div>
                        </div>

                        {/* Face recognition */}
                        {detail && (
                          <>
                            <div className="nv-tab-section-title">Khuôn mặt chấm công</div>
                            <div className="nv-face-status">
                              <span className={`nv-face-indicator ${detail.face_descriptor ? "nv-face-indicator--ok" : "nv-face-indicator--no"}`}>
                                {detail.face_descriptor ? "✅ Đã đăng ký khuôn mặt" : "❌ Chưa đăng ký khuôn mặt"}
                              </span>
                              {detail.face_descriptor && canEdit && (
                                <button className="nv-btn nv-btn--danger nv-btn--sm" onClick={handleResetFace} disabled={saving}>
                                  Xóa khuôn mặt
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="nv-tab-placeholder">
                        <span>🚧</span>
                        <p>Tính năng đang phát triển</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Xóa nhân viên?"
          desc={`"${deleteTarget.full_name}" sẽ bị xóa vĩnh viễn.`}
          confirmLabel="🗑️ Xác nhận xóa"
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={saving}
        />
      )}

      <Toasts items={toasts} />
    </div>
  );
}
