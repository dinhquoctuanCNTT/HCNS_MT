import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";

export default function HomeScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Xin chào, {user?.fullName || "bạn"} 👋
      </Text>
      <Text style={styles.subtitle}>{user?.phone ?? ""}</Text>

      <TouchableOpacity
        style={styles.btnAttendance}
        onPress={() => navigation.navigate("Attendance")}
      >
        <Text style={styles.btnText}>📷 Chấm công</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnLogout}
        onPress={() => dispatch(logout())}
      >
        <Text style={styles.btnLogoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f0f0f5",
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: "#6b6f85", marginBottom: 48 },
  btnAttendance: {
    backgroundColor: "#534ab7",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginBottom: 16,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  btnLogout: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2a3e",
  },
  btnLogoutText: { color: "#6b6f85", fontSize: 14 },
});
