import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Provider, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "./src/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { restoreSession } from "./src/store/slices/authSlice";

import { setStore } from "./src/api/axiosClient";

function AppContent() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userStr = await AsyncStorage.getItem("user");
        if (token && userStr) {
          dispatch(
            restoreSession({
              token,
              user: JSON.parse(userStr),
            }),
          );
        }
      } catch (e) {
        console.log("Restore session error:", e);
      } finally {
        setLoading(false);
      }
    };
    restoreToken();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0f0f1a",
        }}
      >
        <ActivityIndicator size="large" color="#534ab7" />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
