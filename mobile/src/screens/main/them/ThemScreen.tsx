import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { attendanceApi } from "../../../api/attendanceApi";

// ── Icon wrapper ──────────────────────────────────────────────────────────────
type IconLib = "ion" | "mci";
interface IconDef {
  lib: IconLib;
  name: string;
  color: string;
  bg: string;
  size?: number;
}

function AppIcon({ icon, size = 26 }: { icon: IconDef; size?: number }) {
  return (
    <View style={[s.iconBox, { backgroundColor: icon.bg }]}>
      {icon.lib === "ion"
        ? <Ionicons     name={icon.name as any} size={size} color={icon.color} />
        : <MaterialCommunityIcons name={icon.name as any} size={size} color={icon.color} />
      }
    </View>
  );
}

// ── Tính năng ─────────────────────────────────────────────────────────────────
const TINH_NANG: { key: string; label: string; action: string; icon: IconDef }[] = [
  { key: "thong-ke", label: "Thống kê\ncá nhân",  action: "baocao",    icon: { lib: "ion", name: "bar-chart",         color: "#fff", bg: "#ef4444" } },
  { key: "lich-lv",  label: "Lịch làm\nviệc",     action: "schedule",  icon: { lib: "ion", name: "calendar",           color: "#fff", bg: "#3b82f6" } },
  { key: "don",      label: "Đơn",                  action: "leave",     icon: { lib: "ion", name: "document-text",      color: "#fff", bg: "#0ea5e9" } },
  { key: "ho-so",    label: "Hồ sơ",                action: "profile",   icon: { lib: "ion", name: "person-circle",      color: "#fff", bg: "#8b5cf6" } },
  { key: "luong",    label: "Phiếu\nlương",         action: "soon",      icon: { lib: "ion", name: "wallet",              color: "#fff", bg: "#22c55e" } },
  { key: "phuc-loi", label: "Phúc lợi",             action: "soon",      icon: { lib: "ion", name: "gift",                color: "#fff", bg: "#f97316" } },
  { key: "sinh-nhat",label: "Sinh nhật",            action: "soon",      icon: { lib: "mci", name: "cake-variant",        color: "#fff", bg: "#ec4899" } },
  { key: "nghi-viec",label: "Nghỉ việc",            action: "soon",      icon: { lib: "ion", name: "log-out",             color: "#fff", bg: "#64748b" } },
];

// ── Ứng dụng ──────────────────────────────────────────────────────────────────
const UNG_DUNG: { key: string; label: string; action: string; icon: IconDef }[] = [
  { key: "cham-cong",  label: "Chấm công",   action: "attendance", icon: { lib: "ion", name: "finger-print",       color: "#fff", bg: "#1e3a8a" } },
  { key: "bao-cao",    label: "Báo cáo",     action: "baocao",     icon: { lib: "ion", name: "stats-chart",        color: "#fff", bg: "#0369a1" } },
  { key: "ban-tin",    label: "Bảng tin",    action: "bantin",     icon: { lib: "ion", name: "newspaper",          color: "#fff", bg: "#0891b2" } },
  { key: "danh-gia",   label: "Đánh giá",   action: "soon",       icon: { lib: "ion", name: "star",               color: "#fff", bg: "#f59e0b" } },
  { key: "ke-toan",    label: "Kế toán",    action: "soon",       icon: { lib: "mci", name: "calculator",         color: "#fff", bg: "#ef4444" } },
  { key: "cong-viec",  label: "Công việc",   action: "soon",       icon: { lib: "ion", name: "checkmark-circle",   color: "#fff", bg: "#22c55e" } },
  { key: "one-ai",     label: "OneAI",       action: "soon",       icon: { lib: "mci", name: "robot",              color: "#fff", bg: "#8b5cf6" } },
  { key: "phong-hop",  label: "Phòng họp",  action: "soon",       icon: { lib: "mci", name: "video-outline",      color: "#fff", bg: "#6366f1" } },
  { key: "tuyen-dung", label: "Tuyển dụng", action: "soon",       icon: { lib: "ion", name: "people",             color: "#fff", bg: "#10b981" } },
  { key: "san-xuat",   label: "Sản xuất",   action: "soon",       icon: { lib: "mci", name: "factory",            color: "#fff", bg: "#475569" } },
  { key: "don-tu",     label: "Đơn từ",     action: "leave",      icon: { lib: "mci", name: "file-document-outline", color: "#fff", bg: "#64748b" } },
  { key: "lich-su",    label: "Lịch sử CC", action: "schedule",   icon: { lib: "ion", name: "time",               color: "#fff", bg: "#7c3aed" } },
];

