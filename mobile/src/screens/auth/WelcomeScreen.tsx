import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Logo from "../../components/auth/Logo";
import { styles } from "./WelcomeScreen.styles";

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Logo />
        <Text style={styles.title}>MT holding</Text>
        <Text style={styles.subtitle}>Community we need all</Text>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.primaryText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.primaryText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
