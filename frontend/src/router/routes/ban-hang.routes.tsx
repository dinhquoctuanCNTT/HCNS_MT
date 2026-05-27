import { Route } from "react-router-dom";
import KeToanPage from "@modules/ke-toan/pages/KeToanPage";

const banHangRoutes = [
  <Route key="bh-kh360"      path="ban-hang/thong-tin-kh-360"      element={<KeToanPage title="1.1 Thông tin khách hàng 360" />} />,
  <Route key="bh-dh360"      path="ban-hang/dinh-huong-kh-360"     element={<KeToanPage title="1.1.1 Định hướng khách hàng 360" />} />,
  <Route key="bh-ns360"      path="ban-hang/nhan-su-pbh-360"       element={<KeToanPage title="1.2 Nhân sự phòng bán hàng 360" />} />,
  <Route key="bh-ccto"       path="ban-hang/co-cau-to-chuc"        element={<KeToanPage title="1.2.0 Cơ cấu tổ chức" />} />,
  <Route key="bh-ttns"       path="ban-hang/thong-tin-nhan-su"     element={<KeToanPage title="1.2.1 Thông tin nhân sự" />} />,
  <Route key="bh-dgl3p"      path="ban-hang/danh-gia-luong-3p"     element={<KeToanPage title="1.2.2 Đánh giá lương 3P" />} />,
  <Route key="bh-cctc"       path="ban-hang/co-che-bh-tieu-chuan"  element={<KeToanPage title="1.2.3 Cơ chế bán hàng tiêu chuẩn" />} />,
  <Route key="bh-cctt"       path="ban-hang/co-che-bh-thuc-te"     element={<KeToanPage title="1.2.4 Cơ chế bán hàng thực tế" />} />,
  <Route key="bh-dtct"       path="ban-hang/doi-thu-canh-tranh"    element={<KeToanPage title="1.3 Thông tin đối thủ cạnh tranh" />} />,
  <Route key="bh-spgb"       path="ban-hang/san-pham-gia-ban"      element={<KeToanPage title="1.4 Thông tin sản phẩm và giá bán" />} />,
  <Route key="bh-nnt"        path="ban-hang/kh-noi-ngoai-tinh"     element={<KeToanPage title="1.5 Kế hoạch BH nội tỉnh và ngoại tỉnh" />} />,
  <Route key="bh-khnnt"      path="ban-hang/kh-bh-noi-ngoai"       element={<KeToanPage title="1.5.1 Kế hoạch BH nội tỉnh và ngoại tỉnh" />} />,
  <Route key="bh-kqnnt"      path="ban-hang/kq-bh-noi-ngoai"       element={<KeToanPage title="1.5.2 Kết quả BH nội tỉnh và ngoại tỉnh" />} />,
  <Route key="bh-top20"      path="ban-hang/top-20-kh-80-ds"       element={<KeToanPage title="1.6 Top 20% KH đóng góp 80% doanh số" />} />,
  <Route key="bh-kh306090"   path="ban-hang/kh-khong-mua-30-60-90" element={<KeToanPage title="1.7 KH không mua hàng 30/60/90 ngày" />} />,
  <Route key="bh-khgiam20"   path="ban-hang/kh-mua-giam-20"        element={<KeToanPage title="1.8 KH có mức mua giảm từ 20% tháng trước" />} />,
  <Route key="bh-dscpln"     path="ban-hang/ds-chi-phi-ln-kh"      element={<KeToanPage title="1.9 Doanh số - chi phí - lợi nhuận theo KH" />} />,
  <Route key="bh-hscodt"     path="ban-hang/ho-so-co-hoi-dau-tu"   element={<KeToanPage title="1.9.1 Hồ sơ cơ hội đầu tư" />} />,
  <Route key="bh-hmdt"       path="ban-hang/hang-muc-dau-tu"       element={<KeToanPage title="1.9.2 Hạng mục đầu tư ban đầu" />} />,
  <Route key="bh-cpvh"       path="ban-hang/chi-phi-van-hanh"      element={<KeToanPage title="1.9.3 Chi phí vận hành" />} />,
  <Route key="bh-khds"       path="ban-hang/ke-hoach-ds-gia-dinh"  element={<KeToanPage title="1.9.4 Kế hoạch doanh số và giả định hiệu quả" />} />,
  <Route key="bh-dgpd"       path="ban-hang/danh-gia-phe-duyet"    element={<KeToanPage title="1.9.5 Đánh giá / phê duyệt / cảnh báo" />} />,
  <Route key="bh-qlcn"       path="ban-hang/quan-ly-cong-no"       element={<KeToanPage title="1.10 Quản lý công nợ" />} />,
  <Route key="bh-srm"        path="ban-hang/sales-roadmap"         element={<KeToanPage title="1.11 Quản lý BH theo Sales Roadmap" />} />,
  <Route key="bh-hsdabh"     path="ban-hang/ho-so-du-an-bh"        element={<KeToanPage title="1.11.1 Hồ sơ dự án bán hàng" />} />,
  <Route key="bh-tdrm"       path="ban-hang/tien-do-roadmap"       element={<KeToanPage title="1.11.2 Tiến độ roadmap 11 bước" />} />,
  <Route key="bh-nkhd"       path="ban-hang/nhat-ky-hanh-dong"     element={<KeToanPage title="1.11.3 Nhật ký hành động" />} />,
  <Route key="bh-ykdh"       path="ban-hang/y-kien-dinh-huong"     element={<KeToanPage title="1.11.4 Ý kiến / định hướng / kết quả" />} />,
  <Route key="bh-mtkh"       path="ban-hang/muc-tieu-ke-hoach"     element={<KeToanPage title="1.12 Mục tiêu / kế hoạch / kết quả theo công ty" />} />,
];

export default banHangRoutes;
