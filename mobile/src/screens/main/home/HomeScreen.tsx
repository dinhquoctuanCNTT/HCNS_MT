import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { logout } from "../../../store/slices/authSlice";
import { attendanceApi } from "../../../api/attendanceApi";
import styles, { COLORS } from "./HomeScreen.style";

const STATS = [
  {
    label: "Ngày công",
    value: "22",
    color: COLORS.success,
    bg: COLORS.successLight,
    icon: (
      <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
        <Path
          d="M3 8l3 3 7-6"
          stroke="#16A34A"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
  {
    label: "Đi muộn",
    value: "2",
    color: COLORS.warning,
    bg: COLORS.warningLight,
    icon: (
      <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
        <Circle cx={8} cy={8} r={6} stroke="#D97706" strokeWidth={1.8} />
        <Path
          d="M8 5v3l2 2"
          stroke="#D97706"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    ),
  },
  {
    label: "Nghỉ phép",
    value: "1.5",
    color: COLORS.primary,
    bg: COLORS.primaryLight,
    icon: (
      <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
        <Rect
          x={3}
          y={4}
          width={10}
          height={10}
          rx={1}
          stroke="#3B82F6"
          strokeWidth={1.8}
        />
        <Path
          d="M6 4V2h4v2"
          stroke="#3B82F6"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    ),
  },
  {
    label: "Tăng ca",
    value: "4h",
    color: COLORS.purple,
    bg: COLORS.purpleLight,
    icon: (
      <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
        <Rect
          x={2}
          y={5}
          width={12}
          height={9}
          rx={1}
          stroke="#7C3AED"
          strokeWidth={1.8}
        />
        <Path
          d="M5 5V3a3 3 0 016 0v2"
          stroke="#7C3AED"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    ),
  },
];

const QUICK = [
  {
    name: "Lịch sử",
    sub: "Chấm công",
    screen: "History",
    bg: COLORS.primaryLight,
    icon: (
      <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
        <Rect
          x={1}
          y={3}
          width={16}
          height={13}
          rx={1.5}
          stroke="#3B82F6"
          strokeWidth={1.5}
        />
        <Path
          d="M5 3V1M13 3V1M1 8h16"
          stroke="#3B82F6"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </Svg>
    ),
  },
  {
    name: "Đơn từ",
    sub: "Xin nghỉ phép",
    screen: "Leave",
    bg: COLORS.warningLight,
    icon: (
      <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
        <Path
          d="M3 2h12v15H3z"
          stroke="#D97706"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <Path
          d="M6 7h6M6 10h6M6 13h3"
          stroke="#D97706"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </Svg>
    ),
  },
  {
    name: "Bảng công",
    sub: "Tháng này",
    screen: "Schedule",
    bg: COLORS.successLight,
    icon: (
      <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
        <Rect
          x={1}
          y={3}
          width={16}
          height={13}
          rx={1.5}
          stroke="#16A34A"
          strokeWidth={1.5}
        />
        <Path
          d="M5 3V1M13 3V1M1 8h16M5 12h2M9 12h2"
          stroke="#16A34A"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </Svg>
    ),
  },
  {
    name: "Cá nhân",
    sub: "Tài khoản",
    screen: "Profile",
    bg: COLORS.purpleLight,
    icon: (
      <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
        <Circle cx={9} cy={6} r={3.5} stroke="#7C3AED" strokeWidth={1.5} />
        <Path
          d="M2 16c0-3.5 3.1-6 7-6s7 2.5 7 6"
          stroke="#7C3AED"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </Svg>
    ),
  },
];

export default function HomeScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [time, setTime] = useState(new Date());
  const [todayRecord, setTodayRecord] = useState<any>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    attendanceApi
      .getHistory(today, today)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length > 0) setTodayRecord(data[0]);
      })
      .catch(() => {});
  }, []);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const timeStr = time.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = time.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Xin chào 👋</Text>
            <Text style={styles.userName}>{user?.fullName || "Nhân viên"}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.timeWrap}>
              <Text style={styles.timeBig}>{timeStr}</Text>
              <Text style={styles.timeDate}>{dateStr}</Text>
            </View>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => dispatch(logout())}
            >
              <Text style={styles.avatarText}>
                {(user?.fullName || "U")[0].toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today strip */}
        <View style={styles.todayStrip}>
          <View style={styles.todayBox}>
            <Text style={styles.todayLabel}>Giờ vào</Text>
            <Text style={styles.todayVal}>
              {todayRecord?.check_in ? fmt(todayRecord.check_in) : "--:--"}
            </Text>
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>
                {todayRecord?.check_in ? "Đúng giờ" : "Chưa vào"}
              </Text>
            </View>
          </View>
          <View style={styles.todayBox}>
            <Text style={styles.todayLabel}>Giờ ra</Text>
            <Text
              style={[
                styles.todayVal,
                !todayRecord?.check_out && { opacity: 0.5 },
              ]}
            >
              {todayRecord?.check_out ? fmt(todayRecord.check_out) : "--:--"}
            </Text>
            <View
              style={[
                styles.todayBadge,
                !todayRecord?.check_out && {
                  backgroundColor: "rgba(251,191,36,0.25)",
                },
              ]}
            >
              <Text style={styles.todayBadgeText}>
                {todayRecord?.check_out ? "Đã ra" : "Chưa ra"}
              </Text>
            </View>
          </View>
          <View style={styles.todayBox}>
            <Text style={styles.todayLabel}>Hôm nay</Text>
            <Text
              style={[
                styles.todayVal,
                { color: todayRecord ? "#86EFAC" : "rgba(255,255,255,0.5)" },
              ]}
            >
              {todayRecord ? "Có mặt" : "Vắng"}
            </Text>
            <View
              style={[
                styles.todayBadge,
                {
                  backgroundColor: todayRecord
                    ? "rgba(134,239,172,0.2)"
                    : "rgba(252,165,165,0.2)",
                },
              ]}
            >
              <Text style={styles.todayBadgeText}>
                {todayRecord ? "✓" : "✗"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Checkin */}
        <TouchableOpacity
          style={styles.checkinCard}
          onPress={() => navigation.navigate("Attendance")}
          activeOpacity={0.85}
        >
          <View style={styles.checkinLeft}>
            <View style={styles.checkinIcon}>
              <Svg width={20} height={20} viewBox="0 0 22 22" fill="none">
                <Rect
                  x={2}
                  y={2}
                  width={18}
                  height={18}
                  rx={4}
                  stroke="#3B82F6"
                  strokeWidth={1.6}
                />
                <Circle
                  cx={11}
                  cy={10}
                  r={3.5}
                  stroke="#3B82F6"
                  strokeWidth={1.6}
                />
                <Path
                  d="M4 20c0-3.5 3.1-5.5 7-5.5s7 2 7 5.5"
                  stroke="#3B82F6"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
            <View>
              <Text style={styles.checkinTitle}>Chấm công ngay</Text>
              <Text style={styles.checkinSub}>
                Nhận diện khuôn mặt · GPS xác minh
              </Text>
            </View>
          </View>
          <View style={styles.checkinArrow}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              ›
            </Text>
          </View>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Tổng hợp tháng này</Text>
          <TouchableOpacity onPress={() => navigation.navigate("History")}>
            <Text style={styles.sectionLink}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          {STATS.slice(0, 2).map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                {s.icon}
              </View>
              <View>
                <Text style={[styles.statVal, { color: s.color }]}>
                  {s.value}
                </Text>
                <Text style={styles.statLbl}>{s.label}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.statsRow}>
          {STATS.slice(2).map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                {s.icon}
              </View>
              <View>
                <Text style={[styles.statVal, { color: s.color }]}>
                  {s.value}
                </Text>
                <Text style={styles.statLbl}>{s.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick */}
        <Text style={styles.sectionTitle}>Tiện ích</Text>
        <View style={styles.quickGrid}>
          {QUICK.map((q, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickCard}
              onPress={() => navigation.navigate(q.screen)}
              activeOpacity={0.8}
            >
              <View style={[styles.quickIcon, { backgroundColor: q.bg }]}>
                {q.icon}
              </View>
              <View>
                <Text style={styles.quickName}>{q.name}</Text>
                <Text style={styles.quickSub}>{q.sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
