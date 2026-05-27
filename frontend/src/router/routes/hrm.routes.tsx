import { Route } from "react-router-dom";
import DashboardPage from "@modules/hrm/pages/DashboardPage";
import ChamCongPage from "@modules/hrm/pages/ChamCongPage";
import CaLamViecPage from "@modules/hrm/pages/CaLamViecPage";
import LichSuChamCongPage from "@modules/hrm/pages/LichSuChamCongPage";
import PheDuyetGiaiTrinhPage from "@modules/hrm/pages/PheDuyetGiaiTrinhPage";
import NhanVienPage from "@modules/hrm/pages/Nhanvienpage";
import NgayLePage from "@modules/hrm/pages/NgayLePage";
import NgayPhepPage from "@modules/hrm/pages/NgayPhepPage";
import LamThemGioPage from "@modules/hrm/pages/LamThemGioPage";
import KeToanPage from "@modules/ke-toan/pages/KeToanPage";

const hrmRoutes = [
  <Route key="hrm"       path="hrm"       element={<DashboardPage />} />,
  <Route key="dashboard" path="dashboard" element={<DashboardPage />} />,
  <Route key="default"   path="default"   element={<DashboardPage />} />,

  <Route key="ns-cham-cong"   path="nhan-su/cham-cong"    element={<ChamCongPage />} />,
  <Route key="ns-ca-lam-viec" path="nhan-su/ca-lam-viec"  element={<CaLamViecPage />} />,
  <Route key="ns-nhan-vien"   path="nhan-su/nhan-vien"    element={<NhanVienPage />} />,
  <Route key="ns-lich-su"     path="nhan-su/lich-su"      element={<LichSuChamCongPage />} />,
  <Route key="ns-ngay-le"     path="nhan-su/ngay-le"      element={<NgayLePage />} />,
  <Route key="ns-nghi-phep"   path="nhan-su/nghi-phep"    element={<NgayPhepPage />} />,
  <Route key="ns-lam-them"    path="nhan-su/lam-them-gio"  element={<LamThemGioPage />} />,
  <Route key="ns-phe-duyet"   path="nhan-su/phe-duyet"    element={<PheDuyetGiaiTrinhPage />} />,
  <Route key="ns-bao-cao"     path="nhan-su/bao-cao"      element={<KeToanPage title="Báo cáo" />} />,
];

export default hrmRoutes;
