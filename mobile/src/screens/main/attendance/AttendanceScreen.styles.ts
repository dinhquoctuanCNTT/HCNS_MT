import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  primary: "#4A90D9",
  primaryDark: "#2E78C7",
  primaryLight: "#EBF4FF",
  success: "#27AE60",
  successLight: "#E8F8F0",
  danger: "#E74C3C",
  dangerLight: "#FDEDEC",
  warning: "#F39C12",
  bg: "#F0F4FA",
  white: "#FFFFFF",
  textDark: "#1A2340",
  textMid: "#4A5568",
  textLight: "#8A9BB5",
  border: "#DDE5F0",
  overlay: "rgba(0,0,0,0.5)",
  overlayDark: "rgba(0,0,0,0.65)",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  // ── Camera full screen ────────────────────────────────────
  camera: {
    flex: 1,
  },

  // ── Top bar (trên camera) ─────────────────────────────────
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  back: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  topTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  topTime: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.85,
  },

  // ── Mode switch (trên camera) ─────────────────────────────
  modeSwitch: {
    position: "absolute",
    top: 110,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  modeBtn: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 17,
  },
  modeBtnActive: {
    backgroundColor: COLORS.primary,
  },
  modeBtnText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "600",
  },
  modeBtnTextActive: {
    color: "#fff",
  },

  // ── Face frame (giữa camera) ──────────────────────────────
  faceFrameWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  faceFrame: {
    width: width * 0.62,
    height: width * 0.75,
    borderRadius: width * 0.38,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
  },
  faceFrameScanning: {
    borderColor: COLORS.warning,
    borderStyle: "solid",
  },
  faceFrameSuccess: {
    borderColor: COLORS.success,
    borderStyle: "solid",
    borderWidth: 4,
  },
  faceFrameError: {
    borderColor: COLORS.danger,
    borderStyle: "solid",
    borderWidth: 4,
  },
  scanLine: {
    position: "absolute",
    width: width * 0.55,
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.7,
  },
  faceHint: {
    marginTop: 20,
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },

  // ── Processing overlay ────────────────────────────────────
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlayDark,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  processingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  processingSubText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
  },

  // ── Bottom bar (nút chụp) ─────────────────────────────────
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    gap: 12,
  },
  gpsText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  btnCapture: {
    width: width - 48,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  btnCaptureCheckout: {
    backgroundColor: "#E74C3C",
    shadowColor: "#E74C3C",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // ── Result card (sau khi xác thực) ───────────────────────
  resultOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingBottom: 40,
  },
  resultCard: {
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  resultCardSuccess: {
    backgroundColor: "#fff",
  },
  resultCardError: {
    backgroundColor: "#fff",
  },

  // Thông tin nhân viên sau xác thực
  employeeRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  employeeAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  employeeAvatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  employeeCode: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  employeeRole: {
    fontSize: 12,
    color: COLORS.textMid,
    marginTop: 1,
  },

  // Status row
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeSuccess: {
    backgroundColor: COLORS.successLight,
  },
  statusBadgeError: {
    backgroundColor: COLORS.dangerLight,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
  },
  statusTextSuccess: {
    color: COLORS.success,
  },
  statusTextError: {
    color: COLORS.danger,
  },
  checkinTime: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  checkinDate: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: "right",
    marginTop: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textMid,
  },

  // Retry button
  btnRetry: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },
  btnRetryText: {
    color: COLORS.textMid,
    fontSize: 13,
    fontWeight: "600",
  },
  errorMsg: {
    fontSize: 13,
    color: COLORS.danger,
    textAlign: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    lineHeight: 20,
  },

  // Permission screen
  permissionContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  permissionIcon: { fontSize: 64, marginBottom: 20 },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: "center",
  },
  permissionSub: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  btnAllow: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 48,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  btnAllowText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
