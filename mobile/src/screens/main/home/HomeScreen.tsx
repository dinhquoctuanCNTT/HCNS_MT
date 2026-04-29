import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  Image,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { attendanceApi } from "../../../api/attendanceApi";
import styles, { COLORS } from "./HomeScreen.style";

// ─── FaceID icon ──────────────────────────────────────────────────────────────
function FaceID({
  size = 20,
  color = "#fff",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Path
        d="M5 9V6a1.5 1.5 0 011.5-1.5H9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M21 9V6a1.5 1.5 0 00-1.5-1.5H17"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M5 17v3a1.5 1.5 0 001.5 1.5H9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M21 17v3a1.5 1.5 0 01-1.5 1.5H17"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Circle cx={9.5} cy={11} r={1.2} fill={color} />
      <Circle cx={16.5} cy={11} r={1.2} fill={color} />
      <Path
        d="M13 12v2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M9.5 17s1.2 1.8 3.5 1.8 3.5-1.8 3.5-1.8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ─── Quick actions (4 icons) ──────────────────────────────────────────────────
const QUICK = [
  {
    label: "Bảng công",
    screen: "Schedule",
    bg: "transparent",
    icon: (
      <Image
        source={require("../../../../assets/icon/timesheet.png")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
    ),
  },
  {
    label: "Lịch làm việc",
    screen: "Schedule",
    bg: "transparent",
    icon: (
      <Image
        source={require("../../../../assets/icon/schedule.png")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
    ),
  },
  {
    label: "Đơn từ",
    screen: "Leave",
    bg: "transparent",
    icon: (
      <Image
        source={require("../../../../assets/icon/document.png")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
    ),
  },
  {
    label: "Xem thêm",
    screen: "Profile",
    bg: "transparent",
    icon: (
      <Image
        source={require("../../../../assets/icon/options.png")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
    ),
  },
];

// ─── Services (8 items = 4×2 grid) ───────────────────────────────────────────
const SERVICES = [
  {
    label: "Chuyển & Nhận",
    screen: "Leave",
    badge: 0,
    bg: "transparent",
    icon: (
      <Image
        source={require("../../../../assets/icon/transaction.png")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
    ),
  },
  {
    label: "Phúc lợi",
    screen: "Leave",
    badge: 0,
    bg: "transparent",
    icon: (
      <Image
        source={require("../../../../assets/icon/welfare.png")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
    ),
  },
  {
    label: "Bảo hiểm",
    screen: "Leave",
    badge: 0,
    bg: "transparent",
    icon: (
      <Image
        source={require("../../../../assets/icon/insurance.png")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
    ),
  },
  {
    label: "Thanh toán",
    screen: "Leave",
    badge: 3,
    bg: "transparent",
    icon: (
      <Image
        source={require("../../../../assets/icon/payment.gif")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
    ),
  },
  {
    label: "Hỗ trợ IT",
    screen: "Leave",
    badge: 0,
    bg: "transparent",
    icon: (
      <Image
        source={require("../../../../assets/icon/tech_support.png")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
    ),
  },
  {
    label: "Mở thẻ",
    screen: "Leave",
    badge: 0,
    bg: "transparent",
    icon: (
      <Image
        source={require("../../../../assets/icon/payment.gif")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
    ),
  },
  {
    label: "Kỹ năng",
    screen: "Leave",
    badge: 0,
    bg: "transparent",
    icon: (
      <Image
        source={require("../../../../assets/icon/skills.png")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
    ),
  },
  {
    label: "Định tuyến",
    screen: "Leave",
    badge: 0,
    bg: "transparent",
    icon: (
      <Image
        source={require("../../../../assets/icon/navigation.png")}
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
      />
    ),
  },
];

// ─── Banners ──────────────────────────────────────────────────────────────────
const BANNERS = [
  {
    key: "1",
    tag: "VĂN HÓA",
    title: "10 Phương châm\nToda San",
    meta: "Hôm nay · 08:00",
    action: "Đọc ngay →",
    isNew: false,
    bg1: "#1e3a8a",
    bg2: "#2563eb",
  },
  {
    key: "2",
    tag: "SỰ KIỆN 2025",
    title: "Giải chạy\nToda San 2025",
    meta: "Đăng ký trước 30/04",
    action: "",
    isNew: true,
    bg1: "#064e3b",
    bg2: "#059669",
  },
  {
    key: "3",
    tag: "TÀI CHÍNH",
    title: "Bảng lương Q2\nđã cập nhật",
    meta: "25/04/2026",
    action: "Xem →",
    isNew: false,
    bg1: "#78350f",
    bg2: "#d97706",
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [todayRecord, setTodayRecord] = useState<any>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    attendanceApi
      .getHistory(today, today)
      .then((res) => {
        const d = Array.isArray(res.data) ? res.data : [];
        if (d.length) setTodayRecord(d[0]);
      })
      .catch(() => {});
  }, []);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const checkIn = todayRecord?.check_in ? fmt(todayRecord.check_in) : null;
  const checkOut = todayRecord?.check_out ? fmt(todayRecord.check_out) : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* ══ HEADER ══ */}
      <View style={styles.header}>
        {/* User row */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate("Profile")}
            >
              <Text style={styles.avatarText}>
                {(user?.fullName || "U")[0].toUpperCase()}
              </Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.userName}>
                {user?.fullName || "Nhân viên"}
              </Text>
              <Text style={styles.userRole}>Nhân viên kinh doanh</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
                  stroke="white"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
                <Path
                  d="M13.73 21a2 2 0 01-3.46 0"
                  stroke="white"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </Svg>
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle
                  cx={11}
                  cy={11}
                  r={7}
                  stroke="white"
                  strokeWidth={1.8}
                />
                <Path
                  d="M16.5 16.5l4 4"
                  stroke="white"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── SLIM ATTENDANCE BAR ── */}
        <View style={styles.attendBar}>
          {/* Left: check-in */}
          <View style={styles.attendSide}>
            <TouchableOpacity
              style={styles.attendFab}
              onPress={() => navigation.navigate("Attendance")}
            >
              <FaceID size={18} color="#fff" />
            </TouchableOpacity>
            <View style={{ gap: 1 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <View style={styles.attendStatusDot} />
                <Text style={styles.attendLabel}>Vào ca:</Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Text
                  style={checkIn ? styles.attendTime : styles.attendTimeDim}
                >
                  {checkIn ?? "--:--"}
                </Text>
                {checkIn && (
                  <View style={styles.attendBadge}>
                    <Text style={styles.attendBadgeText}>Đúng giờ</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Divider */}
          <View
            style={{
              width: 1,
              height: "60%",
              backgroundColor: COLORS.borderMid,
            }}
          />

          {/* Right: check-out */}
          <View style={[styles.attendSide, styles.attendSideRight]}>
            <View
              style={[styles.attendStatusDot, styles.attendStatusDotGray]}
            />
            <View style={{ gap: 1 }}>
              <Text style={styles.attendLabel}>Ra ca:</Text>
              <Text style={styles.attendTimeDim}>{checkOut ?? "--:--"}</Text>
            </View>
          </View>
        </View>

        {/* ── QUICK ACTIONS (4 icons) ── */}
        <View style={styles.quickCard}>
          <View style={styles.quickGrid}>
            {QUICK.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickItem}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.75}
              >
                <View
                  style={[styles.quickIconBox, { backgroundColor: item.bg }]}
                >
                  {item.icon}
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* ══ SCROLL BODY ══ */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* DỊCH VỤ — 4 columns × 2 rows */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>DỊCH VỤ</Text>
            <Text style={styles.cardLink}>Xem tất cả ›</Text>
          </View>
          <View style={styles.svcGrid}>
            {SERVICES.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.svcItem}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.75}
              >
                <View style={{ position: "relative" }}>
                  <View
                    style={[styles.svcIconBox, { backgroundColor: item.bg }]}
                  >
                    {item.icon}
                  </View>
                  {item.badge > 0 && (
                    <View style={styles.badgeWrap}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    </View>
                  )}
                </View>
                <Text style={styles.svcLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* BẢN TIN NỘI BỘ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>BẢN TIN NỘI BỘ</Text>
            <Text style={styles.cardLink}>Xem tất cả ›</Text>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={BANNERS}
            keyExtractor={(b) => b.key}
            contentContainerStyle={styles.bannerContent}
            style={styles.bannerScroll}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.bannerCard} activeOpacity={0.85}>
                <View style={[styles.bannerImg, { backgroundColor: item.bg1 }]}>
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: item.bg2,
                      opacity: 0.5,
                    }}
                  />
                  <View style={{ zIndex: 1 }}>
                    <Text style={styles.bannerTag}>{item.tag}</Text>
                    <Text style={styles.bannerTitle}>{item.title}</Text>
                  </View>
                </View>
                <View style={styles.bannerFooter}>
                  <Text style={styles.bannerMeta}>{item.meta}</Text>
                  {item.isNew ? (
                    <View style={styles.bannerNew}>
                      <Text style={styles.bannerNewText}>Mới</Text>
                    </View>
                  ) : (
                    <Text style={styles.bannerLink}>{item.action}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={styles.dotsRow}>
            <View style={styles.dotActive} />
            <View style={styles.dotInactive} />
            <View style={styles.dotInactive} />
          </View>
        </View>
      </ScrollView>
      {/* Bottom nav is in MainStack.tsx — do NOT add it here */}
    </View>
  );
}
