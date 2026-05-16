import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { useFocusEffect, CommonActions } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { attendanceApi } from "../../../api/attendanceApi";
import styles, { COLORS, BLUE } from "./HomeScreen.style";

// ─── SVG Progress Ring ──────────────────────────────────────────────────────
function TenureRing({ years }: { years: string | null }) {
  const R = 34;
  const SW = 5;
  const SZ = (R + SW) * 2 + 4;
  const C = SZ / 2;
  const circumference = 2 * Math.PI * R;
  const pct = years ? Math.min(parseFloat(years) / 5, 1) : 0;
  const arcLen = circumference * pct;
  const gap = circumference - arcLen;

  return (
    <View
      style={{
        width: SZ,
        height: SZ,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={SZ}
        height={SZ}
        style={{ position: "absolute", top: 0, left: 0 }}
        viewBox={`0 0 ${SZ} ${SZ}`}
      >
        <Circle
          cx={C}
          cy={C}
          r={R}
          stroke="#DBEAFE"
          strokeWidth={SW}
          fill="none"
        />
        {pct > 0 && (
          <Circle
            cx={C}
            cy={C}
            r={R}
            stroke={BLUE}
            strokeWidth={SW}
            fill="none"
            strokeDasharray={`${arcLen} ${gap}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${C} ${C})`}
          />
        )}
      </Svg>
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "900",
            color: BLUE,
            lineHeight: 19,
          }}
        >
          {years ?? "—"}
        </Text>
        <Text style={{ fontSize: 8, fontWeight: "700", color: "#64748B" }}>
          Years
        </Text>
      </View>
    </View>
  );
}

// ─── Header SVG Icons ───────────────────────────────────────────────────────
function BellIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="#fff"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21a2 2 0 01-3.46 0"
        stroke="#fff"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
function SearchIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke="#fff" strokeWidth={1.8} />
      <Path
        d="M16.5 16.5l4 4"
        stroke="#fff"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
function GearIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={3} stroke="#fff" strokeWidth={1.8} />
      <Path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="#fff"
        strokeWidth={1.6}
      />
    </Svg>
  );
}
function FaceIDIcon({
  size = 12,
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

// ─── Data ────────────────────────────────────────────────────────────────────
const QUICK = [
  {
    label: "Thống kê\ncá nhân",
    screen: "Schedule",
    nestedScreen: "Stats",
    icon: require("../../../../assets/icon/timesheet.png"),
    cal: false,
  },
  {
    label: "Lịch làm\nviệc",
    screen: "Schedule",
    resetTab: true,
    icon: require("../../../../assets/icon/schedule.png"),
    cal: true,
  },
  {
    label: "Đơn từ",
    screen: "Leave",
    icon: require("../../../../assets/icon/document.png"),
    cal: false,
  },
  {
    label: "Xem thêm",
    screen: "Profile",
    icon: require("../../../../assets/icon/options.png"),
    cal: false,
  },
];

const SERVICES = [
  {
    label: "Chuyển &\nNhận",
    screen: "Leave",
    badge: 0,
    icon: require("../../../../assets/icon/transaction.png"),
    bg: "#fee2e2",
  },
  {
    label: "Phúc lợi",
    screen: "Leave",
    badge: 0,
    icon: require("../../../../assets/icon/welfare.png"),
    bg: "#fce7f3",
  },
  {
    label: "Bảo hiểm",
    screen: "Leave",
    badge: 0,
    icon: require("../../../../assets/icon/insurance.png"),
    bg: "#e0e7ff",
  },
  {
    label: "Thanh toán",
    screen: "Leave",
    badge: 2,
    icon: require("../../../../assets/icon/payment.gif"),
    bg: "#dbeafe",
  },
  {
    label: "Hỗ trợ IT",
    screen: "Leave",
    badge: 1,
    icon: require("../../../../assets/icon/tech_support.png"),
    bg: "#ccfbf1",
  },
  {
    label: "Văn phòng\nđiện tử",
    screen: "Leave",
    badge: 0,
    icon: require("../../../../assets/icon/document.png"),
    bg: "#fef3c7",
  },
  {
    label: "Kỹ năng",
    screen: "Leave",
    badge: 0,
    icon: require("../../../../assets/icon/skills.png"),
    bg: "#dcfce7",
  },
  {
    label: "Tuyển dụng",
    screen: "Leave",
    badge: 0,
    icon: require("../../../../assets/icon/navigation.png"),
    bg: "#f3e8ff",
  },
];

const BANNERS = [
  {
    key: "1",
    tag: "VĂN HÓA",
    title: "10 Phương châm\nToda San",
    meta: "Hôm nay · 08:00",
    action: "Đọc ngay",
    isNew: false,
    bg1: "#1e3a8a",
    bg2: "#2563eb",
  },
  {
    key: "2",
    tag: "SỰ KIỆN",
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

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [todayRecord, setTodayRecord] = useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      const today = new Date().toISOString().slice(0, 10);
      attendanceApi
        .getHistory(today, today)
        .then((res) => {
          const d = Array.isArray(res.data) ? res.data : [];
          setTodayRecord(d.length ? d[0] : null);
        })
        .catch(() => {});
    }, []),
  );

  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    return { time: `${h % 12 || 12}:${m}`, ampm: h >= 12 ? "PM" : "AM" };
  };

  const todayDate = new Date().getDate();
  const checkInFmt = todayRecord?.check_in
    ? fmtTime(todayRecord.check_in)
    : null;
  const checkOutFmt = todayRecord?.check_out
    ? fmtTime(todayRecord.check_out)
    : null;
  const avatarUrl = (user as any)?.avatar_url;

  const tenureYears = (() => {
    const raw = (user as any)?.created_at;
    if (!raw) return null;
    const y =
      (Date.now() - new Date(raw).getTime()) / (365.25 * 24 * 3600 * 1000);
    return y >= 0.1 ? y.toFixed(1) : null;
  })();

  const lateMinutes = checkInFmt
    ? (() => {
        const d = new Date(todayRecord.check_in);
        const m = d.getHours() * 60 + d.getMinutes() - (8 * 60 + 5);
        return m > 0 ? m : 0;
      })()
    : 0;

  const earlyMinutes = checkOutFmt
    ? (() => {
        const d = new Date(todayRecord.check_out);
        const m = 17 * 60 + 30 - (d.getHours() * 60 + d.getMinutes());
        return m > 0 ? m : 0;
      })()
    : 0;

  const otMinutes = checkOutFmt
    ? (() => {
        const d = new Date(todayRecord.check_out);
        const m = d.getHours() * 60 + d.getMinutes() - (17 * 60 + 30);
        return m > 0 ? m : 0;
      })()
    : 0;

  const goTo = (item: any) => {
    if (item.nestedScreen) {
      navigation.dispatch((state: any) => {
        const idx = state.routes.findIndex((r: any) => r.name === item.screen);
        if (idx < 0) { navigation.navigate(item.screen); return CommonActions.navigate(item.screen); }
        const routes = state.routes.map((r: any, j: number) =>
          j === idx
            ? { ...r, state: { index: 0, routes: [{ name: item.nestedScreen }] } }
            : r,
        );
        return CommonActions.reset({ ...state, index: idx, routes });
      });
    } else if (item.resetTab) {
      navigation.dispatch((state: any) => {
        const idx = state.routes.findIndex((r: any) => r.name === item.screen);
        if (idx < 0) return CommonActions.navigate(item.screen);
        const routes = state.routes.map((r: any, j: number) =>
          j === idx ? { ...r, state: undefined } : r,
        );
        return CommonActions.reset({ ...state, index: idx, routes });
      });
    } else {
      navigation.navigate(item.screen, item.params);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A4FA0" />

      {/* ══════ HEADER ══════ */}
      <ImageBackground
        source={require("../../../../assets/hinh-nen-mau-xanh-duong-30-576x1024.jpg")}
        style={styles.headerArea}
        imageStyle={styles.headerBgImg}
      >
        {/* Dark overlay for legibility */}
        <View style={styles.headerOverlay} pointerEvents="none" />

        {/* User row */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate("Profile")}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarInitial}>
                  {(user?.fullName || "U")[0].toUpperCase()}
                </Text>
              )}
            </TouchableOpacity>
            <View>
              <Text style={styles.userName}>
                {user?.fullName || "Nhân viên"}
              </Text>
              <Text style={styles.userRole}>
                {(user as any)?.job_title || "Nhân viên kinh doanh"}
              </Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <BellIcon />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <SearchIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate("Profile")}
            >
              <GearIcon />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Glass Card ── */}
        <View style={styles.glassCard}>
          {/* Tenure badge top-right */}
          {tenureYears && (
            <View style={styles.tenureBadge}>
              <Text style={styles.tenureBadgeVal}>{tenureYears}</Text>
              <Text style={styles.tenureBadgeLbl}>Years</Text>
              <Text style={styles.tenureBadgeLbl}>tenure</Text>
            </View>
          )}

          {/* Vào ca | Ring | Ra ca */}
          <View style={styles.attendRow}>
            {/* Left — Vào ca */}
            <View style={styles.attendCol}>
              <View style={styles.labelRow}>
                <View
                  style={[
                    styles.statusDot,
                    checkInFmt && styles.statusDotActive,
                  ]}
                />
                <Text style={styles.attendLbl}>Vào ca:</Text>
              </View>
              <View style={styles.timeRow}>
                <Text style={checkInFmt ? styles.timeVal : styles.timeValDim}>
                  {checkInFmt ? checkInFmt.time : "--:--"}
                </Text>
                <Text style={checkInFmt ? styles.ampmVal : styles.ampmDim}>
                  {checkInFmt ? checkInFmt.ampm : "AM"}
                </Text>
              </View>
              {lateMinutes > 0 && (
                <View style={styles.statusBadgeWarn}>
                  <Text style={styles.statusBadgeWarnTxt}>
                    Muộn {lateMinutes}p
                  </Text>
                </View>
              )}
              {checkInFmt && lateMinutes === 0 && (
                <View style={styles.statusBadgeOk}>
                  <Text style={styles.statusBadgeOkTxt}>Đúng giờ</Text>
                </View>
              )}
            </View>

            {/* Center — ring */}
            <View style={styles.ringWrap}>
              <TenureRing years={tenureYears} />
            </View>

            {/* Right — Ra ca */}
            <View style={[styles.attendCol, styles.attendColRight]}>
              <View style={[styles.labelRow, { justifyContent: "flex-end" }]}>
                <Text style={styles.attendLbl}>Ra ca:</Text>
                <View
                  style={[
                    styles.statusDot,
                    checkOutFmt && styles.statusDotActive,
                  ]}
                />
              </View>
              <View style={[styles.timeRow, { justifyContent: "flex-end" }]}>
                <Text style={checkOutFmt ? styles.ampmVal : styles.ampmDim}>
                  {checkOutFmt ? checkOutFmt.ampm : "PM"}
                </Text>
                <Text style={checkOutFmt ? styles.timeVal : styles.timeValDim}>
                  {checkOutFmt ? checkOutFmt.time : "--:--"}
                </Text>
              </View>
              {earlyMinutes > 0 && (
                <View
                  style={[styles.statusBadgeWarn, { alignSelf: "flex-end" }]}
                >
                  <Text style={styles.statusBadgeWarnTxt}>
                    Sớm {earlyMinutes}p
                  </Text>
                </View>
              )}
              {otMinutes > 0 && (
                <View style={[styles.statusBadgeOk, { alignSelf: "flex-end" }]}>
                  <Text style={styles.statusBadgeOkTxt}>OT {otMinutes}p</Text>
                </View>
              )}
              {checkOutFmt && earlyMinutes === 0 && otMinutes === 0 && (
                <View style={[styles.statusBadgeOk, { alignSelf: "flex-end" }]}>
                  <Text style={styles.statusBadgeOkTxt}>Đúng giờ</Text>
                </View>
              )}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Quick actions */}
          <View style={styles.quickRow}>
            {QUICK.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickItem}
                activeOpacity={0.75}
                onPress={() => goTo(item)}
              >
                <View style={styles.quickIconBox}>
                  {item.cal ? (
                    <View style={styles.calIcon}>
                      <View style={styles.calHeader} />
                      <Text style={styles.calDate}>{todayDate}</Text>
                    </View>
                  ) : (
                    <Image
                      source={item.icon}
                      style={styles.quickIconImg}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>

      {/* ══════ SCROLL BODY ══════ */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* DỊCH VỤ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>DỊCH VỤ</Text>
            <Text style={styles.cardLink}>Xem tất cả ›</Text>
          </View>
          <View style={styles.svcGrid}>
            {SERVICES.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.svcItem, { backgroundColor: item.bg + "30" }]}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.75}
              >
                <View style={{ position: "relative" }}>
                  <View
                    style={[styles.svcIconBox, { backgroundColor: item.bg }]}
                  >
                    <Image
                      source={item.icon}
                      style={{ width: 28, height: 28 }}
                      resizeMode="contain"
                    />
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
            {BANNERS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dotPip,
                  i === 0
                    ? { width: 20, backgroundColor: BLUE }
                    : { width: 6, backgroundColor: "#D1D5DB" },
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
