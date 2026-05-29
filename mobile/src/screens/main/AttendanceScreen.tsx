// screens/AttendanceScreen.tsx
// Đã cập nhật: luồng 3 bước (Chụp → Preview → Gọi API)

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAttendanceCamera } from "../hooks/useAttendanceCamera";
import AttendanceConfirmModal from "../components/AttendanceConfirmModal";
import { attendanceApi } from "../api/attendanceApi";

type AttendanceType = "check_in" | "check_out";

export default function AttendanceScreen() {
  const { snapshot, loading, error, capture, reset } = useAttendanceCamera();
  const [attendanceType, setAttendanceType] =
    useState<AttendanceType>("check_in");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Bước 1: Người dùng bấm nút → chụp ảnh + lấy vị trí
  const handlePress = async (type: AttendanceType) => {
    setAttendanceType(type);
    await capture();
    // Nếu capture thành công, hiện modal preview
    setShowModal(true);
  };

  // Bước 2: Người dùng bấm "Chụp lại"
  const handleRetake = () => {
    setShowModal(false);
    reset();
  };

  // Bước 3: Người dùng bấm "Xác nhận" → gọi API
  const handleConfirm = async () => {
    if (!snapshot) return;
    setSubmitting(true);
    try {
      if (attendanceType === "check_in") {
        await attendanceApi.checkIn({
          photo_base64: snapshot.photoBase64,
          latitude: snapshot.latitude,
          longitude: snapshot.longitude,
          address: snapshot.address,
          timestamp: snapshot.timestamp,
        });
        Alert.alert("Thành công", "Check-in thành công!");
      } else {
        await attendanceApi.checkOut({
          photo_base64: snapshot.photoBase64,
          latitude: snapshot.latitude,
          longitude: snapshot.longitude,
          address: snapshot.address,
          timestamp: snapshot.timestamp,
        });
        Alert.alert("Thành công", "Check-out thành công!");
      }
      setShowModal(false);
      reset();
    } catch (e: any) {
      Alert.alert("Lỗi", e?.response?.data?.message ?? "Chấm công thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chấm Công</Text>
      <Text style={styles.subtitle}>Chọn loại chấm công bên dưới</Text>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.btn, styles.btnCheckIn]}
          onPress={() => handlePress("check_in")}
          disabled={loading}
        >
          {loading && attendanceType === "check_in" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.btnIcon}>📷</Text>
              <Text style={styles.btnText}>Check-in</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnCheckOut]}
          onPress={() => handlePress("check_out")}
          disabled={loading}
        >
          {loading && attendanceType === "check_out" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.btnIcon}>🏁</Text>
              <Text style={styles.btnText}>Check-out</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal Preview */}
      <AttendanceConfirmModal
        visible={showModal && !!snapshot}
        snapshot={snapshot}
        type={attendanceType}
        submitting={submitting}
        onRetake={handleRetake}
        onConfirm={handleConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    marginBottom: 40,
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    width: "100%",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  btn: {
    flex: 1,
    height: 100,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  btnCheckIn: {
    backgroundColor: "#2563EB",
  },
  btnCheckOut: {
    backgroundColor: "#059669",
  },
  btnIcon: {
    fontSize: 28,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
