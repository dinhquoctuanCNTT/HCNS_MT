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

    <Route path="ban-hang" element={<KeToanPage title="Kế Toán Bán Hàng" />} />
    <Route path="mua-hang" element={<KeToanPage title="Kế Toán Mua Hàng" />} />
    <Route
      path="tong-hop"
      element={<KeToanPage title="Kế Toán Sổ Cái Tổng Hợp" />}
    />
    <Route path="kho" element={<KeToanPage title="Kế Toán Kho Hàng" />} />
    <Route
      path="bao-hiem"
      element={
        <KeToanPage title="Kết Nối Bảo Hiểm - Hóa Đơn Bảo Hiểm Điện Tử" />
      }
    />
    <Route path="cong-dong" element={<KeToanPage title="Cộng Đồng Hỗ Trợ" />} />
  </Route>,
  /* ── MTSHOP ── */
  <Route
    key="kt-mtshop"
    path="ke-toan/mtshop"
    element={<KeToanPage title="MTSHOP" />}
  />,
  <Route
    key="kt-mtshop-quy-trinh"
    path="ke-toan/mtshop/quy-trinh"
    element={<KeToanPage title="1. MTSHOP. Quy trình phòng kế toán" />}
  />,
  <Route
    key="kt-mtshop-quy-tien-mat"
    path="ke-toan/mtshop/quy-tien-mat"
    element={<KeToanPage title="2. MTSHOP. Quỹ tiền mặt và ngân hàng" />}
  />,
  <Route
    key="kt-mtshop-tong-hop"
    path="ke-toan/mtshop/tong-hop-chi-phi"
    element={<KeToanPage title="3. MTSHOP. Tổng hợp các chi phí" />}
  />,
  <Route
    key="kt-mtshop-cn-thu"
    path="ke-toan/mtshop/cong-no-phai-thu"
    element={<KeToanPage title="4. MTSHOP. Công nợ phải thu" />}
  />,
  <Route
    key="kt-mtshop-cn-tra"
    path="ke-toan/mtshop/cong-no-phai-tra"
    element={<KeToanPage title="5. MTSHOP. Công nợ phải trả" />}
  />,
  <Route
    key="kt-mtshop-kho"
    path="ke-toan/mtshop/kho-hang-hoa"
    element={<KeToanPage title="6. MTSHOP. Kho hàng hóa" />}
  />,
  <Route
    key="kt-mtshop-bc-tc"
    path="ke-toan/mtshop/bao-cao-tai-chinh"
    element={<KeToanPage title="7. MTSHOP. Báo cáo tài chính hàng tháng" />}
  />,
  <Route
    key="kt-mtshop-vat"
    path="ke-toan/mtshop/bao-cao-vat"
    element={<KeToanPage title="8. MTSHOP. Báo cáo VAT(NBo)" />}
  />,

  /* ── MTPSI ── */
  <Route
    key="kt-mtpsi"
    path="ke-toan/mtpsi"
    element={<KeToanPage title="MTPSI" />}
  />,
  <Route
    key="kt-mtpsi-quy-trinh"
    path="ke-toan/mtpsi/quy-trinh"
    element={<KeToanPage title="1. MTPSI. Quy trình phòng kế toán" />}
  />,
  <Route
    key="kt-mtpsi-quy-tien-mat"
    path="ke-toan/mtpsi/quy-tien-mat"
    element={<KeToanPage title="2. MTPSI. Quỹ tiền mặt và ngân hàng" />}
  />,
  <Route
    key="kt-mtpsi-tong-hop"
    path="ke-toan/mtpsi/tong-hop-chi-phi"
    element={<KeToanPage title="3. MTPSI. Tổng hợp các chi phí" />}
  />,
  <Route
    key="kt-mtpsi-cn-thu"
    path="ke-toan/mtpsi/cong-no-phai-thu"
    element={<KeToanPage title="4. MTPSI. Công nợ phải thu" />}
  />,
  <Route
    key="kt-mtpsi-cn-tra"
    path="ke-toan/mtpsi/cong-no-phai-tra"
    element={<KeToanPage title="5. MTPSI. Công nợ phải trả" />}
  />,
  <Route
    key="kt-mtpsi-kho"
    path="ke-toan/mtpsi/kho-hang-hoa"
    element={<KeToanPage title="6. MTPSI. Kho hàng hóa" />}
  />,
  <Route
    key="kt-mtpsi-bc-tc"
    path="ke-toan/mtpsi/bao-cao-tai-chinh"
    element={<KeToanPage title="7. MTPSI. Báo cáo tài chính hàng tháng" />}
  />,
  <Route
    key="kt-mtpsi-vat"
    path="ke-toan/mtpsi/bao-cao-vat"
    element={<KeToanPage title="8. MTPSI. Báo cáo VAT(NBo)" />}
  />,
  <Route
    key="kt-mtpsi-hop-dong"
    path="ke-toan/mtpsi/hop-dong-thi-cong"
    element={<KeToanPage title="9. MTPSI. Các mẫu hợp đồng thi công" />}
  />,
  <Route
    key="kt-mtpsi-theo-doi"
    path="ke-toan/mtpsi/theo-doi-cong-trinh"
    element={<KeToanPage title="10. MTPSI. Theo dõi các công trình" />}
  />,
  <Route
    key="kt-mtpsi-thue"
    path="ke-toan/mtpsi/thue"
    element={<KeToanPage title="11. MTPSI. Thuế" />}
  />,

  /* ── MTPARTS ── */
  <Route
    key="kt-mtparts"
    path="ke-toan/mtparts"
    element={<KeToanPage title="MTPARTS" />}
  />,
  <Route
    key="kt-mtparts-quy-trinh"
    path="ke-toan/mtparts/quy-trinh"
    element={<KeToanPage title="1. MTPARTS. Quy trình phòng kế toán" />}
  />,
  <Route
    key="kt-mtparts-quy-tien-mat"
    path="ke-toan/mtparts/quy-tien-mat"
    element={<KeToanPage title="2. MTPARTS. Quỹ tiền mặt và ngân hàng" />}
  />,
  <Route
    key="kt-mtparts-tong-hop"
    path="ke-toan/mtparts/tong-hop-chi-phi"
    element={<KeToanPage title="3. MTPARTS. Tổng hợp các chi phí" />}
  />,
  <Route
    key="kt-mtparts-cn-thu"
    path="ke-toan/mtparts/cong-no-phai-thu"
    element={<KeToanPage title="4. MTPARTS. Công nợ phải thu" />}
  />,
  <Route
    key="kt-mtparts-cn-tra"
    path="ke-toan/mtparts/cong-no-phai-tra"
    element={<KeToanPage title="5. MTPARTS. Công nợ phải trả" />}
  />,
  <Route
    key="kt-mtparts-kho"
    path="ke-toan/mtparts/kho-hang-hoa"
    element={<KeToanPage title="6. MTPARTS. Kho hàng hóa" />}
  />,
  <Route
    key="kt-mtparts-bc-tc"
    path="ke-toan/mtparts/bao-cao-tai-chinh"
    element={<KeToanPage title="7. MTPARTS. Báo cáo tài chính hàng tháng" />}
  />,
  <Route
    key="kt-mtparts-vat"
    path="ke-toan/mtparts/bao-cao-vat"
    element={<KeToanPage title="8. MTPARTS. Báo cáo VAT(NBo)" />}
  />,
  <Route
    key="kt-mtparts-thue"
    path="ke-toan/mtparts/thue"
    element={<KeToanPage title="9. MTPARTS. Thuế" />}
  />,

  /* ── MTH ── */
  <Route
    key="kt-mth"
    path="ke-toan/mth"
    element={<KeToanPage title="MTH Phòng kế toán" />}
  />,
  <Route
    key="kt-mth-tu-tai-lieu"
    path="ke-toan/mth/tu-tai-lieu"
    element={<KeToanPage title="1. MTH. Tủ tài liệu phòng kế toán" />}
  />,
  <Route
    key="kt-mth-dao-tao-kt"
    path="ke-toan/mth/dao-tao-kt"
    element={<KeToanPage title="2. MTH. Đào tạo KT" />}
  />,
  <Route
    key="kt-mth-cong-viec-ktv"
    path="ke-toan/mth/cong-viec-ktv"
    element={<KeToanPage title="3. MTH. Công việc của kế toán viên" />}
  />,
  <Route
    key="kt-mth-tai-lieu-dao-tao"
    path="ke-toan/mth/tai-lieu-dao-tao"
    element={<KeToanPage title="4. MTH. Tài liệu đào tạo KTBH và Kho" />}
  />,
  <Route
    key="kt-mth-hop-giao-ban"
    path="ke-toan/mth/hop-giao-ban"
    element={<KeToanPage title="MTH. Họp giao ban" />}
  />,

  /* ── MT Paint ── */
  <Route
    key="kt-mt-paint"
    path="ke-toan/mt-paint"
    element={<KeToanPage title="MT Paint" />}
  />,
  <Route
    key="kt-paint-quy-trinh"
    path="ke-toan/mt-paint/quy-trinh"
    element={<KeToanPage title="1. MT Paint. Quy trình phòng kế toán" />}
  />,
  <Route
    key="kt-paint-quy-tien-mat"
    path="ke-toan/mt-paint/quy-tien-mat"
    element={<KeToanPage title="2. MT Paint. Quỹ tiền mặt và chuyển khoản" />}
  />,
  <Route
    key="kt-paint-tong-hop"
    path="ke-toan/mt-paint/tong-hop-chi-phi"
    element={<KeToanPage title="3. MT Paint. Tổng hợp các chi phí" />}
  />,
  <Route
    key="kt-paint-cn-thu"
    path="ke-toan/mt-paint/cong-no-phai-thu"
    element={<KeToanPage title="5. MT Paint. Công nợ phải thu" />}
  />,
  <Route
    key="kt-paint-kho-pha-le"
    path="ke-toan/mt-paint/kho-pha-le"
    element={<KeToanPage title="6. MT Paint. Kho pha lẻ" />}
  />,
  <Route
    key="kt-paint-bc-tc"
    path="ke-toan/mt-paint/bao-cao-tai-chinh"
    element={<KeToanPage title="7. MT Paint. Báo cáo tài chính hàng tháng" />}
  />,
  <Route
    key="kt-paint-kho"
    path="ke-toan/mt-paint/kho-hang-hoa"
    element={<KeToanPage title="8. MT Paint. Kho hàng hóa" />}
  />,
  <Route
    key="kt-paint-hoa-don-vat"
    path="ke-toan/mt-paint/hoa-don-vat"
    element={<KeToanPage title="9. MT Paint. Hóa đơn VAT" />}
  />,
  <Route
    key="kt-paint-cn-trong-nuoc"
    path="ke-toan/mt-paint/cong-no-trong-nuoc"
    element={<KeToanPage title="10. MT Paint. Công nợ phải trả trong nước" />}
  />,
  <Route
    key="kt-paint-cn-nuoc-ngoai"
    path="ke-toan/mt-paint/cong-no-nuoc-ngoai"
    element={<KeToanPage title="11. MT Paint. Công nợ phải trả nước ngoài" />}
  />,
  <Route
    key="kt-paint-ngan-sach"
    path="ke-toan/mt-paint/ngan-sach"
    element={<KeToanPage title="12. MT Paint. Ngân sách" />}
  />,
  <Route
    key="kt-paint-bao-cao-bi"
    path="ke-toan/mt-paint/bao-cao-bi"
    element={<KeToanPage title="13. MT Paint. Học làm báo cáo BI" />}
  />,
  <Route
    key="kt-paint-hang-hu-hong"
    path="ke-toan/mt-paint/hang-hu-hong"
    element={<KeToanPage title="14. MT Paint. Hồ sơ hàng hư hỏng hàng năm" />}
  />,
  <Route
    key="kt-paint-du-lieu-pm"
    path="ke-toan/mt-paint/du-lieu-pm"
    element={<KeToanPage title="15. MT Paint. Dữ liệu pm" />}
  />,
  <Route
    key="kt-paint-thue"
    path="ke-toan/mt-paint/thue"
    element={<KeToanPage title="16. Thuế MT Paint" />}
  />,
  <Route
    key="kt-paint-doi-chieu"
    path="ke-toan/mt-paint/doi-chieu-136-336"
    element={<KeToanPage title="17. MT Paint. Báo cáo đối chiếu 136 và 336" />}
  />,

  /* ── MHM ── */
  <Route
    key="kt-mhm-quy-trinh"
    path="ke-toan/mhm/quy-trinh"
    element={<KeToanPage title="1. MHM. Quy trình phòng kế toán" />}
  />,
  <Route
    key="kt-mhm-quy-tien-mat"
    path="ke-toan/mhm/quy-tien-mat"
    element={<KeToanPage title="2. MHM. Quỹ tiền mặt và ngân hàng" />}
  />,
  <Route
    key="kt-mhm-cn-thu"
    path="ke-toan/mhm/cong-no-phai-thu"
    element={<KeToanPage title="3. MHM. Công nợ phải thu" />}
  />,
  <Route
    key="kt-mhm-cn-tra"
    path="ke-toan/mhm/cong-no-phai-tra"
    element={<KeToanPage title="4. MHM. Công nợ phải trả" />}
  />,
  <Route
    key="kt-mhm-chi-phi-cc"
    path="ke-toan/mhm/chi-phi-cong-cu"
    element={<KeToanPage title="5. MHM. Chi phí đầu tư thiết bị công cụ" />}
  />,
  <Route
    key="kt-mhm-chi-phi-kd"
    path="ke-toan/mhm/chi-phi-kinh-doanh"
    element={<KeToanPage title="6. MHM. Chi phí kinh doanh" />}
  />,
  <Route
    key="kt-mhm-chi-phi-sx"
    path="ke-toan/mhm/chi-phi-san-xuat"
    element={<KeToanPage title="7. MHM. Chi phí sản xuất" />}
  />,
  <Route
    key="kt-mhm-chi-phi-vh"
    path="ke-toan/mhm/chi-phi-van-hanh"
    element={<KeToanPage title="8. MHM. Chi phí vận hành" />}
  />,
  <Route
    key="kt-mhm-kho"
    path="ke-toan/mhm/kho"
    element={<KeToanPage title="9. MHM. Kho" />}
  />,
  <Route
    key="kt-mhm-bc-thue"
    path="ke-toan/mhm/bao-cao-thue"
    element={<KeToanPage title="10. MHM. Báo cáo thuế" />}
  />,
  <Route
    key="kt-mhm-hoa-don"
    path="ke-toan/mhm/hoa-don"
    element={<KeToanPage title="11. MHM. Hóa đơn đầu vào và đầu ra" />}
  />,
  <Route
    key="kt-mhm-bc-tc"
    path="ke-toan/mhm/bao-cao-tai-chinh"
    element={<KeToanPage title="12. MHM. Báo cáo tài chính hàng tháng" />}
  />,
  <Route
    key="kt-mhm-ke-hoach-bh"
    path="ke-toan/mhm/ke-hoach-ban-hang"
    element={<KeToanPage title="13. MHM. Kế hoạch bán hàng" />}
  />,
  <Route
    key="kt-mhm-theo-doi-boc-tach"
    path="ke-toan/mhm/theo-doi-boc-tach"
    element={<KeToanPage title="14. MHM. Theo dõi khác - bóc tách chi phí" />}
  />,
  <Route
    key="kt-mhm-tinh-gia-von"
    path="ke-toan/mhm/tinh-gia-von"
    element={<KeToanPage title="15. MHM. Tính giá vốn MHM" />}
  />,
  <Route
    key="kt-mhm-thue"
    path="ke-toan/mhm/thue"
    element={<KeToanPage title="16. MHM. Thuế" />}
  />,

  /* ── Báo cáo tổng hợp ── */
  <Route
    key="kt-bc-hop-nhat"
    path="ke-toan/bc-hop-nhat"
    element={<KeToanPage title="BC hợp nhất MT Holdings" />}
  />,
  <Route
    key="kt-bao-cao-360"
    path="ke-toan/bao-cao-360"
    element={<KeToanPage title="Báo cáo 360" />}
  />,
];

export default keToanRoutes;
