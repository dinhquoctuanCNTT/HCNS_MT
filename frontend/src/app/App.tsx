import { AuthProvider } from "../features/auth/authContext";
import AppRouter from "../router/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
