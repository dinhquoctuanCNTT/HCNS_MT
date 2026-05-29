import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { RootState } from "../store";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";

export default function AppNavigator() {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  // Chưa đăng nhập → AuthStack
  if (!token)
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );


  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
