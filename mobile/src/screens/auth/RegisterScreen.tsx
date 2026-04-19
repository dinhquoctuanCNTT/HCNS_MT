import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import Logo from "../../components/auth/Logo";
import PawFooter from "../../components/auth/PawFooter";
import { styles } from "./RegisterScreen.style";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, serPassword] = useState();

  const onRegister = () => {
    console.log({ name, email });
  };
  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Enter your credentials to continue</Text>
        <AppInput
          label="Name"
          placehoder="Đinh Quốc Tuấn"
          value={name}
          onChangeText={setName}
        />
        <AppInput
          label="Email"
          placehoder="dinhtuna30@gmail"
          value={email}
          onChangetext={setEmail}
        />
        <AppInput
          label="password"
          placehoder="*********"
          value={password}
          onChaneText={serPassword}
        />
        <AppButton title="Sign up" onPress={onRegister} />
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
