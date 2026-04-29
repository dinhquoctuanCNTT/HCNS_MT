import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Vibration,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import Svg, { Path, Circle } from "react-native-svg";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { attendanceApi } from "../../../api/attendanceApi";
import styles, { COLORS } from "./AttendanceScreen.styles";

type Mode = "check_in" | "check_out";
type Status = "idle" | "processing" | "success" | "error";

export default function AttendanceScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<Mode>("check_in");
  const [status, setStatus] = useState<Status>("idle");
  const [resultTime, setResultTime] = useState("");
  const [resultDate, setResultDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [location, setLocation] = useState("");
  const [clockStr, setClockStr] = useState("");

  const cameraRef = useRef<CameraView>(null);
  const isCapturing = useRef(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const user = useSelector((state: RootState) => state.auth.user);

  // ── Đồng hồ ──────────────────────────────────────────────────────────────────
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

  // ── Scan animation ────────────────────────────────────────────────────────────
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

  // ── Reset khi đổi mode ────────────────────────────────────────────────────────
  useEffect(() => {
    if (permission?.granted) {
      setStatus("idle");
      setErrorMsg("");
      setLocation("");
    }
  }, [permission?.granted, mode]);

  // ── Mở cài đặt GPS ───────────────────────────────────────────────────────────
  const openLocationSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  // ── Chụp ảnh ──────────────────────────────────────────────────────────────────
  const handleCapture = useCallback(async () => {
    if (isCapturing.current || !cameraRef.current) return;

    // ── Lấy tọa độ GPS ───────────────────────────────────────────────────────
    let latitude: number | undefined;
    let longitude: number | undefined;

    try {
      await Location.requestForegroundPermissionsAsync();

      // Thử cache trước (nhanh, không cần GPS signal)
      const cached = await Location.getLastKnownPositionAsync({
        maxAge: 120000,
        requiredAccuracy: 1000,
      }).catch(() => null);

      if (cached) {
        latitude = cached.coords.latitude;
        longitude = cached.coords.longitude;
      } else {
        // Không có cache → lấy mới
        const fresh = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
        latitude = fresh.coords.latitude;
        longitude = fresh.coords.longitude;
      }
    } catch (e) {
      console.warn("[GPS] error:", e);
      // Vẫn tiếp tục — backend sẽ báo lỗi no_gps
    }

    // ── Tiến hành chụp ────────────────────────────────────────────────────────
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
        quality: 0.5,
      });
      if (!photo?.base64) throw new Error("Lỗi khi chụp ảnh");

      const base64Full = `data:image/jpg;base64,${photo.base64}`;
      console.log("[SEND] lat:", latitude, "lng:", longitude);
      const res =
        mode === "check_in"
          ? await attendanceApi.checkIn(base64Full, latitude, longitude)
          : await attendanceApi.checkOut(base64Full, latitude, longitude);

      Vibration.vibrate([0, 60, 60, 60]);
      const t = new Date(res.data.time);
      setResultTime(
        t.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      );
      setResultDate(
        t.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      );
      setLocation(res.data.location ?? "");
      showResult("success");
    } catch (err: any) {
      Vibration.vibrate(200);
      const data = err.response?.data;
      const msg = err.response?.data?.message || err.message || "Lỗi kết nối";

      if (
        data?.reason === "out_of_range" ||
        msg.includes("ngoài vùng") ||
        msg.includes("khu vực")
      ) {
        Alert.alert("📍 Chấm công thất bại", msg, [
          { text: "Đóng", style: "cancel" },
          { text: "Mở cài đặt GPS", onPress: openLocationSettings },
        ]);
      }
      setErrorMsg(msg);
      showResult("error");
    } finally {
      isCapturing.current = false;
    }
  }, [mode]);

  const showResult = (s: "success" | "error") => {
    setStatus(s);
    slideAnim.setValue(300);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  };

  const handleReset = () => {
    setErrorMsg("");
    setLocation("");
    setStatus("idle");
  };

  // ── Permission camera ─────────────────────────────────────────────────────────
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={styles.permissionTitle}>Cần quyền camera</Text>
        <Text style={styles.permissionSub}>
          Ứng dụng cần quyền truy cập camera để nhận diện khuôn mặt khi chấm
          công
        </Text>
        <TouchableOpacity style={styles.btnAllow} onPress={requestPermission}>
          <Text style={styles.btnAllowText}>Cho phép truy cập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 80],
  });
  const isCheckout = mode === "check_out";

  const faceFrameStyle = [
    styles.faceFrame,
    status === "processing" && styles.faceFrameScanning,
    status === "success" && styles.faceFrameSuccess,
    status === "error" && styles.faceFrameError,
  ];

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="front" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Quay về</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Chấm công</Text>
        <Text style={styles.topTime}>{clockStr}</Text>
      </View>

      {/* Mode switch */}
      <View style={styles.modeSwitch}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === "check_in" && styles.modeBtnActive]}
          onPress={() => setMode("check_in")}
        >
          <Text
            style={[
              styles.modeBtnText,
              mode === "check_in" && styles.modeBtnTextActive,
            ]}
          >
            🟢 Vào ca
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === "check_out" && styles.modeBtnActive]}
          onPress={() => setMode("check_out")}
        >
          <Text
            style={[
              styles.modeBtnText,
              mode === "check_out" && styles.modeBtnTextActive,
            ]}
          >
            🔴 Ra ca
          </Text>
        </TouchableOpacity>
      </View>

      {/* Face frame */}
      <View style={styles.faceFrameWrap} pointerEvents="none">
        <View style={faceFrameStyle} />
        {(status === "idle" || status === "processing") && (
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: scanTranslateY }] },
            ]}
          />
        )}
        {status === "idle" && (
          <Text style={styles.faceHint}>Đặt khuôn mặt vào khung</Text>
        )}
      </View>

      {/* Processing overlay */}
      {status === "processing" && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.processingText}>Đang nhận diện khuôn mặt...</Text>
          <Text style={styles.processingSubText}>
            Vui lòng giữ nguyên tư thế
          </Text>
        </View>
      )}

      {/* Bottom bar */}
      {status === "idle" && (
        <View style={styles.bottomBar}>
          <Text style={styles.gpsText}>
            📍 Vị trí sẽ được xác định khi chấm công
          </Text>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity onPress={handleCapture} activeOpacity={0.85}>
              <View
                style={[
                  styles.captureRing,
                  isCheckout && styles.captureRingCheckout,
                ]}
              >
                <View
                  style={[
                    styles.captureBtn,
                    isCheckout && styles.captureBtnCheckout,
                  ]}
                >
                  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                      stroke={isCheckout ? "#fff" : COLORS.primary}
                      strokeWidth={1.8}
                      strokeLinejoin="round"
                    />
                    <Circle
                      cx={12}
                      cy={13}
                      r={4}
                      stroke={isCheckout ? "#fff" : COLORS.primary}
                      strokeWidth={1.8}
                    />
                  </Svg>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.captureBtnLabel}>
            {isCheckout ? "Nhấn để chấm ra" : "Nhấn để chấm vào"}
          </Text>
        </View>
      )}

      {/* Result card */}
      {(status === "success" || status === "error") && (
        <Animated.View
          style={[
            styles.resultOverlay,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View
            style={[
              styles.resultCard,
              status === "success"
                ? styles.resultCardSuccess
                : styles.resultCardError,
            ]}
          >
            <View style={styles.employeeRow}>
              <View style={styles.employeeAvatar}>
                <Text style={styles.employeeAvatarText}>
                  {(user?.fullName || "U")[0].toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.employeeName}>
                  {user?.fullName || "Nhân viên"}
                </Text>
                <Text style={styles.employeeCode}>{user?.phone ?? ""}</Text>
              </View>
            </View>

            {status === "success" ? (
              <>
                <View style={styles.statusRow}>
                  <View style={[styles.statusBadge, styles.statusBadgeSuccess]}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: COLORS.success },
                      ]}
                    />
                    <Text style={[styles.statusText, styles.statusTextSuccess]}>
                      {mode === "check_in" ? "Đã chấm vào" : "Đã chấm ra"}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.checkinTime}>{resultTime}</Text>
                    <Text style={styles.checkinDate}>{resultDate}</Text>
                  </View>
                </View>
                {location ? (
                  <View style={styles.locationRow}>
                    <Text style={{ fontSize: 12 }}>📍</Text>
                    <Text style={styles.locationText}>{location}</Text>
                  </View>
                ) : null}
              </>
            ) : (
              <>
                <Text style={styles.errorMsg}>{errorMsg}</Text>
                {(errorMsg.includes("GPS") ||
                  errorMsg.includes("vị trí") ||
                  errorMsg.includes("khu vực")) && (
                  <TouchableOpacity
                    onPress={openLocationSettings}
                    style={[
                      styles.btnRetry,
                      {
                        backgroundColor: "#FEF9E7",
                        borderColor: "#F39C12",
                        marginTop: 0,
                      },
                    ]}
                  >
                    <Text style={[styles.btnRetryText, { color: "#F39C12" }]}>
                      📍 Mở cài đặt vị trí
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            <TouchableOpacity style={styles.btnRetry} onPress={handleReset}>
              <Text style={styles.btnRetryText}>Chấm lại</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
