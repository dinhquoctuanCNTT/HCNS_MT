import { Route, Navigate, Outlet } from "react-router-dom";
import KeToanPage from "@modules/ke-toan/pages/KeToanPage";
import KeToanDashboardPage from "@modules/ke-toan/pages/KeToanDashboardPage";
import KeToanLayout from "@modules/ke-toan/components/Layout";
import BaoCaoPage from "@modules/ke-toan/pages/BaoCao";

const KeToanLayoutWrapper = () => (
  <KeToanLayout>
    <Outlet />
  </KeToanLayout>
);

const keToanRoutes = [
  <Route
    key="kt-tc-redirect"
    path="ke-toan-tc"
    element={<Navigate to="/admin/ke-toan/dashboard" replace />}
  />,

  <Route key="kt-layout-group" path="ke-toan" element={<KeToanLayoutWrapper />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<KeToanDashboardPage />} />
    <Route path="bao-cao" element={<BaoCaoPage />} />
    <Route path="ban-hang"  element={<KeToanPage title="Kế Toán Bán Hàng" />} />
    <Route path="mua-hang"  element={<KeToanPage title="Kế Toán Mua Hàng" />} />
    <Route path="tong-hop"  element={<KeToanPage title="Kế Toán Sổ Cái Tổng Hợp" />} />
    <Route path="kho"       element={<KeToanPage title="Kế Toán Kho Hàng" />} />
    <Route path="bao-hiem"  element={<KeToanPage title="Kết Nối Bảo Hiểm - Hóa Đơn Bảo Hiểm Điện Tử" />} />
    <Route path="cong-dong" element={<KeToanPage title="Cộng Đồng Hỗ Trợ" />} />

    {/* ── MTSHOP ── */}
    <Route path="mtshop" element={<KeToanPage title="MTSHOP" />} />
    <Route path="mtshop/quy-trinh"        element={<KeToanPage title="1. MTSHOP. Quy trình phòng kế toán" />} />
    <Route path="mtshop/quy-tien-mat"     element={<KeToanPage title="2. MTSHOP. Quỹ tiền mặt và ngân hàng" />} />
    <Route path="mtshop/tong-hop-chi-phi" element={<KeToanPage title="3. MTSHOP. Tổng hợp các chi phí" />} />
    <Route path="mtshop/cong-no-phai-thu" element={<KeToanPage title="4. MTSHOP. Công nợ phải thu" />} />
    <Route path="mtshop/cong-no-phai-tra" element={<KeToanPage title="5. MTSHOP. Công nợ phải trả" />} />
    <Route path="mtshop/kho-hang-hoa"     element={<KeToanPage title="6. MTSHOP. Kho hàng hóa" />} />
    <Route path="mtshop/bao-cao-tai-chinh"element={<KeToanPage title="7. MTSHOP. Báo cáo tài chính hàng tháng" />} />
    <Route path="mtshop/bao-cao-vat"      element={<KeToanPage title="8. MTSHOP. Báo cáo VAT(NBo)" />} />

    {/* ── MTPSI ── */}
    <Route path="mtpsi" element={<KeToanPage title="MTPSI" />} />
    <Route path="mtpsi/quy-trinh"         element={<KeToanPage title="1. MTPSI. Quy trình phòng kế toán" />} />
    <Route path="mtpsi/quy-tien-mat"      element={<KeToanPage title="2. MTPSI. Quỹ tiền mặt và ngân hàng" />} />
    <Route path="mtpsi/tong-hop-chi-phi"  element={<KeToanPage title="3. MTPSI. Tổng hợp các chi phí" />} />
    <Route path="mtpsi/cong-no-phai-thu"  element={<KeToanPage title="4. MTPSI. Công nợ phải thu" />} />
    <Route path="mtpsi/cong-no-phai-tra"  element={<KeToanPage title="5. MTPSI. Công nợ phải trả" />} />
    <Route path="mtpsi/kho-hang-hoa"      element={<KeToanPage title="6. MTPSI. Kho hàng hóa" />} />
    <Route path="mtpsi/bao-cao-tai-chinh" element={<KeToanPage title="7. MTPSI. Báo cáo tài chính hàng tháng" />} />
    <Route path="mtpsi/bao-cao-vat"       element={<KeToanPage title="8. MTPSI. Báo cáo VAT(NBo)" />} />
    <Route path="mtpsi/hop-dong-thi-cong" element={<KeToanPage title="9. MTPSI. Các mẫu hợp đồng thi công" />} />
    <Route path="mtpsi/theo-doi-cong-trinh" element={<KeToanPage title="10. MTPSI. Theo dõi các công trình" />} />
    <Route path="mtpsi/thue"              element={<KeToanPage title="11. MTPSI. Thuế" />} />

    {/* ── MTPARTS ── */}
    <Route path="mtparts" element={<KeToanPage title="MTPARTS" />} />
    <Route path="mtparts/quy-trinh"        element={<KeToanPage title="1. MTPARTS. Quy trình phòng kế toán" />} />
    <Route path="mtparts/quy-tien-mat"     element={<KeToanPage title="2. MTPARTS. Quỹ tiền mặt và ngân hàng" />} />
    <Route path="mtparts/tong-hop-chi-phi" element={<KeToanPage title="3. MTPARTS. Tổng hợp các chi phí" />} />
    <Route path="mtparts/cong-no-phai-thu" element={<KeToanPage title="4. MTPARTS. Công nợ phải thu" />} />
    <Route path="mtparts/cong-no-phai-tra" element={<KeToanPage title="5. MTPARTS. Công nợ phải trả" />} />
    <Route path="mtparts/kho-hang-hoa"     element={<KeToanPage title="6. MTPARTS. Kho hàng hóa" />} />
    <Route path="mtparts/bao-cao-tai-chinh"element={<KeToanPage title="7. MTPARTS. Báo cáo tài chính hàng tháng" />} />
    <Route path="mtparts/bao-cao-vat"      element={<KeToanPage title="8. MTPARTS. Báo cáo VAT(NBo)" />} />
    <Route path="mtparts/thue"             element={<KeToanPage title="9. MTPARTS. Thuế" />} />

    {/* ── MTH ── */}
    <Route path="mth" element={<KeToanPage title="MTH Phòng kế toán" />} />
    <Route path="mth/tu-tai-lieu"      element={<KeToanPage title="1. MTH. Tủ tài liệu phòng kế toán" />} />
    <Route path="mth/dao-tao-kt"       element={<KeToanPage title="2. MTH. Đào tạo KT" />} />
    <Route path="mth/cong-viec-ktv"    element={<KeToanPage title="3. MTH. Công việc của kế toán viên" />} />
    <Route path="mth/tai-lieu-dao-tao" element={<KeToanPage title="4. MTH. Tài liệu đào tạo KTBH và Kho" />} />
    <Route path="mth/hop-giao-ban"     element={<KeToanPage title="MTH. Họp giao ban" />} />

    {/* ── MT Paint ── */}
    <Route path="mt-paint" element={<KeToanPage title="MT Paint" />} />
    <Route path="mt-paint/quy-trinh"          element={<KeToanPage title="1. MT Paint. Quy trình phòng kế toán" />} />
    <Route path="mt-paint/quy-tien-mat"       element={<KeToanPage title="2. MT Paint. Quỹ tiền mặt và chuyển khoản" />} />
    <Route path="mt-paint/tong-hop-chi-phi"   element={<KeToanPage title="3. MT Paint. Tổng hợp các chi phí" />} />
    <Route path="mt-paint/cong-no-phai-thu"   element={<KeToanPage title="5. MT Paint. Công nợ phải thu" />} />
    <Route path="mt-paint/kho-pha-le"         element={<KeToanPage title="6. MT Paint. Kho pha lẻ" />} />
    <Route path="mt-paint/bao-cao-tai-chinh"  element={<KeToanPage title="7. MT Paint. Báo cáo tài chính hàng tháng" />} />
    <Route path="mt-paint/kho-hang-hoa"       element={<KeToanPage title="8. MT Paint. Kho hàng hóa" />} />
    <Route path="mt-paint/hoa-don-vat"        element={<KeToanPage title="9. MT Paint. Hóa đơn VAT" />} />
    <Route path="mt-paint/cong-no-trong-nuoc" element={<KeToanPage title="10. MT Paint. Công nợ phải trả trong nước" />} />
    <Route path="mt-paint/cong-no-nuoc-ngoai" element={<KeToanPage title="11. MT Paint. Công nợ phải trả nước ngoài" />} />
    <Route path="mt-paint/ngan-sach"          element={<KeToanPage title="12. MT Paint. Ngân sách" />} />
    <Route path="mt-paint/bao-cao-bi"         element={<KeToanPage title="13. MT Paint. Học làm báo cáo BI" />} />
    <Route path="mt-paint/hang-hu-hong"       element={<KeToanPage title="14. MT Paint. Hồ sơ hàng hư hỏng hàng năm" />} />
    <Route path="mt-paint/du-lieu-pm"         element={<KeToanPage title="15. MT Paint. Dữ liệu pm" />} />
    <Route path="mt-paint/thue"               element={<KeToanPage title="16. Thuế MT Paint" />} />
    <Route path="mt-paint/doi-chieu-136-336"  element={<KeToanPage title="17. MT Paint. Báo cáo đối chiếu 136 và 336" />} />

    {/* ── MHM ── */}
    <Route path="mhm/quy-trinh"          element={<KeToanPage title="1. MHM. Quy trình phòng kế toán" />} />
    <Route path="mhm/quy-tien-mat"       element={<KeToanPage title="2. MHM. Quỹ tiền mặt và ngân hàng" />} />
    <Route path="mhm/cong-no-phai-thu"   element={<KeToanPage title="3. MHM. Công nợ phải thu" />} />
    <Route path="mhm/cong-no-phai-tra"   element={<KeToanPage title="4. MHM. Công nợ phải trả" />} />
    <Route path="mhm/chi-phi-cong-cu"    element={<KeToanPage title="5. MHM. Chi phí đầu tư thiết bị công cụ" />} />
    <Route path="mhm/chi-phi-kinh-doanh" element={<KeToanPage title="6. MHM. Chi phí kinh doanh" />} />
    <Route path="mhm/chi-phi-san-xuat"   element={<KeToanPage title="7. MHM. Chi phí sản xuất" />} />
    <Route path="mhm/chi-phi-van-hanh"   element={<KeToanPage title="8. MHM. Chi phí vận hành" />} />
    <Route path="mhm/kho"                element={<KeToanPage title="9. MHM. Kho" />} />
    <Route path="mhm/bao-cao-thue"       element={<KeToanPage title="10. MHM. Báo cáo thuế" />} />
    <Route path="mhm/hoa-don"            element={<KeToanPage title="11. MHM. Hóa đơn đầu vào và đầu ra" />} />
    <Route path="mhm/bao-cao-tai-chinh"  element={<KeToanPage title="12. MHM. Báo cáo tài chính hàng tháng" />} />
    <Route path="mhm/ke-hoach-ban-hang"  element={<KeToanPage title="13. MHM. Kế hoạch bán hàng" />} />
    <Route path="mhm/theo-doi-boc-tach"  element={<KeToanPage title="14. MHM. Theo dõi khác - bóc tách chi phí" />} />
    <Route path="mhm/tinh-gia-von"       element={<KeToanPage title="15. MHM. Tính giá vốn MHM" />} />
    <Route path="mhm/thue"               element={<KeToanPage title="16. MHM. Thuế" />} />

    {/* ── Báo cáo tổng hợp ── */}
    <Route path="bc-hop-nhat"  element={<KeToanPage title="BC hợp nhất MT Holdings" />} />
    <Route path="bao-cao-360"  element={<KeToanPage title="Báo cáo 360" />} />
  </Route>,
];

export default keToanRoutes;
