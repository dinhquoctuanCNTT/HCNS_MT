import React from "react";
import { Outlet } from "react-router-dom";
import TopHeader from "../../../../shared/components/Header/TopHeader";
import "./TruyenThongLayout.css";

export default function TruyenThongLayout() {
  return (
    <div className="truyen-thong-layout">
      {/* Top Header - Sử dụng component chung */}
      <TopHeader />

      {/* Main Content */}
      <main className="truyen-thong-content">
        <Outlet />
      </main>
    </div>
  );
}
