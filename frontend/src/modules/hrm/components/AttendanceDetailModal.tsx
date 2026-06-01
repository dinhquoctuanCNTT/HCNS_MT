import { useEffect, useRef } from "react";

interface AttendanceRecord {
  id: number;
  full_name: string;
  employee_code: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  late_minutes: number;
  early_minutes: number;
  status: string;
  check_in_image_url: string | null;
  check_out_image_url: string | null;
  check_in_address: string | null;
  check_out_address: string | null;
  latitude: number | null;
  longitude: number | null;
  department_name?: string;
  branch_name?: string;
}

interface Props {
  record: AttendanceRecord;
  onClose: () => void;
}

function fmt(dt: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function fmtDate(dt: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  ontime:  { label: "Đúng giờ",   color: "#15803d", bg: "#dcfce7" },
  late:    { label: "Đi muộn",    color: "#b45309", bg: "#fef3c7" },
  early:   { label: "Về sớm",     color: "#7c3aed", bg: "#ede9fe" },
  absent:  { label: "Vắng mặt",   color: "#dc2626", bg: "#fee2e2" },
  missing: { label: "Thiếu ra",   color: "#475569", bg: "#f1f5f9" },
};

function getStatuses(row: AttendanceRecord): string[] {
  if (!row.check_in) return ["absent"];
  const tags: string[] = [];
  if (!row.check_out) tags.push("missing");
  if (row.late_minutes > 0) tags.push("late");
  if (row.early_minutes > 0) tags.push("early");
  return tags.length ? tags : ["ontime"];
}

export default function AttendanceDetailModal({ record, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const tags = getStatuses(record);
  const mapsUrl = record.latitude && record.longitude
    ? `https://www.google.com/maps?q=${record.latitude},${record.longitude}`
    : null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 16,
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              Chi tiết chấm công
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>
              {fmtDate(record.date)}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9", border: "none", borderRadius: 8,
              width: 32, height: 32, cursor: "pointer", fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b",
            }}
          >×</button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* Nhân viên */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: 14, background: "#f8fafc", borderRadius: 10, marginBottom: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0,
            }}>
              {record.full_name?.[0]?.toUpperCase() ?? "N"}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{record.full_name}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {record.employee_code}
                {record.department_name && ` · ${record.department_name}`}
                {record.branch_name && ` · ${record.branch_name}`}
              </div>
            </div>
          </div>

          {/* Trạng thái */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {tags.map((t) => {
              const s = STATUS_LABELS[t];
              return s ? (
                <span key={t} style={{
                  background: s.bg, color: s.color,
                  padding: "4px 12px", borderRadius: 20,
                  fontSize: 12, fontWeight: 700,
                }}>{s.label}</span>
              ) : null;
            })}
          </div>

          {/* Grid thời gian */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={{ padding: 14, background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 11, color: "#15803d", fontWeight: 700, marginBottom: 4 }}>↗ VÀO CA</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{fmt(record.check_in)}</div>
              {record.late_minutes > 0 && (
                <div style={{ fontSize: 11, color: "#dc2626", marginTop: 2 }}>
                  Muộn {record.late_minutes} phút
                </div>
              )}
            </div>
            <div style={{ padding: 14, background: "#fff7ed", borderRadius: 10, border: "1px solid #fed7aa" }}>
              <div style={{ fontSize: 11, color: "#ea580c", fontWeight: 700, marginBottom: 4 }}>↙ RA CA</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{fmt(record.check_out)}</div>
              {record.early_minutes > 0 && (
                <div style={{ fontSize: 11, color: "#7c3aed", marginTop: 2 }}>
                  Sớm {record.early_minutes} phút
                </div>
              )}
            </div>
          </div>

          {/* Địa điểm */}
          {(record.check_in_address || record.check_out_address || mapsUrl) && (
            <div style={{ padding: 14, background: "#f8fafc", borderRadius: 10, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>📍 ĐỊA ĐIỂM</div>
              {record.check_in_address && (
                <div style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>
                  <span style={{ color: "#22c55e", fontWeight: 700 }}>↗ Vào ca: </span>
                  {record.check_in_address}
                </div>
              )}
              {record.check_out_address && (
                <div style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>↙ Ra ca: </span>
                  {record.check_out_address}
                </div>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 12, color: "#3b82f6", textDecoration: "none",
                  padding: "4px 10px", background: "#eff6ff",
                  borderRadius: 6, marginTop: 4,
                }}>
                  🗺️ Xem trên Google Maps
                  ({Number(record.latitude).toFixed(5)}, {Number(record.longitude).toFixed(5)})
                </a>
              )}
            </div>
          )}

          {/* Ảnh */}
          {(record.check_in_image_url || record.check_out_image_url) && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>📷 HÌNH ẢNH</div>
              <div style={{ display: "flex", gap: 12 }}>
                {record.check_in_image_url && (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={record.check_in_image_url}
                      alt="Vào ca"
                      style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, border: "2px solid #bbf7d0" }}
                    />
                    <div style={{ fontSize: 11, color: "#15803d", marginTop: 4, fontWeight: 600 }}>Vào ca</div>
                  </div>
                )}
                {record.check_out_image_url && (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={record.check_out_image_url}
                      alt="Ra ca"
                      style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, border: "2px solid #fed7aa" }}
                    />
                    <div style={{ fontSize: 11, color: "#ea580c", marginTop: 4, fontWeight: 600 }}>Ra ca</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
