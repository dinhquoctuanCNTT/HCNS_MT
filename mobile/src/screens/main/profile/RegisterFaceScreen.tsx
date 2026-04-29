import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Svg, { Path, Rect, Circle, Line } from "react-native-svg";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../../../store";

import HomeScreen from "../home/HomeScreen";
import AttendanceScreen from "../attendance/AttendanceScreen";
import HistoryScreen from "../history/HistoryScreen";
import LeaveScreen from "../leave/LeaveScreen";
import ScheduleScreen from "../schedule/ScheduleScreen";
import ProfileScreen from "./ProfileScreen";
import RegisterFaceScreen from "../../auth/RegisterScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const NAVY = "#0B1D3A";
const BLUE = "#1D4ED8";
const GRAY = "#94A3B8";
const WHITE = "#FFFFFF";
const BORDER = "#DDE3EE";
const PAGE_BG = "#F4F6FA";
const BAR_H = Platform.OS === "ios" ? 80 : 66;
const PB = Platform.OS === "ios" ? 24 : 10;

// ─── Tab icons ────────────────────────────────────────────────────────────────
function IconHome({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
        fill={active ? NAVY : "none"}
        stroke={c}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M9 21V13h6v8"
        stroke={active ? WHITE : c}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function IconCalendar({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3}
        y={4}
        width={18}
        height={17}
        rx={2}
        stroke={c}
        strokeWidth={1.7}
      />
      <Path
        d="M16 2v4M8 2v4M3 10h18"
        stroke={c}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}
function IconRequest({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke={c}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function IconProfile({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={c} strokeWidth={1.7} />
      <Path
        d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
        stroke={c}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ─── FAB Face-ID ─────────────────────────────────────────────────────────────
function FaceFAB() {
  return (
    <View style={s.fab}>
      <Svg width={27} height={27} viewBox="0 0 26 26" fill="none">
        <Path
          d="M5 9V6a1.5 1.5 0 011.5-1.5H9"
          stroke={WHITE}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
        <Path
          d="M21 9V6a1.5 1.5 0 00-1.5-1.5H17"
          stroke={WHITE}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
        <Path
          d="M5 17v3a1.5 1.5 0 001.5 1.5H9"
          stroke={WHITE}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
        <Path
          d="M21 17v3a1.5 1.5 0 01-1.5 1.5H17"
          stroke={WHITE}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
        <Circle cx={9.5} cy={11} r={1.25} fill={WHITE} />
        <Circle cx={16.5} cy={11} r={1.25} fill={WHITE} />
        <Line
          x1={13}
          y1={12}
          x2={13}
          y2={14.5}
          stroke={WHITE}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M9.5 17.5c0 0 1.2 2 3.5 2s3.5-2 3.5-2"
          stroke={WHITE}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

// ─── Custom tab bar ───────────────────────────────────────────────────────────
const LABELS: Record<string, string> = {
  Home: "Trang chủ",
  Schedule: "Lịch",
  Attendance: "",
  Leave: "Yêu cầu",
  Profile: "Cá nhân",
};

function CustomTabBar({ state, navigation }: any) {
  return (
    <View style={s.bar}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const isCenter = route.name === "Attendance";
        const onPress = () => {
          if (!focused) navigation.navigate(route.name);
        };

        if (isCenter) {
          return (
            <TouchableOpacity
              key={route.key}
              style={s.fabSlot}
              onPress={onPress}
              activeOpacity={0.85}
            >
              <FaceFAB />
            </TouchableOpacity>
          );
        }

        const icons: Record<string, JSX.Element> = {
          Home: <IconHome active={focused} />,
          Schedule: <IconCalendar active={focused} />,
          Leave: <IconRequest active={focused} />,
          Profile: <IconProfile active={focused} />,
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={s.tab}
            onPress={onPress}
            activeOpacity={0.75}
          >
            {icons[route.name]}
            <Text style={[s.label, focused && s.labelActive]}>
              {LABELS[route.name]}
            </Text>
            {focused ? <View style={s.dot} /> : <View style={s.dotGap} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Tab Navigator ────────────────────────────────────────────────────────────
function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Leave" component={LeaveScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── Root stack ───────────────────────────────────────────────────────────────
// Routing logic:
//   Đăng nhập xong → kiểm tra has_registered_face
//   → false: chuyển thẳng sang RegisterFace (bắt buộc)
//   → true:  vào Tabs bình thường
//
//   RegisterFace thành công → replace("Tabs")
//   Profile → navigate("RegisterFace") để cập nhật lại

export default function MainStack() {
  const user = useSelector((state: RootState) => state.auth.user);

  // Màn hình khởi đầu: nếu chưa đăng ký khuôn mặt → RegisterFace, ngược lại → Tabs
  const initialRoute =
    user?.has_registered_face === false ? "RegisterFace" : "Tabs";

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen
        name="RegisterFace"
        component={RegisterFaceScreen}
        // Không cho back khi chưa đăng ký khuôn mặt
        options={{ gestureEnabled: !!user?.has_registered_face }}
      />
    </Stack.Navigator>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  bar: {
    flexDirection: "row",
    height: BAR_H,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    alignItems: "flex-end",
  },
  tab: { flex: 1, alignItems: "center", paddingBottom: PB, gap: 3 },
  label: { fontSize: 9, color: GRAY, fontWeight: "500" },
  labelActive: { fontSize: 9, color: NAVY, fontWeight: "700" },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: BLUE },
  dotGap: { width: 4, height: 4 },
  fabSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: PB - 6,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: NAVY,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 3,
    borderColor: PAGE_BG,
    ...Platform.select({
      ios: {
        shadowColor: NAVY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: { elevation: 10 },
    }),
  },
});
