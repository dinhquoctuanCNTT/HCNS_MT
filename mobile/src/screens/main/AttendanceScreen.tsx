import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { attendanceApi } from "../../api/attendanceApi";

export default function AttendanceScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    action: string;
    time: string;
    confidence: number;
  }>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Cần quyền truy cập camera</Text>
        <TouchableOpacity style={styles.btnAllow} onPress={requestPermission}>
          <Text style={styles.btnText}>Cho phép</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || loading) return;
    try {
      setLoading(true);
      setResult(null);
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });
      const base64 = `data:image/jpg;base64,${photo.base64}`;
      const res = await attendanceApi.checkIn(base64);
      setResult(res.data);
    } catch (err: any) {
      Alert.alert("Thất bại", err.response?.data?.message || "Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Quay về</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chấm công</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Camera */}
      <View style={styles.cameraWrap}>
        <View style={{ flex: 1 }}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            ratio="4:3"
          />
          <View style={styles.faceFrame} />
        </View>
      </View>

      {/* Kết quả */}
      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultIcon}>
            {result.action === "check_in" ? "✅" : "👋"}
          </Text>
          <Text style={styles.resultTitle}>
            {result.action === "check_in" ? "Đã chấm vào" : "Đã chấm ra"}
          </Text>
          <Text style={styles.resultTime}>
            {new Date(result.time).toLocaleTimeString("vi-VN")}
          </Text>
          <Text style={styles.resultConf}>
            Độ tin cậy: {result.confidence}%
          </Text>
        </View>
      )}

      {/* Nút chụp */}
      <TouchableOpacity
        style={[styles.btnCapture, loading && { opacity: 0.6 }]}
        onPress={handleCapture}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>📷 Chấm công</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 52,
  },
  back: { color: "#9090aa", fontSize: 14 },
  headerTitle: { color: "#f0f0f5", fontSize: 16, fontWeight: "600" },
  cameraWrap: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: "hidden",
    aspectRatio: 3 / 4, // ← đổi height: 380 → aspectRatio
  },
  camera: { flex: 1 },
  faceFrame: {
    position: "absolute",
    alignSelf: "center",
    top: 60,
    width: 200,
    height: 240,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#534ab7",
    borderStyle: "dashed",
  },
  resultCard: {
    margin: 24,
    backgroundColor: "#1e1e2e",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a3e",
  },
  resultIcon: { fontSize: 36, marginBottom: 8 },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f0f0f5",
    marginBottom: 4,
  },
  resultTime: {
    fontSize: 28,
    fontWeight: "700",
    color: "#534ab7",
    marginBottom: 4,
  },
  resultConf: { fontSize: 13, color: "#6b6f85" },
  btnCapture: {
    marginHorizontal: 24,
    marginTop: "auto",
    marginBottom: 32,
    backgroundColor: "#534ab7",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  message: {
    color: "#f0f0f5",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  btnAllow: {
    backgroundColor: "#534ab7",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
});
