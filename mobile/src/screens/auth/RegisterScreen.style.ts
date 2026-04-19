import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBFF",
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#8A94A6",
    marginTop: 6,
    marginBottom: 18,
  },
  footerRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: "#8A94A6",
  },
  link: {
    color: "#4F8CFF",
    fontWeight: "600",
  },
});
