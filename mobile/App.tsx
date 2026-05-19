import React, { useEffect, useState } from "react";
import {
  View, ActivityIndicator, Alert, Modal,
  Text, TouchableOpacity, Linking, StyleSheet,
} from "react-native";
import { Provider, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { store } from "./src/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { restoreSession } from "./src/store/slices/authSlice";

const APP_VERSION_CODE = 1;
const VERSION_CHECK_URL =
  "https://raw.githubusercontent.com/dinhquoctuanCNTT/HCNS_MT/refs/heads/main/version.json";

function AppContent() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [updateInfo, setUpdateInfo] = useState<{
    versionName: string;
    apkUrl: string;
    releaseNotes: string;
  } | null>(null);

  useEffect(() => {
    // 1. Kiểm tra phiên bản APK mới trên GitHub
    const checkAppVersion = async () => {
      try {
        console.log("VERSION CHECK: fetching...");
        const res = await fetch(VERSION_CHECK_URL);
        const data = await res.json();
        console.log("VERSION CHECK: remote=", data.versionCode, "local=", APP_VERSION_CODE);
        if (data.versionCode > APP_VERSION_CODE) {
          console.log("VERSION CHECK: new version found, showing modal");
          setUpdateInfo({
            versionName: data.versionName,
            apkUrl: data.apkUrl,
            releaseNotes: data.releaseNotes,
          });
        }
      } catch (e) {
        console.log("VERSION CHECK error:", e);
      }
    };
    checkAppVersion();

    // 2. Tự động kiểm tra và tải cập nhật OTA (Chỉ chạy ở môi trường build thật, không chạy ở Dev mode)
    const checkUpdates = async () => {
      if (__DEV__) return;
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            "Cập nhật mới",
            "Đã tải xong phiên bản mới nhất. Ứng dụng sẽ tự động khởi động lại để áp dụng thay đổi.",
            [{ text: "Đồng ý", onPress: async () => await Updates.reloadAsync() }]
          );
        }
      } catch (e) {
        console.log("Check updates error:", e);
      }
    };
    checkUpdates();

    // 2. Khôi phục phiên làm việc đăng nhập
    const restoreToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userStr = await AsyncStorage.getItem("user");
        if (token && userStr) {
          dispatch(
            restoreSession({
              token,
              user: JSON.parse(userStr),
            }),
          );
        }
      } catch (e) {
        console.log("Restore session error:", e);
      } finally {
        setLoading(false);
      }
    };
    restoreToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f0f1a" }}>
        <ActivityIndicator size="large" color="#534ab7" />
      </View>
    );
  }

  return (
    <>
      <AppNavigator />

      <Modal visible={!!updateInfo} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.card}>
            <View style={s.badge}>
              <Text style={s.badgeText}>Cập nhật mới</Text>
            </View>
            <Text style={s.title}>Phiên bản {updateInfo?.versionName}</Text>
            <Text style={s.notes}>{updateInfo?.releaseNotes}</Text>
            <TouchableOpacity
              style={s.btn}
              onPress={() => updateInfo && Linking.openURL(updateInfo.apkUrl)}
            >
              <Text style={s.btnText}>Tải về & Cài đặt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center", alignItems: "center", padding: 24,
  },
  card: {
    backgroundColor: "#fff", borderRadius: 20, padding: 24,
    width: "100%", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
  badge: {
    backgroundColor: "#EFF6FF", borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12,
  },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#1D4ED8" },
  title: { fontSize: 20, fontWeight: "900", color: "#1E293B", marginBottom: 8 },
  notes: { fontSize: 14, color: "#64748B", textAlign: "center", marginBottom: 24, lineHeight: 20 },
  btn: {
    backgroundColor: "#0A4FA0", borderRadius: 14,
    paddingHorizontal: 32, paddingVertical: 14, width: "100%", alignItems: "center",
  },
  btnText: { fontSize: 15, fontWeight: "800", color: "#fff" },
});

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
