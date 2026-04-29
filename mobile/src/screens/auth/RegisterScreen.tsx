import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Vibration,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Svg, { Path, Circle } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setCredentials } from "../../store/slices/authSlice";
import axiosClient from "../../api/axiosClient";

const COLORS = {
  primary: "#4A90D9",
  primaryLight: "#EBF4FF",
  success: "#27AE60",
  successLight: "#E8F8F0",
  danger: "#E74C3C",
  warning: "#F39C12",
  white: "#FFFFFF",
  textDark: "#1A2340",
  textLight: "#8A9BB5",
  overlay: "rgba(0,0,0,0.65)",
};

type Status = "idle" | "processing" | "success" | "error";

export default function RegisterFaceScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [clockStr, setClockStr] = useState("");

  const cameraRef = useRef<CameraView>(null);
  const isCapturing = useRef(false);
  const scanAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  // ── Đồng hồ ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setClockStr(
        new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // ── Scan animation ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "idle" || status === "processing") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
      ).start();
    } else {
      scanAnim.stopAnimation();
    }
  }, [status]);

  // ── Chụp và đăng ký ─────────────────────────────────────────────────────────
  const handleCapture = useCallback(async () => {
    if (isCapturing.current || !cameraRef.current) return;
    isCapturing.current = true;

    Vibration.vibrate(40);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.88,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      setStatus("processing");

      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });
      if (!photo?.base64) throw new Error("Lỗi khi chụp ảnh");

      const base64Full = `data:image/jpg;base64,${photo.base64}`;

      // Gọi API đăng ký khuôn mặt
      await axiosClient.post("/attendance/register-face", {
        image: base64Full,
      });

      // Cập nhật Redux — đánh dấu đã đăng ký khuôn mặt
      dispatch(
        setCredentials({
          token: token!,
          user: { ...user, has_registered_face: true } as any,
        }),
      );

      Vibration.vibrate([0, 60, 60, 60]);
      setStatus("success");

      // Hiện result rồi tự chuyển sang Home sau 2 giây
      slideAnim.setValue(300);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }).start();

      setTimeout(() => {
        navigation.replace("Tabs"); // vào Home
      }, 2000);
    } catch (err: any) {
      Vibration.vibrate(200);
      setErrorMsg(err.response?.data?.message || err.message || "Lỗi kết nối");
      setStatus("error");
      slideAnim.setValue(300);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }).start();
    } finally {
      isCapturing.current = false;
    }
  }, [user, token, dispatch, navigation]);

  const handleRetry = () => {
    setStatus("idle");
    setErrorMsg("");
  };

  // ── Permission ───────────────────────────────────────────────────────────────
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={s.permissionContainer}>
        <Text style={s.permissionIcon}>📷</Text>
        <Text style={s.permissionTitle}>Cần quyền camera</Text>
        <Text style={s.permissionSub}>
          Ứng dụng cần quyền camera để chụp khuôn mặt làm dữ liệu gốc cho chấm
          công
        </Text>
        <TouchableOpacity style={s.btnAllow} onPress={requestPermission}>
          <Text style={s.btnAllowText}>Cho phép truy cập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 80],
  });

  const frameStyle = [
    s.faceFrame,
    status === "processing" && s.faceFrameScanning,
    status === "success" && s.faceFrameSuccess,
    status === "error" && s.faceFrameError,
  ];

  return (
    <View style={s.container}>
      <CameraView ref={cameraRef} style={s.camera} facing="front" />

      {/* Top bar */}
      <View style={s.topBar}>
        <View style={{ width: 60 }} />
        <Text style={s.topTitle}>Đăng ký khuôn mặt</Text>
        <Text style={s.topTime}>{clockStr}</Text>
      </View>

      {/* Hướng dẫn */}
      <View style={s.guideBanner}>
        <Text style={s.guideText}>
          📋 Đây là lần đăng ký khuôn mặt gốc. Vui lòng nhìn thẳng vào camera và
          chụp trong điều kiện ánh sáng tốt.
        </Text>
      </View>

      {/* Face frame */}
      <View style={s.faceFrameWrap} pointerEvents="none">
        <View style={frameStyle} />
        {(status === "idle" || status === "processing") && (
          <Animated.View
            style={[
              s.scanLine,
              { transform: [{ translateY: scanTranslateY }] },
            ]}
          />
        )}
        {status === "idle" && (
          <Text style={s.faceHint}>Đặt khuôn mặt vào khung</Text>
        )}
      </View>

      {/* Processing overlay */}
      {status === "processing" && (
        <View style={s.processingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={s.processingText}>Đang lưu khuôn mặt gốc...</Text>
          <Text style={s.processingSubText}>Vui lòng giữ nguyên tư thế</Text>
        </View>
      )}

      {/* Nút chụp tròn */}
      {status === "idle" && (
        <View style={s.bottomBar}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity onPress={handleCapture} activeOpacity={0.85}>
              <View style={s.captureRing}>
                <View style={s.captureBtn}>
                  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                      stroke={COLORS.primary}
                      strokeWidth={1.8}
                      strokeLinejoin="round"
                    />
                    <Circle
                      cx={12}
                      cy={13}
                      r={4}
                      stroke={COLORS.primary}
                      strokeWidth={1.8}
                    />
                  </Svg>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
          <Text style={s.captureBtnLabel}>Nhấn để đăng ký khuôn mặt</Text>
        </View>
      )}

      {/* Result card */}
      {(status === "success" || status === "error") && (
        <Animated.View
          style={[s.resultOverlay, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={s.resultCard}>
            <View style={s.employeeRow}>
              <View style={s.employeeAvatar}>
                <Text style={s.employeeAvatarText}>
                  {(user?.fullName || "U")[0].toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.employeeName}>
                  {user?.fullName || "Nhân viên"}
                </Text>
                <Text style={s.employeeCode}>{(user as any)?.phone ?? ""}</Text>
              </View>
            </View>

            {status === "success" ? (
              <View style={s.successWrap}>
                <Text style={s.successIcon}>✅</Text>
                <Text style={s.successTitle}>Đăng ký thành công!</Text>
                <Text style={s.successSub}>
                  Khuôn mặt của bạn đã được lưu. Đang chuyển vào trang chủ...
                </Text>
              </View>
            ) : (
              <>
                <Text style={s.errorMsg}>{errorMsg}</Text>
                <TouchableOpacity style={s.btnRetry} onPress={handleRetry}>
                  <Text style={s.btnRetryText}>Thử lại</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const { width } = require("react-native").Dimensions.get("window");

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },

  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 52 : 36,
    paddingBottom: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  topTitle: { color: "#fff", fontSize: 15, fontWeight: "700" },
  topTime: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
    width: 60,
    textAlign: "right",
  },

  guideBanner: {
    position: "absolute",
    top: Platform.OS === "ios" ? 110 : 94,
    left: 16,
    right: 16,
    backgroundColor: "rgba(74,144,217,0.85)",
    borderRadius: 12,
    padding: 12,
  },
  guideText: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  faceFrameWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  faceFrame: {
    width: width * 0.62,
    height: width * 0.75,
    borderRadius: width * 0.38,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.7)",
    borderStyle: "dashed",
  },
  faceFrameScanning: { borderColor: COLORS.warning, borderStyle: "solid" },
  faceFrameSuccess: {
    borderColor: COLORS.success,
    borderStyle: "solid",
    borderWidth: 4,
  },
  faceFrameError: {
    borderColor: COLORS.danger,
    borderStyle: "solid",
    borderWidth: 4,
  },
  scanLine: {
    position: "absolute",
    width: width * 0.55,
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.7,
  },
  faceHint: {
    marginTop: 20,
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },

  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  processingText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  processingSubText: { color: "rgba(255,255,255,0.65)", fontSize: 12 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 44 : 32,
    paddingTop: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    gap: 14,
  },
  captureRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureBtnLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "600",
  },

  resultOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
  },
  resultCard: {
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  employeeRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#DDE5F0",
  },
  employeeAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  employeeAvatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
  },
  employeeName: { fontSize: 16, fontWeight: "700", color: COLORS.textDark },
  employeeCode: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },

  successWrap: { alignItems: "center", padding: 20, gap: 8 },
  successIcon: { fontSize: 48 },
  successTitle: { fontSize: 18, fontWeight: "700", color: COLORS.success },
  successSub: {
    fontSize: 13,
    color: "#8A9BB5",
    textAlign: "center",
    lineHeight: 20,
  },

  errorMsg: {
    fontSize: 13,
    color: COLORS.danger,
    textAlign: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    lineHeight: 20,
  },
  btnRetry: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#DDE5F0",
    alignItems: "center",
    backgroundColor: "#F0F4FA",
  },
  btnRetryText: { color: "#4A5568", fontSize: 13, fontWeight: "600" },

  permissionContainer: {
    flex: 1,
    backgroundColor: "#F0F4FA",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  permissionIcon: { fontSize: 64, marginBottom: 20 },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: "center",
  },
  permissionSub: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  btnAllow: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 48,
  },
  btnAllowText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
