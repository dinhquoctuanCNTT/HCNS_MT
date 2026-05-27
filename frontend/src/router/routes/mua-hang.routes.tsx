import { RouteObject } from "react-router-dom";
import { MuaHangLayout } from "../../modules/mua-hang/components/Layout/MuaHangLayout";
import { TongQuanPage } from "../../modules/mua-hang/pages/TongQuanPage";

export const muaHangRoutes: RouteObject = {
  path: "/mua-hang",
  element: <MuaHangLayout />,
  children: [
    {
      index: true,
      element: <TongQuanPage />,
    },
    {
      path: "quy-trinh",
      element: (
        <div style={{ padding: "32px" }}>Quy trình mua sắm (Coming soon)</div>
      ),
    },
    {
      path: "ke-hoach",
      element: (
        <div style={{ padding: "32px" }}>Kế hoạch mua hàng (Coming soon)</div>
      ),
    },
    {
      path: "don-hang",
      element: (
        <div style={{ padding: "32px" }}>Quản lý đơn hàng (Coming soon)</div>
      ),
    },
    {
      path: "nha-cung-cap",
      element: (
        <div style={{ padding: "32px" }}>
          Quản lý nhà cung cấp (Coming soon)
        </div>
      ),
    },
    {
      path: "danh-muc",
      element: <div style={{ padding: "32px" }}>Danh mục (Coming soon)</div>,
    },
    {
      path: "bao-cao",
      element: <div style={{ padding: "32px" }}>Báo cáo (Coming soon)</div>,
    },
  ],
};
