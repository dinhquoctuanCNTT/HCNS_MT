import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { logout } from "../../../store/slices/authSlice";

const COLORS = {
  primary: "#4A90D9",
  primaryLight: "#EBF4FF",
  bg: "#F0F4FA",
  white: "#FFFFFF",
  textDark: "#1A2340",
  textMid: "#4A5568",
  textLight: "#8A9BB5",
  border: "#DDE5F0",
  danger: "#E74C3C",
  dangerLight: "#FDEDEC",
};

const INFO_ITEMS = [
  { icon: "👤", label: "Họ và tên", key: "fullName" },
  { icon: "📱", label: "Số điện thoại", key: "phone" },
  { icon: "🏢", label: "Vai trò", key: "role" },
];

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

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
          <Text style={s.userRole}>{user?.role || "Nhân viên"}</Text>
        </View>

        {/* Thông tin */}
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
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  back: { color: COLORS.primary, fontSize: 14, fontWeight: "600" },
  headerTitle: { color: COLORS.textDark, fontSize: 17, fontWeight: "700" },
  avatarSection: { alignItems: "center", paddingVertical: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: "700", color: "#fff" },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  userRole: { fontSize: 13, color: COLORS.textLight, fontWeight: "500" },
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
