import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { attendanceApi } from "../../../../api/attendanceApi";
import styles, { COLORS, H_PAD, CELL_W } from "./HistoryScreen.style";
import { Tab, DayDetail } from "../types";
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
} from "../helpers";

const PAGE_SIZE = 10;

export default function HistoryScreen({ navigation }: any) {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("calendar");
  const [page, setPage] = useState(1);

  // Reset page khi đổi tháng/năm
  useEffect(() => setPage(1), [year, month]);

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
    records.forEach((r) => m.set(new Date(r.date).getDate(), r));
    return m;
  }, [records]);

  const calWeeks = useMemo(() => buildGrid(year, month), [year, month]);
  const totalPresent = records.filter((r) => r.check_in).length;
  const totalLate = records.filter(isLate).length;

  const absentDays = useMemo(() => {
    let n = 0;
    const last = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= last; d++) {
      const date = new Date(year, month, d);
      if (date > today) break;
      const dow = date.getDay();
      if (dow === 0) continue;
      if (!recMap.has(d)) n++;
    }
    return n;
  }, [recMap, year, month, today]);

  const workDaysTotal = useMemo(() => {
    let n = 0;
    const last = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= last; d++) {
      if (new Date(year, month, d).getDay() !== 0) n++;
    }
    return n;
  }, [year, month]);

  const explainDays = useMemo(() => {
    const list: DayDetail[] = [];
    const last = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= last; d++) {
      const date = new Date(year, month, d);
      if (date > today) break;
      const status = getDayStatus(d, year, month, recMap, today);
      if (status === "absent" || status === "late") {
        list.push({
          day: d,
          record: recMap.get(d) ?? null,
          status,
          dayOfWeek: DOW_FULL[dowIdx(date)],
          dateStr: fmtDate(date),
        });
      }
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

  // Phân trang
  const pagedRecords = useMemo(
    () => sortedRecords.slice(0, page * PAGE_SIZE),
    [sortedRecords, page],
  );
  const hasMore = pagedRecords.length < sortedRecords.length;

  const prevYear = () => setYear((y) => y - 1);
  const nextYear = () => setYear((y) => y + 1);
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

  const handleDayPress = useCallback(
    (day: number) => {
      const status = getDayStatus(day, year, month, recMap, today);
      if (status === "future" || status === "weekend") return;
      const date = new Date(year, month, day);
      const detail = {
        day,
        record: recMap.get(day) ?? null,
        status,
        dayOfWeek: DOW_FULL[dowIdx(date)],
        dateStr: fmtDate(date),
      };
      navigation.navigate("DayDetail", { detail });
    },
    [year, month, recMap, today, navigation],
  );

  // ── Calendar cell ──────────────────────────────────────────────────────────
  const renderCell = (day: number | null, ci: number, wi: number) => {
    const key = `${wi}-${ci}`;
    if (day === null)
      return <View key={key} style={{ width: CELL_W, height: 36 }} />;
    const status = getDayStatus(day, year, month, recMap, today);
    const dow = new Date(year, month, day).getDay();
    const isSun = dow === 0;
    const isWknd = dow === 0 || dow === 6;
    const isToday = status === "today";
    const rec = recMap.get(day);
    const late = isLate(rec);

    let numStyle: object = styles.dayNumDefault;
    if (isSun) numStyle = styles.dayNumRed;
    else if (status === "late") numStyle = styles.dayNumAmber;
    else if (status === "future") numStyle = styles.dayNumFuture;
    else if (isWknd) numStyle = styles.dayNumMuted;

    const numEl = isToday ? (
      <View style={styles.todayCircle}>
        <Text style={styles.todayNum}>{day}</Text>
      </View>
    ) : (
      <Text style={numStyle}>{day}</Text>
    );

    let dotColor: string | null = null;
    if (status === "present") dotColor = COLORS.success;
    else if (status === "late") dotColor = COLORS.warning;
    else if (status === "absent") dotColor = COLORS.danger;
    else if (isToday && rec && !late) dotColor = COLORS.success;
    else if (isToday && rec && late) dotColor = COLORS.warning;

    const cell = (
      <View style={styles.dayCellWrap}>
        <View style={{ position: "relative" }}>
          {numEl}
          {dotColor && (
            <View style={[styles.cornerDot, { backgroundColor: dotColor }]} />
          )}
        </View>
      </View>
    );

    if (isWknd || status === "future")
      return (
        <View key={key} style={styles.calCell}>
          {cell}
        </View>
      );

    return (
      <TouchableOpacity
        key={key}
        style={styles.calCell}
        onPress={() => handleDayPress(day)}
        activeOpacity={0.7}
      >
        {cell}
      </TouchableOpacity>
    );
  };

  // ── Log card ───────────────────────────────────────────────────────────────
  const renderLogCard = (record: any, idx: number) => {
    const date = new Date(record.date);
    const dayNum = date.getDate();
    const late = isLate(record);
    const miss = record.check_in && !record.check_out;
    const ok = !late && !miss && record.check_in;
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
        onPress={() => handleDayPress(dayNum)}
        activeOpacity={0.8}
      >
        <View style={[styles.logLeft, { backgroundColor: leftBg }]}>
          <Text style={[styles.logDay, { color: dayColor }]}>{dayNum}</Text>
          <Text style={[styles.logDow, { color: dayColor }]}>
            {DOW_FULL[dowIdx(date)].slice(0, 5)}
          </Text>
        </View>
        <View style={styles.logRight}>
          <View style={styles.logTimeRow}>
            <View style={styles.logTimeItem}>
              <Text style={styles.logTimeLabel}>Vào</Text>
              <Text
                style={record.check_in ? styles.logTimeIn : styles.logTimeDash}
              >
                {record.check_in ? fmtTime(record.check_in) : "--:--"}
              </Text>
            </View>
            <View style={styles.logDivider} />
            <View style={styles.logTimeItem}>
              <Text style={styles.logTimeLabel}>Ra</Text>
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
            {ok && (
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

  // ── Explain card ───────────────────────────────────────────────────────────
  const renderExplainCard = (detail: DayDetail, idx: number) => {
    const isAbsent = detail.status === "absent";
    const color = isAbsent ? COLORS.danger : COLORS.warning;
    const bg = isAbsent ? COLORS.dangerLight : COLORS.warningLight;
    const label = isAbsent ? "Nghỉ không phép" : "Đi muộn";
    const timeText = detail.record
      ? `Vào: ${fmtTime(detail.record.check_in)}${detail.record.check_out ? ` · Ra: ${fmtTime(detail.record.check_out)}` : " · Chưa ra"}`
      : "Không có dữ liệu chấm công";
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
            {detail.dayOfWeek.slice(0, 5)}
          </Text>
        </View>
        <View style={styles.explainInfo}>
          <Text style={styles.explainReason}>
            {label} · {detail.dateStr}
          </Text>
          <Text style={styles.explainTime}>{timeText}</Text>
        </View>
        <TouchableOpacity
          style={styles.explainBtn}
          onPress={() => navigation.navigate("UpdateRequest", { detail })}
        >
          <Text style={styles.explainBtnText}>Giải trình</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // ── Sub-screen routing đã bị xóa ─────────────────────────────────────────
  // DayDetailScreen và UpdateRequestForm đã được chuyển lên root MainStack
  // Navigation giờ sử dụng navigation.navigate() thay vì inline rendering

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bảng công</Text>
          <View style={{ width: 28 }} />
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
                  tab === t.key ? styles.tabTextActive : styles.tabTextInactive
                }
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.metaCard}>
        <Text style={styles.metaShift}>
          Ca làm việc:{" "}
          <Text style={styles.metaShiftVal}>Hành chính từ 08:00 đến 17:30</Text>
        </Text>
        <View style={styles.metaPeriodRow}>
          <Text style={styles.metaPeriodLabel}>
            01/{String(month + 1).padStart(2, "0")}/{year} –{" "}
            {new Date(year, month + 1, 0).getDate()}/
            {String(month + 1).padStart(2, "0")}/{year}
          </Text>
          <TouchableOpacity style={styles.metaDropdown}>
            <Text style={styles.metaDropdownText}>
              Tháng {month + 1}/{year}
            </Text>
            <Text style={{ fontSize: 10, color: COLORS.primary }}>▾</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator
            style={{ marginTop: 40 }}
            color={COLORS.primary}
            size="large"
          />
        ) : tab === "calendar" ? (
          <View style={styles.calWrap}>
            <View style={styles.yearNavRow}>
              <TouchableOpacity onPress={prevYear}>
                <Text style={styles.yearNavText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.yearText}>{year}</Text>
              <TouchableOpacity onPress={nextYear}>
                <Text style={styles.yearNavText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Month pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthPillsContent}
              style={{ marginBottom: 10 }}
            >
              {MONTH_PILLS.map((m, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.monthPill,
                    i === month && styles.monthPillActive,
                  ]}
                  onPress={() => setMonth(i)}
                >
                  <Text
                    style={[
                      styles.monthPillText,
                      i === month && styles.monthPillTextActive,
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Summary badges */}
            <View style={styles.summaryBadges}>
              <View style={[styles.badgeCard, styles.badgeCardGreen]}>
                <Text style={[styles.badgeNum, styles.badgeNumGreen]}>
                  {totalPresent}
                </Text>
                <Text style={styles.badgeLabel}>Có mặt</Text>
              </View>
              <View style={[styles.badgeCard, styles.badgeCardAmber]}>
                <Text style={[styles.badgeNum, styles.badgeNumAmber]}>
                  {totalLate}
                </Text>
                <Text style={styles.badgeLabel}>Đi muộn</Text>
              </View>
              <View style={[styles.badgeCard, styles.badgeCardRed]}>
                <Text style={[styles.badgeNum, styles.badgeNumRed]}>
                  {absentDays}
                </Text>
                <Text style={styles.badgeLabel}>Vắng</Text>
              </View>
            </View>

            {/* DOW headers */}
            <View style={styles.dowRow}>
              {DOW_LABELS.map((d, i) => (
                <View key={d} style={styles.dowCell}>
                  <Text style={i === 6 ? styles.dowTextRed : styles.dowText}>
                    {d}
                  </Text>
                </View>
              ))}
            </View>

            {/* Month nav */}
            <View style={styles.monthNavRow}>
              <TouchableOpacity onPress={prevMonth}>
                <Text style={styles.monthNavBtn}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.monthLabel}>Tháng {month + 1}</Text>
              <TouchableOpacity onPress={nextMonth}>
                <Text style={styles.monthNavBtn}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Calendar grid */}
            {calWeeks.map((week, wi) => (
              <View key={wi} style={styles.weekRow}>
                {week.map((day, ci) => renderCell(day, ci, wi))}
              </View>
            ))}

            {/* Legend */}
            <View style={styles.legend}>
              {[
                { color: COLORS.success, label: "Đúng giờ" },
                { color: COLORS.warning, label: "Đi muộn" },
                { color: COLORS.danger, label: "Vắng mặt" },
              ].map((l, i) => (
                <View key={i} style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: l.color }]}
                  />
                  <Text style={styles.legendText}>{l.label}</Text>
                </View>
              ))}
            </View>

            {/* Summary bar */}
            <View style={styles.summaryBar}>
              <View
                style={[
                  styles.summaryChip,
                  { backgroundColor: COLORS.success },
                ]}
              >
                <Text style={styles.summaryChipText}>
                  Số công {totalPresent}/{workDaysTotal}
                </Text>
              </View>
              <View
                style={[
                  styles.summaryChip,
                  { backgroundColor: COLORS.warning },
                ]}
              >
                <Text style={styles.summaryChipText}>Đi muộn {totalLate}</Text>
              </View>
              <View
                style={[styles.summaryChip, { backgroundColor: COLORS.danger }]}
              >
                <Text style={styles.summaryChipText}>Nghỉ {absentDays}</Text>
              </View>
            </View>
          </View>
        ) : tab === "list" ? (
          <View style={styles.listSection}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 16 }}>🕐</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: COLORS.textDark,
                }}
              >
                Danh sách chấm công — Tháng {month + 1}/{year}
              </Text>
            </View>

            {sortedRecords.length === 0 ? (
              <View style={styles.empty}>
                <Text style={{ fontSize: 36 }}>📋</Text>
                <Text style={styles.emptyText}>Không có dữ liệu tháng này</Text>
              </View>
            ) : (
              <>
                {/* Tổng kết */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: 12,
                    backgroundColor: COLORS.bg,
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "800",
                        color: COLORS.success,
                      }}
                    >
                      {totalPresent}
                    </Text>
                    <Text style={{ fontSize: 10, color: COLORS.textLight }}>
                      Có mặt
                    </Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: COLORS.border }} />
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "800",
                        color: COLORS.warning,
                      }}
                    >
                      {totalLate}
                    </Text>
                    <Text style={{ fontSize: 10, color: COLORS.textLight }}>
                      Đi muộn
                    </Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: COLORS.border }} />
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "800",
                        color: COLORS.danger,
                      }}
                    >
                      {absentDays}
                    </Text>
                    <Text style={{ fontSize: 10, color: COLORS.textLight }}>
                      Vắng
                    </Text>
                  </View>
                </View>

                {/* Danh sách có phân trang */}
                {pagedRecords.map((r, i) => renderLogCard(r, i))}

                {/* Nút xem thêm */}
                {hasMore && (
                  <TouchableOpacity
                    style={{
                      padding: 12,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      borderRadius: 10,
                      marginTop: 8,
                      backgroundColor: COLORS.white,
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
                      Xem thêm ({sortedRecords.length - pagedRecords.length} bản
                      ghi)
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Hiển thị trang hiện tại */}
                <Text
                  style={{
                    textAlign: "center",
                    color: COLORS.textLight,
                    fontSize: 11,
                    marginTop: 8,
                  }}
                >
                  Hiển thị {pagedRecords.length}/{sortedRecords.length} bản ghi
                </Text>
              </>
            )}
          </View>
        ) : (
          <View style={styles.explainSection}>
            <Text style={styles.explainSectionTitle}>
              Các ngày cần giải trình — Tháng {month + 1}/{year}
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
