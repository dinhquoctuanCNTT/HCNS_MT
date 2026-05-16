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
      const raw = action.payload.user;
      const user: User = {
        ...raw,
        fullName: (raw as any).full_name ?? raw.fullName ?? "",
        has_registered_face: !!(raw as any).has_registered_face,
      };
      state.token = action.payload.token;
      state.user = user;
      AsyncStorage.setItem("token", action.payload.token);
      AsyncStorage.setItem("user", JSON.stringify(user));
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
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        AsyncStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, restoreSession, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
export type { AuthState, User };
