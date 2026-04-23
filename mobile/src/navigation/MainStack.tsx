import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/main/home/HomeScreen";
import AttendanceScreen from "../screens/main/attendance/AttendanceScreen";
import HistoryScreen from "../screens/main/history/HistoryScreen";
import LeaveScreen from "../screens/main/leave/LeaveScreen";
import ScheduleScreen from "../screens/main/schedule/ScheduleScreen";
import ProfileScreen from "../screens/main/profile/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const PRIMARY = "#3B82F6";
const INACTIVE = "#8A9BB5";
const BG = "#FFFFFF";
const BORDER = "#DDE5F0";
const DANGER = "#DC2626";

function TabIcon({
  name,
  active,
  badge,
}: {
  name: string;
  active: boolean;
  badge?: boolean;
}) {
  const c = active ? PRIMARY : INACTIVE;
  const icons: Record<string, JSX.Element> = {
    Home: (
      <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <Rect
          x={2}
          y={2}
          width={6}
          height={6}
          rx={1.5}
          stroke={c}
          strokeWidth={1.5}
        />
        <Rect
          x={12}
          y={2}
          width={6}
          height={6}
          rx={1.5}
          stroke={c}
          strokeWidth={1.5}
        />
        <Rect
          x={2}
          y={12}
          width={6}
          height={6}
          rx={1.5}
          stroke={c}
          strokeWidth={1.5}
        />
        <Rect
          x={12}
          y={12}
          width={6}
          height={6}
          rx={1.5}
          stroke={c}
          strokeWidth={1.5}
        />
      </Svg>
    ),
    Leave: (
      <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <Path
          d="M4 3h12v16H4z"
          stroke={c}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <Path
          d="M7 8h6M7 11h6M7 14h4"
          stroke={c}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </Svg>
    ),
    Schedule: (
      <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <Rect
          x={2}
          y={3}
          width={16}
          height={14}
          rx={1.5}
          stroke={c}
          strokeWidth={1.5}
        />
        <Path
          d="M6 3V1M14 3V1M2 8h16"
          stroke={c}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </Svg>
    ),
    Profile: (
      <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
        <Circle cx={10} cy={7} r={3.5} stroke={c} strokeWidth={1.5} />
        <Path
          d="M3 18c0-3.5 3.1-6 7-6s7 2.5 7 6"
          stroke={c}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </Svg>
    ),
  };
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ position: "relative" }}>
        {icons[name]}
        {badge && <View style={s.badge} />}
      </View>
    </View>
  );
}

function CenterIcon() {
  return (
    <View style={s.centerBtn}>
      <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
        <Rect
          x={3}
          y={3}
          width={16}
          height={16}
          rx={3}
          stroke="white"
          strokeWidth={1.8}
        />
        <Circle cx={11} cy={10} r={3} stroke="white" strokeWidth={1.8} />
        <Path
          d="M5 19c0-3 2.7-5 6-5s6 2 6 5"
          stroke="white"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

function CustomTabBar({ state, navigation }: any) {
  const labels: Record<string, string> = {
    Home: "Tổng quan",
    Leave: "Đơn từ",
    Attendance: "Chấm công",
    Schedule: "Bảng công",
    Profile: "Cá nhân",
  };

  return (
    <View style={s.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const isCenter = route.name === "Attendance";
        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={[s.tabItem, isCenter && s.tabItemCenter]}
            onPress={onPress}
            activeOpacity={0.75}
          >
            {isCenter ? (
              <>
                <CenterIcon />
                <Text style={[s.tabLabel, { marginTop: 4 }]}>Chấm công</Text>
              </>
            ) : (
              <>
                <TabIcon
                  name={route.name}
                  active={isFocused}
                  badge={route.name === "Leave"}
                />
                <Text style={[s.tabLabel, isFocused && s.tabLabelActive]}>
                  {labels[route.name]}
                </Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Leave" component={LeaveScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
}

const s = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 64,
    backgroundColor: BG,
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    alignItems: "center",
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 6,
    gap: 3,
  },
  tabItemCenter: { justifyContent: "flex-end", marginBottom: 2 },
  tabLabel: { fontSize: 9, color: INACTIVE, fontWeight: "500" },
  tabLabelActive: { color: PRIMARY },
  centerBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: BG,
    marginBottom: -8,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DANGER,
    borderWidth: 1.5,
    borderColor: BG,
  },
});
