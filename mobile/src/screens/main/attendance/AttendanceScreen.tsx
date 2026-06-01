import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
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
import { isLate } from "../history/helpers";

type Mode = "check_in" | "check_out";
type Status = "idle" | "processing" | "success" | "error";
type ShiftStatus = "before" | "active" | "after";

// ── Ca làm việc cố định ────────────────────────────────────────────────────────
const SHIFT = {
  startH: 8,
  startM: 0,
  endH: 17,
  endM: 30,
  graceMins: 5,
};

function getShiftStatus(now: Date): ShiftStatus {
  const totalMins = now.getHours() * 60 + now.getMinutes();
  const startMins = SHIFT.startH * 60 + SHIFT.startM;
  const endMins = SHIFT.endH * 60 + SHIFT.endM;
  if (totalMins < startMins + SHIFT.graceMins) return "before";
  if (totalMins < endMins) return "active";
  return "after";
}

function getCountdown(now: Date): {
  label: string;
  seconds: number;
  color: string;
} {
  const totalSecs =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const startSecs = SHIFT.startH * 3600 + SHIFT.startM * 60;
  const endSecs = SHIFT.endH * 3600 + SHIFT.endM * 60;

  if (totalSecs < startSecs) {
    return {
      label: "Ca bắt đầu sau",
      seconds: startSecs - totalSecs,
      color: "#4A90D9",
    };
  }
  if (totalSecs < endSecs) {
    return {
      label: "Ca kết thúc sau",
      seconds: endSecs - totalSecs,
      color: "#27AE60",
    };
  }
  return { label: "Ca đã kết thúc", seconds: 0, color: "#8A9BB5" };
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "--:--:--";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function getShiftLabel(status: ShiftStatus): {
  text: string;
  color: string;
  bg: string;
} {
  switch (status) {
    case "before":
      return {
        text: "Chưa vào ca",
        color: "#4A90D9",
        bg: "rgba(74,144,217,0.15)",
      };
    case "active":
      return {
        text: "Đang trong ca",
        color: "#27AE60",
        bg: "rgba(39,174,96,0.15)",
      };
    case "after":
      return {
        text: "Đã ra ca",
        color: "#8A9BB5",
        bg: "rgba(138,155,181,0.15)",
      };
  }
}

// ── Shift Info Bar ─────────────────────────────────────────────────────────────
function ShiftBar({ now }: { now: Date }) {
  const shiftStatus = getShiftStatus(now);
  const countdown = getCountdown(now);
  const label = getShiftLabel(shiftStatus);

  return (
    <View
      style={{
        position: "absolute",
        top: Platform.OS === "ios" ? 110 : 94,
        left: 16,
        right: 16,
        backgroundColor: "rgba(0,0,0,0.55)",
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
      }}
    >
      {/* Row 1: Ca làm việc + trạng thái */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 11,
              fontWeight: "600",
            }}
          >
            CA LÀM VIỆC
          </Text>
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>
            {String(SHIFT.startH).padStart(2, "0")}:
            {String(SHIFT.startM).padStart(2, "0")}
            {" – "}
            {String(SHIFT.endH).padStart(2, "0")}:
            {String(SHIFT.endM).padStart(2, "0")}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: label.bg,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: label.color + "55",
          }}
        >
          <Text style={{ color: label.color, fontSize: 10, fontWeight: "700" }}>
            {label.text}
          </Text>
        </View>
      </View>

      {/* Row 2: Đếm ngược */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>
          {countdown.label}
        </Text>
        <Text
          style={{
            color: countdown.color,
            fontSize: 18,
            fontWeight: "800",
            letterSpacing: 1,
            fontVariant: ["tabular-nums"],
          }}
        >
          {countdown.seconds > 0 ? formatCountdown(countdown.seconds) : "--"}
        </Text>
      </View>
    </View>
  );
}

