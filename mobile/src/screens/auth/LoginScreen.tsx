import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  StatusBar,
  TextInput,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";
import { styles } from "./LoginScreen.style";
import { setCredentials } from "../../store/slices/authSlice";
import axiosClient from "../../api/axiosClient";

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passError, setPassError] = useState("");

  const onLogin = async () => {
    let hasError = false;
    if (!employeeCode.trim()) {
      setPhoneError("Mã nhân viên không được để trống");
      hasError = true;
    } else setPhoneError("");

    if (!password.trim() || password.length < 6) {
      setPassError("Mật khẩu phải có ít nhất 6 ký tự");
      hasError = true;
    } else setPassError("");

    if (hasError) return;

    try {
      setLoading(true);
      const res = await axiosClient.post("/auth/login", {
        employee_code: employeeCode.trim().toUpperCase(),
        password,
      });
      dispatch(setCredentials({ token: res.data.token, user: res.data.user }));
    } catch (err: any) {
      Alert.alert(
        "Đăng nhập thất bại",
        err.response?.data?.message || "Sai thông tin đăng nhập",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1B3F7E" />

      <View style={styles.geoBg}>
        <View style={styles.geoShape1} />
        <View style={styles.geoShape2} />
        <View style={styles.geoShape3} />
        <View style={styles.geoShape4} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <View style={styles.card}>
              <View style={styles.cardLogoWrap}>
                <Image
                  source={require("../../assets/mt-logo.png")}
                  style={styles.cardLogo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.divider} />

              <View
                style={[
                  styles.inputBox,
                  phoneError ? styles.inputErrBox : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Mã nhân viên (VD: MTH67)"
                  placeholderTextColor="#9ca3af"
                  value={employeeCode}
                  onChangeText={setEmployeeCode}
                  keyboardType="default"
                  autoCapitalize="characters"
                />
              </View>
              {phoneError ? (
                <Text style={styles.errText}>{phoneError}</Text>
              ) : (
                <View style={{ height: 10 }} />
              )}

              {/* Input mật khẩu */}
              <View
                style={[
                  styles.inputBox,
                  styles.inputRow,
                  passError ? styles.inputErrBox : null,
                  { marginTop: 16 },
                ]}
              >
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                />
                <TouchableOpacity
                  onPress={() => setShowPass((s) => !s)}
                  style={styles.eyeBtn}
                >
                  <Text style={styles.eyeTxt}>{showPass ? "👁️" : "🔒"}</Text>
                </TouchableOpacity>
              </View>
              {passError ? (
                <Text style={styles.errText}>{passError}</Text>
              ) : (
                <View style={{ height: 10 }} />
              )}

              {/* Ghi nhớ + Quên MK */}
              <View style={styles.rememberRow}>
                <TouchableOpacity
                  style={styles.checkRow}
                  onPress={() => setRemember((r) => !r)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[styles.checkbox, remember && styles.checkboxOn]}
                  >
                    {remember && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={styles.rememberTxt}>Ghi nhớ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={styles.forgotTxt}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>

              {/* Nút đăng nhập */}
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#2563EB"
                  style={{ marginVertical: 8 }}
                />
              ) : (
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={onLogin}
                  activeOpacity={0.85}
                >
                  <Text style={styles.loginTxt}>Đăng nhập</Text>
                </TouchableOpacity>
              )}

              {/* ── Illustration tích hợp trong card ── */}
              <View style={styles.illustrationWrap}>
                <Image
                  source={require("../../assets/buiding.png")}
                  style={styles.illustration}
                  resizeMode="contain"
                />
              </View>
            </View>
            {/* End card */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
