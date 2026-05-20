import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HistoryStackParamList } from "../types";
import { attendanceApi } from "../../../../api/attendanceApi";
import { isLate, fmtTime, DOW_FULL, dowIdx } from "../helpers";
import styles, { COLORS } from "./Statsscreen.style";

type Props = NativeStackScreenProps<HistoryStackParamList, "Stats">;

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

function getDateFromISO(iso: string) {
  const s = iso.endsWith("Z") ? iso : iso + "Z";
  return new Date(s);
}

function getUTCDay(iso: string) {
  return getDateFromISO(iso).getUTCDate();
}
function getUTCMonth(iso: string) {
  return getDateFromISO(iso).getUTCMonth();
}
function getUTCYear(iso: string) {
  return getDateFromISO(iso).getUTCFullYear();
}

// ── Tính phút muộn/sớm ────────────────────────────────────────────────────────
function calcLateMins(checkIn: string): number {
  const timePart = checkIn.split("T")[1] ?? "";
  const [h, m] = timePart.split(":").map(Number);
  return Math.max(0, h * 60 + m - (8 * 60 + 5));
}

function calcEarlyMins(checkOut: string): number {
  const timePart = checkOut.split("T")[1] ?? "";
  const [h, m] = timePart.split(":").map(Number);
  return Math.max(0, 17 * 60 + 30 - (h * 60 + m));
}

