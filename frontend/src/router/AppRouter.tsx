import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
            <Route
              path="nhan-su/bao-cao"
              element={<KeToanPage title="Báo cáo" />}
            />

            {/* ── Kế toán & Tài chính ── */}
            <Route
              path="ke-toan/mtshop"
              element={<KeToanPage title="MTSHOP" />}
            />

            <Route
              path="ke-toan/mtshop/quy-trinh"
              element={
                <KeToanPage title="1. MTSHOP. Quy trình phòng kế toán" />
              }
            />
            <Route
              path="ke-toan/mtshop/quy-tien-mat"
              element={
                <KeToanPage title="2. MTSHOP. Quỹ tiền mặt và ngân hàng" />
              }
            />
            <Route
              path="ke-toan/mtshop/tong-hop-chi-phi"
              element={<KeToanPage title="3. MTSHOP. Tổng hợp các chi phí" />}
            />
            <Route
              path="ke-toan/mtshop/cong-no-phai-thu"
              element={<KeToanPage title="4. MTSHOP. Công nợ phải thu" />}
            />
            <Route
              path="ke-toan/mtshop/cong-no-phai-tra"
              element={<KeToanPage title="5. MTSHOP. Công nợ phải trả" />}
            />
            <Route
              path="ke-toan/mtshop/kho-hang-hoa"
              element={<KeToanPage title="6. MTSHOP. Kho hàng hóa" />}
            />
            <Route
              path="ke-toan/mtshop/bao-cao-tai-chinh"
              element={
                <KeToanPage title="7. MTSHOP. Báo cáo tài chính hàng tháng" />
              }
            />
            <Route
              path="ke-toan/mtshop/bao-cao-vat"
              element={<KeToanPage title="8. MTSHOP. Báo cáo VAT(NBo)" />}
            />

            {/**/}
            <Route
              path="ke-toan/mtpsi"
              element={<KeToanPage title="MTPSI" />}
            />

            <Route
              path="ke-toan/mtpsi/quy-trinh"
              element={<KeToanPage title="1. MTPSI. Quy trình phòng kế toán" />}
            />
            <Route
              path="ke-toan/mtpsi/quy-tien-mat"
              element={
                <KeToanPage title="2. MTPSI. Quỹ tiền mặt và ngân hàng" />
              }
            />
            <Route
              path="ke-toan/mtpsi/tong-hop-chi-phi"
              element={<KeToanPage title="3. MTPSI. Tổng hợp các chi phí" />}
            />
            <Route
              path="ke-toan/mtpsi/cong-no-phai-thu"
              element={<KeToanPage title="4. MTPSI. Công nợ phải thu" />}
            />
            <Route
              path="ke-toan/mtpsi/cong-no-phai-tra"
              element={<KeToanPage title="5. MTPSI. Công nợ phải trả" />}
            />
            <Route
              path="ke-toan/mtpsi/kho-hang-hoa"
              element={<KeToanPage title="6. MTPSI. Kho hàng hóa" />}
            />
            <Route
              path="ke-toan/mtpsi/bao-cao-tai-chinh"
              element={
                <KeToanPage title="7. MTPSI. Báo cáo tài chính hàng tháng" />
              }
            />
            <Route
              path="ke-toan/mtpsi/bao-cao-vat"
              element={<KeToanPage title="8. MTPSI. Báo cáo VAT(NBo)" />}
            />
            <Route
              path="ke-toan/mtpsi/hop-dong-thi-cong"
              element={
                <KeToanPage title="9. MTPSI. Các mẫu hợp đồng thi công" />
              }
            />
            <Route
              path="ke-toan/mtpsi/theo-doi-cong-trinh"
              element={
                <KeToanPage title="10. MTPSI. Theo dõi các công trình" />
              }
            />
            <Route
              path="ke-toan/mtpsi/thue"
              element={<KeToanPage title="11. MTPSI. Thuế" />}
            />
            <Route
              path="ke-toan/mtparts"
              element={<KeToanPage title="MTPARTS" />}
            />
            <Route
              path="ke-toan/mth"
              element={<KeToanPage title="MTH Phòng kế toán" />}
            />
            <Route
              path="ke-toan/mt-paint"
              element={<KeToanPage title="MT Paint" />}
            />
            {/* MTPARTS sub-routes */}
            <Route path="ke-toan/mtparts/quy-trinh"        element={<KeToanPage title="1. MTPARTS. Quy trình phòng kế toán" />} />
            <Route path="ke-toan/mtparts/quy-tien-mat"      element={<KeToanPage title="2. MTPARTS. Quỹ tiền mặt và ngân hàng" />} />
            <Route path="ke-toan/mtparts/tong-hop-chi-phi"  element={<KeToanPage title="3. MTPARTS. Tổng hợp các chi phí" />} />
            <Route path="ke-toan/mtparts/cong-no-phai-thu"  element={<KeToanPage title="4. MTPARTS. Công nợ phải thu" />} />
            <Route path="ke-toan/mtparts/cong-no-phai-tra"  element={<KeToanPage title="5. MTPARTS. Công nợ phải trả" />} />
            <Route path="ke-toan/mtparts/kho-hang-hoa"      element={<KeToanPage title="6. MTPARTS. Kho hàng hóa" />} />
            <Route path="ke-toan/mtparts/bao-cao-tai-chinh" element={<KeToanPage title="7. MTPARTS. Báo cáo tài chính hàng tháng" />} />
            <Route path="ke-toan/mtparts/bao-cao-vat"       element={<KeToanPage title="8. MTPARTS. Báo cáo VAT(NBo)" />} />
            <Route path="ke-toan/mtparts/thue"              element={<KeToanPage title="9. MTPARTS. Thuế" />} />

            {/* MTH sub-routes */}
            <Route path="ke-toan/mth/tu-tai-lieu"    element={<KeToanPage title="1. MTH. Tủ tài liệu phòng kế toán" />} />
            <Route path="ke-toan/mth/dao-tao-kt"     element={<KeToanPage title="2. MTH. Đào tạo KT" />} />
            <Route path="ke-toan/mth/cong-viec-ktv"  element={<KeToanPage title="3. MTH. Công việc của kế toán viên" />} />
            <Route path="ke-toan/mth/tai-lieu-dao-tao" element={<KeToanPage title="4. MTH. Tài liệu đào tạo KTBH và Kho" />} />
            <Route path="ke-toan/mth/hop-giao-ban"   element={<KeToanPage title="MTH. Họp giao ban" />} />

            {/* MT Paint sub-routes */}
            <Route path="ke-toan/mt-paint/quy-trinh"         element={<KeToanPage title="1. MT Paint. Quy trình phòng kế toán" />} />
            <Route path="ke-toan/mt-paint/quy-tien-mat"       element={<KeToanPage title="2. MT Paint. Quỹ tiền mặt và chuyển khoản" />} />
            <Route path="ke-toan/mt-paint/tong-hop-chi-phi"   element={<KeToanPage title="3. MT Paint. Tổng hợp các chi phí" />} />
            <Route path="ke-toan/mt-paint/cong-no-phai-thu"   element={<KeToanPage title="5. MT Paint. Công nợ phải thu" />} />
            <Route path="ke-toan/mt-paint/kho-pha-le"         element={<KeToanPage title="6. MT Paint. Kho pha lẻ" />} />
            <Route path="ke-toan/mt-paint/bao-cao-tai-chinh"  element={<KeToanPage title="7. MT Paint. Báo cáo tài chính hàng tháng" />} />
            <Route path="ke-toan/mt-paint/kho-hang-hoa"       element={<KeToanPage title="8. MT Paint. Kho hàng hóa" />} />
            <Route path="ke-toan/mt-paint/hoa-don-vat"        element={<KeToanPage title="9. MT Paint. Hóa đơn VAT" />} />
            <Route path="ke-toan/mt-paint/cong-no-trong-nuoc" element={<KeToanPage title="10. MT Paint. Công nợ phải trả trong nước" />} />
            <Route path="ke-toan/mt-paint/cong-no-nuoc-ngoai" element={<KeToanPage title="11. MT Paint. Công nợ phải trả nước ngoài" />} />
            <Route path="ke-toan/mt-paint/ngan-sach"          element={<KeToanPage title="12. MT Paint. Ngân sách" />} />
            <Route path="ke-toan/mt-paint/bao-cao-bi"         element={<KeToanPage title="13. MT Paint. Học làm báo cáo BI" />} />
            <Route path="ke-toan/mt-paint/hang-hu-hong"       element={<KeToanPage title="14. MT Paint. Hồ sơ hàng hư hỏng hàng năm" />} />
            <Route path="ke-toan/mt-paint/du-lieu-pm"         element={<KeToanPage title="15. MT Paint. Dữ liệu pm" />} />
            <Route path="ke-toan/mt-paint/thue"               element={<KeToanPage title="16. Thuế MT Paint" />} />
            <Route path="ke-toan/mt-paint/doi-chieu-136-336"  element={<KeToanPage title="17. MT Paint. Báo cáo đối chiếu 136 và 336" />} />

            {/* MHM sub-routes */}
            <Route path="ke-toan/mhm/quy-trinh"         element={<KeToanPage title="1. MHM. Quy trình phòng kế toán" />} />
            <Route path="ke-toan/mhm/quy-tien-mat"       element={<KeToanPage title="2. MHM. Quỹ tiền mặt và ngân hàng" />} />
            <Route path="ke-toan/mhm/cong-no-phai-thu"   element={<KeToanPage title="3. MHM. Công nợ phải thu" />} />
            <Route path="ke-toan/mhm/cong-no-phai-tra"   element={<KeToanPage title="4. MHM. Công nợ phải trả" />} />
            <Route path="ke-toan/mhm/chi-phi-cong-cu"    element={<KeToanPage title="5. MHM. Chi phí đầu tư thiết bị công cụ" />} />
            <Route path="ke-toan/mhm/chi-phi-kinh-doanh" element={<KeToanPage title="6. MHM. Chi phí kinh doanh" />} />
            <Route path="ke-toan/mhm/chi-phi-san-xuat"   element={<KeToanPage title="7. MHM. Chi phí sản xuất" />} />
            <Route path="ke-toan/mhm/chi-phi-van-hanh"   element={<KeToanPage title="8. MHM. Chi phí vận hành" />} />
            <Route path="ke-toan/mhm/kho"                element={<KeToanPage title="9. MHM. Kho" />} />
            <Route path="ke-toan/mhm/bao-cao-thue"       element={<KeToanPage title="10. MHM. Báo cáo thuế" />} />
            <Route path="ke-toan/mhm/hoa-don"            element={<KeToanPage title="11. MHM. Hóa đơn đầu vào và đầu ra" />} />
            <Route path="ke-toan/mhm/bao-cao-tai-chinh"  element={<KeToanPage title="12. MHM. Báo cáo tài chính hàng tháng" />} />
            <Route path="ke-toan/mhm/ke-hoach-ban-hang"  element={<KeToanPage title="13. MHM. Kế hoạch bán hàng" />} />
            <Route path="ke-toan/mhm/theo-doi-boc-tach"  element={<KeToanPage title="14. MHM. Theo dõi khác - bóc tách chi phí" />} />
            <Route path="ke-toan/mhm/tinh-gia-von"       element={<KeToanPage title="15. MHM. Tính giá vốn MHM" />} />
            <Route path="ke-toan/mhm/thue"               element={<KeToanPage title="16. MHM. Thuế" />} />

            <Route
              path="ke-toan/bc-hop-nhat"
              element={<KeToanPage title="BC hợp nhất MT Holdings" />}
            />
            <Route
              path="ke-toan/bao-cao-360"
              element={<KeToanPage title="Báo cáo 360" />}
            />

            {/* ── Đào tạo ── */}
            {/* 1. Sơ đồ tổ chức */}
            <Route path="dao-tao/so-do-to-chuc/he-sinh-thai"   element={<KeToanPage title="1.1. Hệ sinh thái MTH" />} />
            <Route path="dao-tao/so-do-to-chuc/danh-muc-cty"   element={<KeToanPage title="1.2. Danh mục công ty, chi nhánh, phòng ban, chức vụ" />} />
            <Route path="dao-tao/so-do-to-chuc/ho-so-nang-luc" element={<KeToanPage title="1.3. Hồ sơ năng lực các công ty" />} />
            <Route path="dao-tao/so-do-to-chuc/chuc-nang-pb"   element={<KeToanPage title="1.4. Chức năng nhiệm vụ phòng ban" />} />
            {/* 2. Nhân sự 360 */}
            <Route path="dao-tao/nhan-su-360/danh-sach"    element={<KeToanPage title="2.1. Danh sách nhân sự" />} />
            <Route path="dao-tao/nhan-su-360/bmtcv-kpi"    element={<KeToanPage title="2.2. BMTCV + KPI" />} />
            <Route path="dao-tao/nhan-su-360/khung-nang-luc" element={<KeToanPage title="2.3. Khung năng lực" />} />
            <Route path="dao-tao/nhan-su-360/lo-trinh"     element={<KeToanPage title="2.4. Lộ trình phát triển" />} />
            {/* 3. Quy trình, biểu mẫu */}
            <Route path="dao-tao/quy-trinh/quy-trinh-chung"    element={<KeToanPage title="1. Quy trình chung PĐT" />} />
            <Route path="dao-tao/quy-trinh/bien-ban-hop"        element={<KeToanPage title="Biên bản họp hàng tháng" />} />
            <Route path="dao-tao/quy-trinh/ke-hoach-tuan-thang" element={<KeToanPage title="2. Kế hoạch tuần/tháng PĐT" />} />
            <Route path="dao-tao/quy-trinh/bao-cao-ngay"        element={<KeToanPage title="3. Báo cáo ngày/tuần/tháng" />} />
            <Route path="dao-tao/quy-trinh/bao-cao-hoat-dong"   element={<KeToanPage title="4. Báo cáo tháng về hoạt động đào tạo" />} />
            <Route path="dao-tao/quy-trinh/giay-to-hc"          element={<KeToanPage title="5. Giấy tờ hành chính" />} />
            {/* 4. Quản lý tài liệu */}
            <Route path="dao-tao/tai-lieu/mth"         element={<KeToanPage title="1. MTH" />} />
            <Route path="dao-tao/tai-lieu/mtpaints"    element={<KeToanPage title="2. MTPaints" />} />
            <Route path="dao-tao/tai-lieu/mhm"         element={<KeToanPage title="3. MHM" />} />
            <Route path="dao-tao/tai-lieu/mtparts"     element={<KeToanPage title="4. MTparts" />} />
            <Route path="dao-tao/tai-lieu/mtshop"      element={<KeToanPage title="5. MTShop" />} />
            <Route path="dao-tao/tai-lieu/mtpsi"       element={<KeToanPage title="6. MTPSI" />} />
            <Route path="dao-tao/tai-lieu/mteducation" element={<KeToanPage title="7. MTEducation" />} />
            <Route path="dao-tao/tai-lieu/mtsoft"      element={<KeToanPage title="8. MTSoft" />} />
            {/* 5. Hoạt động đào tạo */}
            <Route path="dao-tao/hoat-dong/chuong-trinh"     element={<KeToanPage title="1. Chương trình đào tạo theo công ty, phòng ban" />} />
            <Route path="dao-tao/hoat-dong/nhu-cau"          element={<KeToanPage title="Nhu cầu đào tạo toàn hệ thống" />} />
            <Route path="dao-tao/hoat-dong/ke-hoach"         element={<KeToanPage title="Kế hoạch, lịch đào tạo trong tháng" />} />
            <Route path="dao-tao/hoat-dong/hoi-nhap"         element={<KeToanPage title="2. Đào tạo hội nhập" />} />
            <Route path="dao-tao/hoat-dong/chuyen-mon"       element={<KeToanPage title="3. Đào tạo chuyên môn" />} />
            <Route path="dao-tao/hoat-dong/nang-cao"         element={<KeToanPage title="4. Đào tạo nâng cao (theo khung năng lực)" />} />
            <Route path="dao-tao/hoat-dong/thue-ngoai"       element={<KeToanPage title="5. Đào tạo thuê ngoài" />} />
            <Route path="dao-tao/hoat-dong/san-pham-moi"     element={<KeToanPage title="6. Đào tạo sản phẩm mới" />} />
            <Route path="dao-tao/hoat-dong/nhac-lai"         element={<KeToanPage title="7. Đào tạo nhắc lại" />} />
            <Route path="dao-tao/hoat-dong/bao-cao-tong-hop" element={<KeToanPage title="8. Báo cáo tổng hợp" />} />
            {/* 6. Đánh giá/kết quả */}
            <Route path="dao-tao/danh-gia/ket-qua-toan-he-thong" element={<KeToanPage title="1. Kết quả đào tạo toàn hệ thống" />} />
            <Route path="dao-tao/danh-gia/khao-sat"              element={<KeToanPage title="2. Khảo sát sau đào tạo" />} />
            <Route path="dao-tao/danh-gia/tong-hop-phan-tich"    element={<KeToanPage title="3. Tổng hợp, phân tích kết quả đào tạo" />} />
            {/* 7. MTH - Đào tạo liên kết */}
            <Route path="dao-tao/lien-ket/oem"             element={<KeToanPage title="1. OEM" />} />
            <Route path="dao-tao/lien-ket/truong"          element={<KeToanPage title="2. Trường" />} />
            <Route path="dao-tao/lien-ket/hoi-thi-tay-nghe" element={<KeToanPage title="3. Hội thi tay nghề" />} />
            {/* ── Phần mềm mua hàng ── */}
            <Route path="phan-mem-mua-hang/ncc/thong-tin"    element={<KeToanPage title="1.1. Thông tin nhà cung cấp" />} />
            <Route path="phan-mem-mua-hang/ncc/danh-gia"     element={<KeToanPage title="1.2. Đánh giá NCC" />} />
            <Route path="phan-mem-mua-hang/nhan-su/thong-tin"    element={<KeToanPage title="2.1. Thông tin nhân sự" />} />
            <Route path="phan-mem-mua-hang/nhan-su/bmtcv-thuong" element={<KeToanPage title="2.2. BMTCV + thưởng P3" />} />
            <Route path="phan-mem-mua-hang/nhan-su/he-thong-bc"  element={<KeToanPage title="2.3. Hệ thống Báo cáo" />} />
            <Route path="phan-mem-mua-hang/nhan-su/chien-luoc"   element={<KeToanPage title="2.4. Chiến lược, mục tiêu phòng mua hàng" />} />
            <Route path="phan-mem-mua-hang/nhan-su/cl-muc-tieu-nam" element={<KeToanPage title="2.4.0. Chiến lược, mục tiêu năm" />} />
            <Route path="phan-mem-mua-hang/nhan-su/ke-hoach-nam" element={<KeToanPage title="2.4.1. Kế hoạch, hành động năm" />} />
            <Route path="phan-mem-mua-hang/nhan-su/p3-nam"       element={<KeToanPage title="2.4.2. P3 năm" />} />
            <Route path="phan-mem-mua-hang/nhan-su/dao-tao"      element={<KeToanPage title="2.5. Đào tạo" />} />
            <Route path="phan-mem-mua-hang/nhan-su/s5"           element={<KeToanPage title="2.6. S5" />} />
            <Route path="phan-mem-mua-hang/san-pham/ke-hoach-sp-moi" element={<KeToanPage title="3.1. Kế hoạch triển khai sản phẩm mới" />} />
            <Route path="phan-mem-mua-hang/san-pham/bang-gia-von"    element={<KeToanPage title="3.2. Bảng giá vốn lợi nhuận" />} />
            <Route path="phan-mem-mua-hang/san-pham/thong-tin-sp"    element={<KeToanPage title="3.3. Thông tin sản phẩm" />} />
            <Route path="phan-mem-mua-hang/san-pham/top-ban-nhieu"   element={<KeToanPage title="3.4. Top sản phẩm bán nhiều đột biến" />} />
            <Route path="phan-mem-mua-hang/san-pham/top-ban-cham"    element={<KeToanPage title="3.5. Top sản phẩm bán chậm" />} />
            <Route path="phan-mem-mua-hang/san-pham/canh-bao-kho"    element={<KeToanPage title="3.6. Cảnh báo hàng tồn kho cần date" />} />
            <Route path="phan-mem-mua-hang/dat-hang/ke-hoach-nam"    element={<KeToanPage title="4.1. Kế hoạch đặt hàng theo năm" />} />
            <Route path="phan-mem-mua-hang/dat-hang/ke-hoach-thang"  element={<KeToanPage title="4.2. Kế hoạch đặt hàng theo tháng" />} />
            <Route path="phan-mem-mua-hang/dat-hang/theo-doi-don"    element={<KeToanPage title="4.3. Theo dõi đơn đặt hàng" />} />
            <Route path="phan-mem-mua-hang/dat-hang/giam-gia-ncc"    element={<KeToanPage title="4.4. Giảm giá mua từ NCC" />} />
            <Route path="phan-mem-mua-hang/dat-hang/khieu-nai"       element={<KeToanPage title="4.5. Khiếu nại đơn hàng" />} />
            <Route path="phan-mem-mua-hang/thanh-toan/ke-hoach-ncc"  element={<KeToanPage title="5.1. Kế hoạch thanh toán NCC" />} />
            <Route path="phan-mem-mua-hang/thanh-toan/cong-no"       element={<KeToanPage title="5.2. Đảm bảo thanh toán công nợ" />} />
            <Route path="phan-mem-mua-hang/chi-phi" element={<KeToanPage title="6. Chi phí mua hàng" />} />
            <Route path="phan-mem-mua-hang/ty-gia"  element={<KeToanPage title="7. Tỷ giá ngoại tệ biến thiên" />} />

            {/* ── Hệ thống quản bán hàng ── */}
            <Route path="ban-hang/thong-tin-kh-360"     element={<KeToanPage title="1.1 Thông tin khách hàng 360" />} />
            <Route path="ban-hang/dinh-huong-kh-360"    element={<KeToanPage title="1.1.1 Định hướng khách hàng 360" />} />
            <Route path="ban-hang/nhan-su-pbh-360"      element={<KeToanPage title="1.2 Nhân sự phòng bán hàng 360" />} />
            <Route path="ban-hang/co-cau-to-chuc"       element={<KeToanPage title="1.2.0 Cơ cấu tổ chức" />} />
            <Route path="ban-hang/thong-tin-nhan-su"    element={<KeToanPage title="1.2.1 Thông tin nhân sự" />} />
            <Route path="ban-hang/danh-gia-luong-3p"    element={<KeToanPage title="1.2.2 Đánh giá lương 3P" />} />
            <Route path="ban-hang/co-che-bh-tieu-chuan" element={<KeToanPage title="1.2.3 Cơ chế bán hàng tiêu chuẩn" />} />
            <Route path="ban-hang/co-che-bh-thuc-te"    element={<KeToanPage title="1.2.4 Cơ chế bán hàng thực tế" />} />
            <Route path="ban-hang/doi-thu-canh-tranh"   element={<KeToanPage title="1.3 Thông tin đối thủ cạnh tranh" />} />
            <Route path="ban-hang/san-pham-gia-ban"     element={<KeToanPage title="1.4 Thông tin sản phẩm và giá bán" />} />
            <Route path="ban-hang/kh-noi-ngoai-tinh"    element={<KeToanPage title="1.5 Kế hoạch BH nội tỉnh và ngoại tỉnh" />} />
            <Route path="ban-hang/kh-bh-noi-ngoai"      element={<KeToanPage title="1.5.1 Kế hoạch BH nội tỉnh và ngoại tỉnh" />} />
            <Route path="ban-hang/kq-bh-noi-ngoai"      element={<KeToanPage title="1.5.2 Kết quả BH nội tỉnh và ngoại tỉnh" />} />
            <Route path="ban-hang/top-20-kh-80-ds"      element={<KeToanPage title="1.6 Top 20% KH đóng góp 80% doanh số" />} />
            <Route path="ban-hang/kh-khong-mua-30-60-90" element={<KeToanPage title="1.7 KH không mua hàng 30/60/90 ngày" />} />
            <Route path="ban-hang/kh-mua-giam-20"       element={<KeToanPage title="1.8 KH có mức mua giảm từ 20% tháng trước" />} />
            <Route path="ban-hang/ds-chi-phi-ln-kh"     element={<KeToanPage title="1.9 Doanh số - chi phí - lợi nhuận theo KH" />} />
            <Route path="ban-hang/ho-so-co-hoi-dau-tu"  element={<KeToanPage title="1.9.1 Hồ sơ cơ hội đầu tư" />} />
            <Route path="ban-hang/hang-muc-dau-tu"      element={<KeToanPage title="1.9.2 Hạng mục đầu tư ban đầu" />} />
            <Route path="ban-hang/chi-phi-van-hanh"     element={<KeToanPage title="1.9.3 Chi phí vận hành" />} />
            <Route path="ban-hang/ke-hoach-ds-gia-dinh" element={<KeToanPage title="1.9.4 Kế hoạch doanh số và giả định hiệu quả" />} />
            <Route path="ban-hang/danh-gia-phe-duyet"   element={<KeToanPage title="1.9.5 Đánh giá / phê duyệt / cảnh báo" />} />
            <Route path="ban-hang/quan-ly-cong-no"      element={<KeToanPage title="1.10 Quản lý công nợ" />} />
            <Route path="ban-hang/sales-roadmap"        element={<KeToanPage title="1.11 Quản lý BH theo Sales Roadmap" />} />
            <Route path="ban-hang/ho-so-du-an-bh"       element={<KeToanPage title="1.11.1 Hồ sơ dự án bán hàng" />} />
            <Route path="ban-hang/tien-do-roadmap"      element={<KeToanPage title="1.11.2 Tiến độ roadmap 11 bước" />} />
            <Route path="ban-hang/nhat-ky-hanh-dong"    element={<KeToanPage title="1.11.3 Nhật ký hành động" />} />
            <Route path="ban-hang/y-kien-dinh-huong"    element={<KeToanPage title="1.11.4 Ý kiến / định hướng / kết quả" />} />
            <Route path="ban-hang/muc-tieu-ke-hoach"    element={<KeToanPage title="1.12 Mục tiêu / kế hoạch / kết quả theo công ty" />} />

            {/* ── Truyền thông ── */}
            <Route
              path="truyen-thong/nhan-su-360/thong-tin"
              element={<KeToanPage title="1.1 Thông tin nhân sự" />}
            />
            <Route
              path="truyen-thong/nhan-su-360/bmtcv-luong"
              element={<KeToanPage title="1.2 BMTCV và lương P3" />}
            />
            <Route
              path="truyen-thong/nhan-su-360/p3"
              element={<KeToanPage title="1.3 P3" />}
            />
            <Route
              path="truyen-thong/nhan-su-360/ke-hoach-nam"
              element={<KeToanPage title="1.4 Kế hoạch năm" />}
            />
            <Route
              path="truyen-thong/nhan-su-360/dao-tao"
              element={<KeToanPage title="1.5 Đào tạo" />}
            />
            <Route
              path="truyen-thong/nhan-su-360/bao-cao-ngay"
              element={<KeToanPage title="1.6 Báo cáo ngày" />}
            />
            <Route
              path="truyen-thong/nhan-su-360/ke-hoach-tuan"
              element={<KeToanPage title="1.7 Kế hoạch tuần" />}
            />
            <Route
              path="truyen-thong/nhan-su-360/ke-hoach-thang"
              element={<KeToanPage title="1.8 Kế hoạch tháng" />}
            />
            <Route
              path="truyen-thong/nhan-su-360/bao-cao-360"
              element={<KeToanPage title="1.9 Báo cáo 360" />}
            />
            <Route
              path="truyen-thong/chien-luoc/phan-tich-insight"
              element={<KeToanPage title="2.1 Phân tích Insight khách hàng" />}
            />
            <Route
              path="truyen-thong/chien-luoc/chien-luoc"
              element={<KeToanPage title="2.2 Chiến lược" />}
            />
            <Route
              path="truyen-thong/chien-luoc/chien-dich"
              element={<KeToanPage title="2.3 Chiến dịch" />}
            />
            <Route
              path="truyen-thong/chien-luoc/du-an"
              element={<KeToanPage title="2.4 Dự án" />}
            />
            <Route
              path="truyen-thong/chien-luoc/bao-cao-360"
              element={<KeToanPage title="2.5 Báo cáo 360" />}
            />
            <Route
              path="truyen-thong/nguyen-lieu/video"
              element={<KeToanPage title="3.1 Video" />}
            />
            <Route
              path="truyen-thong/nguyen-lieu/hinh-anh"
              element={<KeToanPage title="3.2 Hình ảnh" />}
            />
            <Route
              path="truyen-thong/nguyen-lieu/content"
              element={<KeToanPage title="3.3 Content" />}
            />
            <Route
              path="truyen-thong/nguyen-lieu/su-kien"
              element={<KeToanPage title="3.4 Sự kiện" />}
            />
            <Route
              path="truyen-thong/nguyen-lieu/tem-nhan"
              element={<KeToanPage title="3.5 Tem nhãn, bao bì" />}
            />
            <Route
              path="truyen-thong/nguyen-lieu/bao-cao-360"
              element={<KeToanPage title="3.6 Báo cáo 360" />}
            />
            <Route
              path="truyen-thong/cong-cu/kenh-truyen-thong"
              element={<KeToanPage title="4.1 Kênh truyền thông" />}
            />
            <Route
              path="truyen-thong/cong-cu/website-seo"
              element={<KeToanPage title="4.2 Website và SEO" />}
            />
            <Route
              path="truyen-thong/cong-cu/mang-xa-hoi"
              element={<KeToanPage title="4.3 Mạng xã hội" />}
            />
            <Route
              path="truyen-thong/cong-cu/zalo-oa"
              element={<KeToanPage title="4.4 Zalo OA" />}
            />
            <Route
              path="truyen-thong/cong-cu/email-marketing"
              element={<KeToanPage title="4.5 Email Marketing" />}
            />
            <Route
              path="truyen-thong/cong-cu/khach-hang-tiem-nang"
              element={<KeToanPage title="4.6 Khách hàng tiềm năng" />}
            />
            <Route
              path="truyen-thong/cong-cu/bao-cao-360"
              element={<KeToanPage title="4.7 Báo cáo 360" />}
            />
            <Route
              path="truyen-thong/thuong-hieu/thuong-hieu"
              element={<KeToanPage title="5.1 Thương hiệu" />}
            />
            <Route
              path="truyen-thong/thuong-hieu/bao-cao-360"
              element={<KeToanPage title="5.2 Báo cáo 360" />}
            />
            <Route
              path="truyen-thong/thiet-bi-dung-cu/quan-ly"
              element={<KeToanPage title="6.1 Quản lý thiết bị dụng cụ" />}
            />
            <Route
              path="truyen-thong/thiet-bi-dung-cu/bao-cao-360"
              element={<KeToanPage title="6.2 Báo cáo 360" />}
            />
            <Route
              path="truyen-thong/cai-dat-quan-tri"
              element={<KeToanPage title="Cài đặt quản trị" />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
