import MainLayout from "../../layouts/MainLayout/MainLayout";
import { useAuthStore } from "../auth/auth.store";
import "./user-home.css";

const UserHomePage = () => {
  const { user } = useAuthStore();

  return (
    <MainLayout>
      <div className="user-home-card">
        <h2>Trang người dùng</h2>
        <p>Xin chào, {user?.phone}</p>
        <p className="muted-text">Chào mừng bạn đến với MT Holding.</p>
      </div>
    </MainLayout>
  );
};

export default UserHomePage;
