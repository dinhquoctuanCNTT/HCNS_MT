import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../features/auth/auth.store";

type Props = {
  allowRoles: string[];
};
const RoleRoute = ({ allowRoles }: Props) => {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowRoles.includes(user.role)) {
    return <Navigate to="/unouthorized" replace />;
  }
  return <Outlet />;
};
export default RoleRoute;
