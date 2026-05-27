import React from "react";
import { Route } from "react-router-dom";
import { MuaHangLayout } from "../../modules/mua-hang/components/Layout/MuaHangLayout";
import { TongQuanPage } from "../../modules/mua-hang/pages/TongQuanPage";

const muaHangRoutes = [
  <Route key="mua-hang" path="mua-hang" element={<MuaHangLayout />}>
    <Route index element={<TongQuanPage />} />
    <Route
      path="quy-trinh"
      element={
        <div style={{ padding: "32px", fontFamily: "sans-serif" }}>Quy trình mua sắm (Coming soon)</div>
      }
    />
    <Route
      path="ke-hoach"
      element={
        <div style={{ padding: "32px", fontFamily: "sans-serif" }}>Kế hoạch mua hàng (Coming soon)</div>
      }
    />
    <Route
      path="don-hang"
      element={
        <div style={{ padding: "32px", fontFamily: "sans-serif" }}>Quản lý đơn hàng (Coming soon)</div>
      }
    />
    <Route
      path="nha-cung-cap"
      element={
        <div style={{ padding: "32px", fontFamily: "sans-serif" }}>
          Quản lý nhà cung cấp (Coming soon)
        </div>
      }
    />
    <Route
      path="danh-muc"
      element={<div style={{ padding: "32px", fontFamily: "sans-serif" }}>Danh mục (Coming soon)</div>}
    />
    <Route
      path="bao-cao"
      element={<div style={{ padding: "32px", fontFamily: "sans-serif" }}>Báo cáo (Coming soon)</div>}
    />
  </Route>,
];

export default muaHangRoutes;
