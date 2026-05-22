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
import ChamCongPage from "../features/admin/dashboard/pages/ChamCongPage";
import CaLamViecPage from "../features/admin/nhansu/pages/CaLamViecPage";
import LichSuChamCongPage from "../features/admin/nhansu/pages/LichSuChamCongPage";
import PheDuyetGiaiTrinhPage from "../features/admin/nhansu/pages/PheDuyetGiaiTrinhPage";
import NhanVienPage from "../features/admin/nhansu/pages/Nhanvienpage";
import NgayLePage from "../features/admin/nhansu/pages/NgayLePage";
import NgayPhepPage from "../features/admin/nhansu/pages/NgayPhepPage";
import LamThemGioPage from "../features/admin/nhansu/pages/LamThemGioPage";
import KeToanPage from "../features/admin/ketoan/pages/KeToanPage";

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
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
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
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="workflow/:projectId/history"
              element={<WorkflowHistoryPage />}
            />

            {/* ── Nhân sự ── */}
            <Route path="nhan-su/cham-cong" element={<ChamCongPage />} />
            <Route path="nhan-su/ca-lam-viec" element={<CaLamViecPage />} />
            <Route path="nhan-su/nhan-vien" element={<NhanVienPage />} />
            <Route path="nhan-su/lich-su" element={<LichSuChamCongPage />} />
            <Route path="nhan-su/ngay-le" element={<NgayLePage />} />
            <Route path="nhan-su/nghi-phep" element={<NgayPhepPage />} />
            <Route path="nhan-su/lam-them-gio" element={<LamThemGioPage />} />
            <Route
              path="nhan-su/phe-duyet"
              element={<PheDuyetGiaiTrinhPage />}
            />
            <Route path="nhan-su/bao-cao" element={<KeToanPage title="Báo cáo" />} />

            {/* ── Kế toán & Tài chính ── */}
            <Route path="ke-toan/mtshop"      element={<KeToanPage title="MTSHOP" />} />
            <Route path="ke-toan/mtpsi"       element={<KeToanPage title="MTPSI" />} />
            <Route path="ke-toan/mtparts"     element={<KeToanPage title="MTPARTS" />} />
            <Route path="ke-toan/mth"         element={<KeToanPage title="MTH Phòng kế toán" />} />
            <Route path="ke-toan/mt-paint"    element={<KeToanPage title="MT Paint" />} />
            <Route path="ke-toan/mhm"         element={<KeToanPage title="MHM" />} />
            <Route path="ke-toan/bc-hop-nhat" element={<KeToanPage title="BC hợp nhất MT Holdings" />} />
            <Route path="ke-toan/bao-cao-360" element={<KeToanPage title="Báo cáo 360" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
