import { useEffect, useState } from "react";
import axiosClient from "../../../../api/axiosClient";

interface Holiday {
  id: number;
  name: string;
  holiday_date: string;
  year: number;
}

const PRESET_HOLIDAYS = [
  { name: "Tết Dương lịch", date: "01-01" },
  { name: "Giỗ Tổ Hùng Vương", date: "04-18" },
  { name: "Ngày Giải phóng 30/4", date: "04-30" },
  { name: "Ngày Quốc tế Lao động 1/5", date: "05-01" },
  { name: "Ngày Quốc khánh 2/9", date: "09-02" },
];

export default function NgayLePage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/holidays?year=${year}`);
      setHolidays(res.data);
    } catch {
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHolidays(); }, [year]);

  const handleAdd = async () => {
    if (!name.trim() || !date) return;
    try {
      setSaving(true);
      await axiosClient.post("/holidays", {
        name: name.trim(),
        holiday_date: date,
        year: new Date(date).getFullYear(),
      });
      setName("");
      setDate("");
      fetchHolidays();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi thêm ngày lễ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xoá ngày lễ này?")) return;
    try {
      await axiosClient.delete(`/holidays/${id}`);
      fetchHolidays();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi xoá");
    }
  };

  const handleAddPreset = async (preset: { name: string; date: string }) => {
    const fullDate = `${year}-${preset.date}`;
    try {
      await axiosClient.post("/holidays", {
        name: preset.name,
        holiday_date: fullDate,
        year,
      });
      fetchHolidays();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi");
    }
  };

  const fmtDate = (d: string) => {
    const dt = new Date(d);
    return `${String(dt.getUTCDate()).padStart(2, "0")}/${String(dt.getUTCMonth() + 1).padStart(2, "0")}/${dt.getUTCFullYear()}`;
  };

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🎌 Quản lý ngày lễ</h2>
      <p style={{ color: "#6b7280", marginBottom: 20, fontSize: 13 }}>
        Ngày lễ sẽ không tính vắng mặt trên bảng công nhân viên.
      </p>

      {/* Year selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, alignItems: "center" }}>
        <span style={{ fontWeight: 600 }}>Năm:</span>
        {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            style={{
              padding: "6px 16px", borderRadius: 8, border: "1px solid #d1d5db",
              backgroundColor: year === y ? "#2563eb" : "#fff",
              color: year === y ? "#fff" : "#374151",
              fontWeight: 600, cursor: "pointer",
            }}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Preset buttons */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
          Thêm nhanh ngày lễ cố định năm {year}:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PRESET_HOLIDAYS.map((p) => (
            <button
              key={p.date}
              onClick={() => handleAddPreset(p)}
              style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 12,
                border: "1px solid #e5e7eb", backgroundColor: "#f9fafb",
                cursor: "pointer", color: "#374151",
              }}
            >
              + {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add form */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Tên ngày lễ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}
        />
        <button
          onClick={handleAdd}
          disabled={saving || !name.trim() || !date}
          style={{
            padding: "8px 20px", borderRadius: 8, backgroundColor: "#2563eb",
            color: "#fff", fontWeight: 600, border: "none", cursor: "pointer",
            opacity: saving || !name.trim() || !date ? 0.6 : 1,
          }}
        >
          {saving ? "Đang thêm..." : "+ Thêm"}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p style={{ color: "#6b7280" }}>Đang tải...</p>
      ) : holidays.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#9ca3af", border: "2px dashed #e5e7eb", borderRadius: 12 }}>
          <p style={{ fontSize: 32 }}>📅</p>
          <p>Chưa có ngày lễ nào năm {year}</p>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={th}>#</th>
              <th style={th}>Tên ngày lễ</th>
              <th style={th}>Ngày</th>
              <th style={th}>Thứ</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((h, i) => {
              const dow = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][new Date(h.holiday_date).getUTCDay()];
              return (
                <tr key={h.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{h.name}</td>
                  <td style={td}>{fmtDate(h.holiday_date)}</td>
                  <td style={td}>
                    <span style={{
                      padding: "2px 8px", borderRadius: 12, fontSize: 12,
                      backgroundColor: dow === "CN" || dow === "T7" ? "#fee2e2" : "#dbeafe",
                      color: dow === "CN" || dow === "T7" ? "#dc2626" : "#1d4ed8",
                      fontWeight: 600,
                    }}>
                      {dow}
                    </span>
                  </td>
                  <td style={td}>
                    <button
                      onClick={() => handleDelete(h.id)}
                      style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #fecaca", backgroundColor: "#fff", color: "#ef4444", cursor: "pointer", fontSize: 12 }}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "10px 12px", textAlign: "left", fontSize: 12,
  fontWeight: 700, color: "#6b7280", textTransform: "uppercase",
};
const td: React.CSSProperties = {
  padding: "10px 12px", fontSize: 14, color: "#374151",
};