// ── Dịch vụ ───────────────────────────────────────────────────────────────────
const SERVICES: { key: string; label: string; badge?: number; icon: IconDef }[] = [
  { key: "chuyen-nhan", label: "Chuyển &\nNhận",      icon: { lib: "mci", name: "swap-horizontal",     color: "#ef4444", bg: "#fee2e2" } },
  { key: "phuc-loi",    label: "Phúc lợi",             icon: { lib: "ion", name: "heart",               color: "#ec4899", bg: "#fce7f3" } },
  { key: "bao-hiem",    label: "Bảo hiểm",             icon: { lib: "ion", name: "shield-checkmark",    color: "#6366f1", bg: "#e0e7ff" } },
  { key: "thanh-toan",  label: "Thanh toán", badge: 2,  icon: { lib: "ion", name: "card",               color: "#3b82f6", bg: "#dbeafe" } },
  { key: "ho-tro-it",   label: "Hỗ trợ IT", badge: 1,  icon: { lib: "mci", name: "laptop",             color: "#10b981", bg: "#ccfbf1" } },
  { key: "van-phong",   label: "Văn phòng\nđiện tử",  icon: { lib: "mci", name: "office-building",     color: "#f59e0b", bg: "#fef3c7" } },
  { key: "ky-nang",     label: "Kỹ năng",              icon: { lib: "ion", name: "school",              color: "#22c55e", bg: "#dcfce7" } },
  { key: "tuyen-dung",  label: "Tuyển dụng",           icon: { lib: "ion", name: "people",              color: "#8b5cf6", bg: "#f3e8ff" } },
];

// ── Bản tin ───────────────────────────────────────────────────────────────────
const BANNERS = [
  { key: "1", tag: "VĂN HÓA",   title: "10 Phương châm\nToda San",   meta: "Hôm nay · 08:00",     action: "Đọc ngay", isNew: false, bg1: "#1e3a8a", bg2: "#2563eb" },
  { key: "2", tag: "SỰ KIỆN",   title: "Giải chạy\nToda San 2025",   meta: "Đăng ký trước 30/04", action: "",         isNew: true,  bg1: "#064e3b", bg2: "#059669" },
  { key: "3", tag: "TÀI CHÍNH", title: "Bảng lương Q2\nđã cập nhật", meta: "25/04/2026",           action: "Xem →",   isNew: false, bg1: "#78350f", bg2: "#d97706" },
];

