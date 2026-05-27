import { useState, useEffect } from "react";
import "../styles/caLamViec.css";
import axiosClient from "@api/axiosClient";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Shift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  days_of_week: string;
  grace_minutes: number;
  is_active: boolean;
}

interface ShiftForm {
  name: string;
  start_time: string;
  end_time: string;
  days_of_week: string[];
  grace_minutes: number;
}

const DAYS = [
  { value: "2", label: "Thứ 2" },
  { value: "3", label: "Thứ 3" },
  { value: "4", label: "Thứ 4" },
  { value: "5", label: "Thứ 5" },
  { value: "6", label: "Thứ 6" },
  { value: "7", label: "Thứ 7" },
  { value: "1", label: "Chủ nhật" },
];

const EMPTY_FORM: ShiftForm = {
  name: "",
  start_time: "08:00",
  end_time: "17:30",
  days_of_week: ["2", "3", "4", "5", "6"],
  grace_minutes: 5,
};

// ── API calls dùng axiosClient ────────────────────────────────────────────────
async function fetchShifts(): Promise<Shift[]> {
  const res = await axiosClient.get("/shifts");
  return res.data;
}

async function createShift(data: ShiftForm): Promise<Shift> {
  const res = await axiosClient.post("/shifts", {
    ...data,
    days_of_week: data.days_of_week.join(","),
  });
  return res.data;
}

async function updateShift(id: number, data: ShiftForm): Promise<Shift> {
  const res = await axiosClient.put(`/shifts/${id}`, {
    ...data,
    days_of_week: data.days_of_week.join(","),
  });
  return res.data;
}

