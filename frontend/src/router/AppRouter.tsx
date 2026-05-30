import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@auth/login/LoginPage";
import RegisterPage from "@auth/register/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "@shell/AdminLayout/AdminLayout";
import ModuleDashboardPage from "@shell/ModuleDashboard/ModuleDashboardPage";

import UserHomePage from "../features/user/UserHomePage";
import ProfilePage from "../features/user/ProfilePage";
import CRMPage from "../features/admin/pages/CRMPage/CRMPage";
import AnalyticsPage from "../features/admin/pages/AnalyticPage/AnalyticsPage";
import WidgetsPage from "../features/admin/pages/WidgetsPage/WidgetsPage";
import IconsPage from "../features/admin/pages/IconsPage/IconsPage";

import hrmRoutes from "./routes/hrm.routes";
import keToanRoutes from "./routes/ke-toan.routes";
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

            <Route element={<AdminLayout />}>
              <Route path="crm" element={<CRMPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="widgets" element={<WidgetsPage />} />
              <Route path="icons" element={<IconsPage />} />
              <Route path="profile" element={<ProfilePage />} />

              {hrmRoutes}
              {phanMemMuaHangRoutes}
              {banHangRoutes}
              {workflowRoutes}
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
