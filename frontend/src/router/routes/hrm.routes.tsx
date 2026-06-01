import { Route, Navigate } from "react-router-dom";
import ChamCongPage from "@modules/hrm/pages/ChamCongPage";
import CaLamViecPage from "@modules/hrm/pages/CaLamViecPage";
import LichSuChamCongPage from "@modules/hrm/pages/LichSuChamCongPage";
import PheDuyetGiaiTrinhPage from "@modules/hrm/pages/PheDuyetGiaiTrinhPage";
import NhanVienPage from "@modules/hrm/pages/Nhanvienpage";
import NgayLePage from "@modules/hrm/pages/NgayLePage";
import NgayPhepPage from "@modules/hrm/pages/NgayPhepPage";
import LamThemGioPage from "@modules/hrm/pages/LamThemGioPage";
import KeToanPage from "@modules/ke-toan/pages/KeToanPage";

// Routes dùng như children — KHÔNG có layout wrapper ở đây
// Layout được bọc ở AppRouter cùng với workflowRoutes
const hrmRoutes = [
  <Route key="hrm-nhansu" path="nhan-su">
    <Route index element={<Navigate to="cham-cong" replace />} />

    {/* 14. Chấm công */}
    <Route path="cham-cong"   element={<ChamCongPage />} />
    <Route path="ca-lam-viec" element={<CaLamViecPage />} />
    <Route path="nhan-vien"   element={<NhanVienPage />} />
    <Route path="lich-su"     element={<LichSuChamCongPage />} />

    {/* Đơn từ */}
    <Route path="ngay-le"            element={<NgayLePage />} />
    <Route path="nghi-phep"          element={<NgayPhepPage />} />
    <Route path="lam-them-gio"       element={<LamThemGioPage />} />
    <Route path="phe-duyet"          element={<PheDuyetGiaiTrinhPage />} />
    <Route path="cai-tien"           element={<KeToanPage title="13.3 Cải tiến" />} />
    <Route path="dao-tao-nang-cao"   element={<KeToanPage title="13.4 Đào tạo nâng cao" />} />

    {/* 10. Công việc */}
    <Route path="cong-viec/muc-tieu-nam"   element={<KeToanPage title="10.1 Mục tiêu năm" />} />
    <Route path="cong-viec/muc-tieu-quy"   element={<KeToanPage title="10.2 Mục tiêu quý" />} />
    <Route path="cong-viec/muc-tieu-thang" element={<KeToanPage title="10.3 Mục tiêu tháng" />} />
    <Route path="cong-viec/muc-tieu-tuan"  element={<KeToanPage title="10.4 Mục tiêu tuần" />} />

    {/* 11. Báo cáo */}
    <Route path="bao-cao/ngay"         element={<KeToanPage title="11.1 Báo cáo ngày" />} />
    <Route path="bao-cao/tuan"         element={<KeToanPage title="11.2 Báo cáo tuần" />} />
    <Route path="bao-cao/thang"        element={<KeToanPage title="11.3 Báo cáo tháng" />} />
    <Route path="bao-cao/hop-giao-ban" element={<KeToanPage title="11.4 Báo cáo họp giao ban" />} />

    {/* Các mục khác */}
    <Route path="tai-khoan"              element={<KeToanPage title="1. Thông tin tài khoản" />} />
    <Route path="hoa-nhap/he-sinh-thai"  element={<KeToanPage title="2.1 Hệ sinh thái" />} />
    <Route path="hoa-nhap/so-do"         element={<KeToanPage title="2.2 Sơ đồ tổ chức" />} />
    <Route path="driver/cau-truc"        element={<KeToanPage title="3. Dữ liệu Driver" />} />
    <Route path="phuc-loi/8-3"           element={<KeToanPage title="4.1 Ngày 8/3" />} />
    <Route path="phuc-loi/20-10"         element={<KeToanPage title="4.2 Ngày 20/10" />} />
    <Route path="phuc-loi/tet"           element={<KeToanPage title="4.3 Tết Nguyên Đán" />} />
    <Route path="bmtcv/danh-sach"        element={<KeToanPage title="5. Bảng mô tả CV & kỹ năng" />} />
    <Route path="luong-3p/p1"            element={<KeToanPage title="6.1 Cấu trúc lương P1" />} />
    <Route path="luong-3p/p2"            element={<KeToanPage title="6.2 Cấu trúc lương P2" />} />
    <Route path="luong-3p/p3"            element={<KeToanPage title="6.3 Cấu trúc lương P3" />} />
    <Route path="lo-trinh/thu-viec"      element={<KeToanPage title="7. Lộ trình phát triển" />} />
    <Route path="ban-tin/ngoai-cty"      element={<KeToanPage title="8. Bản tin nội bộ" />} />
    <Route path="lich/nam"               element={<KeToanPage title="9.1 Lịch năm" />} />
    <Route path="lich/thang"             element={<KeToanPage title="9.2 Lịch tháng" />} />
    <Route path="luong-thuong"           element={<KeToanPage title="12. Lương thưởng" />} />
    <Route path="dinh-tuyen"             element={<KeToanPage title="15. Định tuyến" />} />
  </Route>,

  <Route key="hrm-redirect" path="hrm" element={<Navigate to="/admin/nhan-su/cham-cong" replace />} />,
];

export default hrmRoutes;
