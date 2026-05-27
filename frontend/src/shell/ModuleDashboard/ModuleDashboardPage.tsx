import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ShoppingBag, Star, Settings,
  KeyRound, UserCog, ShieldCheck, ChevronRight,
  ChevronDown, LogOut, Building2,
} from "lucide-react";
import { ALL_APPS, CATEGORIES } from "@data/apps";
import logoMT from "@assets/Logo MT Holdings New-01.png";
import bannerBg from "@assets/banner.jpg";
import { useAuthStore } from "@auth/auth.store";

export default function ModuleDashboardPage() {
  const navigate = useNavigate();
  const { user, clearAuthState } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState("Ứng dụng của tôi");
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = user?.fullname
    ? user.fullname.split(" ").slice(-2).map((w: string) => w[0]).join("").toUpperCase()
    : "MT";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        avatarRef.current && !avatarRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    clearAuthState();
    navigate("/login");
  };

  const visibleApps = ALL_APPS.filter((app) => {
    const matchSearch = app.label.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      activeCategory === "Ứng dụng của tôi" || activeCategory === "Tất cả"
        ? true
        : app.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ height: "100vh", overflow: "hidden", position: "relative" }}>

      {/* ── Background image — full page ── */}
      <img
        src={bannerBg}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
          zIndex: 0,
        }}
      />

      {/* ── Profile dropdown — rendered at root level, above everything ── */}
      {profileOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: 90,
            right: 24,
            width: 340,
            background: "#ffffff",
            borderRadius: 18,
            boxShadow: "0 12px 48px rgba(0,0,0,0.22)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {/* User info */}
          <div style={{
            padding: "32px 28px 22px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            borderBottom: "1px solid #f1f5f9",
          }}>
            <div style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#eab308,#ca8a04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: 1,
            }}>
              {initials}
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#111827", letterSpacing: 0.5 }}>
              {user?.fullname?.toUpperCase() ?? ""}
            </div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>
              {user?.email ?? ""}
            </div>
          </div>

          {/* Company */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9" }}>
            <button style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              background: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              color: "#111827",
            }}>
              <Building2 size={18} color="#6b7280" />
              <span style={{ flex: 1, textAlign: "left" }}>CÔNG TY CỔ PHẦN SƠN MT</span>
              <ChevronRight size={18} color="#9ca3af" />
            </button>
          </div>

          {/* Menu items */}
          <div style={{ padding: "8px 10px" }}>
            {[
              { icon: <KeyRound size={20} color="#6b7280" />, label: "Đổi mật khẩu" },
              { icon: <UserCog size={20} color="#6b7280" />, label: "Thiết lập tài khoản" },
              { icon: <ShieldCheck size={20} color="#6b7280" />, label: "Thiết lập bảo mật" },
            ].map((item) => (
              <button
                key={item.label}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "13px 16px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 15,
                  color: "#374151",
                  borderRadius: 10,
                  textAlign: "left",
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            {/* Language */}
            <button
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "13px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 15,
                color: "#374151",
                borderRadius: 10,
                transition: "background 0.12s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 20 }}>🇻🇳</span>
              <span style={{ flex: 1, textAlign: "left" }}>Ngôn ngữ: Việt Nam</span>
              <ChevronDown size={18} color="#9ca3af" />
            </button>
          </div>

          {/* Logout */}
          <div style={{ padding: "6px 10px 14px", borderTop: "1px solid #f1f5f9" }}>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "13px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                color: "#374151",
                borderRadius: 10,
                transition: "background 0.12s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut size={20} color="#6b7280" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}

      {/* ── All UI on top ── */}
      <div style={{
        position: "relative",
        zIndex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* ── Top navbar ── */}
        <header style={{
          background: "rgba(255,255,255,0.5)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(226,232,240,0.6)",
          padding: "0 24px",
          height: 80,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <img src={logoMT} alt="MT Holdings" style={{ height: 72, objectFit: "contain" }} />

          <div style={{
            flex: 1,
            maxWidth: 360,
            margin: "0 auto",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}>
            <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 12, pointerEvents: "none" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm"
              style={{
                width: "100%",
                padding: "7px 14px 7px 36px",
                border: "1px solid #e2e8f0",
                borderRadius: 20,
                fontSize: 14,
                outline: "none",
                background: "rgba(248,250,252,0.85)",
                color: "#334155",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
            <button style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              border: "1px solid rgba(226,232,240,0.8)",
              borderRadius: 8,
              background: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              fontSize: 13,
              color: "#475569",
              fontWeight: 500,
            }}>
              <ShoppingBag size={15} />
              Chợ ứng dụng
            </button>

            <button style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "1px solid rgba(226,232,240,0.8)",
              background: "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}>
              <Settings size={18} color="#475569" />
            </button>

            {/* Avatar */}
            <div
              ref={avatarRef}
              onClick={() => setProfileOpen((p) => !p)}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#f97316,#ea580c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                flexShrink: 0,
                userSelect: "none",
                boxShadow: profileOpen ? "0 0 0 3px rgba(249,115,22,0.35)" : "none",
              }}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* ── Category tabs ── */}
        <div style={{
          background: "rgba(255,255,255,0.5)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(226,232,240,0.6)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          flexShrink: 0,
          height: 56,
        }}>
          <Star size={22} color="#f59e0b" fill="#f59e0b" style={{ flexShrink: 0, marginRight: 8 }} />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                border: "none",
                outline: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: activeCategory === cat ? 700 : 500,
                background: "transparent",
                color: activeCategory === cat ? "#111827" : "#374151",
                whiteSpace: "nowrap",
              }}
            >
              {cat}
            </button>
          ))}
          <button style={{
            padding: "6px 14px",
            borderRadius: 20,
            border: "1px solid #9ca3af",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 500,
            background: "transparent",
            color: "#374151",
            whiteSpace: "nowrap",
            outline: "none",
          }}>
            +1
          </button>
        </div>

        {/* ── Icon grid ── */}
        <div style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: 52,
        }}>
          {visibleApps.length === 0 ? (
            <p style={{ color: "#1e293b", fontSize: 15, fontWeight: 500 }}>
              Không tìm thấy ứng dụng
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {[visibleApps.slice(0, 5), visibleApps.slice(5)].map((row, rowIdx) => (
                <div key={rowIdx} style={{ display: "flex", justifyContent: "center", gap: 60 }}>
                  {row.map((app) => {
                    const Icon = app.icon;
                    return (
                      <button
                        key={app.id}
                        onClick={() => navigate(app.href)}
                        style={{
                          background: "none",
                          border: "none",
                          outline: "none",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 10,
                          width: 100,
                          padding: 0,
                        }}
                      >
                        <div style={{
                          width: 95,
                          height: 95,
                          borderRadius: 22,
                          background: app.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 6px 20px rgba(0,0,0,0.22)",
                          overflow: "hidden",
                        }}>
                          {app.imgSrc
                            ? <img src={app.imgSrc} alt={app.label} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.45)", transformOrigin: "center" }} />
                            : <Icon size={42} color="#fff" strokeWidth={1.6} />
                          }
                        </div>

                        <div style={{ textAlign: "center" }}>
                          <div style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "#1e293b",
                            lineHeight: 1.3,
                            textShadow: "0 1px 4px rgba(255,255,255,0.95)",
                          }}>
                            {app.label}
                          </div>
                          {app.sub && (
                            <div style={{
                              fontSize: 11,
                              color: "#334155",
                              marginTop: 1,
                              textShadow: "0 1px 3px rgba(255,255,255,0.95)",
                            }}>
                              {app.sub}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
