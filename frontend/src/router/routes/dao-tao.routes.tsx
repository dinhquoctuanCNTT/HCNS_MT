import { Route, Navigate, Outlet } from "react-router-dom";
import KeToanPage from "@modules/ke-toan/pages/KeToanPage";
import DaoTaoLayout from "@modules/dao-tao/components/Layout";

const DaoTaoLayoutWrapper = () => (
  <DaoTaoLayout>
    <Outlet />
  </DaoTaoLayout>
);

const daoTaoRoutes = [
  <Route key="dt-layout-group" path="dao-tao" element={<DaoTaoLayoutWrapper />}>
    <Route index element={<Navigate to="so-do-to-chuc/he-sinh-thai" replace />} />

    {/* 1. Sơ đồ tổ chức */}
    <Route path="so-do-to-chuc/he-sinh-thai"   element={<KeToanPage title="1.1. Hệ sinh thái MTH" />} />
    <Route path="so-do-to-chuc/danh-muc-cty"   element={<KeToanPage title="1.2. Danh mục công ty, chi nhánh, phòng ban, chức vụ" />} />
    <Route path="so-do-to-chuc/ho-so-nang-luc" element={<KeToanPage title="1.3. Hồ sơ năng lực các công ty" />} />
    <Route path="so-do-to-chuc/chuc-nang-pb"   element={<KeToanPage title="1.4. Chức năng nhiệm vụ phòng ban" />} />

    {/* 2. Nhân sự 360 */}
    <Route path="nhan-su-360/danh-sach"      element={<KeToanPage title="2.1. Danh sách nhân sự" />} />
    <Route path="nhan-su-360/bmtcv-kpi"      element={<KeToanPage title="2.2. BMTCV + KPI" />} />
    <Route path="nhan-su-360/khung-nang-luc" element={<KeToanPage title="2.3. Khung năng lực" />} />
    <Route path="nhan-su-360/lo-trinh"       element={<KeToanPage title="2.4. Lộ trình phát triển" />} />

    {/* 3. Quy trình, biểu mẫu */}
    <Route path="quy-trinh/quy-trinh-chung"    element={<KeToanPage title="1. Quy trình chung PĐT" />} />
    <Route path="quy-trinh/bien-ban-hop"        element={<KeToanPage title="Biên bản họp hàng tháng" />} />
    <Route path="quy-trinh/ke-hoach-tuan-thang" element={<KeToanPage title="2. Kế hoạch tuần/tháng PĐT" />} />
    <Route path="quy-trinh/bao-cao-ngay"        element={<KeToanPage title="3. Báo cáo ngày/tuần/tháng" />} />
    <Route path="quy-trinh/bao-cao-hoat-dong"   element={<KeToanPage title="4. Báo cáo tháng về hoạt động đào tạo" />} />
    <Route path="quy-trinh/giay-to-hc"          element={<KeToanPage title="5. Giấy tờ hành chính" />} />

    {/* 4. Quản lý tài liệu */}
    <Route path="tai-lieu/mth"         element={<KeToanPage title="1. MTH" />} />
    <Route path="tai-lieu/mtpaints"    element={<KeToanPage title="2. MTPaints" />} />
    <Route path="tai-lieu/mhm"         element={<KeToanPage title="3. MHM" />} />
    <Route path="tai-lieu/mtparts"     element={<KeToanPage title="4. MTparts" />} />
    <Route path="tai-lieu/mtshop"      element={<KeToanPage title="5. MTShop" />} />
    <Route path="tai-lieu/mtpsi"       element={<KeToanPage title="6. MTPSI" />} />
    <Route path="tai-lieu/mteducation" element={<KeToanPage title="7. MTEducation" />} />
    <Route path="tai-lieu/mtsoft"      element={<KeToanPage title="8. MTSoft" />} />

    {/* 5. Hoạt động đào tạo */}
    <Route path="hoat-dong/chuong-trinh"     element={<KeToanPage title="1. Chương trình đào tạo theo công ty, phòng ban" />} />
    <Route path="hoat-dong/nhu-cau"          element={<KeToanPage title="Nhu cầu đào tạo toàn hệ thống" />} />
    <Route path="hoat-dong/ke-hoach"         element={<KeToanPage title="Kế hoạch, lịch đào tạo trong tháng" />} />
    <Route path="hoat-dong/hoi-nhap"         element={<KeToanPage title="2. Đào tạo hội nhập" />} />
    <Route path="hoat-dong/chuyen-mon"       element={<KeToanPage title="3. Đào tạo chuyên môn" />} />
    <Route path="hoat-dong/nang-cao"         element={<KeToanPage title="4. Đào tạo nâng cao (theo khung năng lực)" />} />
    <Route path="hoat-dong/thue-ngoai"       element={<KeToanPage title="5. Đào tạo thuê ngoài" />} />
    <Route path="hoat-dong/san-pham-moi"     element={<KeToanPage title="6. Đào tạo sản phẩm mới" />} />
    <Route path="hoat-dong/nhac-lai"         element={<KeToanPage title="7. Đào tạo nhắc lại" />} />
    <Route path="hoat-dong/bao-cao-tong-hop" element={<KeToanPage title="8. Báo cáo tổng hợp" />} />

    {/* 6. Đánh giá / kết quả */}
    <Route path="danh-gia/ket-qua-toan-he-thong" element={<KeToanPage title="1. Kết quả đào tạo toàn hệ thống" />} />
    <Route path="danh-gia/khao-sat"               element={<KeToanPage title="2. Khảo sát sau đào tạo" />} />
    <Route path="danh-gia/tong-hop-phan-tich"     element={<KeToanPage title="3. Tổng hợp, phân tích kết quả đào tạo" />} />

    {/* 7. MTH - Đào tạo liên kết */}
    <Route path="lien-ket/oem"               element={<KeToanPage title="1. OEM" />} />
    <Route path="lien-ket/truong"            element={<KeToanPage title="2. Trường" />} />
    <Route path="lien-ket/hoi-thi-tay-nghe" element={<KeToanPage title="3. Hội thi tay nghề" />} />
  </Route>,
];

export default daoTaoRoutes;