function getWeeksOfMonth(year: number, month: number) {
  const last = new Date(year, month + 1, 0).getDate();
  const weeks: { start: number; end: number }[] = [];
  let start = 1;
  while (start <= last) {
    let end = start;
    while (end <= last && new Date(year, month, end).getDay() !== 0) end++;
    if (end > last) end = last;
    weeks.push({ start, end });
    start = end + 1;
  }
  return weeks;
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────
function BarChart({
  data,
  labels,
  maxVal,
  color,
}: {
  data: number[];
  labels: string[];
  maxVal: number;
  color: string;
}) {
  const chartH = 100;
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          height: chartH,
          gap: 8,
        }}
      >
        {data.map((val, i) => {
          const barH = maxVal > 0 ? (val / maxVal) * chartH : 0;
          const isHighlight =
            val > 0 && val === Math.max(...data.filter(Boolean));
          return (
            <View
              key={i}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {val > 0 && (
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.textLight,
                    marginBottom: 2,
                  }}
                >
                  {val}
                </Text>
              )}
              <View
                style={{
                  width: "100%",
                  height: Math.max(barH, val > 0 ? 4 : 0),
                  backgroundColor:
                    val === 0
                      ? COLORS.border
                      : isHighlight
                        ? color
                        : color + "88",
                  borderRadius: 4,
                }}
              />
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
        {labels.map((l, i) => (
          <Text
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 10,
              color: COLORS.textLight,
            }}
          >
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ── Progress Row ──────────────────────────────────────────────────────────────
function ProgressRow({
  label,
  value,
  total,
  color,
  dot,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  dot: string;
}) {
  const pct = total > 0 ? value / total : 0;
  return (
    <View style={{ marginBottom: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: dot,
            }}
          />
          <Text style={styles.analysisLabel}>{label}</Text>
        </View>
        <Text
          style={{ fontSize: 12, fontWeight: "700", color: COLORS.textDark }}
        >
          {value} ngày
        </Text>
      </View>
      <View
        style={{
          height: 6,
          backgroundColor: COLORS.border,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: 6,
            width: `${Math.round(pct * 100)}%`,
            backgroundColor: color,
            borderRadius: 3,
          }}
        />
      </View>
    </View>
  );
}

export default function StatsScreen({ navigation }: Props) {
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.getParent()?.navigate("Home" as never);
      }
      return true;
    });
    return () => sub.remove();
  }, [navigation]);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [leaveRecords, setLeaveRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
        const last = new Date(year, month + 1, 0).getDate();
        const to = `${year}-${String(month + 1).padStart(2, "0")}-${last}`;
        const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

        // Fetch cả 3 cùng lúc
        const [attendRes, statsRes] = await Promise.all([
          attendanceApi.getHistory(from, to),
          attendanceApi.getStats(monthStr),
        ]);

        setRecords(Array.isArray(attendRes.data) ? attendRes.data : []);
        setStats(statsRes.data ?? null);

        // Leave riêng vì có thể lỗi
        try {
          const leaveRes = await attendanceApi.getLeaveRequests("approved");
          setLeaveRecords(Array.isArray(leaveRes.data) ? leaveRes.data : []);
        } catch {
          setLeaveRecords([]);
        }
      } catch {
        setRecords([]);
        setLeaveRecords([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [year, month]);
  // ── Stats ─────────────────────────────────────────────────────────────────
  const workDaysTotal = useMemo(() => {
    let n = 0;
    const last = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= last; d++) {
      if (new Date(year, month, d).getDay() !== 0) n++;
    }
    return n;
  }, [year, month]);

  const totalPresent = records.filter((r) => r.check_in).length;
  const totalLate = records.filter(isLate).length;
  const totalOnTime = totalPresent - totalLate;

  const totalLateMinutes = useMemo(
    () => records.reduce((sum, r) => sum + (r.late_minutes ?? (r.check_in ? calcLateMins(r.check_in) : 0)), 0),
    [records],
  );
  const totalEarlyMinutes = useMemo(
    () => records.reduce((sum, r) => sum + (r.early_minutes ?? (r.check_out ? calcEarlyMins(r.check_out) : 0)), 0),
    [records],
  );
  console.log(
    "[ISLATE]",
    records.map((r) => ({
      check_in: r.check_in,
      late: isLate(r),
    })),
  );
  const { leaveDays, absentDays } = useMemo(() => {
    let leave = 0;
    let absent = 0;
    const last = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= last; d++) {
      const date = new Date(year, month, d);
      if (date > today) break;
      if (date.getDay() === 0) continue;

      const hasAttendance = records.some(
        (r) =>
          getUTCDay(r.date) === d &&
          getUTCMonth(r.date) === month &&
          getUTCYear(r.date) === year,
      );
      if (hasAttendance) continue;

      const hasLeave = leaveRecords.some((l) => {
        const fromD = new Date(l.from_date);
        const toD = new Date(l.to_date);
        const cur = new Date(year, month, d);
        return cur >= fromD && cur <= toD;
      });

      if (hasLeave) leave++;
      else absent++;
    }
    return { leaveDays: leave, absentDays: absent };
  }, [records, leaveRecords, year, month, today]);


  // ── Biểu đồ tuần — dùng UTC ──────────────────────────────────────────────
  const weeks = useMemo(() => getWeeksOfMonth(year, month), [year, month]);
  const weekData = useMemo(
    () =>
      weeks.map(
        (w) =>
          records.filter((r) => {
            const d = getUTCDay(r.date);
            const m = getUTCMonth(r.date);
            const y = getUTCYear(r.date);
            return (
              r.check_in &&
              d >= w.start &&
              d <= w.end &&
              m === month &&
              y === year
            );
          }).length,
      ),
    [weeks, records, month, year],
  );
  const weekLabels = weeks.map((_, i) => `T${i + 1}`);

  // ── Ngày chưa chấm — dùng UTC ────────────────────────────────────────────
  const uncheckedDays = useMemo(() => {
    const days: number[] = [];
    const last = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= last; d++) {
      const date = new Date(year, month, d);
      if (date > today) break;
      if (date.getDay() === 0) continue;
      const hasRecord = records.some(
        (r) =>
          getUTCDay(r.date) === d &&
          getUTCMonth(r.date) === month &&
          getUTCYear(r.date) === year,
      );
      if (!hasRecord) days.push(d);
    }
    return days;
  }, [records, year, month, today]);

  const recentRecords = useMemo(
    () =>
      [...records]
        .sort(
          (a, b) =>
            getDateFromISO(b.date).getTime() - getDateFromISO(a.date).getTime(),
        )
        .slice(0, 5),
    [records],
  );

  return (
    <View style={styles.container}>
      {/* ── Month Picker Modal ── */}
      <Modal
        visible={showMonthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Chọn tháng</Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 300 }}
            >
              {[today.getFullYear() - 1, today.getFullYear()].map((y) => (
                <View key={y}>
                  <Text style={styles.modalYearLabel}>{y}</Text>
                  <View style={styles.modalMonthGrid}>
                    {MONTHS.map((label, mi) => {
                      const isActive = y === year && mi === month;
                      const isFuture =
                        y > today.getFullYear() ||
                        (y === today.getFullYear() && mi > today.getMonth());
                      return (
                        <TouchableOpacity
                          key={mi}
                          style={[
                            styles.modalMonthBtn,
                            {
                              backgroundColor: isActive
                                ? COLORS.primary
                                : "#f5f5f5",
                              opacity: isFuture ? 0.4 : 1,
                            },
                          ]}
                          onPress={() => {
                            if (isFuture) return;
                            setYear(y);
                            setMonth(mi);
                            setShowMonthPicker(false);
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: isActive ? "700" : "500",
                              color: isActive ? "#fff" : COLORS.textDark,
                            }}
                          >
                            {label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Header ── */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerInner}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.getParent()?.navigate("Home" as never);
                }
              }}
            >
              <Text style={styles.backBtnText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Thống kê cá nhân</Text>
            <View style={{ width: 32 }} />
          </View>
          <TouchableOpacity
            style={styles.monthPickerRow}
            onPress={() => setShowMonthPicker(true)}
          >
            <Text style={styles.monthPickerArrow}>‹</Text>
            <View style={styles.monthPickerPill}>
              <Text style={styles.monthPickerText}>
                Tháng {month + 1} / {year}
              </Text>
            </View>
            <Text style={styles.monthPickerArrow}>›</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {loading ? (
          <ActivityIndicator
            style={{ marginTop: 40 }}
            color={COLORS.primary}
            size="large"
          />
        ) : (
          <>
            <View style={styles.overviewWrap}>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewIcon}>📅</Text>
                  <Text style={styles.overviewValue}>
                    {stats?.total_present ?? totalPresent}
                    <Text style={styles.overviewValueSub}>
                      /{stats?.work_days_total ?? workDaysTotal}
                    </Text>
                  </Text>
                  <Text style={styles.overviewLabel}>Ngày công</Text>
                </View>
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewIcon}>⏰</Text>
                  <Text style={styles.overviewValueWarning}>
                    {totalLateMinutes}
                    <Text style={{ fontSize: 11 }}>p</Text>
                  </Text>
                  <Text style={styles.overviewLabel}>Đi muộn</Text>
                </View>
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewIcon}>🏃</Text>
                  <Text style={styles.overviewValueWarning}>
                    {totalEarlyMinutes}
                    <Text style={{ fontSize: 11 }}>p</Text>
                  </Text>
                  <Text style={styles.overviewLabel}>Về sớm</Text>
                </View>
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewIcon}>🏖️</Text>
                  <Text style={styles.overviewValueDanger}>
                    {stats?.total_absent ?? leaveDays + absentDays}
                  </Text>
                  <Text style={styles.overviewLabel}>Ngày nghỉ</Text>
                </View>
              </View>
            </View>

            {/* ── Biểu đồ tuần ── */}
            <View style={styles.sectionCardFirst}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ngày công theo tuần</Text>
              </View>
              <BarChart
                data={weekData}
                labels={weekLabels}
                maxVal={Math.max(...weekData, 6)}
                color={COLORS.primary}
              />
            </View>

            {/* ── Phân tích thời gian ── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Phân tích thời gian</Text>
                <Text style={styles.sectionMeta}>Tháng {month + 1}</Text>
              </View>
              <ProgressRow
                label="Đúng giờ"
                value={totalOnTime}
                total={workDaysTotal}
                color={COLORS.success}
                dot={COLORS.success}
              />
              <ProgressRow
                label="Đi muộn"
                value={totalLate}
                total={workDaysTotal}
                color={COLORS.warning}
                dot={COLORS.warning}
              />
              <ProgressRow
                label="Nghỉ phép"
                value={leaveDays}
                total={workDaysTotal}
                color={COLORS.primary}
                dot={COLORS.primary}
              />
              <ProgressRow
                label="Vắng mặt"
                value={absentDays}
                total={workDaysTotal}
                color={COLORS.danger}
                dot={COLORS.danger}
              />
            </View>

            {/* ── Lịch sử gần đây ── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Lịch sử chấm công gần đây
                </Text>
              </View>
              {recentRecords.length === 0 ? (
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.textLight,
                    textAlign: "center",
                    paddingVertical: 16,
                  }}
                >
                  Chưa có dữ liệu
                </Text>
              ) : (
                recentRecords.map((r, i) => {
                  const date = getDateFromISO(r.date);
                  const late = isLate(r);
                  const miss = r.check_in && !r.check_out;
                  const absent = !r.check_in;
                  const lateMins = r.check_in ? calcLateMins(r.check_in) : 0;
                  const earlyMins = r.check_out
                    ? calcEarlyMins(r.check_out)
                    : 0;

                  const dotColor = absent
                    ? COLORS.danger
                    : late
                      ? COLORS.warning
                      : COLORS.success;
                  const statusBg = absent
                    ? COLORS.dangerLight
                    : late
                      ? COLORS.warningLight
                      : miss
                        ? COLORS.dangerLight
                        : COLORS.successLight;
                  const statusColor = absent
                    ? COLORS.danger
                    : late
                      ? COLORS.warningDark
                      : miss
                        ? COLORS.danger
                        : COLORS.successDark;

                  // Badge text với số phút
                  let statusText = "";
                  if (absent) statusText = "Vắng mặt";
                  else if (late) statusText = `Muộn ${lateMins}p`;
                  else if (miss) statusText = "Thiếu ra";
                  else statusText = "Đúng giờ";

                  return (
                    <View
                      key={i}
                      style={[
                        styles.recentItem,
                        {
                          borderBottomWidth:
                            i < recentRecords.length - 1 ? 0.5 : 0,
                          borderBottomColor: COLORS.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.recentDot,
                          { backgroundColor: dotColor },
                        ]}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.recentDate}>
                          {DOW_FULL[dowIdx(date)].slice(0, 7)},{" "}
                          {String(date.getUTCDate()).padStart(2, "0")}/
                          {String(date.getUTCMonth() + 1).padStart(2, "0")}/
                          {date.getUTCFullYear()}
                        </Text>
                        <Text style={styles.recentTime}>
                          {r.check_in
                            ? `Vào: ${fmtTime(r.check_in)}`
                            : "Không có dữ liệu"}
                          {r.check_out
                            ? ` · Ra: ${fmtTime(r.check_out)}${earlyMins > 0 ? ` (sớm ${earlyMins}p)` : ""}`
                            : r.check_in
                              ? " · Chưa ra"
                              : ""}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusBg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: statusColor },
                          ]}
                        >
                          {statusText}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* ── Banner cảnh báo ── */}
            {uncheckedDays.length > 0 && (
              <View style={styles.warningBanner}>
                <Text style={{ fontSize: 20 }}>ℹ️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.warningTitle}>
                    Bạn còn {uncheckedDays.length} ngày chưa chấm công trong
                    tháng.
                  </Text>
                  <Text style={styles.warningSub}>
                    Hãy kiểm tra lại bảng công của bạn.
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
