import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

type Props = {
  label: string;
  placeholder?: string;
  placehoder?: string; // giữ lại tên cũ để không lỗi chỗ khác
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

// ── Eye icons ────────────────────────────────────────────────
function EyeOpen() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="#9CA3AF"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Circle cx={12} cy={12} r={3} stroke="#9CA3AF" strokeWidth={1.8} />
    </Svg>
  );
}

function EyeOff() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"
        stroke="#9CA3AF"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function AppInput({
  label,
  placeholder,
  placehoder, // tương thích tên cũ
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const ph = placeholder ?? placehoder ?? "";

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder={ph}
          placeholderTextColor="#AAB4C3"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword((v) => !v)}
            activeOpacity={0.7}
          >
            {showPassword ? <EyeOpen /> : <EyeOff />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 8,
    color: "#1F2937",
    fontWeight: "500",
    fontSize: 14,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E7ECF3",
    borderRadius: 14,
    backgroundColor: "#fff",
    height: 50,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#1F2937",
    fontSize: 15,
  },
  eyeBtn: {
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
