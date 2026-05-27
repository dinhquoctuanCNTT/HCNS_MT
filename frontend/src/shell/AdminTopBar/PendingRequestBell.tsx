import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { dashboardApi } from "../../../../api/dashboardApi";
import { useNavigate } from "react-router-dom";

export default function PendingRequestBell() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const fetchCount = async () => {
    try {
      const data = await dashboardApi.getPendingCount();
      setCount(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch pending counts", error);
    }
  };

  useEffect(() => {
    fetchCount();
    // Tự động làm mới mỗi 30 giây
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button 
      className="admin-topbar__iconBtn" 
      type="button"
      title={`${count} đơn đang chờ duyệt`}
      onClick={() => navigate("/admin/nhansu/phe-duyet")}
      style={{ position: 'relative' }}
    >
      <Bell size={20} />
      {count > 0 && (
        <span className="admin-topbar__badge admin-topbar__badge--red">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
