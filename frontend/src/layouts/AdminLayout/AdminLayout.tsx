import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../../features/admin/dashboard/components/AdminSidebar";
import AdminTopbar from "../../features/admin/dashboard/components/AdminTopBar/AdminTopbar";
import "./admin-layout.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} />

      <div className="admin-layout_main">
        <AdminTopbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="admin-layout_content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
