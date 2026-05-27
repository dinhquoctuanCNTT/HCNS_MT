import { Route } from "react-router-dom";
import KeToanPage from "@modules/ke-toan/pages/KeToanPage";

const daoTaoRoutes = [
  /* 1. Sơ đồ tổ chức */
  <Route key="dt-sdtc-hst"  path="dao-tao/so-do-to-chuc/he-sinh-thai"   element={<KeToanPage title="1.1. Hệ sinh thái MTH" />} />,
  <Route key="dt-sdtc-dmc"  path="dao-tao/so-do-to-chuc/danh-muc-cty"   element={<KeToanPage title="1.2. Danh mục công ty, chi nhánh, phòng ban, chức vụ" />} />,
  <Route key="dt-sdtc-hsnl" path="dao-tao/so-do-to-chuc/ho-so-nang-luc" element={<KeToanPage title="1.3. Hồ sơ năng lực các công ty" />} />,
  <Route key="dt-sdtc-cnpb" path="dao-tao/so-do-to-chuc/chuc-nang-pb"   element={<KeToanPage title="1.4. Chức năng nhiệm vụ phòng ban" />} />,

  /* 2. Nhân sự 360 */
  <Route key="dt-ns-ds"    path="dao-tao/nhan-su-360/danh-sach"      element={<KeToanPage title="2.1. Danh sách nhân sự" />} />,
  <Route key="dt-ns-kpi"   path="dao-tao/nhan-su-360/bmtcv-kpi"      element={<KeToanPage title="2.2. BMTCV + KPI" />} />,
  <Route key="dt-ns-knl"   path="dao-tao/nhan-su-360/khung-nang-luc" element={<KeToanPage title="2.3. Khung năng lực" />} />,
  <Route key="dt-ns-lt"    path="dao-tao/nhan-su-360/lo-trinh"       element={<KeToanPage title="2.4. Lộ trình phát triển" />} />,

  /* 3. Quy trình, biểu mẫu */
  <Route key="dt-qt-chung"   path="dao-tao/quy-trinh/quy-trinh-chung"    element={<KeToanPage title="1. Quy trình chung PĐT" />} />,
  <Route key="dt-qt-bbh"     path="dao-tao/quy-trinh/bien-ban-hop"        element={<KeToanPage title="Biên bản họp hàng tháng" />} />,
  <Route key="dt-qt-khtt"    path="dao-tao/quy-trinh/ke-hoach-tuan-thang" element={<KeToanPage title="2. Kế hoạch tuần/tháng PĐT" />} />,
  <Route key="dt-qt-bcn"     path="dao-tao/quy-trinh/bao-cao-ngay"        element={<KeToanPage title="3. Báo cáo ngày/tuần/tháng" />} />,
  <Route key="dt-qt-bchd"    path="dao-tao/quy-trinh/bao-cao-hoat-dong"   element={<KeToanPage title="4. Báo cáo tháng về hoạt động đào tạo" />} />,
  <Route key="dt-qt-gthc"    path="dao-tao/quy-trinh/giay-to-hc"          element={<KeToanPage title="5. Giấy tờ hành chính" />} />,

  /* 4. Quản lý tài liệu */
  <Route key="dt-tl-mth"       path="dao-tao/tai-lieu/mth"         element={<KeToanPage title="1. MTH" />} />,
  <Route key="dt-tl-mtpaints"  path="dao-tao/tai-lieu/mtpaints"    element={<KeToanPage title="2. MTPaints" />} />,
  <Route key="dt-tl-mhm"       path="dao-tao/tai-lieu/mhm"         element={<KeToanPage title="3. MHM" />} />,
  <Route key="dt-tl-mtparts"   path="dao-tao/tai-lieu/mtparts"     element={<KeToanPage title="4. MTparts" />} />,
  <Route key="dt-tl-mtshop"    path="dao-tao/tai-lieu/mtshop"      element={<KeToanPage title="5. MTShop" />} />,
  <Route key="dt-tl-mtpsi"     path="dao-tao/tai-lieu/mtpsi"       element={<KeToanPage title="6. MTPSI" />} />,
  <Route key="dt-tl-mtedu"     path="dao-tao/tai-lieu/mteducation" element={<KeToanPage title="7. MTEducation" />} />,
  <Route key="dt-tl-mtsoft"    path="dao-tao/tai-lieu/mtsoft"      element={<KeToanPage title="8. MTSoft" />} />,

  /* 5. Hoạt động đào tạo */
  <Route key="dt-hd-ct"    path="dao-tao/hoat-dong/chuong-trinh"     element={<KeToanPage title="1. Chương trình đào tạo theo công ty, phòng ban" />} />,
  <Route key="dt-hd-nc"    path="dao-tao/hoat-dong/nhu-cau"          element={<KeToanPage title="Nhu cầu đào tạo toàn hệ thống" />} />,
  <Route key="dt-hd-kh"    path="dao-tao/hoat-dong/ke-hoach"         element={<KeToanPage title="Kế hoạch, lịch đào tạo trong tháng" />} />,
  <Route key="dt-hd-hn"    path="dao-tao/hoat-dong/hoi-nhap"         element={<KeToanPage title="2. Đào tạo hội nhập" />} />,
  <Route key="dt-hd-cm"    path="dao-tao/hoat-dong/chuyen-mon"       element={<KeToanPage title="3. Đào tạo chuyên môn" />} />,
  <Route key="dt-hd-nc2"   path="dao-tao/hoat-dong/nang-cao"         element={<KeToanPage title="4. Đào tạo nâng cao (theo khung năng lực)" />} />,
  <Route key="dt-hd-tn"    path="dao-tao/hoat-dong/thue-ngoai"       element={<KeToanPage title="5. Đào tạo thuê ngoài" />} />,
  <Route key="dt-hd-spm"   path="dao-tao/hoat-dong/san-pham-moi"     element={<KeToanPage title="6. Đào tạo sản phẩm mới" />} />,
  <Route key="dt-hd-nl"    path="dao-tao/hoat-dong/nhac-lai"         element={<KeToanPage title="7. Đào tạo nhắc lại" />} />,
  <Route key="dt-hd-bcth"  path="dao-tao/hoat-dong/bao-cao-tong-hop" element={<KeToanPage title="8. Báo cáo tổng hợp" />} />,

  /* 6. Đánh giá / kết quả */
  <Route key="dt-dg-kq"   path="dao-tao/danh-gia/ket-qua-toan-he-thong" element={<KeToanPage title="1. Kết quả đào tạo toàn hệ thống" />} />,
  <Route key="dt-dg-ks"   path="dao-tao/danh-gia/khao-sat"               element={<KeToanPage title="2. Khảo sát sau đào tạo" />} />,
  <Route key="dt-dg-thpt" path="dao-tao/danh-gia/tong-hop-phan-tich"     element={<KeToanPage title="3. Tổng hợp, phân tích kết quả đào tạo" />} />,

  /* 7. MTH - Đào tạo liên kết */
  <Route key="dt-lk-oem"   path="dao-tao/lien-ket/oem"               element={<KeToanPage title="1. OEM" />} />,
  <Route key="dt-lk-truong" path="dao-tao/lien-ket/truong"           element={<KeToanPage title="2. Trường" />} />,
  <Route key="dt-lk-htti"  path="dao-tao/lien-ket/hoi-thi-tay-nghe" element={<KeToanPage title="3. Hội thi tay nghề" />} />,
];

export default daoTaoRoutes;