export default function AttendanceScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<Mode>("check_in");
  const [status, setStatus] = useState<Status>("idle");
  const [resultTime, setResultTime] = useState("");
  const [resultDate, setResultDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [location, setLocation] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [now, setNow] = useState(new Date());

  const cameraRef = useRef<CameraView>(null);
  const isCapturing = useRef(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-detect check_in / check_out dựa trên record hôm nay
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    attendanceApi.getHistory(today, today)
      .then(res => {
        const record = Array.isArray(res.data) ? res.data[0] : null;
        if (record?.check_in && !record?.check_out) {
          setMode("check_out");
        } else {
          setMode("check_in");
        }
      })
      .catch(() => setMode("check_in"));
  }, []);

  const clockStr = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });


  useEffect(() => {
    if (permission?.granted) {
      setStatus("idle");
      setErrorMsg("");
      setLocation("");
    }
  }, [permission?.granted, mode]);

  const openLocationSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  // Lấy địa chỉ từ tọa độ GPS
  const getAddressFromCoords = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (results?.length > 0) {
        const r = results[0];
        const parts = [r.streetNumber, r.street, r.district, r.city].filter(Boolean);
        return parts.join(", ");
      }
    } catch (e) {
      console.warn("[ReverseGeocode] error:", e);
    }
    return "";
  }, []);

  // Tự động lấy vị trí hiện tại khi màn hình idle
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted || cancelled) return;
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (cancelled) return;
        const { latitude, longitude } = pos.coords;
        setCurrentCoords({ lat: latitude, lng: longitude });
        const addr = await getAddressFromCoords(latitude, longitude);
        if (!cancelled) setCurrentAddress(addr);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [mode, getAddressFromCoords]);

  const handleCapture = useCallback(async () => {
    if (isCapturing.current || !cameraRef.current) return;

    let latitude: number | undefined;
    let longitude: number | undefined;
    let address: string | undefined;

    try {
      await Location.requestForegroundPermissionsAsync();
      const cached = await Location.getLastKnownPositionAsync({
        maxAge: 120000,
        requiredAccuracy: 1000,
      }).catch(() => null);

      if (cached) {
        latitude = cached.coords.latitude;
        longitude = cached.coords.longitude;
      } else {
        const fresh = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
        latitude = fresh.coords.latitude;
        longitude = fresh.coords.longitude;
      }

      if (latitude && longitude) {
        address = await getAddressFromCoords(latitude, longitude);
      }
    } catch (e) {
      console.warn("[GPS] error:", e);
    }

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
      const res =
        mode === "check_in"
          ? await attendanceApi.checkIn(base64Full, latitude, longitude, address)
          : await attendanceApi.checkOut(base64Full, latitude, longitude, address);

      Vibration.vibrate([0, 60, 60, 60]);
      // Sau check_in → bước tiếp là check_out, và ngược lại
      setMode(prev => prev === "check_in" ? "check_out" : "check_in");
      console.log("[CHECKIN RESULT]", JSON.stringify(res.data));
      const t = new Date(res.data.time);
      setResultTime(
        t.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      setResultDate(
        t.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
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
      if (address) setCurrentAddress(address);
      showResult("success");
    } catch (err: any) {
      Vibration.vibrate(200);
      const data = err.response?.data;
      const msg = err.response?.data?.message || err.message || "Lỗi kết nối";
      console.log("[Attendance Error]", JSON.stringify(err.response?.data));

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

  // ── Permission ────────────────────────────────────────────────────────────────
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

  const isCheckout = mode === "check_out";

  const cornerColor =
    status === "success" ? COLORS.success :
    status === "error"   ? COLORS.danger  : "#F97316";

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

      {/* Shift info bar */}
      <ShiftBar now={now} />

      {/* Face frame – corner brackets */}
      <View style={styles.faceFrameWrap} pointerEvents="none">
        <Text style={styles.faceHint}>Đưa khuôn mặt vào vùng chỉ định</Text>
        <View style={styles.faceFrame}>
          <View style={[styles.corner, styles.cornerTL, { borderColor: cornerColor }]} />
          <View style={[styles.corner, styles.cornerTR, { borderColor: cornerColor }]} />
          <View style={[styles.corner, styles.cornerBL, { borderColor: cornerColor }]} />
          <View style={[styles.corner, styles.cornerBR, { borderColor: cornerColor }]} />
        </View>
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
          {/* Thông tin vị trí hiện tại */}
          <View style={{ marginBottom: 8, alignItems: "center" }}>
            {currentAddress ? (
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 4, maxWidth: "90%" }}>
                <Text style={{ fontSize: 13 }}>📍</Text>
                <Text style={{ color: "#e2e8f0", fontSize: 12, flex: 1, textAlign: "center", lineHeight: 18 }}>
                  {currentAddress}
                </Text>
              </View>
            ) : (
              <Text style={styles.gpsText}>📍 Đang xác định vị trí...</Text>
            )}
            {currentCoords && (
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 2 }}>
                {currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)}
              </Text>
            )}
          </View>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity onPress={handleCapture} activeOpacity={0.85}>
              <View style={styles.captureBtn}>
                <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                    stroke="#fff"
                    strokeWidth={1.8}
                    strokeLinejoin="round"
                  />
                  <Circle cx={12} cy={13} r={4} stroke="#fff" strokeWidth={1.8} />
                </Svg>
              </View>
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.captureBtnLabel}>
            {isCheckout ? "🔴  Nhấn để chấm ra ca" : "🟢  Nhấn để chấm vào ca"}
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
                {/* Tên chi nhánh / văn phòng */}
                {location ? (
                  <View style={styles.locationRow}>
                    <Text style={{ fontSize: 12 }}>🏢</Text>
                    <Text style={styles.locationText}>{location}</Text>
                  </View>
                ) : null}
                {/* Địa chỉ thực tế từ GPS */}
                {currentAddress ? (
                  <View style={[styles.locationRow, { marginTop: 4 }]}>
                    <Text style={{ fontSize: 12 }}>📍</Text>
                    <Text style={[styles.locationText, { fontSize: 12, color: "#64748b" }]}>
                      {currentAddress}
                    </Text>
                  </View>
                ) : null}
                {/* Tọa độ GPS */}
                {currentCoords && (
                  <View style={[styles.locationRow, { marginTop: 2 }]}>
                    <Text style={{ fontSize: 11 }}>🛰️</Text>
                    <Text style={{ fontSize: 11, color: "#94a3b8" }}>
                      {currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)}
                    </Text>
                  </View>
                )}
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
            {status === "success" && (
              <TouchableOpacity
                style={[
                  styles.btnRetry,
                  { backgroundColor: "#EFF6FF", borderColor: "#0e7fc0" },
                ]}
                onPress={() =>
                  navigation.navigate("Schedule", { screen: "Stats" })
                }
              >
                <Text style={[styles.btnRetryText, { color: "#0e7fc0" }]}>
                  📊 Xem thống kê
                </Text>
              </TouchableOpacity>
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
