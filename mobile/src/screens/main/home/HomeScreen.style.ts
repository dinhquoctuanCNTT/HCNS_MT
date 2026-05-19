import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import COLORS from "../../../constants/colors";

export { COLORS };

const { width } = Dimensions.get("window");
const H_PAD = 16;
const GAP = 10;
const COL4 = Math.floor((width - H_PAD * 4 - GAP * 3) / 4);
const BANNER_W = Math.floor((width - H_PAD * 2 - GAP) / 2);

// Responsive scale: chuẩn theo màn 390px, cap tại 1.15 cho màn lớn
const BASE_W = 390;
const scale = Math.min(Math.max(width / BASE_W, 0.85), 1.15);
const STATUS_H = Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 0;

export const BLUE = "#0D8BFF";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },

  // ── HEADER ───────────────────────────────────────────────────────────────
  headerArea: {
    paddingTop: Platform.OS === "ios" ? 44 : STATUS_H + 10,
    paddingHorizontal: H_PAD,
    paddingBottom: 14,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    backgroundColor: "#0A4FA0",
  },
  headerBgImg: {
    resizeMode: "cover",
    // FIX: opacity = 1 để nền trời xanh mây hiển thị rõ như hình 1
    opacity: 1,
  },
  // FIX: bỏ overlay tối hoàn toàn - hình 1 không có overlay
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0)",
  },

  // ── USER ROW ─────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerIcons: { flexDirection: "row", gap: 8 },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.30)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.70)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImg: { width: 44, height: 44, borderRadius: 22 },
  avatarInitial: { fontSize: 17, fontWeight: "800", color: "#fff" },
  userName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
  userRole: { fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 1 },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  notifDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#FF4444",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
  },

  // ── GLASS CARD ───────────────────────────────────────────────────────────
  // FIX: tăng opacity để card trắng đục hơn → nhìn thấy nền trời qua card
  // Hình 1 card có nền trắng mờ, viền trắng rõ
  glassCard: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.90)",
    overflow: "visible",
    position: "relative",
    // FIX: thêm shadow nhẹ để card nổi bật trên nền trời
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  floatingActions: {
    position: "absolute",
    top: 10,
    right: 12,
    zIndex: 10,
    flexDirection: "row",
    gap: 7,
  },
  floatingBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── ATTEND ROW ───────────────────────────────────────────────────────────

  attendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  attendCol: { flex: 1, gap: 4 },
  attendColRight: { alignItems: "flex-end" },

  labelRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  statusDotActive: { backgroundColor: "#22C55E" },
  attendLbl: { fontSize: 11, fontWeight: "600", color: "#475569" },

  timeRow: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  timeVal: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1E293B",
    letterSpacing: 0.3,
  },
  timeValDim: {
    fontSize: 22,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.3,
  },
  ampmVal: { fontSize: 12, fontWeight: "700", color: "#1E293B" },
  ampmDim: { fontSize: 12, fontWeight: "700", color: "#94A3B8" },

  statusBadgeOk: {
    backgroundColor: "#DCFCE7",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    alignSelf: "flex-start",
  },
  statusBadgeOkTxt: { fontSize: 8, fontWeight: "700", color: "#16A34A" },
  statusBadgeWarn: {
    backgroundColor: "#FEF3C7",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    alignSelf: "flex-start",
  },
  statusBadgeWarnTxt: { fontSize: 8, fontWeight: "700", color: "#D97706" },

  // FIX: ringWrap – căn giữa hoàn toàn cho MapLocationButton + text
  ringWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  mapBtnText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#475569",
    marginTop: 4,
    textAlign: "center",
  },
  branchBadge: {
    marginTop: 3,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxWidth: 90,
  },
  branchBadgeTxt: {
    fontSize: 8,
    fontWeight: "700",
    color: "#1D4ED8",
    textAlign: "center",
  },

  // ── DIVIDER ──────────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.07)",
    marginHorizontal: 16,
  },

  // ── QUICK ACTIONS ────────────────────────────────────────────────────────
  // FIX: padding cân đối, icon box trắng đẹp như hình 1
  quickRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  quickItem: { alignItems: "center", gap: 5, flex: 1 },
  quickIconBox: {
    width: Math.round(48 * scale),
    height: Math.round(48 * scale),
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
    lineHeight: 12,
  },

  // ── SCROLL ───────────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: H_PAD,
    paddingTop: 14,
    paddingBottom: 100,
    gap: 12,
  },

  // ── SECTION CARD ─────────────────────────────────────────────────────────
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: H_PAD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: 0.5,
  },
  cardLink: { fontSize: 11, color: BLUE, fontWeight: "600" },

  // ── SERVICE GRID ─────────────────────────────────────────────────────────
  svcGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8,
    columnGap: 8,
  },
  svcItem: {
    width: COL4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF0F6",
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    gap: 5,
  },
  svcIconBox: {
    width: Math.round(38 * scale),
    height: Math.round(38 * scale),
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  svcLabel: {
    fontSize: 8.5,
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
    lineHeight: 11,
  },
  badgeWrap: { position: "absolute", top: -3, right: -3 },
  badge: {
    backgroundColor: COLORS.danger,
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
    paddingHorizontal: 2,
  },
  badgeText: { fontSize: 7.5, fontWeight: "800", color: "#fff" },

  // ── FACE ID BUTTONS ──────────────────────────────────────────────────────
  faceRow: { flexDirection: "row", gap: 6, alignItems: "center" },
  faceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  faceBtnGhost: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "transparent",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BLUE,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  faceBtnText: { fontSize: 9, fontWeight: "700", color: "#fff" },
  faceBtnTextGhost: { fontSize: 9, fontWeight: "700", color: BLUE },

  // ── BANNERS ──────────────────────────────────────────────────────────────
  bannerScroll: { marginHorizontal: -H_PAD },
  bannerContent: { paddingHorizontal: H_PAD, gap: 10 },
  bannerCard: {
    width: BANNER_W,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerImg: { height: 100, justifyContent: "flex-end", padding: 10 },
  bannerTag: {
    fontSize: 7,
    fontWeight: "800",
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 1,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 15,
  },
  bannerFooter: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerMeta: { fontSize: 8.5, color: "#94A3B8" },
  bannerLink: { fontSize: 9, color: BLUE, fontWeight: "700" },
  bannerNew: {
    backgroundColor: COLORS.successLight,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bannerNewText: { fontSize: 8, fontWeight: "800", color: COLORS.successDark },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 10,
  },
  dotPip: { height: 4, borderRadius: 2 },
});
