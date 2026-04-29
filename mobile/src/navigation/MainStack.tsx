import React from "react";
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
import { RootState } from "../store";

import HomeScreen from "../screens/main/home/HomeScreen";
import AttendanceScreen from "../screens/main/attendance/AttendanceScreen";
import HistoryStack from "../screens/main/history/HistoryStack"; // ✅ HistoryStack
import LeaveScreen from "../screens/main/leave/LeaveScreen";
import ProfileScreen from "../screens/main/profile/ProfileScreen";
import RegisterFaceScreen from "../screens/auth/RegisterScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const NAVY = "#1e3a8a";
const BLUE = "#1d4ed8";
const GRAY = "#94a3b8";
const WHITE = "#ffffff";
const BORDER = "#e8ecf2";
const BG = "#f0f2f7";
const BAR_H = Platform.OS === "ios" ? 78 : 64;
const PB = Platform.OS === "ios" ? 22 : 10;

// ─── Face-ID icon ─────────────────────────────────────────────────────────────
function FaceIDIcon({
  color = WHITE,
  size = 25,
}: {
  color?: string;
  size?: number;
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
      <Circle cx={9.5} cy={11} r={1.3} fill={color} />
      <Circle cx={16.5} cy={11} r={1.3} fill={color} />
      <Line
        x1={13}
        y1={12}
        x2={13}
        y2={14.5}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M9.5 17.5s1.2 2 3.5 2 3.5-2 3.5-2"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ─── Nav icons ────────────────────────────────────────────────────────────────
function NavHome({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
        fill={active ? NAVY : "none"}
        stroke={c}
        strokeWidth={1.7}
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

function NavCalendar({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
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
      <Path
        d="M7 14h4M7 17h6"
        stroke={c}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function NavBell({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <View style={{ position: "relative" }}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
          stroke={c}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
        <Path
          d="M13.73 21a2 2 0 01-3.46 0"
          stroke={c}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
      </Svg>
      <View style={s.notifDot} />
    </View>
  );
}

function NavMore({ active }: { active: boolean }) {
  const c = active ? NAVY : GRAY;
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={5} cy={12} r={1.5} fill={c} />
      <Circle cx={12} cy={12} r={1.5} fill={c} />
      <Circle cx={19} cy={12} r={1.5} fill={c} />
    </Svg>
  );
}

// ─── Tab meta ─────────────────────────────────────────────────────────────────
const TAB_META: Record<
  string,
  { label: string; Icon: (p: { active: boolean }) => JSX.Element }
> = {
  Home: { label: "Trang chủ", Icon: NavHome },
  Schedule: { label: "Lịch sử", Icon: NavCalendar },
  Attendance: { label: "", Icon: () => <></> }, // FAB slot
  Leave: { label: "Thông báo", Icon: NavBell },
  Profile: { label: "Xem thêm", Icon: NavMore },
};

// ─── Custom tab bar ───────────────────────────────────────────────────────────
function CustomTabBar({ state, navigation }: any) {
  return (
    <View style={s.bar}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const isCenter = route.name === "Attendance";
        const onPress = () => {
          if (!focused) navigation.navigate(route.name);
        };
        const meta = TAB_META[route.name];

        if (isCenter) {
          return (
            <TouchableOpacity
              key={route.key}
              style={s.fabSlot}
              onPress={onPress}
              activeOpacity={0.85}
            >
              <View style={s.fab}>
                <FaceIDIcon size={25} color={WHITE} />
              </View>
            </TouchableOpacity>
          );
        }

        if (!meta) return <View key={route.key} style={s.tab} />;
        const { label, Icon } = meta;

        return (
          <TouchableOpacity
            key={route.key}
            style={s.tab}
            onPress={onPress}
            activeOpacity={0.75}
          >
            <Icon active={focused} />
            <Text style={[s.label, focused && s.labelActive]}>{label}</Text>
            {focused ? (
              <View style={s.underline} />
            ) : (
              <View style={s.underlineGap} />
            )}
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
      <Tab.Screen name="Schedule" component={HistoryStack} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Leave" component={LeaveScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── Root Stack ───────────────────────────────────────────────────────────────
export default function MainStack() {
  const user = useSelector((state: RootState) => state.auth.user);
  const initialRoute =
    user?.has_registered_face === false ? "RegisterFace" : "Tabs";

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="RegisterFace"
        component={RegisterFaceScreen}
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
    borderTopWidth: 1.5,
    borderTopColor: BORDER,
    alignItems: "flex-end",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: PB,
    gap: 2,
  },
  label: { fontSize: 9, color: GRAY, fontWeight: "600" },
  labelActive: { fontSize: 9, color: NAVY, fontWeight: "800" },
  underline: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: NAVY,
    marginTop: 1,
  },
  underlineGap: { width: 4, height: 3, marginTop: 1 },

  fabSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: PB - 8,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: NAVY,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 4,
    borderColor: BG,
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

  notifDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#ef4444",
    borderWidth: 1.5,
    borderColor: WHITE,
  },
});
