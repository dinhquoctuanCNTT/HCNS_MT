import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextStyle,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { attendanceApi } from "../../../api/attendanceApi";
import styles, {
  COLORS,
  H_PAD,
  CELL_W,
} from "./HistoryScreen/HistoryScreen.style";
import { HistoryStackParamList, Tab, DayDetail } from "./types";
import {
  DOW_LABELS,
  DOW_FULL,
  MONTH_PILLS,
  fmtTime,
  fmtDate,
  dowIdx,
  isLate,
  buildGrid,
  getDayStatus,
} from "./helpers";
import BackButton from "./BackButton";

type Props = NativeStackScreenProps<HistoryStackParamList, "HistoryMain">;
const PAGE_SIZE = 10;

function getWeeksOfMonth(year: number, month: number) {
  const weeks: { label: string; start: number; end: number }[] = [];
  const last = new Date(year, month + 1, 0).getDate();
  let wn = 1,
    start = 1;
  while (start <= last) {
    let end = start;
    while (end <= last && new Date(year, month, end).getDay() !== 0) end++;
    if (end > last) end = last;
    weeks.push({ label: `Tuần ${wn}`, start, end });
    start = end + 1;
    wn++;
  }
  return weeks;
}

function getRecordDate(isoStr: string): number {
  const s = isoStr.endsWith("Z") ? isoStr : isoStr + "Z";
  return new Date(s).getUTCDate();
}

function isCheckInLate(rec: any): boolean {
  if (!rec?.check_in) return false;
  const t = rec.check_in.includes("T")
    ? rec.check_in.split("T")[1]
    : rec.check_in;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m > 8 * 60 + 5;
}

function isCheckOutEarly(rec: any): boolean {
  if (!rec?.check_out) return false;
  const t = rec.check_out.includes("T")
    ? rec.check_out.split("T")[1]
    : rec.check_out;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m < 17 * 60 + 30;
}

