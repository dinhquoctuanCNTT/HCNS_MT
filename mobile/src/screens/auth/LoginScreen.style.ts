import { StyleSheet, Platform, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const PRIMARY = "#2563EB";
const BG_DARK = "#1B3F7E";
const BG_MID = "#1E4D9B";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_DARK,
  },

  /* ── Geometric background ── */
  geoBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    overflow: "hidden",
  },

  geoShape1: {
    position: "absolute",
    top: -height * 0.1,
    left: -width * 0.2,
    width: width * 0.9,
    height: height * 0.45,
    backgroundColor: "#1E4D9B",
    borderRadius: 0,
    transform: [{ rotate: "-25deg" }],
    opacity: 0.6,
  },

  geoShape2: {
    position: "absolute",
    top: height * 0.05,
    right: -width * 0.3,
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: "#3B82F6",
    borderRadius: 0,
    transform: [{ rotate: "20deg" }],
    opacity: 0.25,
  },

  geoShape3: {
    position: "absolute",
    bottom: height * 0.05,
    left: -width * 0.2,
    width: width * 0.7,
    height: height * 0.2,
    backgroundColor: "#1E40AF",
    borderRadius: 0,
    transform: [{ rotate: "15deg" }],
    opacity: 0.4,
  },

  geoShape4: {
    position: "absolute",
    bottom: -height * 0.05,
    right: -width * 0.1,
    width: width * 0.6,
    height: height * 0.25,
    backgroundColor: "#60A5FA",
    borderRadius: 0,
    transform: [{ rotate: "-10deg" }],
    opacity: 0.15,
  },

  /* ── Inner ── */
  inner: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 120 : 100,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  /* ── Unified card ── */
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 0,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },

  /* ── Logo trong card ── */
  cardLogoWrap: {
    alignItems: "center",
    marginBottom: 16,
  },

  cardLogo: {
    width: width * 0.5,
    height: 60,
  },

  /* ── Divider ── */
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 18,
  },

  /* ── Input outlined ── */
  inputBox: {
    borderWidth: 1.5,
    borderColor: "#F59E0B",
    borderRadius: 0,
    backgroundColor: "#ffffff",
    marginBottom: 6,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  inputErrBox: {
    borderColor: "#ef4444",
  },

  input: {
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 13 : 11,
    fontSize: 15,
    color: "#111827",
  },

  eyeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  eyeTxt: {
    fontSize: 17,
  },

  errText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 2,
  },

  /* ── Ghi nhớ ── */
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 16,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 0,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  checkboxOn: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  checkMark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  rememberTxt: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },

  forgotTxt: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: "600",
  },

  /* ── Nút đăng nhập ── */
  loginBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 0,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  loginTxt: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  /* ── Illustration trong card ── */
  illustrationWrap: {
    alignItems: "center",
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 16,
  },

  illustration: {
    width: width * 0.75,
    height: width * 0.65,
  },
});
