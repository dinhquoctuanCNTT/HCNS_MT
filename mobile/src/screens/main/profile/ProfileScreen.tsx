import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { logout } from "../../../store/slices/authSlice";

const COLORS = {
  primary: "#4A90D9",
  primaryLight: "#EBF4FF",
  success: "#27AE60",
  successLight: "#E8F8F0",
  bg: "#F0F4FA",
  white: "#FFFFFF",
  textDark: "#1A2340",
  textMid: "#4A5568",
  textLight: "#8A9BB5",
  border: "#DDE5F0",
  danger: "#E74C3C",
  dangerLight: "#FDEDEC",
  warning: "#F39C12",
  warningLight: "#FEF9E7",
};

const INFO_ITEMS = [
  { icon: "👤", label: "Họ và tên", key: "fullName" },
  { icon: "📱", label: "Số điện thoại", key: "phone" },
  { icon: "🏢", label: "Vai trò", key: "role" },
];

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const hasFace = !!(user as any)?.has_registered_face;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.back}>← Quay về</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Tài khoản</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>
              {(user?.fullName || "U")[0].toUpperCase()}
            </Text>
          </View>
          <Text style={s.userName}>{user?.fullName || "Nhân viên"}</Text>
          <Text style={s.userRole}>{(user as any)?.role || "Nhân viên"}</Text>

          {/* Badge trạng thái khuôn mặt */}
          <View
            style={[s.faceBadge, hasFace ? s.faceBadgeOk : s.faceBadgeWarn]}
          >
            <Text
              style={[
                s.faceBadgeText,
                hasFace ? s.faceBadgeTextOk : s.faceBadgeTextWarn,
              ]}
            >
              {hasFace ? "✓ Đã đăng ký khuôn mặt" : "⚠ Chưa đăng ký khuôn mặt"}
            </Text>
          </View>
        </View>

        {/* Nút đăng ký / cập nhật khuôn mặt */}
        <TouchableOpacity
          style={[s.btnFace, hasFace && s.btnFaceUpdate]}
          onPress={() => navigation.navigate("RegisterFace")}
        >
          <Text style={[s.btnFaceText, hasFace && s.btnFaceTextUpdate]}>
            {hasFace ? "🔄 Cập nhật khuôn mặt" : "📷 Đăng ký khuôn mặt"}
          </Text>
          <Text style={[s.btnFaceSub, hasFace && { color: COLORS.primary }]}>
            {hasFace
              ? "Chụp lại để cập nhật dữ liệu khuôn mặt"
              : "Bắt buộc để sử dụng tính năng chấm công"}
          </Text>
        </TouchableOpacity>

        {/* Thông tin cá nhân */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Thông tin cá nhân</Text>
          {INFO_ITEMS.map((item, i) => (
            <View
              key={i}
              style={[s.infoRow, i < INFO_ITEMS.length - 1 && s.infoRowBorder]}
            >
              <Text style={s.infoIcon}>{item.icon}</Text>
              <View style={s.infoContent}>
                <Text style={s.infoLabel}>{item.label}</Text>
                <Text style={s.infoValue}>
                  {(user as any)?.[item.key] || "—"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Đăng xuất */}
        <TouchableOpacity
          style={s.btnLogout}
          onPress={() => dispatch(logout())}
        >
          <Text style={s.btnLogoutText}>🚪 Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 52 : 36,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  back: { color: COLORS.primary, fontSize: 14, fontWeight: "600" },
  headerTitle: { color: COLORS.textDark, fontSize: 17, fontWeight: "700" },

  avatarSection: { alignItems: "center", paddingVertical: 24, gap: 6 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarText: { fontSize: 36, fontWeight: "700", color: "#fff" },
  userName: { fontSize: 20, fontWeight: "800", color: COLORS.textDark },
  userRole: { fontSize: 13, color: COLORS.textLight, fontWeight: "500" },

  // Badge khuôn mặt
  faceBadge: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  faceBadgeOk: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },
  faceBadgeWarn: {
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
  },
  faceBadgeText: { fontSize: 12, fontWeight: "600" },
  faceBadgeTextOk: { color: COLORS.success },
  faceBadgeTextWarn: { color: COLORS.warning },

  // Nút đăng ký khuôn mặt
  btnFace: {
    backgroundColor: COLORS.warning,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.warning,
    gap: 4,
  },
  btnFaceUpdate: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  btnFaceText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  btnFaceTextUpdate: { color: COLORS.primary },
  btnFaceSub: { fontSize: 12, color: "rgba(255,255,255,0.8)" },

  // Card thông tin
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "rgba(0,0,0,0.06)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoIcon: { fontSize: 20, width: 32 },
  infoContent: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 2,
    fontWeight: "500",
  },
  infoValue: { fontSize: 15, fontWeight: "600", color: COLORS.textDark },

  btnLogout: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.danger,
  },
  btnLogoutText: { color: COLORS.danger, fontSize: 15, fontWeight: "700" },
});
