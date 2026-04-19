import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PawFooter() {
  return (
    <View style={styles.container}>
      <Text style={[styles.paw, { color: "#F7904C" }]}>🐾</Text>
      <Text style={[styles.paw, { color: "#D9A0A8" }]}>🐾</Text>
      <Text style={[styles.paw, { color: "#F3C95E" }]}>🐾</Text>
      <Text style={[styles.paw, { color: "#C6A2F5" }]}>🐾</Text>
      <Text style={[styles.paw, { color: "#F7B3C2" }]}>🐾</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
    paddingHorizontal: 8,
  },
  paw: {
    fontSize: 28,
  },
});
