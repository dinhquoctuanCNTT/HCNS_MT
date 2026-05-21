import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/auth.store";
import useLogout from "../../features/auth/logout/useLogout";
import "./main-layout.css";

const MainLayout = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const logout = useLogout();

  return (
    <div className="main-layout">
      <header className="main-topbar">
        <div className="main-topbar-brand" onClick={() => navigate("/")}>
          MT holding
        </div>
        <div className="main-topbar-right">
          <span>
            {user?.fullName}({user?.role})
          </span>
          <button className="main-logout-btn" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default MainLayout;
