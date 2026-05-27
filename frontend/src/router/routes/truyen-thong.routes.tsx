import { Route } from "react-router-dom";
import FeedPage from "../../modules/truyen-thong/pages/FeedPage";
import TruyenThongLayout from "../../modules/truyen-thong/components/Layout/TruyenThongLayout";

// Placeholder component cho các trang chưa có
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: "24px" }}>
    <h2>{title}</h2>
    <p>Trang này đang được phát triển...</p>
  </div>
);

const truyenThongRoutes = [
  <Route key="truyen-thong" path="truyen-thong" element={<TruyenThongLayout />}>
    <Route index element={<FeedPage />} />

    {/* Nhân sự 360 */}
    <Route path="nhan-su-360">
      <Route
        path="thong-tin"
        element={<PlaceholderPage title="Thông tin Nhân sự 360" />}
      />
      <Route
        path="danh-gia"
        element={<PlaceholderPage title="Đánh giá Nhân sự 360" />}
      />
    </Route>

    {/* Đào tạo */}
    <Route path="dao-tao">
      <Route
        path="khoa-hoc"
        element={<PlaceholderPage title="Khóa học Đào tạo" />}
      />
      <Route
        path="tai-lieu"
        element={<PlaceholderPage title="Tài liệu Đào tạo" />}
      />
    </Route>

    {/* Sự kiện */}
    <Route path="su-kien">
      <Route
        path="danh-sach"
        element={<PlaceholderPage title="Danh sách Sự kiện" />}
      />
      <Route
        path="dang-ky"
        element={<PlaceholderPage title="Đăng ký Sự kiện" />}
      />
    </Route>

    {/* Thông báo */}
    <Route path="thong-bao" element={<PlaceholderPage title="Thông báo" />} />

    {/* Tài liệu */}
    <Route path="tai-lieu" element={<PlaceholderPage title="Tài liệu" />} />
  </Route>,
];

export default truyenThongRoutes;
