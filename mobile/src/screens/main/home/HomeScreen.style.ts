import { StyleSheet, Dimensions, Platform } from "react-native";
import COLORS from "../../../constants/colors";

export { COLORS };

const { width } = Dimensions.get("window");
const H_PAD    = 16;
const GAP      = 10;
const COL4     = Math.floor((width - H_PAD * 4 - GAP * 3) / 4);
const BANNER_W = Math.floor((width - H_PAD * 2 - GAP) / 2);

export const BLUE = "#0D8BFF";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },

  // ── HEADER ───────────────────────────────────────────────────────────────
  headerArea: {
    paddingTop: Platform.OS === "ios" ? 52 : 36,
    paddingHorizontal: H_PAD,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    backgroundColor: "#0A4FA0",
  },
  headerBgImg: {
    resizeMode: "cover",
    opacity: 1,
  },
  headerOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0)",
  },

  // ── USER ROW ─────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerLeft:  { flexDirection: "row", alignItems: "center", gap: 10 },
  headerIcons: { flexDirection: "row", gap: 8 },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.60)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImg:     { width: 44, height: 44, borderRadius: 22 },
  avatarInitial: { fontSize: 17, fontWeight: "800", color: "#fff" },
  userName: { fontSize: 15, fontWeight: "800", color: "#fff", letterSpacing: 0.2 },
  userRole:  { fontSize: 11, color: "rgba(255,255,255,0.82)", marginTop: 1 },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
  },
  notifDot: {
    position: "absolute",
    top: 6, right: 6,
    width: 7, height: 7,
    borderRadius: 3.5,
    backgroundColor: "#FF4444",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },

  // ── GLASS CARD ───────────────────────────────────────────────────────────
  glassCard: {
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.60)",
    overflow: "hidden",
    position: "relative",
  },

  floatingActions: {
    position: "absolute", top: 12, right: 14, zIndex: 10,
    flexDirection: "row", gap: 8,
  },
  floatingBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center", justifyContent: "center",
  },

  // ── ATTEND ROW ───────────────────────────────────────────────────────────
  attendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 14,
  },
  attendCol:      { flex: 1, gap: 4 },
  attendColRight: { alignItems: "flex-end" },

  labelRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  statusDot:       { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#D1D5DB" },
  statusDotActive: { backgroundColor: "#22C55E" },
  attendLbl:       { fontSize: 11, fontWeight: "600", color: "#475569" },

  timeRow:    { flexDirection: "row", alignItems: "baseline", gap: 3 },
  timeVal:    { fontSize: 24, fontWeight: "900", color: "#1E293B", letterSpacing: 0.3 },
  timeValDim: { fontSize: 24, fontWeight: "900", color: "#1E293B", letterSpacing: 0.6 },
  ampmVal:    { fontSize: 13, fontWeight: "800", color: "#1E293B" },
  ampmDim:    { fontSize: 13, fontWeight: "800", color: "#1E293B" },

  statusBadgeOk: {
    backgroundColor: "#DCFCE7", borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 2, alignSelf: "flex-start",
  },
  statusBadgeOkTxt: { fontSize: 8, fontWeight: "700", color: "#16A34A" },
  statusBadgeWarn: {
    backgroundColor: "#FEF3C7", borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 2, alignSelf: "flex-start",
  },
  statusBadgeWarnTxt: { fontSize: 8, fontWeight: "700", color: "#D97706" },

  ringWrap: { alignItems: "center", justifyContent: "center", marginHorizontal: 8 },
  mapBtnText: { fontSize: 11, fontWeight: "700", color: "#1E293B", marginTop: 2 },

  // ── DIVIDER ───────────────────────────────────────────────────────────────
  divider: { height: 1, backgroundColor: "#EEF2F7", marginHorizontal: 14 },

  // ── QUICK ACTIONS ────────────────────────────────────────────────────────
  quickRow: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 14, justifyContent: "space-between" },
  quickItem: { alignItems: "center", gap: 6, width: 66 },
  quickIconBox: {
    width: 60, height: 60,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 3
  },
  quickLabel: { fontSize: 10, fontWeight: "600", color: "#1E293B", textAlign: "center", lineHeight: 14 },

  // ── SCROLL ────────────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: H_PAD,
    paddingTop: 14,
    paddingBottom: 100,
    gap: 12,
  },

  // ── SECTION CARD ──────────────────────────────────────────────────────────
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
  cardTitle: { fontSize: 12, fontWeight: "800", color: "#1E293B", letterSpacing: 0.5 },
  cardLink:  { fontSize: 11, color: BLUE, fontWeight: "600" },

  // ── SERVICE GRID ──────────────────────────────────────────────────────────
  svcGrid: { flexDirection: "row", flexWrap: "wrap", rowGap: GAP, columnGap: GAP },
  svcItem: {
    width: COL4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF0F6",
    paddingTop: 14, paddingBottom: 10,
    paddingHorizontal: 4,
    alignItems: "center",
    gap: 7,
  },
  svcIconBox: {
    width: 44, height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  svcLabel:  { fontSize: 9, fontWeight: "600", color: "#475569", textAlign: "center", lineHeight: 12 },
  badgeWrap: { position: "absolute", top: -3, right: -3 },
  badge: {
    backgroundColor: COLORS.danger,
    borderRadius: 7,
    minWidth: 14, height: 14,
    justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: "#fff",
    paddingHorizontal: 2,
  },
  badgeText: { fontSize: 7.5, fontWeight: "800", color: "#fff" },

  // ── FACE ID BUTTONS ───────────────────────────────────────────────────────
  faceRow: { flexDirection: "row", gap: 6, alignItems: "center" },
  faceBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: BLUE, borderRadius: 12,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  faceBtnGhost: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "transparent", borderRadius: 12,
    borderWidth: 1, borderColor: BLUE,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  faceBtnText:      { fontSize: 9, fontWeight: "700", color: "#fff" },
  faceBtnTextGhost: { fontSize: 9, fontWeight: "700", color: BLUE },

  // ── BANNERS ───────────────────────────────────────────────────────────────
  bannerScroll:  { marginHorizontal: -H_PAD },
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
  bannerImg:  { height: 100, justifyContent: "flex-end", padding: 10 },
  bannerTag:  { fontSize: 7, fontWeight: "800", color: "rgba(255,255,255,0.8)", letterSpacing: 1, marginBottom: 2, textTransform: "uppercase" },
  bannerTitle:{ fontSize: 12, fontWeight: "900", color: "#fff", lineHeight: 15 },
  bannerFooter: {
    backgroundColor: "#fff",
    paddingHorizontal: 10, paddingVertical: 7,
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
  },
  bannerMeta: { fontSize: 8.5, color: "#94A3B8" },
  bannerLink: { fontSize: 9,   color: BLUE, fontWeight: "700" },
  bannerNew: {
    backgroundColor: COLORS.successLight,
    borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2,
  },
  bannerNewText: { fontSize: 8, fontWeight: "800", color: COLORS.successDark },
  dotsRow: { flexDirection: "row", justifyContent: "center", gap: 4, marginTop: 10 },
  dotPip:  { height: 4, borderRadius: 2 },
});
