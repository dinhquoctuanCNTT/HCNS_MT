import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { style } from "../../screens/auth/LoginScreen.styles";

type Props = {
  small?: boolean;
};
export default function Logo({ small = false }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, small && styles.iconBoxSmall]}></View>
      {!small && <Text style={styles.name}>MT Holding</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  iconBox: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: "#4F8CFF",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBoxSmall: {
    width: 64,
    height: 64,
    borderRadius: 18,
  },
  icon: {
    fontSize: 34,
  },
  name: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
});
