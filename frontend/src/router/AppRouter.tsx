import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Warehouse, Cog, Network, GitFork } from "lucide-react";

import LoginPage from "@auth/login/LoginPage";
import RegisterPage from "@auth/register/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "@shell/AdminLayout/AdminLayout";
import ModuleDashboardPage from "@shell/ModuleDashboard/ModuleDashboardPage";
import ComingSoonModule from "@shell/ComingSoonModule/ComingSoonModule";

import UserHomePage from "../features/user/UserHomePage";
import ProfilePage from "../features/user/ProfilePage";
import CRMPage from "../features/admin/pages/CRMPage/CRMPage";
import AnalyticsPage from "../features/admin/pages/AnalyticPage/AnalyticsPage";
import WidgetsPage from "../features/admin/pages/WidgetsPage/WidgetsPage";
import IconsPage from "../features/admin/pages/IconsPage/IconsPage";

import hrmRoutes from "./routes/hrm.routes";
import keToanRoutes from "./routes/ke-toan.routes";
import HRMLayout from "@modules/hrm/components/Layout";
import daoTaoRoutes from "./routes/dao-tao.routes";
import phanMemMuaHangRoutes from "./routes/phan-mem-mua-hang.routes";
import banHangRoutes from "./routes/ban-hang.routes";
import truyenThongRoutes from "./routes/truyen-thong.routes";
import workflowRoutes from "./routes/workflow.routes";
import muaHangRoutes from "./routes/mua-hang.routes";

const UnauthorizedPage = () => (
  <div className="page-center">
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        background: "white",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
      }}
    >
      <h2>403 - Unauthorized</h2>
      <p>Bạn không có quyền truy cập trang này</p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<UserHomePage />} />

          <Route path="/admin">
            <Route index element={<ModuleDashboardPage />} />

            {keToanRoutes}
            {truyenThongRoutes}
            {muaHangRoutes}
            {daoTaoRoutes}
            {phanMemMuaHangRoutes}

            {/* ── Modules chưa phát triển — hiện ComingSoon thay vì 404 ── */}
            <Route
              path="kho-hang/*"
              element={
                <ComingSoonModule
                  label="Kho hàng"
                  color="linear-gradient(135deg,#0ea5e9,#0369a1)"
                  icon={Warehouse}
                  description="Hệ thống quản lý kho hàng, nhập xuất tồn và kiểm kê toàn bộ kho của MT Holdings."
                />
              }
            />
            <Route
              path="san-xuat/*"
              element={
                <ComingSoonModule
                  label="Sản xuất"
                  color="linear-gradient(135deg,#6366f1,#4338ca)"
                  icon={Cog}
                  description="Quản lý quy trình sản xuất, định mức nguyên liệu và theo dõi tiến độ sản xuất."
                />
              }
            />
            <Route
              path="so-do/*"
              element={
                <ComingSoonModule
                  label="Sơ đồ chính"
                  color="linear-gradient(135deg,#ec4899,#9d174d)"
                  icon={Network}
                  description="Sơ đồ tổ chức và quy trình nghiệp vụ tổng thể của MT Holdings."
                />
              }
            />
            <Route
              path="so-do-to-chuc-mth/*"
              element={
                <ComingSoonModule
                  label="Sơ đồ tổ chức MTH"
                  color="linear-gradient(135deg,#14b8a6,#0f766e)"
                  icon={GitFork}
                  description="Sơ đồ tổ chức chi tiết của tập đoàn MTH theo từng công ty và phòng ban."
                />
              }
            />

            {/* ── HRM + Workflow cùng 1 layout ── */}
            <Route element={<HRMLayout><Outlet /></HRMLayout>}>
              {hrmRoutes}
              {workflowRoutes}
            </Route>

            <Route element={<AdminLayout />}>
              <Route path="crm" element={<CRMPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="widgets" element={<WidgetsPage />} />
              <Route path="icons" element={<IconsPage />} />
              <Route path="profile" element={<ProfilePage />} />

              {banHangRoutes}
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
