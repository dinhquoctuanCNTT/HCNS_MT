import { Route } from "react-router-dom";
import KeToanPage from "@modules/ke-toan/pages/KeToanPage";

const phanMemMuaHangRoutes = [
  /* 1. Nhà cung cấp */
  <Route key="pmm-ncc-tt"  path="phan-mem-mua-hang/ncc/thong-tin" element={<KeToanPage title="1.1. Thông tin nhà cung cấp" />} />,
  <Route key="pmm-ncc-dg"  path="phan-mem-mua-hang/ncc/danh-gia"  element={<KeToanPage title="1.2. Đánh giá NCC" />} />,

  /* 2. Nhân sự */
  <Route key="pmm-ns-tt"    path="phan-mem-mua-hang/nhan-su/thong-tin"       element={<KeToanPage title="2.1. Thông tin nhân sự" />} />,
  <Route key="pmm-ns-bmt"   path="phan-mem-mua-hang/nhan-su/bmtcv-thuong"    element={<KeToanPage title="2.2. BMTCV + thưởng P3" />} />,
  <Route key="pmm-ns-htbc"  path="phan-mem-mua-hang/nhan-su/he-thong-bc"     element={<KeToanPage title="2.3. Hệ thống Báo cáo" />} />,
  <Route key="pmm-ns-cl"    path="phan-mem-mua-hang/nhan-su/chien-luoc"      element={<KeToanPage title="2.4. Chiến lược, mục tiêu phòng mua hàng" />} />,
  <Route key="pmm-ns-clmtn" path="phan-mem-mua-hang/nhan-su/cl-muc-tieu-nam" element={<KeToanPage title="2.4.0. Chiến lược, mục tiêu năm" />} />,
  <Route key="pmm-ns-khn"   path="phan-mem-mua-hang/nhan-su/ke-hoach-nam"    element={<KeToanPage title="2.4.1. Kế hoạch, hành động năm" />} />,
  <Route key="pmm-ns-p3"    path="phan-mem-mua-hang/nhan-su/p3-nam"          element={<KeToanPage title="2.4.2. P3 năm" />} />,
  <Route key="pmm-ns-dt"    path="phan-mem-mua-hang/nhan-su/dao-tao"         element={<KeToanPage title="2.5. Đào tạo" />} />,
  <Route key="pmm-ns-s5"    path="phan-mem-mua-hang/nhan-su/s5"              element={<KeToanPage title="2.6. S5" />} />,

  /* 3. Sản phẩm */
  <Route key="pmm-sp-kh"   path="phan-mem-mua-hang/san-pham/ke-hoach-sp-moi" element={<KeToanPage title="3.1. Kế hoạch triển khai sản phẩm mới" />} />,
  <Route key="pmm-sp-bgv"  path="phan-mem-mua-hang/san-pham/bang-gia-von"    element={<KeToanPage title="3.2. Bảng giá vốn lợi nhuận" />} />,
  <Route key="pmm-sp-tt"   path="phan-mem-mua-hang/san-pham/thong-tin-sp"    element={<KeToanPage title="3.3. Thông tin sản phẩm" />} />,
  <Route key="pmm-sp-top-n" path="phan-mem-mua-hang/san-pham/top-ban-nhieu"  element={<KeToanPage title="3.4. Top sản phẩm bán nhiều đột biến" />} />,
  <Route key="pmm-sp-top-c" path="phan-mem-mua-hang/san-pham/top-ban-cham"   element={<KeToanPage title="3.5. Top sản phẩm bán chậm" />} />,
  <Route key="pmm-sp-cbk"  path="phan-mem-mua-hang/san-pham/canh-bao-kho"   element={<KeToanPage title="3.6. Cảnh báo hàng tồn kho cần date" />} />,

  /* 4. Đặt hàng */
  <Route key="pmm-dh-khn"  path="phan-mem-mua-hang/dat-hang/ke-hoach-nam"   element={<KeToanPage title="4.1. Kế hoạch đặt hàng theo năm" />} />,
  <Route key="pmm-dh-kht"  path="phan-mem-mua-hang/dat-hang/ke-hoach-thang" element={<KeToanPage title="4.2. Kế hoạch đặt hàng theo tháng" />} />,
  <Route key="pmm-dh-tdd"  path="phan-mem-mua-hang/dat-hang/theo-doi-don"   element={<KeToanPage title="4.3. Theo dõi đơn đặt hàng" />} />,
  <Route key="pmm-dh-gg"   path="phan-mem-mua-hang/dat-hang/giam-gia-ncc"   element={<KeToanPage title="4.4. Giảm giá mua từ NCC" />} />,
  <Route key="pmm-dh-kn"   path="phan-mem-mua-hang/dat-hang/khieu-nai"      element={<KeToanPage title="4.5. Khiếu nại đơn hàng" />} />,

  /* 5. Thanh toán */
  <Route key="pmm-tt-khn"  path="phan-mem-mua-hang/thanh-toan/ke-hoach-ncc" element={<KeToanPage title="5.1. Kế hoạch thanh toán NCC" />} />,
  <Route key="pmm-tt-cn"   path="phan-mem-mua-hang/thanh-toan/cong-no"      element={<KeToanPage title="5.2. Đảm bảo thanh toán công nợ" />} />,

  /* 6-7 */
  <Route key="pmm-chi-phi" path="phan-mem-mua-hang/chi-phi" element={<KeToanPage title="6. Chi phí mua hàng" />} />,
  <Route key="pmm-ty-gia"  path="phan-mem-mua-hang/ty-gia"  element={<KeToanPage title="7. Tỷ giá ngoại tệ biến thiên" />} />,
];

export default phanMemMuaHangRoutes;
