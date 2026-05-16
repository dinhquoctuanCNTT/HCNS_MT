import { StyleSheet } from "react-native";
import COLORS from "../../../../constants/colors";

export { COLORS };
export const H_PAD = 16;

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: { backgroundColor: COLORS.primary },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: H_PAD,
    paddingBottom: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backBtnText: { color: "#fff", fontSize: 18, fontWeight: "300" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },

  // Month picker
  monthPickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingBottom: 14,
  },
  monthPickerArrow: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  monthPickerPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  monthPickerText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  // ── Overview — 4 ô ngang gọn ───────────────────────────────────────────────
  overviewWrap: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: H_PAD,
    paddingBottom: 16,
  },
  overviewGrid: {
    flexDirection: "row",
    gap: 8,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  overviewIcon: { fontSize: 16, marginBottom: 4 },
  overviewValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  overviewValueSub: { fontSize: 11, color: COLORS.textLight },
  overviewValueWarning: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.warning,
  },
  overviewValueDanger: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.danger,
  },
  overviewLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 2,
    textAlign: "center",
  },

  // ── Section card ────────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: COLORS.white,
    marginTop: 10,
    marginHorizontal: H_PAD,
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  sectionCardFirst: {
    backgroundColor: COLORS.white,
    marginTop: 12,
    marginHorizontal: H_PAD,
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textDark },
  sectionMeta: { fontSize: 12, color: COLORS.textLight },
  sectionLink: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },

  // ── Analysis ────────────────────────────────────────────────────────────────
  analysisDivider: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
  },
  analysisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  analysisLabel: { fontSize: 12, color: COLORS.textMid },

  // ── Recent records ──────────────────────────────────────────────────────────
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  recentDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  recentDate: { fontSize: 13, fontWeight: "600", color: COLORS.textDark },
  recentTime: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusBadgeText: { fontSize: 11, fontWeight: "700" },

  // ── Warning banner ──────────────────────────────────────────────────────────
  warningBanner: {
    backgroundColor: "#EFF6FF",
    marginTop: 10,
    marginHorizontal: H_PAD,
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#BFDBFE",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  warningTitle: { fontSize: 13, color: "#1D4ED8", fontWeight: "600" },
  warningSub: { fontSize: 11, color: "#3B82F6", marginTop: 2 },

  // ── Modal ───────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 16,
  },
  modalYearLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textLight,
    marginBottom: 8,
    marginTop: 8,
  },
  modalMonthGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  modalMonthBtn: {
    width: "22%",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
});
