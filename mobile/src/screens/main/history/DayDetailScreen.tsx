import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HistoryStackParamList } from "./types";
import { fmtTime, isLate } from "./helpers";

type Props = NativeStackScreenProps<HistoryStackParamList, "DayDetail">;

function fmtWorked(checkIn: string | null, checkOut: string | null): string {
  if (!checkIn || !checkOut) return "--";
  const mins = Math.floor(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 60000,
  );
  if (mins <= 0) return "0 phút";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} phút`;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}

function workedPercent(checkIn: string | null, checkOut: string | null): number {
  if (!checkIn || !checkOut) return 0;
  const mins = Math.floor(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 60000,
  );
  return Math.min(mins / 480, 1);
}

export default function DayDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { detail } = route.params;
  const r = detail.record;
  const late = isLate(r);
  const isAbsent = detail.status === "absent";

  const lateMinutes: number = r?.late_minutes ?? 0;
  const earlyMinutes: number = r?.early_minutes ?? 0;
  const workedLabel = fmtWorked(r?.check_in ?? null, r?.check_out ?? null);
  const pct = workedPercent(r?.check_in ?? null, r?.check_out ?? null);

  const statusLabel = isAbsent ? "Nghỉ không phép" : late ? "Đi muộn" : "Đúng giờ";
  const statusColor = isAbsent ? "#ef4444" : late ? "#ea580c" : "#16a34a";
  const statusBg = isAbsent ? "#fee2e2" : late ? "#ffedd5" : "#dcfce7";

  // Ring border colors based on worked percent
  const ringColor = pct >= 1 ? "#22c55e" : pct >= 0.5 ? "#3b82f6" : "#f59e0b";

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* ── Header ── */}
      <View style={[s.header, { paddingTop: insets.top + (Platform.OS === "android" ? 8 : 0) }]}>
        <View style={s.headerRow}>
          <TouchableOpacity style={s.backBtnWrap} onPress={() => navigation.goBack()}>
            <Text style={s.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Chi tiết công</Text>
          <View style={{ width: 32 }} />
        </View>
        <Text style={s.headerSub}>{detail.dayOfWeek}, {detail.dateStr}</Text>
        <View style={[s.statusPill, { backgroundColor: statusBg }]}>
          <Text style={[s.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* CARD 1: Tóm tắt thời gian */}
        <View style={s.card}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={[s.ringWrap, { borderTopColor: ringColor, borderRightColor: pct >= 0.75 ? ringColor : "#e5e7eb" }]}>
              <Text style={s.ringText}>{workedLabel === "--" ? "--" : workedLabel.replace(" giờ ", "g\n").replace(" phút", "p")}</Text>
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text style={s.cardTitle}>Tóm tắt thời gian</Text>
              <Text style={s.timeLarge}>{workedLabel}</Text>
              <Text style={s.textMuted}>Tổng giờ quy định: 8 giờ</Text>
            </View>
          </View>
        </View>

        {/* CARD 2: Chi tiết chấm công */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Chi tiết chấm công</Text>
          <View style={s.rowSpace}>
            <Text style={s.textNormal}>
              Giờ vào:<Text style={s.textBold}>{r?.check_in ? fmtTime(r.check_in) : "--:--"}</Text>
            </Text>
            <Text style={s.textNormal}>
              Giờ ra:<Text style={s.textBold}>{r?.check_out ? fmtTime(r.check_out) : "--:--"}</Text>
            </Text>
          </View>
          {lateMinutes > 0 && (
            <View style={s.badgeRow}>
              <View style={s.badgeWarn}>
                <Ionicons name="warning" size={13} color="#b45309" /><Text style={s.badgeWarnText}> Đi muộn: {lateMinutes} phút</Text>
              </View>
            </View>
          )}
          {earlyMinutes > 0 && (
            <View style={s.badgeRow}>
              <View style={s.badgeInfo}>
                <Ionicons name="time" size={13} color="#7c3aed" /><Text style={s.badgeInfoText}> Về sớm: {earlyMinutes} phút</Text>
              </View>
            </View>
          )}
        </View>

        {/* CARD 3: Tăng ca */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Tăng ca</Text>
          <View style={{ marginTop: 10, gap: 8 }}>
            <Text style={s.textNormal}>
              Làm thêm hưởng lương (giờ):<Text style={s.textBold}>0</Text>
            </Text>
            <Text style={s.textNormal}>
              Làm thêm nghỉ bù (giờ):<Text style={s.textBold}>0</Text>
            </Text>
          </View>
        </View>

        {/* CARD 4: Nghỉ lễ / Công tác */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Nghỉ lễ & Công tác</Text>
          <View style={{ marginTop: 10, gap: 8 }}>
            <Text style={s.textNormal}>
              Nghỉ lễ (ngày):<Text style={s.textBold}>0</Text>
            </Text>
            <Text style={s.textNormal}>
              Công tác (ngày):<Text style={s.textBold}>0</Text>
            </Text>
          </View>
        </View>

        {/* CARD 5: Lý do — chỉ hiện khi đi muộn hoặc vắng */}
        {(lateMinutes > 0 || isAbsent) && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Lý do {isAbsent ? "nghỉ" : "đi muộn"}</Text>
            <View style={s.rowSpace}>
              <Text style={s.textMuted}>Chưa cập nhật</Text>
              <TouchableOpacity onPress={() => navigation.navigate("UpdateRequest", { detail })}>
                <Text style={s.textLink}>Thêm lý do</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* BUTTON */}
        <TouchableOpacity
          style={s.btnPrimary}
          onPress={() => navigation.navigate("UpdateRequest", { detail })}
        >
          <Text style={s.btnPrimaryText}>Đề nghị cập nhật công</Text>
        </TouchableOpacity>

        <Text style={s.footerNote}>*Dữ liệu được cập nhật từ hệ thống chấm công</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: "#1c64f2",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginTop: 12, marginBottom: 8,
  },
  backBtnWrap: { width: 32, height: 32, justifyContent: "center" },
  backBtnText: { fontSize: 28, color: "#fff", marginTop: -6 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#fff", textAlign: "center", flex: 1 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.9)", textAlign: "center", marginBottom: 12 },
  statusPill: {
    flexDirection: "row", alignItems: "center", alignSelf: "center",
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
  },
  statusText: { fontSize: 13, fontWeight: "700" },

  scrollContent: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 4 },

  ringWrap: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 4, borderColor: "#e5e7eb",
    alignItems: "center", justifyContent: "center",
  },
  ringText: { fontSize: 11, fontWeight: "700", textAlign: "center", color: "#111827", lineHeight: 16 },

  timeLarge: { fontSize: 20, fontWeight: "800", color: "#111827", marginBottom: 2, marginTop: 4 },
  textMuted: { fontSize: 13, color: "#6b7280" },

  rowSpace: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginTop: 10,
  },
  textNormal: { fontSize: 14, color: "#374151" },
  textBold: { fontWeight: "700", color: "#111827" },
  textLink: { fontSize: 14, color: "#2563eb", fontWeight: "600" },

  badgeRow: { marginTop: 8 },
  badgeWarn: {
    backgroundColor: "#fff7ed", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    borderLeftWidth: 3, borderLeftColor: "#ea580c",
  },
  badgeWarnText: { fontSize: 13, color: "#9a3412", fontWeight: "600" },
  badgeInfo: {
    backgroundColor: "#eff6ff", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    borderLeftWidth: 3, borderLeftColor: "#3b82f6",
  },
  badgeInfoText: { fontSize: 13, color: "#1e40af", fontWeight: "600" },

  btnPrimary: {
    backgroundColor: "#2563eb", borderRadius: 24,
    paddingVertical: 14, alignItems: "center", marginTop: 12, marginBottom: 12,
  },
  btnPrimaryText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  footerNote: { fontSize: 11, color: "#6b7280", textAlign: "center", fontStyle: "italic" },
});