async function deleteShift(id: number): Promise<void> {
  await axiosClient.delete(`/shifts/${id}`);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDays(daysStr: string) {
  const map: Record<string, string> = {
    "1": "CN",
    "2": "T2",
    "3": "T3",
    "4": "T4",
    "5": "T5",
    "6": "T6",
    "7": "T7",
  };
  return daysStr
    .split(",")
    .map((d) => map[d] || d)
    .join(", ");
}

function validateForm(form: ShiftForm): string | null {
  if (!form.name.trim()) return "Tên ca không được để trống";
  if (!form.start_time) return "Giờ bắt đầu không được để trống";
  if (!form.end_time) return "Giờ kết thúc không được để trống";
  if (form.start_time >= form.end_time)
    return "Giờ bắt đầu phải nhỏ hơn giờ kết thúc";
  if (form.days_of_week.length === 0) return "Chọn ít nhất 1 ngày áp dụng";
  if (form.grace_minutes < 0 || form.grace_minutes > 60)
    return "Thời gian ân hạn từ 0-60 phút";
  return null;
}

export default function CaLamViecPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ShiftForm>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchShifts();
      setShifts(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (s: Shift) => {
    setEditId(s.id);
    setForm({
      name: s.name,
      start_time: s.start_time.slice(0, 5),
      end_time: s.end_time.slice(0, 5),
      days_of_week: s.days_of_week.split(","),
      grace_minutes: s.grace_minutes,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    const err = validateForm(form);
    if (err) {
      setFormError(err);
      return;
    }

    const duplicate = shifts.find(
      (s) =>
        s.name.toLowerCase() === form.name.trim().toLowerCase() &&
        s.id !== editId,
    );
    if (duplicate) {
      setFormError(`Ca "${form.name}" đã tồn tại`);
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      if (editId) {
        await updateShift(editId, form);
      } else {
        await createShift(form);
      }
      setShowModal(false);
      await load();
    } catch (e: any) {
      setFormError(
        e?.response?.data?.message || e.message || "Lỗi lưu dữ liệu",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteShift(id);
      setDeleteId(null);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Lỗi xóa ca");
    }
  };

  const toggleDay = (day: string) => {
    setForm((f) => ({
      ...f,
      days_of_week: f.days_of_week.includes(day)
        ? f.days_of_week.filter((d) => d !== day)
        : [...f.days_of_week, day],
    }));
  };

  return (
    <div className="clv-page">
      {error && <div className="clv-alert clv-alert--error">{error}</div>}

      {/* ── Table ── */}
      <div className="clv-card">
        {loading ? (
          <div className="clv-loading">Đang tải...</div>
        ) : shifts.length === 0 ? (
          <div className="clv-empty">
            <div style={{ fontSize: 40 }}>📅</div>
            <div>Chưa có ca làm việc nào</div>
            <button className="clv-btn clv-btn--primary" onClick={openCreate}>
              + Thêm ca đầu tiên
            </button>
          </div>
        ) : (
          <table className="clv-table">
            <thead>
              <tr>
                <th>
                  <div className="clv-th-content">
                    Tên ca
                    <span className="clv-sort-icons"><span>▲</span><span>▼</span></span>
                  </div>
                </th>
                <th>Giờ bắt đầu</th>
                <th>Giờ kết thúc</th>
                <th>Ngày áp dụng</th>
                <th>Ân hạn</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((s) => (
                <tr key={s.id} className="clv-row">
                  <td className="clv-td-name">{s.name}</td>
                  <td className="clv-td-time">{s.start_time?.slice(0, 5)}</td>
                  <td className="clv-td-time">{s.end_time?.slice(0, 5)}</td>
                  <td>
                    <span className="clv-days">
                      {formatDays(s.days_of_week)}
                    </span>
                  </td>
                  <td className="clv-td-sub">{s.grace_minutes} phút</td>
                  <td>
                    <span
                      className={`clv-badge ${s.is_active ? "clv-badge--active" : "clv-badge--inactive"}`}
                    >
                      {s.is_active ? "Đang dùng" : "Đã tắt"}
                    </span>
                  </td>
                  <td>
                    <div className="clv-actions">
                      <button
                        className="clv-action-btn clv-action-btn--edit"
                        onClick={() => openEdit(s)}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        className="clv-action-btn clv-action-btn--delete"
                        onClick={() => setDeleteId(s.id)}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal thêm/sửa ── */}
      {showModal && (
        <div className="clv-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="clv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="clv-modal__header">
              <h3>{editId ? "Sửa ca làm việc" : "Thêm ca làm việc"}</h3>
              <button
                className="clv-modal__close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="clv-modal__body">
              {formError && (
                <div className="clv-alert clv-alert--error">{formError}</div>
              )}
              <div className="clv-form-group">
                <label>
                  Tên ca <span className="clv-required">*</span>
                </label>
                <input
                  type="text"
                  className="clv-input"
                  placeholder="VD: Hành chính, Ca sáng..."
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="clv-form-row">
                <div className="clv-form-group">
                  <label>
                    Giờ bắt đầu <span className="clv-required">*</span>
                  </label>
                  <input
                    type="time"
                    className="clv-input"
                    value={form.start_time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, start_time: e.target.value }))
                    }
                  />
                </div>
                <div className="clv-form-group">
                  <label>
                    Giờ kết thúc <span className="clv-required">*</span>
                  </label>
                  <input
                    type="time"
                    className="clv-input"
                    value={form.end_time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, end_time: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="clv-form-group">
                <label>Thời gian ân hạn (phút)</label>
                <input
                  type="number"
                  className="clv-input"
                  min={0}
                  max={60}
                  value={form.grace_minutes}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      grace_minutes: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <div className="clv-hint">
                  Số phút cho phép đi trễ mà không tính muộn
                </div>
              </div>
              <div className="clv-form-group">
                <label>
                  Ngày áp dụng <span className="clv-required">*</span>
                </label>
                <div className="clv-days-picker">
                  {DAYS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      className={`clv-day-btn ${form.days_of_week.includes(d.value) ? "clv-day-btn--active" : ""}`}
                      onClick={() => toggleDay(d.value)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="clv-modal__footer">
              <button
                className="clv-btn clv-btn--outline"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button
                className="clv-btn clv-btn--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : editId ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm xóa ── */}
      {deleteId && (
        <div className="clv-modal-overlay" onClick={() => setDeleteId(null)}>
          <div
            className="clv-modal clv-modal--sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="clv-modal__header">
              <h3>Xác nhận xóa</h3>
              <button
                className="clv-modal__close"
                onClick={() => setDeleteId(null)}
              >
                ✕
              </button>
            </div>
            <div className="clv-modal__body">
              <p style={{ color: "#374151", marginBottom: 0 }}>
                Bạn có chắc muốn xóa ca này? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="clv-modal__footer">
              <button
                className="clv-btn clv-btn--outline"
                onClick={() => setDeleteId(null)}
              >
                Hủy
              </button>
              <button
                className="clv-btn clv-btn--danger"
                onClick={() => handleDelete(deleteId)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
