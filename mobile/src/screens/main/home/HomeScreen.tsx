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

// ─── Custom SVGs ─────────────────────────────────────────────────────────────
function CopyIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="#fff" />
    </Svg>
  );
}

function DownloadIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="#fff" />
    </Svg>
  );
}

function MapLocationButton() {
  return (
    <View style={{
      width: 86, height: 86, borderRadius: 43,
      backgroundColor: '#E8F1FC',
      borderWidth: 3, borderColor: '#fff',
      alignItems: 'center', justifyContent: 'center',
      shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
      elevation: 5,
    }}>
      <View style={{
        width: 76, height: 76, borderRadius: 38,
        backgroundColor: '#478ECC',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden'
      }}>
         <Svg width={80} height={80} style={{ position: 'absolute' }}>
            <Path d="M-10 50 L90 10 L90 90 L-10 90 Z" fill="#88C070" opacity={0.8} />
            <Path d="M-10 65 L90 25" stroke="#fff" strokeWidth={3.5} opacity={0.6} />
            <Path d="M35 -10 L45 90" stroke="#fff" strokeWidth={3.5} opacity={0.6} />
            <Path d="M15 -10 L25 90" stroke="#fff" strokeWidth={1.5} opacity={0.6} />
         </Svg>
         <Svg width={34} height={40} viewBox="0 0 24 30" fill="none" style={{ marginTop: -10 }}>
            <Path d="M12 2C6.48 2 2 6.48 2 12c0 7.5 10 16 10 16s10-8.5 10-16c0-5.52-4.48-10-10-10zm0 13.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="#1E3A8A" stroke="#fff" strokeWidth={2}/>
         </Svg>
      </View>
      <View style={{
        position: 'absolute', bottom: -2, right: -2,
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
        elevation: 4
      }}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path d="M21 19V7c0-1.1-.9-2-2-2h-3.17L14 3h-4L8.17 5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2z" fill="#4A8CC7" />
          <Circle cx={12} cy={12} r={3.5} fill="#fff" />
        </Svg>
      </View>
    </View>
  );
}

function CalendarIconSVG({ day, color }: { day: string, color: string }) {
  return (
    <View style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', overflow: 'hidden', alignItems: 'center' }}>
      <View style={{ width: '100%', height: 9, backgroundColor: color }} />
      <Text style={{ fontSize: 13, fontWeight: '800', color: '#1E293B', marginTop: 2 }}>{day}</Text>
    </View>
  );
}

function FolderIconSVG() {
  return (
    <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
      <Path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="#0EA5E9" />
      <Path d="M4 6h5.17l2 2H20v10H4V6z" fill="#38BDF8" />
    </Svg>
  );
}

function ListIconSVG() {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
      <Circle cx={5} cy={7} r={1.8} fill="#C084FC" />
      <Circle cx={5} cy={12} r={1.8} fill="#C084FC" />
      <Circle cx={5} cy={17} r={1.8} fill="#C084FC" />
      <Path d="M9 7h11M9 12h11M9 17h11" stroke="#38BDF8" strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
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
    iconId: "stats",
  },
  {
    label: "Lịch làm\nviệc",
    screen: "Schedule",
    resetTab: true,
    iconId: "schedule",
  },
  {
    label: "Đơn từ",
    screen: "Leave",
    iconId: "leave",
  },
  {
    label: "Xem thêm",
    screen: "Profile",
    iconId: "more",
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
          {/* Top Right Floating Icons */}
          <View style={styles.floatingActions}>
            <TouchableOpacity style={styles.floatingBtn}>
               <CopyIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingBtn}>
               <DownloadIcon />
            </TouchableOpacity>
          </View>

          {/* Vào ca | Map | Ra ca */}
          <View style={styles.attendRow}>
            {/* Left — Vào ca */}
            <View style={styles.attendCol}>
              <View style={styles.labelRow}>
                <View style={[styles.statusDot, { backgroundColor: checkInFmt ? '#22C55E' : 'rgba(0,0,0,0.15)' }]} />
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

            {/* Center — Map */}
            <View style={styles.ringWrap}>
              <TouchableOpacity activeOpacity={0.8} style={{ alignItems: 'center', gap: 6 }}>
                 <MapLocationButton />
                 <Text style={styles.mapBtnText}>Vị trí Chấm công</Text>
              </TouchableOpacity>
            </View>

            {/* Right — Ra ca */}
            <View style={[styles.attendCol, styles.attendColRight]}>
              <View style={[styles.labelRow, { justifyContent: "flex-end" }]}>
                <Text style={styles.attendLbl}>Ra ca:</Text>
                <View style={[styles.statusDot, { backgroundColor: checkOutFmt ? '#22C55E' : '#fff' }]} />
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
                  {item.iconId === "stats" && <CalendarIconSVG day={todayDate.toString()} color="#4ADE80" />}
                  {item.iconId === "schedule" && <CalendarIconSVG day="18" color="#3B82F6" />}
                  {item.iconId === "leave" && <FolderIconSVG />}
                  {item.iconId === "more" && <ListIconSVG />}
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
