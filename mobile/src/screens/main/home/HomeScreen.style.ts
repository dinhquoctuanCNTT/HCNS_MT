import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");
const H_PAD = 14;
const GAP = 7;
// 4 columns: total gap = GAP * 3, total padding = H_PAD * 2
const COL4 = Math.floor((width - H_PAD * 4 - GAP * 3) / 4);

export const COLORS = {
  navy: "#0484d4",
  navyMid: "#046fa0",
  blue: "#1d4ed8",
  blueLight: "#eff6ff",
  success: "#22c55e",
  successLight: "#dcfce7",
  successDark: "#16a34a",
  warning: "#d97706",
  warningLight: "#fef3c7",
  danger: "#ef4444",
  dangerLight: "#fef2f2",
  teal: "#0891b2",
  tealLight: "#e0f7fa",
  purple: "#7c3aed",
  purpleLight: "#f5f3ff",
  bg: "#f0f2f7",
  white: "#ffffff",
  textDark: "#111827",
  textMid: "#374151",
  textLight: "#9ca3af",
  border: "#e2e8f0",
  borderMid: "#e8ecf2",
};

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  // ── HEADER ─────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: Platform.OS === "ios" ? 50 : 56,
    paddingHorizontal: H_PAD,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerRight: { flexDirection: "row", gap: 8 },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 14, fontWeight: "800", color: COLORS.white },
  userName: { fontSize: 14, fontWeight: "800", color: COLORS.white },
  userRole: { fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  notifDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5,
    borderColor: COLORS.navy,
  },

  // ── ATTENDANCE BAR (slim white pill) ───────────────────────────────────────
  attendBar: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderMid,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 0, // flush to primaryCard
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  attendSide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  attendSideRight: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.borderMid,
    backgroundColor: "#fafbfc",
  },
  attendFab: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  attendStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  attendStatusDotGray: {
    backgroundColor: "#d1d5db",
  },
  attendLabel: { fontSize: 10.5, color: COLORS.textLight, fontWeight: "500" },
  attendTime: { fontSize: 14, fontWeight: "800", color: COLORS.navy },
  attendTimeDim: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
    letterSpacing: 1,
  },
  attendBadge: {
    backgroundColor: COLORS.successLight,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  attendBadgeText: {
    fontSize: 8.5,
    fontWeight: "700",
    color: COLORS.successDark,
  },

  // ── QUICK ACTIONS (4 icons below attendance bar) ───────────────────────────
  quickCard: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderMid,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: H_PAD,
  },
  quickGrid: { flexDirection: "row" },
  quickItem: { flex: 1, alignItems: "center", gap: 6 },
  quickIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  quickLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 13,
  },

  // ── SCROLL ─────────────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: H_PAD,
    paddingTop: 12,
    paddingBottom: 90,
    gap: 12,
  },

  // ── SECTION CARD ───────────────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: H_PAD,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.navy,
    letterSpacing: 0.4,
  },
  cardLink: { fontSize: 10.5, color: COLORS.blue, fontWeight: "600" },

  // ── SERVICE GRID — 4 columns ───────────────────────────────────────────────
  svcGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  svcItem: {
    width: COL4,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderMid,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 2,
    alignItems: "center",
    gap: 5,
  },
  svcIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  svcLabel: {
    fontSize: 8.5,
    fontWeight: "600",
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 12,
  },

  // Badge
  badgeWrap: { position: "absolute", top: -2, right: -2 },
  badge: {
    backgroundColor: COLORS.danger,
    borderRadius: 7,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  badgeText: { fontSize: 7.5, fontWeight: "800", color: COLORS.white },

  // ── NEWS BANNERS ───────────────────────────────────────────────────────────
  bannerScroll: { marginHorizontal: -H_PAD },
  bannerContent: { paddingHorizontal: H_PAD, gap: 10 },
  bannerCard: {
    width: 230,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bannerImg: {
    height: 150,
    justifyContent: "flex-end",
    padding: 10,
  },
  bannerTag: {
    fontSize: 7,
    fontWeight: "800",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1,
    marginBottom: 2,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.white,
    lineHeight: 18,
  },
  bannerFooter: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerMeta: { fontSize: 9, color: COLORS.textLight },
  bannerLink: { fontSize: 9.5, color: COLORS.blue, fontWeight: "700" },
  bannerNew: {
    backgroundColor: COLORS.successLight,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  bannerNewText: { fontSize: 9, fontWeight: "800", color: COLORS.successDark },

  // Dots
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 10,
  },
  dotActive: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.navy,
  },
  dotInactive: {
    width: 6,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d1d5db",
  },
});
