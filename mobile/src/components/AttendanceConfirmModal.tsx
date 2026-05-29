// components/AttendanceConfirmModal.tsx
// Màn hình Preview: hiển thị ảnh + giờ + địa chỉ, 2 nút Chụp lại / Xác nhận

import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { AttendanceSnapshot } from "../hooks/useAttendanceCamera";

interface Props {
  visible: boolean;
  snapshot: AttendanceSnapshot | null;
  type: "check_in" | "check_out";
  submitting: boolean;
  onRetake: () => void;
  onConfirm: () => void;
}

function formatTime(isoString: string) {
  const d = new Date(isoString);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} – ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export default function AttendanceConfirmModal({
  visible,
  snapshot,
  type,
  submitting,
  onRetake,
  onConfirm,
}: Props) {
  if (!snapshot) return null;

  const label = type === "check_in" ? "Check-in" : "Check-out";

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Xác nhận {label}</Text>

        {/* Ảnh vừa chụp */}
        <Image source={{ uri: snapshot.photoUri }} style={styles.photo} />

        {/* Thông tin */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🕐</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Thời gian</Text>
              <Text style={styles.infoValue}>
                {formatTime(snapshot.timestamp)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Địa điểm</Text>
              <Text style={styles.infoValue}>{snapshot.address}</Text>
              <Text style={styles.infoCoords}>
                {snapshot.latitude.toFixed(6)}, {snapshot.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        </View>

        {/* Nút hành động */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={onRetake}
            disabled={submitting}
          >
            <Text style={styles.btnSecondaryText}>Chụp lại</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              styles.btnPrimary,
              submitting && styles.btnDisabled,
            ]}
            onPress={onConfirm}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnPrimaryText}>Xác nhận {label}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  photo: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    backgroundColor: "#ddd",
    marginBottom: 20,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoIcon: {
    fontSize: 22,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  infoCoords: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    backgroundColor: "#f0f0f0",
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  btnPrimary: {
    backgroundColor: "#2563EB",
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
