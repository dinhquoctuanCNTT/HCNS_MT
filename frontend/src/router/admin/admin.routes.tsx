import { RouteObject } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

import DashboardPage from "../../features/admin/dashboard/pages/DashboardPage";
import DefaultPage from "../../features/admin/pages/DefaultPage/DefaultPage";
import ChamCongPage from "../../features/admin/dashboard/pages/ChamCongPage";
import CRMPage from "../../features/admin/pages/CRMPage/CRMPage";
import AnalyticsPage from "../../features/admin/pages/AnalyticPage/AnalyticsPage";
import WidgetsPage from "../../features/admin/pages/WidgetsPage/WidgetsPage";
import IconsPage from "../../features/admin/pages/IconsPage/IconsPage";
import WorkflowPage from "../../features/workflow/workflow/WorkflowPage";
import CaLamViecPage from "../../features/admin/nhansu/pages/CaLamViecPage";
import LichSuChamCongPage from "../../features/admin/nhansu/pages/LichSuChamCongPage";

export const adminRoutes: RouteObject = {
  path: "admin",
  element: <AdminLayout />,
  children: [
    { index: true, element: <DashboardPage /> },
    { path: "dashboard", element: <DashboardPage /> },
    { path: "default", element: <DefaultPage /> },
    { path: "crm", element: <CRMPage /> },
    { path: "analytics", element: <AnalyticsPage /> },
    { path: "workflow", element: <WorkflowPage /> },
    { path: "widgets", element: <WidgetsPage /> },
    { path: "icons", element: <IconsPage /> },

    // ── Nhân sự ──
    { path: "nhan-su/cham-cong", element: <ChamCongPage /> },
    { path: "nhan-su/nhan-vien", element: <DefaultPage /> },
    { path: "nhan-su/ca-lam-viec", element: <CaLamViecPage /> },
    { path: "nhan-su/lich-su", element: <LichSuChamCongPage /> },
    { path: "nhan-su/bao-cao", element: <DefaultPage /> },
  ],
};
