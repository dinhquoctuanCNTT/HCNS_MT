import React from "react";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import Svg, { Path } from "react-native-svg";
import { COLORS } from "./HistoryScreen.style";

interface Props {
  onPress: () => void;
  tintColor?: string;
}

export default function BackButton({
  onPress,
  tintColor = COLORS.white,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.btn}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      activeOpacity={0.65}
    >
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M15 19l-7-7 7-7"
          stroke={tintColor}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});
