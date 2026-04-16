import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "../features/welcome/WelcomePage";
import LoginPage from "../features/auth/login/LoginPage";
import RegisterPage from "../features/auth/register/RegisterPage";
import UserHomePage from "../features/user/UserHomePage";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";

import DashboardPage from "../features/admin/dashboard/pages/DashboardPage";
import CRMPage from "../features/admin/pages/CRMPage/CRMPage";
import AnalyticsPage from "../features/admin/pages/AnalyticPage/AnalyticsPage";
import WidgetsPage from "../features/admin/pages/WidgetsPage/WidgetsPage";
import IconsPage from "../features/admin/pages/IconsPage/IconsPage";
import WorkflowPage from "../features/workflow/workflow/WorkflowPage";
import WorkflowHistoryPage from "../features/workflow/workflowHistory/WorkflowhistoryPage";

import ProfilePage from "../features/user/ProfilePage";

const UnauthorizedPage = () => {
  return (
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
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<UserHomePage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="default" element={<DashboardPage />} />
            <Route path="crm" element={<CRMPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="widgets" element={<WidgetsPage />} />
            <Route path="icons" element={<IconsPage />} />
            <Route path="workflow" element={<WorkflowPage />} />
            {/* ✅ FIX: projectId nằm trong URL để WorkflowHistoryPage đọc được */}

            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="workflow/:projectId/history"
              element={<WorkflowHistoryPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
