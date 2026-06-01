import { Link } from "react-router-dom";
import { Home, Construction } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ComingSoonModuleProps {
  label: string;
  color: string;
  icon: LucideIcon;
  description?: string;
}

export default function ComingSoonModule({
  label,
  color,
  icon: Icon,
  description,
}: ComingSoonModuleProps) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#f8fafc",
        gap: 0,
      }}
    >
      {/* Module icon */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 22,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
          marginBottom: 24,
        }}
      >
        <Icon size={42} color="#fff" strokeWidth={1.6} />
      </div>

      {/* Module name */}
      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#0f172a",
          margin: "0 0 8px",
          letterSpacing: "-0.5px",
        }}
      >
        {label}
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: 15,
          color: "#64748b",
          margin: "0 0 32px",
          textAlign: "center",
          maxWidth: 380,
          lineHeight: 1.6,
        }}
      >
        {description ?? "Module này đang được phát triển và sẽ sớm ra mắt."}
      </p>

      {/* Under construction badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 20px",
          background: "#fef3c7",
          border: "1px solid #fcd34d",
          borderRadius: 12,
          marginBottom: 32,
        }}
      >
        <Construction size={18} color="#d97706" />
        <span style={{ fontSize: 14, fontWeight: 600, color: "#92400e" }}>
          Đang trong quá trình phát triển
        </span>
      </div>

      {/* Back button */}
      <Link
        to="/admin"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 24px",
          background: "#1e293b",
          color: "#fff",
          borderRadius: 10,
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 600,
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <Home size={16} />
        Quay lại Dashboard
      </Link>
    </div>
  );
}
