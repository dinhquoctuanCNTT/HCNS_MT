import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

type Props = {
  label: string;
  placehoder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};
export default function AppInput({
  label,
  placehoder,
  value,
  onChangeText,
  secureTextEntry = false,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placehoder}
        placeholderTextColor="#AAB4C3"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
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
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E7ECF3",
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
});