export default function HistoryMainScreen({ navigation }: Props) {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("calendar");
  const [page, setPage] = useState(1);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  useEffect(() => {
    setPage(1);
    setSelectedWeek(null);
  }, [year, month]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
        const last = new Date(year, month + 1, 0).getDate();
        const to = `${year}-${String(month + 1).padStart(2, "0")}-${last}`;
        const res = await attendanceApi.getHistory(from, to);
        setRecords(Array.isArray(res.data) ? res.data : []);
      } catch {
        setRecords([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [year, month]);

  const recMap = useMemo(() => {
    const m = new Map<number, any>();
    records.forEach((r) => m.set(getRecordDate(r.date), r));
    return m;
  }, [records]);

  const weeks = useMemo(() => getWeeksOfMonth(year, month), [year, month]);
  const calWeeks = useMemo(() => buildGrid(year, month), [year, month]);
  const totalPresent = records.filter((r) => r.check_in).length;
  const totalLate = records.filter(isLate).length;

  const absentDays = useMemo(() => {
    let n = 0;
    const last = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= last; d++) {
      const date = new Date(year, month, d);
      if (date > today) break;
      if (date.getDay() === 0) continue;
      if (!recMap.has(d)) n++;
    }
    return n;
  }, [recMap, year, month, today]);

  const workDaysTotal = useMemo(() => {
    let n = 0;
    const last = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= last; d++) {
      const date = new Date(year, month, d);
      if (date > today) break;
      if (date.getDay() !== 0) n++;
    }
    return n;
  }, [year, month, today]);

  const explainDays = useMemo(() => {
    const list: DayDetail[] = [];
    const last = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= last; d++) {
      const date = new Date(year, month, d);
      if (date > today) break;
      const status = getDayStatus(d, year, month, recMap, today);
      if (status === "absent" || status === "late")
        list.push({
          day: d,
          record: recMap.get(d) ?? null,
          status,
          dayOfWeek: DOW_FULL[dowIdx(date)],
          dateStr: fmtDate(date),
        });
    }
    return list.reverse();
  }, [recMap, year, month, today]);

  const sortedRecords = useMemo(
    () =>
      [...records].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [records],
  );

  const filteredRecords = useMemo(() => {
    if (selectedWeek === null) return sortedRecords;
    const w = weeks[selectedWeek];
    if (!w) return sortedRecords;
    return sortedRecords.filter((r) => {
      const d = getRecordDate(r.date);
      return d >= w.start && d <= w.end;
    });
  }, [sortedRecords, selectedWeek, weeks]);

  const pagedRecords = useMemo(
    () => filteredRecords.slice(0, page * PAGE_SIZE),
    [filteredRecords, page],
  );
  const hasMore = pagedRecords.length < filteredRecords.length;
  const filteredPresent = useMemo(
    () => filteredRecords.filter((r) => r.check_in).length,
    [filteredRecords],
  );
  const filteredLate = useMemo(
    () => filteredRecords.filter(isLate).length,
    [filteredRecords],
  );
  const filteredWorkDays = useMemo(() => {
    if (selectedWeek === null) return workDaysTotal;
    const w = weeks[selectedWeek];
    if (!w) return workDaysTotal;
    let n = 0;
    for (let d = w.start; d <= w.end; d++) {
      const date = new Date(year, month, d);
      if (date > today) break;
      if (date.getDay() !== 0) n++;
    }
    return n;
  }, [selectedWeek, weeks, year, month, today, workDaysTotal]);

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  const goToDetail = useCallback(
    (day: number) => {
      const status = getDayStatus(day, year, month, recMap, today);
      if (status === "future" || status === "weekend") return;
      const date = new Date(year, month, day);
      navigation.navigate("DayDetail", {
        detail: {
          day,
          record: recMap.get(day) ?? null,
          status,
          dayOfWeek: DOW_FULL[dowIdx(date)],
          dateStr: fmtDate(date),
        },
      });
    },
    [year, month, recMap, today, navigation],
  );

  // ── Cell: số trên, 2 badge dưới ──────────────────────────────────────────────
  const renderCell = (day: number | null, ci: number, wi: number) => {
    const key = `${wi}-${ci}`;
    if (day === null)
      return <View key={key} style={[styles.calCell, { height: 62 }]} />;

    const status = getDayStatus(day, year, month, recMap, today);
    const dow = new Date(year, month, day).getDay();
    const isSun = dow === 0;
    const isFuture = status === "future";
    const isPast = !isFuture && status !== "weekend";
    const rec = recMap.get(day);

    // Màu số ngày
    let numStyle: TextStyle = styles.dayNumDefault;
    if (isSun) numStyle = styles.dayNumRed;
    else if (isFuture) numStyle = styles.dayNumFuture;
    else if (status === "today") numStyle = styles.dayNumToday;

    // Tính badge vào ca và ra ca
    // Chỉ hiện badge khi ngày đã qua (không phải future, không phải CN)
    const showBadges = isPast && !isSun;

    let inBadgeStyle = styles.badgeGray; // xám = chưa có
    let outBadgeStyle = styles.badgeGray;
    let inSign = "–";
    let outSign = "–";

    if (rec) {
      if (rec.check_in) {
        inBadgeStyle = isCheckInLate(rec)
          ? styles.badgeAmber
          : styles.badgeGreen;
        inSign = isCheckInLate(rec) ? "–" : "+";
      }
      if (rec.check_out) {
        outBadgeStyle = isCheckOutEarly(rec)
          ? styles.badgeAmber
          : styles.badgeGreen;
        outSign = isCheckOutEarly(rec) ? "–" : "+";
      }
    }

    const isClickable = !isFuture && !isSun;

    const inner = (
      <View style={styles.dayCellOuter}>
        <Text style={numStyle}>{day}</Text>

        {!isSun && (
          <View style={styles.badgesContainer}>
            {/* ← bao ngoài */}
            <View style={styles.badgesRow}>
              {/* Ô vào ca */}
              <View
                style={[
                  styles.badge,
                  isFuture
                    ? styles.badgeEmpty
                    : rec?.check_in
                      ? isCheckInLate(rec)
                        ? styles.badgeAmber
                        : styles.badgeGreen
                      : styles.badgeGray,
                ]}
              >
                {!isFuture && (
                  <Text style={styles.badgeText}>
                    {rec?.check_in ? (isCheckInLate(rec) ? "-" : "+") : "--"}
                  </Text>
                )}
              </View>

              {/* Ô ra ca */}
              <View
                style={[
                  styles.badge,
                  isFuture
                    ? styles.badgeEmpty
                    : rec?.check_out
                      ? isCheckOutEarly(rec)
                        ? styles.badgeAmber
                        : styles.badgeGreen
                      : styles.badgeGray,
                ]}
              >
                {!isFuture && (
                  <Text style={styles.badgeText}>
                    {rec?.check_out ? (isCheckOutEarly(rec) ? "-" : "+") : "--"}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    );

    if (!isClickable)
      return (
        <View key={key} style={styles.calCell}>
          {inner}
        </View>
      );
    return (
      <TouchableOpacity
        key={key}
        style={styles.calCell}
        onPress={() => goToDetail(day)}
        activeOpacity={0.75}
      >
        {inner}
      </TouchableOpacity>
    );
  };

  const renderLogCard = (record: any, idx: number) => {
    const dayNum = getRecordDate(record.date);
    const late = isLate(record);
    const miss = record.check_in && !record.check_out;
    const dayColor = late
      ? COLORS.warning
      : miss
        ? COLORS.danger
        : COLORS.success;
    const leftBg = late
      ? COLORS.warningLight
      : miss
        ? COLORS.dangerLight
        : COLORS.successLight;
    return (
      <TouchableOpacity
        key={idx}
        style={styles.logCard}
        onPress={() => goToDetail(dayNum)}
        activeOpacity={0.8}
      >
        <View style={[styles.logLeft, { backgroundColor: leftBg }]}>
          <Text style={[styles.logDay, { color: dayColor }]}>{dayNum}</Text>
          <Text style={[styles.logDow, { color: dayColor }]}>
            {DOW_FULL[dowIdx(new Date(year, month, dayNum))].slice(0, 5)}
          </Text>
        </View>
        <View style={styles.logRight}>
          <View style={styles.logTimeRow}>
            <View style={styles.logTimeItem}>
              <Text style={styles.logTimeLabel}>VÀO CA</Text>
              <Text
                style={record.check_in ? styles.logTimeIn : styles.logTimeDash}
              >
                {record.check_in ? fmtTime(record.check_in) : "--:--"}
              </Text>
            </View>
            <View style={styles.logDivider} />
            <View style={styles.logTimeItem}>
              <Text style={styles.logTimeLabel}>RA CA</Text>
              <Text
                style={
                  record.check_out ? styles.logTimeOut : styles.logTimeDash
                }
              >
                {record.check_out ? fmtTime(record.check_out) : "--:--"}
              </Text>
            </View>
          </View>
          <View style={styles.logTagRow}>
            {!late && !miss && record.check_in && (
              <View
                style={[
                  styles.logTag,
                  { backgroundColor: COLORS.successLight },
                ]}
              >
                <Text style={[styles.logTagText, { color: COLORS.success }]}>
                  Đúng giờ
                </Text>
              </View>
            )}
            {late && (
              <View
                style={[
                  styles.logTag,
                  { backgroundColor: COLORS.warningLight },
                ]}
              >
                <Text style={[styles.logTagText, { color: COLORS.warning }]}>
                  Đi muộn
                </Text>
              </View>
            )}
            {miss && (
              <View
                style={[styles.logTag, { backgroundColor: COLORS.dangerLight }]}
              >
                <Text style={[styles.logTagText, { color: COLORS.danger }]}>
                  Thiếu ra
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderExplainCard = (detail: DayDetail, idx: number) => {
    const isAbsent = detail.status === "absent";
    const color = isAbsent ? "#ef4444" : "#f59e0b";
    const bg = isAbsent ? "#fee2e2" : "#fef3c7";
    const icon = isAbsent ? "📄" : "⏱️";

    return (
      <TouchableOpacity
        key={idx}
        style={styles.explainCard}
        onPress={() => navigation.navigate("UpdateRequest", { detail })}
        activeOpacity={0.8}
      >
        <View style={[styles.explainDateBox, { backgroundColor: bg }]}>
          <Text style={[styles.explainDateNum, { color }]}>{detail.day}</Text>
          <Text style={[styles.explainDateDow, { color }]}>
            {detail.dayOfWeek}
          </Text>
        </View>
        <View style={styles.explainInfo}>
          <View style={styles.explainHeader}>
            <Text style={styles.explainIcon}>{icon}</Text>
            <Text style={styles.explainReason} numberOfLines={1}>
              {isAbsent ? "Nghỉ không phép" : "Đi muộn"} - {detail.dateStr}
            </Text>
          </View>
          <View style={styles.explainBody}>
            <Text style={styles.explainTime}>
              {detail.record
                ? `Vào: ${fmtTime(detail.record.check_in)}${detail.record.check_out ? ` · Ra: ${fmtTime(detail.record.check_out)}` : " · Chưa ra"}`
                : "Không có dữ liệu"}
            </Text>
            <View style={styles.explainBtn}>
              <Text style={styles.explainBtnText}>Giải trình ›</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={showMonthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              width: "80%",
              maxHeight: "70%",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#111827",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Chọn tháng
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {[today.getFullYear() - 1, today.getFullYear()].map((y) => (
                <View key={y}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: "#94a3b8",
                      marginVertical: 8,
                    }}
                  >
                    {y}
                  </Text>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                  >
                    {MONTH_PILLS.map((label, mi) => {
                      const isActive = y === year && mi === month;
                      const isFut =
                        y > today.getFullYear() ||
                        (y === today.getFullYear() && mi > today.getMonth());
                      return (
                        <TouchableOpacity
                          key={mi}
                          style={{
                            width: "22%",
                            paddingVertical: 8,
                            borderRadius: 8,
                            alignItems: "center",
                            backgroundColor: isActive
                              ? COLORS.primary
                              : "#f5f5f5",
                            opacity: isFut ? 0.4 : 1,
                          }}
                          onPress={() => {
                            if (isFut) return;
                            setYear(y);
                            setMonth(mi);
                            setShowMonthPicker(false);
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: isActive ? "700" : "500",
                              color: isActive ? "#fff" : "#111827",
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

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <BackButton onPress={() => navigation.navigate("Home" as any)} />
            <Text style={styles.headerTitle}>Bảng công</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.tabs}>
            {(
              [
                { key: "calendar", label: "Bảng công" },
                { key: "list", label: "Danh sách" },
                {
                  key: "explain",
                  label: `Giải trình${explainDays.length > 0 ? ` (${explainDays.length})` : ""}`,
                },
              ] as { key: Tab; label: string }[]
            ).map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.tabItem,
                  tab === t.key ? styles.tabActive : styles.tabInactive,
                ]}
                onPress={() => setTab(t.key)}
              >
                <Text
                  style={
                    tab === t.key
                      ? styles.tabTextActive
                      : styles.tabTextInactive
                  }
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </View>

      {/* Stats */}
      <View style={styles.statsBar}>
        {[
          {
            num: filteredPresent,
            label: "CÓ MẶT",
            color: COLORS.success,
          },
          {
            num: filteredLate,
            label: "ĐI MUỘN",
            color: COLORS.warning,
          },
          { num: absentDays, label: "VẮNG", color: COLORS.danger },
        ].map((item, i) => (
          <View key={i} style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={[styles.statNum, { color: item.color }]}>
                {item.num}
              </Text>
            </View>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {tab === "list" && (
        <View
          style={{ flexDirection: "row", paddingHorizontal: H_PAD, paddingVertical: 8, gap: 6, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e8ecf2" }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 6,
              borderRadius: 20,
              alignItems: "center",
              backgroundColor: selectedWeek === null ? COLORS.primary : "#f1f5f9",
              borderWidth: 1,
              borderColor: selectedWeek === null ? COLORS.primary : "#e2e8f0",
            }}
            onPress={() => { setSelectedWeek(null); setPage(1); }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: selectedWeek === null ? "#fff" : "#64748b" }}>
              Tất cả
            </Text>
          </TouchableOpacity>
          {weeks.map((w, i) => (
            <TouchableOpacity
              key={i}
              style={{
                flex: 1,
                paddingVertical: 6,
                borderRadius: 20,
                alignItems: "center",
                backgroundColor: selectedWeek === i ? COLORS.primary : "#f1f5f9",
                borderWidth: 1,
                borderColor: selectedWeek === i ? COLORS.primary : "#e2e8f0",
              }}
              onPress={() => { setSelectedWeek(i); setPage(1); }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: selectedWeek === i ? "#fff" : "#64748b" }}>
                {w.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator
            style={{ marginTop: 40 }}
            color={COLORS.primary}
            size="large"
          />
        ) : tab === "calendar" ? (
          <>
            <View style={styles.calWrap}>
              <View style={styles.monthNavRow}>
                <TouchableOpacity onPress={prevMonth}>
                  <Text style={styles.monthNavBtn}>‹</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
                  <Text style={styles.monthLabel}>Tháng {month + 1}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextMonth}>
                  <Text style={styles.monthNavBtn}>›</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dowRow}>
                {DOW_LABELS.map((d, i) => (
                  <View key={d} style={styles.dowCell}>
                    <Text style={i === 6 ? styles.dowTextRed : styles.dowText}>
                      {d}
                    </Text>
                  </View>
                ))}
              </View>

              {calWeeks.map((week, wi) => (
                <View key={wi} style={styles.weekRow}>
                  {week.map((day, ci) => renderCell(day, ci, wi))}
                </View>
              ))}

              <View style={styles.legend}>
                {[
                  { color: "#6ee7b7", label: "Đúng giờ" },
                  { color: "#fdba74", label: "Đi muộn" },
                  { color: "#d1d5db", label: "Vắng mặt" },
                ].map((l, i) => (
                  <View key={i} style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: l.color }]}
                    />
                    <Text style={styles.legendText}>{l.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.summaryBar}>
              {[
                {
                  label: "Số công:",
                  val: `${totalPresent}/${workDaysTotal} ngày`,
                  color: COLORS.success,
                },
                {
                  label: "Đi muộn:",
                  val: `${totalLate} ngày`,
                  color: COLORS.warning,
                },
                {
                  label: "Nghỉ:",
                  val: `${absentDays} ngày`,
                  color: COLORS.danger,
                },
              ].map((item, i) => (
                <View
                  key={i}
                  style={[
                    styles.summaryItem,
                    i === 2 && styles.summaryItemLast,
                  ]}
                >
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                  <Text style={[styles.summaryVal, { color: item.color }]}>
                    {item.val}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : tab === "list" ? (
          <View style={styles.listSection}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: "700", color: "#111827" }}
              >
                {selectedWeek !== null
                  ? weeks[selectedWeek]?.label
                  : `Tháng ${month + 1}/${year}`}
              </Text>
              <Text style={{ fontSize: 11, color: "#94a3b8" }}>
                {filteredRecords.length} ngày
              </Text>
            </View>
            {filteredRecords.length === 0 ? (
              <View style={styles.empty}>
                <Text style={{ fontSize: 36 }}>📋</Text>
                <Text style={styles.emptyText}>Không có dữ liệu</Text>
              </View>
            ) : (
              <>
                {pagedRecords.map((r, i) => renderLogCard(r, i))}
                {hasMore && (
                  <TouchableOpacity
                    style={{
                      padding: 12,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#e2e8f0",
                      borderRadius: 10,
                      marginTop: 8,
                    }}
                    onPress={() => setPage((p) => p + 1)}
                  >
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontWeight: "600",
                        fontSize: 13,
                      }}
                    >
                      Xem thêm ({filteredRecords.length - pagedRecords.length}{" "}
                      bản ghi)
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        ) : (
          <View style={styles.explainSection}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text style={[styles.explainSectionTitle, { marginBottom: 0 }]}>
                Các ngày cần giải trình
              </Text>
              <TouchableOpacity 
                style={{ backgroundColor: "#eff6ff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "#3b82f6" }}
                onPress={() => navigation.navigate("ExplanationHistory")}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#2563eb" }}>Lịch sử đơn ›</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
              Dữ liệu tính cho Tháng {month + 1}/{year}
            </Text>
            {explainDays.length === 0 ? (
              <View style={styles.empty}>
                <Text style={{ fontSize: 36 }}>✅</Text>
                <Text style={styles.emptyText}>
                  Không có ngày nào cần giải trình
                </Text>
              </View>
            ) : (
              explainDays.map((d, i) => renderExplainCard(d, i))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
