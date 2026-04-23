import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { attendanceApi } from "../../../api/attendanceApi";
import styles, { COLORS } from "./AttendanceScreen.styles";

type Mode = "check_in" | "check_out";
type Status = "idle" | "processing" | "success" | "error";

export default function AttendanceScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState(false);
  const [mode, setMode] = useState<Mode>("check_in");
  const [status, setStatus] = useState<Status>("idle");
  const [loading, setLoading] = useState(false);
  const [resultTime, setResultTime] = useState("");
  const [resultDate, setResultDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [location, setLocation] = useState("");
  const [clockStr, setClockStr] = useState("");

  const cameraRef = useRef<CameraView>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  const user = useSelector((state: RootState) => state.auth.user);

  // Đồng hồ realtime
  useEffect(() => {
    const timer = setInterval(() => {
      setClockStr(
        new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Xin quyền GPS
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
    })();
  }, []);

  // Scan animation
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

  const handleCapture = async () => {
    if (!cameraRef.current || loading) return;
    try {
      setLoading(true);
      setStatus("processing");
      setErrorMsg("");

      // Lấy GPS
      let latitude: number | undefined;
      let longitude: number | undefined;
      if (locationPermission) {
        try {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          latitude = loc.coords.latitude;
          longitude = loc.coords.longitude;
        } catch (e) {}
      }

      // Chụp ảnh
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });
      const base64 = `data:image/jpg;base64,${photo.base64}`;

      // Gọi API
      const res =
        mode === "check_in"
          ? await attendanceApi.checkIn(base64, latitude, longitude)
          : await attendanceApi.checkOut(base64, latitude, longitude);

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
      setErrorMsg(err.response?.data?.message || "Lỗi kết nối");
      showResult("error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorMsg("");
    setLocation("");
  };

  // ── Permission screen ─────────────────────────────────────
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

  return (
    <View style={styles.container}>
      {/* Camera full screen */}
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
          onPress={() => {
            setMode("check_in");
            handleReset();
          }}
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
          onPress={() => {
            setMode("check_out");
            handleReset();
          }}
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
        <View
          style={[
            styles.faceFrame,
            status === "processing" && styles.faceFrameScanning,
            status === "success" && styles.faceFrameSuccess,
            status === "error" && styles.faceFrameError,
          ]}
        />
        {(status === "idle" || status === "processing") && (
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: scanTranslateY }] },
            ]}
          />
        )}
        <Text style={styles.faceHint}>
          {status === "idle"
            ? "Đặt khuôn mặt vào khung"
            : status === "processing"
              ? "Đang xác thực..."
              : status === "success"
                ? "✓ Xác thực thành công"
                : "✗ Xác thực thất bại"}
        </Text>
      </View>

      {/* Processing overlay */}
      {status === "processing" && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
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
            {locationPermission ? "📍 GPS đã bật" : "⚠️ GPS chưa bật"}
          </Text>
          <TouchableOpacity
            style={[
              styles.btnCapture,
              mode === "check_out" && styles.btnCaptureCheckout,
              loading && { opacity: 0.6 },
            ]}
            onPress={handleCapture}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>
                {mode === "check_in" ? "📷  Chấm vào" : "📷  Chấm ra"}
              </Text>
            )}
          </TouchableOpacity>
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
            {/* Thông tin nhân viên */}
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

            {/* Status + thời gian */}
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
              <Text style={styles.errorMsg}>{errorMsg}</Text>
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
