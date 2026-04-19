import React from "react";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

export default function AppNavigator() {
  const token = useSelector((state: RootState) => state.auth.token);
  return (
    <NavigationContainer>
      {token ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
