import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.subtext,
  },
  bottom: {
    gap: 14,
    marginBottom: 60,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: {
    color: COLORS.while,
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.while,
  },
  secondaryText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
