import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export const COLORS = {
  primary: "#3B82F6",
  primaryLight: "#EFF6FF",
  success: "#16A34A",
  successLight: "#DCFCE7",
  warning: "#D97706",
  warningLight: "#FEF3C7",
  danger: "#DC2626",
  dangerLight: "#FEE2E2",
  purple: "#7C3AED",
  purpleLight: "#F5F3FF",
  bg: "#F0F4FA",
  white: "#FFFFFF",
  textDark: "#1A2340",
  textMid: "#4A5568",
  textLight: "#8A9BB5",
  border: "#DDE5F0",
};

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  // ── Header ──────────────────────────────────────────────
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  greeting: { fontSize: 11, color: "rgba(255,255,255,0.7)" },
  userName: { fontSize: 17, fontWeight: "700", color: "#fff", marginTop: 2 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  timeWrap: { alignItems: "flex-end" },
  timeBig: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  timeDate: { fontSize: 9, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 12, fontWeight: "700", color: "#fff" },

  // Today strip
  todayStrip: { flexDirection: "row", gap: 6 },
  todayBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
  },
  todayLabel: { fontSize: 8, color: "rgba(255,255,255,0.7)", marginBottom: 4 },
  todayVal: { fontSize: 14, fontWeight: "700", color: "#fff" },
  todayBadge: {
    marginTop: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  todayBadgeText: { fontSize: 8, color: "#fff", fontWeight: "600" },

  // ── Scroll ───────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: { padding: 12, gap: 10, paddingBottom: 80 },

  // ── Checkin card ─────────────────────────────────────────
  checkinCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  checkinLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkinIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  checkinTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
  checkinSub: { fontSize: 10, color: COLORS.textLight, marginTop: 2 },
  checkinArrow: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Section ──────────────────────────────────────────────
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 12, fontWeight: "700", color: COLORS.textDark },
  sectionLink: { fontSize: 11, color: COLORS.primary },

  // ── Stats ────────────────────────────────────────────────
  statsRow: { flexDirection: "row", gap: 6 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  statVal: { fontSize: 18, fontWeight: "700" },
  statLbl: { fontSize: 9, color: COLORS.textLight, marginTop: 1 },

  // ── Quick actions ─────────────────────────────────────────
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  quickCard: {
    width: (width - 36) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  quickIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  quickName: { fontSize: 12, fontWeight: "700", color: COLORS.textDark },
  quickSub: { fontSize: 9, color: COLORS.textLight, marginTop: 1 },
});
