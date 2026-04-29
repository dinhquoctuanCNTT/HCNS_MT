import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HistoryStackParamList } from "./types";
import { fmtTime, isLate } from "./helpers";
import { COLORS, H_PAD } from "./HistoryScreen.style";
import BackButton from "./BackButton";

type Props = NativeStackScreenProps<HistoryStackParamList, "DayDetail">;

export default function DayDetailScreen({ route, navigation }: Props) {
  const { detail } = route.params;
  const r = detail.record;
  const late = isLate(r);
  const statusLabel = r ? (late ? "Đi muộn" : "Đi làm") : "Nghỉ";
  const statusColor = r
    ? late
      ? COLORS.warning
      : COLORS.success
    : COLORS.textLight;

  const rows = [
    { label: "Số công hưởng lương", value: r ? "1" : "0", bold: true },
    { label: "Số công đi làm thực tế", value: r ? "1" : "0", sub: true },
    {
      label: "Giờ vào",
      value: r?.check_in ? fmtTime(r.check_in) : "--:--",
      indent: true,
    },
    {
      label: "Giờ ra",
      value: r?.check_out ? fmtTime(r.check_out) : "--:--",
      indent: true,
    },
    { label: "Nghỉ/Đi công tác", value: "0", indent: true },
    { label: "Đi muộn (phút)", value: late ? "5" : "0" },
    { label: "Về sớm (phút)", value: "0" },
    { label: "Tổng thời gian làm thêm giờ", value: "0" },
    { label: "Làm thêm hưởng lương (giờ)", value: "0" },
    { label: "Làm thêm nghỉ bù (giờ)", value: "0" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* ── Header ── */}
      <View style={s.header}>
        <SafeAreaView>
          <View style={s.headerRow}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={s.headerTitle}>Chi tiết công</Text>
            {/* placeholder để title căn giữa */}
            <View style={{ width: 40 }} />
          </View>
          <Text style={s.headerSub}>
            {detail.dayOfWeek}, {detail.dateStr}
          </Text>
          <View style={s.statusPill}>
            <View style={[s.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[s.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* ── Rows ── */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: COLORS.white, marginTop: 8 }}>
          {rows.map((row, i) => (
            <View
              key={i}
              style={[s.row, row.sub && s.rowSub, row.indent && s.rowIndent]}
            >
              <Text
                style={row.bold ? s.labelBold : row.sub ? s.labelSub : s.label}
              >
                {row.sub ? "↳ " : ""}
                {row.label}
              </Text>
              <Text style={row.value === "--:--" ? s.valueMuted : s.value}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        {/* ── CTA ── */}
        <View style={s.ctaWrap}>
          <TouchableOpacity
            style={s.ctaBtn}
            onPress={() => navigation.navigate("UpdateRequest", { detail })}
          >
            <Text style={s.ctaText}>Đề nghị cập nhật công</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    paddingHorizontal: H_PAD,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
    flex: 1,
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 10,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: "600", color: COLORS.white },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: H_PAD,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  rowSub: { backgroundColor: COLORS.bg },
  rowIndent: { paddingLeft: 32 },
  label: { fontSize: 14, color: COLORS.textSub },
  labelBold: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
  labelSub: { fontSize: 13, fontWeight: "600", color: COLORS.textMid },
  value: { fontSize: 14, fontWeight: "500", color: COLORS.textDark },
  valueMuted: { fontSize: 14, color: COLORS.textLight },

  ctaWrap: { padding: H_PAD, paddingTop: 20, paddingBottom: 40 },
  ctaBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaText: { fontSize: 15, color: COLORS.white, fontWeight: "700" },
});
