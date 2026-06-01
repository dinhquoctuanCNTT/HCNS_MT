import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, Alert, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, CommonActions } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { attendanceApi } from "../../../api/attendanceApi";

const NAVY = "#1e3a8a";

// ── Tính năng ─────────────────────────────────────────────────────────────────
const TINH_NANG = [
  { key: "sinh-nhat", icon: "🎂", label: "Sinh nhật",  action: "soon" },
  { key: "ho-so",     icon: "👤", label: "Hồ sơ",       action: "profile" },
  { key: "luong",     icon: "💰", label: "FNE.lương",   action: "soon" },
  { key: "phuc-loi",  icon: "🎁", label: "Phúc lợi",    action: "soon" },
  { key: "dong-phuc", icon: "👔", label: "Đồng phục",   action: "soon" },
  { key: "nghi-viec", icon: "🚪", label: "Nghỉ việc",   action: "soon" },
];

// ── Ứng dụng ──────────────────────────────────────────────────────────────────
const UNG_DUNG = [
  { key: "cham-cong",  icon: "📸", label: "Chấm công",   action: "attendance", color: "#1e3a8a" },
  { key: "dang-ky",    icon: "📝", label: "Đăng ký",      action: "schedule",   color: "#0ea5e9" },
  { key: "ke-toan",    icon: "📊", label: "Kế toán",      action: "soon",       color: "#ef4444" },
  { key: "cong-viec",  icon: "✅", label: "Công việc",    action: "soon",       color: "#22c55e" },
  { key: "one-ai",     icon: "🤖", label: "OneAI",        action: "soon",       color: "#8b5cf6" },
  { key: "phong-hoc",  icon: "📚", label: "Phòng học",    action: "soon",       color: "#f59e0b" },
  { key: "tuyen-dung", icon: "🤝", label: "Tuyển dụng",  action: "soon",       color: "#10b981" },
  { key: "san-xuat",   icon: "🏭", label: "Sản xuất",     action: "soon",       color: "#6366f1" },
  { key: "bao-cao",    icon: "📈", label: "Báo cáo",      action: "soon",       color: "#f97316" },
  { key: "don-tu",     icon: "📋", label: "Đơn từ",       action: "leave",      color: "#64748b" },
  { key: "lich-su",    icon: "🗓️", label: "Lịch sử",     action: "schedule",   color: "#0369a1" },
  { key: "ho-tro",     icon: "💬", label: "Hỗ trợ",       action: "soon",       color: "#7c3aed" },
];

