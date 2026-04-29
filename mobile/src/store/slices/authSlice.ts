import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  fullName: string;
  phone: string;
  role: string;
  has_registered_face?: boolean; // ← thêm mới
};

type AuthState = {
  token: string | null;
  user: User | null;
};

type SetCredentialsPayload = {
  token: string;
  user: User;
};

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      AsyncStorage.setItem("token", action.payload.token);
      AsyncStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
    },
    restoreSession: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
});

export const { setCredentials, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
export type { AuthState, User };
