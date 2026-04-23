import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { attendanceApi } from "../../../api/attendanceApi";

const { width } = Dimensions.get("window");
const COLORS = {
  primary: "#4A90D9",
  success: "#27AE60",
  warning: "#F39C12",
  danger: "#E74C3C",
  bg: "#F0F4FA",
  white: "#FFFFFF",
  textDark: "#1A2340",
  textMid: "#4A5568",
  textLight: "#8A9BB5",
  border: "#DDE5F0",
  successLight: "#E8F8F0",
  warningLight: "#FEF9E7",
  dangerLight: "#FDEDEC",
  primaryLight: "#EBF4FF",
};

const MONTHS = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
}

export default function HistoryScreen({ navigation }: any) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [year, month]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const to = `${year}-${String(month + 1).padStart(2, "0")}-${lastDay}`;
      const res = await attendanceApi.getHistory(from, to);
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const totalDays = records.length;
  const lateDays = records.filter((r) => {
    if (!r.check_in) return false;
    const t = new Date(r.check_in);
    return t.getHours() > 8 || (t.getHours() === 8 && t.getMinutes() > 5);
  }).length;
  const missingOut = records.filter((r) => r.check_in && !r.check_out).length;

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.back}>← Quay về</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Lịch sử chấm công</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Month picker */}
      <View style={s.yearRow}>
        <TouchableOpacity onPress={() => setYear((y) => y - 1)}>
          <Text style={s.yearBtn}>‹</Text>
        </TouchableOpacity>
        <Text style={s.yearText}>{year}</Text>
        <TouchableOpacity onPress={() => setYear((y) => y + 1)}>
          <Text style={s.yearBtn}>›</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.monthScroll}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {MONTHS.map((m, i) => (
          <TouchableOpacity
            key={i}
            style={[s.monthBtn, i === month && s.monthBtnActive]}
            onPress={() => setMonth(i)}
          >
            <Text style={[s.monthBtnText, i === month && s.monthBtnTextActive]}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Summary */}
      <View style={s.summaryRow}>
        {[
          {
            label: "Ngày công",
            value: totalDays,
            color: COLORS.success,
            bg: COLORS.successLight,
          },
          {
            label: "Đi muộn",
            value: lateDays,
            color: COLORS.warning,
            bg: COLORS.warningLight,
          },
          {
            label: "Thiếu ra",
            value: missingOut,
            color: COLORS.danger,
            bg: COLORS.dangerLight,
          },
        ].map((s2, i) => (
          <View key={i} style={[s.summaryCard, { backgroundColor: s2.bg }]}>
            <Text style={[s.summaryValue, { color: s2.color }]}>
              {s2.value}
            </Text>
            <Text style={s.summaryLabel}>{s2.label}</Text>
          </View>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 40 }}
          color={COLORS.primary}
          size="large"
        />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, gap: 10 }}
        >
          {records.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyIcon}>📋</Text>
              <Text style={s.emptyText}>Không có dữ liệu tháng này</Text>
            </View>
          ) : (
            records.map((record, i) => {
              const checkIn = record.check_in
                ? new Date(record.check_in)
                : null;
              const isLate =
                checkIn &&
                (checkIn.getHours() > 8 ||
                  (checkIn.getHours() === 8 && checkIn.getMinutes() > 5));
              return (
                <View key={i} style={s.recordCard}>
                  <View
                    style={[
                      s.recordDateWrap,
                      {
                        backgroundColor: isLate
                          ? COLORS.warningLight
                          : COLORS.successLight,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        s.recordDay,
                        { color: isLate ? COLORS.warning : COLORS.success },
                      ]}
                    >
                      {new Date(record.date).getDate()}
                    </Text>
                    <Text
                      style={[
                        s.recordMonth,
                        { color: isLate ? COLORS.warning : COLORS.success },
                      ]}
                    >
                      {formatDate(record.date).split("/")[1]
                        ? `T${new Date(record.date).getMonth() + 1}`
                        : ""}
                    </Text>
                  </View>
                  <View style={s.recordBody}>
                    <View style={s.recordTimeRow}>
                      <View style={s.recordTimeItem}>
                        <Text style={s.recordTimeLabel}>Vào</Text>
                        <Text
                          style={[s.recordTimeValue, { color: COLORS.success }]}
                        >
                          {record.check_in
                            ? formatTime(record.check_in)
                            : "--:--"}
                        </Text>
                      </View>
                      <View style={s.recordTimeDash}>
                        <Text style={{ color: COLORS.textLight }}>→</Text>
                      </View>
                      <View style={s.recordTimeItem}>
                        <Text style={s.recordTimeLabel}>Ra</Text>
                        <Text
                          style={[
                            s.recordTimeValue,
                            {
                              color: record.check_out
                                ? COLORS.primary
                                : COLORS.textLight,
                            },
                          ]}
                        >
                          {record.check_out
                            ? formatTime(record.check_out)
                            : "--:--"}
                        </Text>
                      </View>
                    </View>
                    <View style={s.recordTags}>
                      {isLate && (
                        <View
                          style={[
                            s.tag,
                            { backgroundColor: COLORS.warningLight },
                          ]}
                        >
                          <Text style={[s.tagText, { color: COLORS.warning }]}>
                            ⏰ Đi muộn
                          </Text>
                        </View>
                      )}
                      {!record.check_out && record.check_in && (
                        <View
                          style={[
                            s.tag,
                            { backgroundColor: COLORS.dangerLight },
                          ]}
                        >
                          <Text style={[s.tagText, { color: COLORS.danger }]}>
                            ⚠ Thiếu ra
                          </Text>
                        </View>
                      )}
                      {record.location_verified && (
                        <View
                          style={[
                            s.tag,
                            { backgroundColor: COLORS.primaryLight },
                          ]}
                        >
                          <Text style={[s.tagText, { color: COLORS.primary }]}>
                            📍 GPS
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  back: { color: COLORS.primary, fontSize: 14, fontWeight: "600" },
  headerTitle: { color: COLORS.textDark, fontSize: 17, fontWeight: "700" },
  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 20,
  },
  yearBtn: { fontSize: 24, color: COLORS.primary, fontWeight: "300" },
  yearText: { fontSize: 16, fontWeight: "700", color: COLORS.textDark },
  monthScroll: { maxHeight: 46, marginBottom: 4 },
  monthBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  monthBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  monthBtnText: { fontSize: 13, color: COLORS.textMid, fontWeight: "600" },
  monthBtnTextActive: { color: "#fff" },
  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginVertical: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  summaryValue: { fontSize: 22, fontWeight: "800" },
  summaryLabel: {
    fontSize: 10,
    color: COLORS.textMid,
    marginTop: 3,
    fontWeight: "600",
  },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: COLORS.textLight, fontSize: 14 },
  recordCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "rgba(0,0,0,0.06)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  recordDateWrap: {
    width: 56,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  recordDay: { fontSize: 22, fontWeight: "800" },
  recordMonth: { fontSize: 10, fontWeight: "600", marginTop: 1 },
  recordBody: { flex: 1, padding: 12 },
  recordTimeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  recordTimeItem: { alignItems: "center" },
  recordTimeDash: { flex: 1, alignItems: "center" },
  recordTimeLabel: { fontSize: 10, color: COLORS.textLight, marginBottom: 2 },
  recordTimeValue: { fontSize: 16, fontWeight: "700" },
  recordTags: { flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 10, fontWeight: "600" },
});