export default function ThemScreen({ navigation }: any) {
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
    }, [])
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

  const soon = () => Alert.alert("Sắp ra mắt", "Tính năng đang được phát triển.");

  const handleTinhNang = (action: string) => {
    if (action === "profile")   navigation.navigate("ProfileDetail");
    else if (action === "baocao")   navigation.navigate("BaoCao");
    else if (action === "schedule") navigation.navigate("Schedule");
    else if (action === "leave")    navigation.navigate("Leave");
    else soon();
  };

  const handleApp = (action: string) => {
    if (action === "attendance") navigation.navigate("Attendance");
    else if (action === "baocao")    navigation.navigate("BaoCao");
    else if (action === "bantin")    navigation.navigate("BanTin");
    else if (action === "leave")     navigation.navigate("Leave");
    else if (action === "schedule")  navigation.navigate("Schedule");
    else soon();
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.topBar}>
          <Text style={s.topTitle}>Thêm</Text>
          <View style={s.topIcons}>
            <TouchableOpacity style={s.topIconBtn}>
              <Ionicons name="star-outline" size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity style={s.topIconBtn}>
              <Ionicons name="notifications-outline" size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity style={s.topIconBtn}>
              <Ionicons name="settings-outline" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── User Card ── */}
        <TouchableOpacity style={s.userCard} onPress={() => navigation.navigate("ProfileDetail")}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.userName}>{user?.fullName?.toUpperCase() ?? "NHÂN VIÊN"}</Text>
            <Text style={s.userRole}>{(user as any)?.job_title ?? "Nhân viên IT"}</Text>
            <Text style={s.userCompany}>CÔNG TY CỔ PHẦN SƠN MT</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </TouchableOpacity>

        {/* ── Chấm công hôm nay ── */}
        <TouchableOpacity style={s.attendCard} onPress={() => navigation.navigate("Attendance")}>
          <View style={s.attendCol}>
            <Text style={s.attendLabel}>Vào ca</Text>
            <Text style={[s.attendTime, !checkIn && s.attendDim]}>{checkIn ?? "--:--"}</Text>
            {checkIn && <Text style={s.attendOk}>✓ Đúng giờ</Text>}
          </View>
          <View style={s.attendCenter}>
            <View style={s.mapBtn}>
              <Ionicons name="location" size={24} color="#3b82f6" />
            </View>
            <Text style={s.mapLabel} numberOfLines={1}>
              {todayRecord?.branch_name ?? "Vị trí chấm công"}
            </Text>
          </View>
          <View style={[s.attendCol, { alignItems: "flex-end" }]}>
            <Text style={s.attendLabel}>Ra ca</Text>
            <Text style={[s.attendTime, !checkOut && s.attendDim]}>{checkOut ?? "--:--"}</Text>
            {checkOut && <Text style={s.attendOk}>✓ Đúng giờ</Text>}
          </View>
        </TouchableOpacity>

        {/* ── Tính năng ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Tính năng</Text>
          <View style={s.grid}>
            {TINH_NANG.map((item) => (
              <TouchableOpacity key={item.key} style={s.gridItem} onPress={() => handleTinhNang(item.action)}>
                <AppIcon icon={item.icon} />
                <Text style={s.gridLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Ứng dụng ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Ứng dụng</Text>
            <TouchableOpacity><Text style={s.linkText}>Tuỳ chỉnh</Text></TouchableOpacity>
          </View>
          <View style={s.grid}>
            {UNG_DUNG.map((app) => (
              <TouchableOpacity key={app.key} style={s.gridItem} onPress={() => handleApp(app.action)}>
                <AppIcon icon={app.icon} />
                <Text style={s.gridLabel}>{app.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Dịch vụ ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>DỊCH VỤ</Text>
            <TouchableOpacity><Text style={s.linkText}>Xem tất cả ›</Text></TouchableOpacity>
          </View>
          <View style={s.grid}>
            {SERVICES.map((item) => (
              <TouchableOpacity key={item.key} style={s.gridItem} onPress={soon}>
                <View style={{ position: "relative" }}>
                  <AppIcon icon={item.icon} />
                  {item.badge ? (
                    <View style={s.badge}>
                      <Text style={s.badgeText}>{item.badge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={s.gridLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Bản tin nội bộ ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>BẢN TIN NỘI BỘ</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={BANNERS}
            keyExtractor={(b) => b.key}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={s.bannerCard} activeOpacity={0.85}>
                <View style={[s.bannerImg, { backgroundColor: item.bg1 }]}>
                  <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: item.bg2, opacity: 0.5 }} />
                  <Text style={s.bannerTag}>{item.tag}</Text>
                  <Text style={s.bannerTitle}>{item.title}</Text>
                </View>
                <View style={s.bannerFooter}>
                  <Text style={s.bannerMeta}>{item.meta}</Text>
                  {item.isNew
                    ? <View style={s.newBadge}><Text style={s.newText}>Mới</Text></View>
                    : <Text style={s.linkText}>{item.action}</Text>
                  }
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f0f4f8" },

  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12,
  },
  topTitle: { fontSize: 22, fontWeight: "900", color: "#1e293b" },
  topIcons: { flexDirection: "row", gap: 8 },
  topIconBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },

  userCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#fff", marginHorizontal: 12, borderRadius: 14,
    padding: 14, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: "#f59e0b",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: "#fff" },
  userName: { fontSize: 14, fontWeight: "800", color: "#1e293b" },
  userRole: { fontSize: 12, color: "#64748b", marginTop: 1 },
  userCompany: { fontSize: 11, color: "#94a3b8", marginTop: 1 },

  attendCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", marginHorizontal: 12, borderRadius: 14,
    padding: 14, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  attendCol: { flex: 1 },
  attendLabel: { fontSize: 10, color: "#94a3b8", fontWeight: "700", marginBottom: 2 },
  attendTime: { fontSize: 22, fontWeight: "900", color: "#1e293b" },
  attendDim: { color: "#cbd5e1" },
  attendOk: { fontSize: 10, color: "#22c55e", fontWeight: "700", marginTop: 2 },
  attendCenter: { alignItems: "center", flex: 1.2 },
  mapBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: "#eff6ff",
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  mapLabel: { fontSize: 9, color: "#64748b", textAlign: "center", maxWidth: 72 },

  section: {
    backgroundColor: "#fff", marginHorizontal: 12, borderRadius: 14,
    padding: 14, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: "#1e293b", marginBottom: 12 },
  linkText: { fontSize: 12, color: "#3b82f6", fontWeight: "600" },

  iconBox: {
    width: 50, height: 50, borderRadius: 14,
    alignItems: "center", justifyContent: "center", marginBottom: 6,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  gridItem: { width: "25%", alignItems: "center", paddingVertical: 6 },
  gridLabel: { fontSize: 10, color: "#475569", fontWeight: "600", textAlign: "center", lineHeight: 14 },

  badge: {
    position: "absolute", top: -4, right: -4,
    backgroundColor: "#ef4444", borderRadius: 8, minWidth: 16,
    height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 3,
  },
  badgeText: { fontSize: 9, color: "#fff", fontWeight: "800" },

  bannerCard: { width: 180, borderRadius: 12, overflow: "hidden", backgroundColor: "#fff" },
  bannerImg: { height: 100, padding: 12, justifyContent: "flex-end" },
  bannerTag: { fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: "700", marginBottom: 4 },
  bannerTitle: { fontSize: 13, color: "#fff", fontWeight: "800", lineHeight: 18 },
  bannerFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 },
  bannerMeta: { fontSize: 10, color: "#94a3b8" },
  newBadge: { backgroundColor: "#22c55e", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  newText: { fontSize: 9, color: "#fff", fontWeight: "800" },
});
