import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HistoryStackParamList } from "./types";
import HistoryMainScreen from "./HistorymainScreen";
import StatsScreen from "./Statsscreen/Statsscreen";
import DayDetailScreen from "./DayDetailScreen";
import UpdateRequestForm from "./UpdateRequestForm";
import ExplanationHistoryScreen from "./ExplanationHistoryScreen";

const Stack = createNativeStackNavigator<HistoryStackParamList>();

// Tab Schedule: HistoryMain là màn đầu (Bảng công),
// Stats (Thống kê) là màn push tiếp theo trong cùng stack.
// unmountOnBlur trên Tab sẽ reset về HistoryMain mỗi lần chuyển tab.
export default function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryMain" component={HistoryMainScreen} />
      <Stack.Screen name="Stats" component={StatsScreen} />
      <Stack.Screen name="DayDetail" component={DayDetailScreen} />
      <Stack.Screen name="UpdateRequest" component={UpdateRequestForm} />
      <Stack.Screen name="ExplanationHistory" component={ExplanationHistoryScreen} />
    </Stack.Navigator>
  );
}
