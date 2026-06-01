import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
} from "react-native";
import Svg, { Path, Circle, Rect, Line } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../store";

import HomeScreen       from "../screens/main/home/HomeScreen";
import AttendanceScreen from "../screens/main/attendance/AttendanceScreen";
import HistoryStack     from "../screens/main/history/HistoryStack";
import LeaveScreen      from "../screens/main/leave/LeaveScreen";
import ProfileScreen    from "../screens/main/profile/ProfileScreen";
import ThemScreen       from "../screens/main/them/ThemScreen";
import RegisterFaceScreen from "../screens/auth/RegisterScreen";

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const NAVY  = "#1e3a8a";
const GRAY  = "#94a3b8";
const WHITE = "#ffffff";
const BAR_H = Platform.OS === "ios" ? 82 : 68;
const PB    = Platform.OS === "ios" ? 20 : 8;

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconChat({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke={c} strokeWidth={1.7} strokeLinejoin="round" fill={active ? NAVY : "none"} />
    </Svg>
  );
}

function IconAVA({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={c} strokeWidth={1.7} fill={active ? NAVY : "none"} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function IconDanhBa({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={2} width={16} height={20} rx={2} stroke={c} strokeWidth={1.7} />
      <Path d="M8 7h8M8 12h8M8 17h5" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function IconBaoCao({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={3} width={18} height={18} rx={2} stroke={c} strokeWidth={1.7} />
      <Path d="M7 16V12M12 16V8M17 16v-4" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function IconBanTin({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={5} width={18} height={14} rx={2} stroke={c} strokeWidth={1.7} />
      <Path d="M7 9h10M7 13h6" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function IconThem({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  const r = 2;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={3}  y={3}  width={7} height={7} rx={r} fill={c} />
      <Rect x={14} y={3}  width={7} height={7} rx={r} fill={c} />
      <Rect x={3}  y={14} width={7} height={7} rx={r} fill={c} />
      <Rect x={14} y={14} width={7} height={7} rx={r} fill={c} />
    </Svg>
  );
}

function IconChamCong() {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      <Path d="M5 9V6a1.5 1.5 0 011.5-1.5H9" stroke={WHITE} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M21 9V6a1.5 1.5 0 00-1.5-1.5H17" stroke={WHITE} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M5 17v3a1.5 1.5 0 001.5 1.5H9" stroke={WHITE} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M21 17v3a1.5 1.5 0 01-1.5 1.5H17" stroke={WHITE} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx={9.5} cy={11} r={1.3} fill={WHITE} />
      <Circle cx={16.5} cy={11} r={1.3} fill={WHITE} />
      <Line x1={13} y1={12} x2={13} y2={14.5} stroke={WHITE} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M9.5 17.5s1.2 2 3.5 2 3.5-2 3.5-2" stroke={WHITE} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

// ── Tab metadata ──────────────────────────────────────────────────────────────
const TABS = [
  { name: "Chat",    label: "Chat",    Icon: IconChat    },
  { name: "Home",    label: "AVA",     Icon: IconAVA     },
  { name: "DanhBa",  label: "Danh bạ", Icon: IconDanhBa  },
  { name: "BaoCao",  label: "Báo cáo", Icon: IconBaoCao  },
  { name: "BanTin",  label: "Bảng tin",Icon: IconBanTin  },
  { name: "Profile", label: "Thêm",    Icon: IconThem    },
];

// ── Custom Tab Bar ─────────────────────────────────────────────────────────────
function CustomTabBar({ state, navigation }: any) {
  const tabCount = TABS.length; // 6
  const midIndex = Math.floor(tabCount / 2); // 3 — FAB ở giữa tabs 3 và 4

  return (
    <View style={s.barWrap}>
      {/* FAB Chấm công — nổi lên trên */}
      <TouchableOpacity
        style={s.fabWrap}
        onPress={() => navigation.navigate("Attendance")}
        activeOpacity={0.85}
      >
        <View style={s.fab}>
          <IconChamCong />
        </View>
        <Text style={s.fabLabel}>Chấm công</Text>
      </TouchableOpacity>

      {/* Tab bar */}
      <View style={s.bar}>
        {TABS.map((tab, index) => {
          const route = state.routes.find((r: any) => r.name === tab.name);
          const focused = route ? state.index === state.routes.indexOf(route) : false;
          const { Icon, label } = tab;

          // Khoảng trống ở giữa cho FAB
          if (index === midIndex) {
            return (
              <View key="fab-slot" style={s.fabSlot} />
            );
          }

          return (
            <TouchableOpacity
              key={tab.name}
              style={s.tab}
              onPress={() => route && navigation.navigate(tab.name)}
              activeOpacity={0.75}
            >
              <Icon active={focused} />
              <Text style={[s.label, focused && s.labelActive]}>{label}</Text>
              {focused && <View style={s.underline} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Placeholder screens ────────────────────────────────────────────────────────
function ComingSoonScreen({ route }: any) {
  const labels: Record<string, string> = {
    Chat: "Chat nội bộ",
    DanhBa: "Danh bạ",
    BaoCao: "Báo cáo",
    Home:   "AVA",
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" }}>
      <Ionicons name="construct-outline" size={56} color="#94a3b8" style={{ marginBottom: 16 }} />
      <Text style={{ fontSize: 18, fontWeight: "800", color: "#1e293b" }}>
        {labels[route.name] ?? route.name}
      </Text>
      <Text style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>Đang phát triển</Text>
    </View>
  );
}

// ── Tab Navigator ─────────────────────────────────────────────────────────────
function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Chat"    component={ComingSoonScreen} />
      <Tab.Screen name="Home"    component={ComingSoonScreen} />
      <Tab.Screen name="DanhBa"  component={ComingSoonScreen} />
      <Tab.Screen name="BaoCao"  component={HistoryStack} />
      <Tab.Screen name="BanTin"  component={LeaveScreen} />
      <Tab.Screen name="Profile" component={ThemScreen} />
    </Tab.Navigator>
  );
}

// ── Main Stack ────────────────────────────────────────────────────────────────
export default function MainStack() {
  const user = useSelector((state: RootState) => state.auth.user);
  const initialRoute = user?.has_registered_face === false ? "RegisterFace" : "Tabs";

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Tabs"           component={TabNavigator} />
      <Stack.Screen name="Attendance"    component={AttendanceScreen} />
      <Stack.Screen name="Schedule"      component={HistoryStack} options={{ headerShown: false }} />
      <Stack.Screen name="BaoCao"        component={HistoryStack} options={{ headerShown: false }} />
      <Stack.Screen name="Leave"         component={LeaveScreen}  options={{ headerShown: false }} />
      <Stack.Screen name="BanTin"        component={LeaveScreen}  options={{ headerShown: false }} />
      <Stack.Screen name="ProfileDetail" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="RegisterFace"
        component={RegisterFaceScreen}
        options={{ gestureEnabled: !!user?.has_registered_face }}
      />
    </Stack.Navigator>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  barWrap: {
    position: "relative",
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: "#e8ecf2",
  },
  bar: {
    flexDirection: "row",
    height: BAR_H,
    alignItems: "flex-end",
  },
  tab: {
    flex: 1, alignItems: "center",
    paddingBottom: PB, gap: 3,
  },
  fabSlot: { flex: 1 }, // khoảng trống giữa cho FAB
  label: { fontSize: 9, color: GRAY, fontWeight: "600" },
  labelActive: { color: NAVY, fontWeight: "800" },
  underline: {
    width: 16, height: 3, borderRadius: 2,
    backgroundColor: NAVY, marginTop: 1,
  },

  // FAB Chấm công
  fabWrap: {
    position: "absolute",
    top: -28,
    left: "50%",
    transform: [{ translateX: -28 }],
    alignItems: "center",
    zIndex: 10,
  },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: NAVY,
    alignItems: "center", justifyContent: "center",
    borderWidth: 4, borderColor: "#f0f2f7",
    ...Platform.select({
      ios: { shadowColor: NAVY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 },
      android: { elevation: 10 },
    }),
  },
  fabLabel: {
    fontSize: 8, color: NAVY, fontWeight: "800",
    marginTop: 2, textAlign: "center",
  },
});
