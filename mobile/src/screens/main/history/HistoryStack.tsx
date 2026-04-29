import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HistoryStackParamList } from "./types";
import HistoryMainScreen from "./HistorymainScreen";
import DayDetailScreen from "./DayDetailScreen";
import UpdateRequestForm from "./UpdateRequestForm";

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export default function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryMain" component={HistoryMainScreen} />
      <Stack.Screen
        name="DayDetail"
        component={DayDetailScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="UpdateRequest"
        component={UpdateRequestForm}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}
