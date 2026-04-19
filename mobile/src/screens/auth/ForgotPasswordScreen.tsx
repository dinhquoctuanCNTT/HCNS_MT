import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const onSubmit = () => {
    console.log("reset passord for", email);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot password</Text>
      <Text style={styles.subtitle}>
        Enter your email recevie reset intructions
      </Text>
      <AppInput
        label="Email"
        placehoder="abc@gmail.com"
        value={email}
        onChangeText={setEmail}
      />
      <AppButton
        title="Quay lại"
        onPress={() => navigation.navigate("Login")}
      />
      <AppButton title="Gửi email" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBFF",
    paddingHorizontal: 24,
    paddingTop: 80,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#8A94A6",
    marginTop: 8,
    marginBottom: 20,
  },
});
