import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import Logo from "../../components/auth/Logo";
import { styles } from "./LoginScreen.style";
import { setCredentials } from "../../store/slices/authSlice";
import axiosClient from "../../api/axiosClient";

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại và mật khẩu");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosClient.post("/auth/login", { phone, password });
      dispatch(
        setCredentials({
          token: res.data.token,
          user: res.data.user,
        }),
      );
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Sai số điện thoại hoặc mật khẩu";
      Alert.alert("Đăng nhập thất bại", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Logo small />
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter your phone and password</Text>
        <AppInput
          label="Số điện thoại"
          placeholder="0911957620"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <AppInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#534ab7" />
        ) : (
          <AppButton title="Log in" onPress={onLogin} />
        )}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
