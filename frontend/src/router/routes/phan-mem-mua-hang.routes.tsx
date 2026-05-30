import { Route, Navigate, Outlet } from "react-router-dom";
import KeToanPage from "@modules/ke-toan/pages/KeToanPage";
import PhanMemMuaHangLayout from "@modules/phan-mem-mua-hang/components/Layout";

const PhanMemMuaHangLayoutWrapper = () => (
  <PhanMemMuaHangLayout>
    <Outlet />
  </PhanMemMuaHangLayout>
);

const phanMemMuaHangRoutes = [
  <Route key="pmm-layout-group" path="phan-mem-mua-hang" element={<PhanMemMuaHangLayoutWrapper />}>
    <Route index element={<Navigate to="ncc/thong-tin" replace />} />

    {/* 1. Nhà cung cấp */}
    <Route path="ncc/thong-tin" element={<KeToanPage title="1.1. Thông tin nhà cung cấp" />} />
    <Route path="ncc/danh-gia"  element={<KeToanPage title="1.2. Đánh giá NCC" />} />

    {/* 2. Nhân sự */}
    <Route path="nhan-su/thong-tin"       element={<KeToanPage title="2.1. Thông tin nhân sự" />} />
    <Route path="nhan-su/bmtcv-thuong"    element={<KeToanPage title="2.2. BMTCV + thưởng P3" />} />
    <Route path="nhan-su/he-thong-bc"     element={<KeToanPage title="2.3. Hệ thống Báo cáo" />} />
    <Route path="nhan-su/chien-luoc"      element={<KeToanPage title="2.4. Chiến lược, mục tiêu phòng mua hàng" />} />
    <Route path="nhan-su/cl-muc-tieu-nam" element={<KeToanPage title="2.4.0. Chiến lược, mục tiêu năm" />} />
    <Route path="nhan-su/ke-hoach-nam"    element={<KeToanPage title="2.4.1. Kế hoạch, hành động năm" />} />
    <Route path="nhan-su/p3-nam"          element={<KeToanPage title="2.4.2. P3 năm" />} />
    <Route path="nhan-su/dao-tao"         element={<KeToanPage title="2.5. Đào tạo" />} />
    <Route path="nhan-su/s5"              element={<KeToanPage title="2.6. S5" />} />

    {/* 3. Sản phẩm */}
    <Route path="san-pham/ke-hoach-sp-moi" element={<KeToanPage title="3.1. Kế hoạch triển khai sản phẩm mới" />} />
    <Route path="san-pham/bang-gia-von"    element={<KeToanPage title="3.2. Bảng giá vốn lợi nhuận" />} />
    <Route path="san-pham/thong-tin-sp"    element={<KeToanPage title="3.3. Thông tin sản phẩm" />} />
    <Route path="san-pham/top-ban-nhieu"   element={<KeToanPage title="3.4. Top sản phẩm bán nhiều đột biến" />} />
    <Route path="san-pham/top-ban-cham"    element={<KeToanPage title="3.5. Top sản phẩm bán chậm" />} />
    <Route path="san-pham/canh-bao-kho"    element={<KeToanPage title="3.6. Cảnh báo hàng tồn kho cần date" />} />

    {/* 4. Đặt hàng */}
    <Route path="dat-hang/ke-hoach-nam"   element={<KeToanPage title="4.1. Kế hoạch đặt hàng theo năm" />} />
    <Route path="dat-hang/ke-hoach-thang" element={<KeToanPage title="4.2. Kế hoạch đặt hàng theo tháng" />} />
    <Route path="dat-hang/theo-doi-don"   element={<KeToanPage title="4.3. Theo dõi đơn đặt hàng" />} />
    <Route path="dat-hang/giam-gia-ncc"   element={<KeToanPage title="4.4. Giảm giá mua từ NCC" />} />
    <Route path="dat-hang/khieu-nai"      element={<KeToanPage title="4.5. Khiếu nại đơn hàng" />} />

    {/* 5. Thanh toán */}
    <Route path="thanh-toan/ke-hoach-ncc" element={<KeToanPage title="5.1. Kế hoạch thanh toán NCC" />} />
    <Route path="thanh-toan/cong-no"      element={<KeToanPage title="5.2. Đảm bảo thanh toán công nợ" />} />

    {/* 6-7 */}
    <Route path="chi-phi" element={<KeToanPage title="6. Chi phí mua hàng" />} />
    <Route path="ty-gia"  element={<KeToanPage title="7. Tỷ giá ngoại tệ biến thiên" />} />
  </Route>,
];

export default phanMemMuaHangRoutes;