export default function HomeScreen({ navigation }: any) {
  const user = useSelector((s: RootState) => s.auth.user);
  const [todayRecord, setTodayRecord] = useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      const today = new Date().toISOString().slice(0, 10);
      attendanceApi.getHistory(today, today)
        .then((res) => {
          const d = Array.isArray(res.data) ? res.data : [];
          setTodayRecord(d.length ? d[0] : null);
        })
        .catch(() => {});
    }, []),
  );

  const initials = user?.fullName
    ? user.fullName.split(" ").slice(-2).map((w: string) => w[0]).join("").toUpperCase()
    : "MT";

  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const checkIn  = todayRecord?.check_in  ? fmtTime(todayRecord.check_in)  : null;
  const checkOut = todayRecord?.check_out ? fmtTime(todayRecord.check_out) : null;

  const handleTinhNang = (action: string) => {
    if (action === "profile") navigation.navigate("Profile");
    else Alert.alert("🚀 Sắp ra mắt", "Tính năng đang được phát triển.");
  };

  const handleApp = (action: string) => {
    if (action === "attendance") navigation.navigate("Attendance");
    else if (action === "schedule") navigation.navigate("Schedule");
    else if (action === "leave")    navigation.navigate("Leave");
    else Alert.alert("🚀 Sắp ra mắt", "Ứng dụng đang được phát triển.");
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header + User Card ── */}
        <View style={s.header}>
          {/* Header top row */}
          <View style={s.headerTop}>
            <Text style={s.headerTitle}>AVA</Text>
            <View style={s.headerIcons}>
              <TouchableOpacity style={s.iconBtn}>
                <Text style={s.iconEmoji}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.iconBtn}>
                <Text style={s.iconEmoji}>🔍</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.iconBtn} onPress={() => navigation.navigate("Profile")}>
                <Text style={s.iconEmoji}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* User info */}
          <View style={s.userRow}>
            <TouchableOpacity style={s.avatar} onPress={() => navigation.navigate("Profile")}>
              <Text style={s.avatarText}>{initials}</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={s.userName}>{user?.fullName || "Nhân viên"}</Text>
              <Text style={s.userRole}>{(user as any)?.job_title || "Nhân viên"}</Text>
            </View>
          </View>

          {/* Attendance mini card */}
          <View style={s.attendCard}>
            <TouchableOpacity
              style={s.attendBtn}
              onPress={() => navigation.navigate("Attendance")}
            >
              <View style={s.attendTimeCol}>
                <Text style={s.attendLabel}>Vào ca</Text>
                <Text style={[s.attendTime, !checkIn && s.attendTimeDim]}>
                  {checkIn ?? "--:--"}
                </Text>
                {checkIn && <Text style={s.attendOk}>✓</Text>}
              </View>

              <View style={s.attendCenter}>
                <View style={s.attendMapBtn}>
                  <Text style={{ fontSize: 20 }}>📍</Text>
                </View>
                <Text style={s.attendMapLabel} numberOfLines={1}>
                  {todayRecord?.branch_name ?? "Vị trí chấm công"}
                </Text>
              </View>

              <View style={[s.attendTimeCol, { alignItems: "flex-end" }]}>
                <Text style={s.attendLabel}>Ra ca</Text>
                <Text style={[s.attendTime, !checkOut && s.attendTimeDim]}>
                  {checkOut ?? "--:--"}
                </Text>
                {checkOut && <Text style={s.attendOk}>✓</Text>}
              </View>
            </TouchableOpacity>

            {/* Quick actions row */}
            <View style={s.quickRow}>
              {[
                { icon: "📊", label: "Thống kê\ncá nhân", nav: () => navigation.navigate("Schedule") },
                { icon: "🗓️", label: "Lịch làm\nviệc",    nav: () => navigation.navigate("Schedule") },
                { icon: "📁", label: "Đơn từ",             nav: () => navigation.navigate("Leave") },
                { icon: "📋", label: "Xem thêm",           nav: () => navigation.navigate("Profile") },
              ].map((q, i) => (
                <TouchableOpacity key={i} style={s.quickItem} onPress={q.nav}>
                  <Text style={s.quickIcon}>{q.icon}</Text>
                  <Text style={s.quickLabel}>{q.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ── Tính năng ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Tính năng</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.featureRow}>
              {TINH_NANG.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={s.featureItem}
                  onPress={() => handleTinhNang(item.action)}
                >
                  <View style={s.featureIcon}>
                    <Text style={s.featureEmoji}>{item.icon}</Text>
                  </View>
                  <Text style={s.featureLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* ── Ứng dụng ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Ứng dụng</Text>
            <TouchableOpacity>
              <Text style={s.customizeText}>Tuỳ chỉnh</Text>
            </TouchableOpacity>
          </View>
          <View style={s.appGrid}>
            {UNG_DUNG.map((app) => (
              <TouchableOpacity
                key={app.key}
                style={s.appItem}
                onPress={() => handleApp(app.action)}
              >
                <View style={[s.appIcon, { backgroundColor: app.color }]}>
                  <Text style={s.appEmoji}>{app.icon}</Text>
                </View>
                <Text style={s.appLabel}>{app.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f1f5f9" },

  // Header
  header: { backgroundColor: NAVY, paddingBottom: 16 },
  headerTop: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16, paddingTop: 8, marginBottom: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "900", color: "#fff", letterSpacing: 1 },
  headerIcons: { flexDirection: "row", gap: 4 },
  iconBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  iconEmoji: { fontSize: 16 },

  // User row
  userRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 12, marginBottom: 14 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#f59e0b",
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.4)",
  },
  avatarText: { fontSize: 17, fontWeight: "800", color: "#fff" },
  userName: { fontSize: 15, fontWeight: "800", color: "#fff" },
  userRole: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 1 },

  // Attend card
  attendCard: {
    marginHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16, overflow: "hidden",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
  },
  attendBtn: {
    flexDirection: "row", alignItems: "center",
    padding: 14, gap: 8,
  },
  attendTimeCol: { flex: 1, alignItems: "flex-start" },
  attendLabel: { fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: "700", marginBottom: 2 },
  attendTime: { fontSize: 22, fontWeight: "900", color: "#fff", letterSpacing: 0.5 },
  attendTimeDim: { color: "rgba(255,255,255,0.3)" },
  attendOk: { fontSize: 10, color: "#4ade80", fontWeight: "800", marginTop: 2 },
  attendCenter: { alignItems: "center", flex: 1.2 },
  attendMapBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  attendMapLabel: { fontSize: 9, color: "rgba(255,255,255,0.7)", textAlign: "center", maxWidth: 80 },

  // Quick row
  quickRow: {
    flexDirection: "row", borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  quickItem: {
    flex: 1, alignItems: "center", paddingVertical: 10, gap: 4,
    borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.1)",
  },
  quickIcon: { fontSize: 20 },
  quickLabel: { fontSize: 9, color: "rgba(255,255,255,0.8)", textAlign: "center", fontWeight: "600" },

  // Sections
  section: { backgroundColor: "#fff", marginTop: 10, padding: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: "#1e293b", marginBottom: 14 },
  customizeText: { fontSize: 13, color: "#3b82f6", fontWeight: "600" },

  // Tính năng
  featureRow: { flexDirection: "row", gap: 4, paddingBottom: 4 },
  featureItem: { alignItems: "center", width: 64, marginRight: 6 },
  featureIcon: {
    width: 50, height: 50, borderRadius: 14,
    backgroundColor: "#f1f5f9",
    alignItems: "center", justifyContent: "center", marginBottom: 6,
  },
  featureEmoji: { fontSize: 22 },
  featureLabel: { fontSize: 10, color: "#475569", fontWeight: "600", textAlign: "center" },

  // Ứng dụng
  appGrid: { flexDirection: "row", flexWrap: "wrap" },
  appItem: { width: "25%", alignItems: "center", paddingVertical: 8 },
  appIcon: {
    width: 50, height: 50, borderRadius: 14,
    alignItems: "center", justifyContent: "center", marginBottom: 6,
  },
  appEmoji: { fontSize: 22 },
  appLabel: { fontSize: 10, color: "#475569", fontWeight: "600", textAlign: "center" },
});
