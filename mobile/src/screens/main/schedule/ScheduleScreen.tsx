import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { attendanceApi } from "../../../api/attendanceApi";

const COLORS = {
  primary: "#4A90D9",
  primaryLight: "#EBF4FF",
  success: "#27AE60",
  successLight: "#E8F8F0",
  warning: "#F39C12",
  warningLight: "#FEF9E7",
  danger: "#E74C3C",
  dangerLight: "#FDEDEC",
  bg: "#F0F4FA",
  white: "#FFFFFF",
  textDark: "#1A2340",
  textMid: "#4A5568",
  textLight: "#8A9BB5",
  border: "#DDE5F0",
};

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
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

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

export default function ScheduleScreen({ navigation }: any) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [year, month]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const lastDay = getDaysInMonth(year, month);
      const to = `${year}-${String(month + 1).padStart(2, "0")}-${lastDay}`;
      const res = await attendanceApi.getHistory(from, to);
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const recordMap: Record<number, any> = {};
  records.forEach((r) => {
    const d = new Date(r.date).getDate();
    recordMap[d] = r;
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = now.getDate();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const getDayStatus = (day: number) => {
    if (isCurrentMonth && day > today) return "future";
    const r = recordMap[day];
    if (!r) return "absent";
    const checkIn = new Date(r.check_in);
    const isLate =
      checkIn.getHours() > 8 ||
      (checkIn.getHours() === 8 && checkIn.getMinutes() > 5);
    if (isLate) return "late";
    return "present";
  };

  const totalPresent = records.length;
  const totalLate = records.filter((r) => {
    const t = new Date(r.check_in);
    return t.getHours() > 8 || (t.getHours() === 8 && t.getMinutes() > 5);
  }).length;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);

  const STATUS_COLORS: Record<string, any> = {
    present: {
      bg: COLORS.successLight,
      text: COLORS.success,
      dot: COLORS.success,
    },
    late: {
      bg: COLORS.warningLight,
      text: COLORS.warning,
      dot: COLORS.warning,
    },
    absent: { bg: COLORS.dangerLight, text: COLORS.danger, dot: COLORS.danger },
    future: { bg: COLORS.bg, text: COLORS.textLight, dot: "transparent" },
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.back}>← Quay về</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Bảng công tháng</Text>
        <View style={{ width: 60 }} />
      </View>

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

      <View style={s.summaryRow}>
        {[
          {
            label: "Có mặt",
            value: totalPresent,
            color: COLORS.success,
            bg: COLORS.successLight,
          },
          {
            label: "Đi muộn",
            value: totalLate,
            color: COLORS.warning,
            bg: COLORS.warningLight,
          },
          {
            label: "Vắng",
            value:
              daysInMonth -
              totalPresent -
              (isCurrentMonth ? daysInMonth - today : 0),
            color: COLORS.danger,
            bg: COLORS.dangerLight,
          },
        ].map((item, i) => (
          <View key={i} style={[s.summaryCard, { backgroundColor: item.bg }]}>
            <Text style={[s.summaryValue, { color: item.color }]}>
              {Math.max(0, item.value)}
            </Text>
            <Text style={s.summaryLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} color={COLORS.primary} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={s.calendar}>
            {DAYS.map((d) => (
              <View key={d} style={s.dayHeader}>
                <Text
                  style={[
                    s.dayHeaderText,
                    d === "CN" && { color: COLORS.danger },
                  ]}
                >
                  {d}
                </Text>
              </View>
            ))}
            {cells.map((day, i) => {
              if (!day) return <View key={`empty-${i}`} style={s.dayCell} />;
              const status = getDayStatus(day);
              const c = STATUS_COLORS[status];
              const isToday = isCurrentMonth && day === today;
              return (
                <View
                  key={day}
                  style={[
                    s.dayCell,
                    { backgroundColor: c.bg },
                    isToday && s.dayCellToday,
                  ]}
                >
                  <Text
                    style={[
                      s.dayNumber,
                      { color: c.text },
                      isToday && s.dayNumberToday,
                    ]}
                  >
                    {day}
                  </Text>
                  {status !== "future" && (
                    <View style={[s.statusDot, { backgroundColor: c.dot }]} />
                  )}
                  {recordMap[day]?.check_in && (
                    <Text style={[s.dayTime, { color: c.text }]}>
                      {new Date(recordMap[day].check_in).toLocaleTimeString(
                        "vi-VN",
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          <View style={s.legend}>
            {[
              { color: COLORS.success, label: "Đúng giờ" },
              { color: COLORS.warning, label: "Đi muộn" },
              { color: COLORS.danger, label: "Vắng mặt" },
            ].map((item, i) => (
              <View key={i} style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: item.color }]} />
                <Text style={s.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>
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
  yearBtn: { fontSize: 24, color: COLORS.primary },
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
  summaryCard: { flex: 1, borderRadius: 12, padding: 12, alignItems: "center" },
  summaryValue: { fontSize: 22, fontWeight: "800" },
  summaryLabel: {
    fontSize: 10,
    color: COLORS.textMid,
    marginTop: 3,
    fontWeight: "600",
  },
  calendar: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  dayHeader: { width: "13%", alignItems: "center", paddingVertical: 6 },
  dayHeaderText: { fontSize: 11, fontWeight: "700", color: COLORS.textMid },
  dayCell: {
    width: "13%",
    aspectRatio: 0.75,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  dayCellToday: { borderWidth: 2, borderColor: COLORS.primary },
  dayNumber: { fontSize: 13, fontWeight: "700" },
  dayNumberToday: { color: COLORS.primary },
  statusDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  dayTime: { fontSize: 8, marginTop: 1, fontWeight: "600" },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: COLORS.textMid },
});
