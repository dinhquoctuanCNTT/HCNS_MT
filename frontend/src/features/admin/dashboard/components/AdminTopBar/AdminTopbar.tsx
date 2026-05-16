import { MessageCircle, Search, Menu, ChevronDown } from "lucide-react";
import "./AdminTopBar.css";
import { useEffect, useRef, useState } from "react";
import NotificationBell from "../../../../workflow/components/layout/NotificationBell";
import PendingRequestBell from "../PendingRequestBell";
import { useAuthStore } from "../../../../auth/auth.store";
import AdminTopBarMenu from "../../../../user/components/AdminTopbarMenu";
import { API_BASE_URL } from "../../../../../config/env";

type AdminTopbarProps = {
  onToggleSidebar: () => void;
};

export default function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <button
          className="admin-topbar__menu"
          type="button"
          onClick={onToggleSidebar}
        >
          <Menu size={22} />
        </button>
        <div className="admin-topbar__searchWrap">
          <input
            className="admin-topbar__search"
            placeholder="Search..."
            type="text"
          />
          <Search size={18} className="admin-topbar__searchIcon" />
        </div>
      </div>

      <div className="admin-topbar__center">
        <div className="admin-topbar__title">CÔNG TY SƠN MT</div>
        <div className="admin-topbar__subtitle">
          TỔNG ĐÀI HỖ TRỢ 24/7: 0911.957.620
        </div>
      </div>

      <div className="admin-topbar__right">
        <img
          src="https://flagcdn.com/w40/vn.png"
          alt="VN"
          className="admin-topbar__flag"
        />

        <PendingRequestBell />

        <button className="admin-topbar__iconBtn" type="button">
          <MessageCircle size={20} />
          <span className="admin-topbar__badge admin-topbar__badge--green">
            3
          </span>
        </button>

        <div className="admin-topbar__divider" />

        <div className="admin-topbar__profileWrapper" ref={dropdownRef}>
          <button
            type="button"
            className={`admin-topbar__profile ${openDropdown ? "is-open" : ""}`}
            onClick={() => setOpenDropdown((prev) => !prev)}
          >
            <img
              src={
                user?.avatar_url
                  ? `${API_BASE_URL}${user.avatar_url}`
                  : "https://i.pravatar.cc/100?img=12"
              }
              alt="avatar"
              className="admin-topbar__avatar"
            />
            <div className="admin-topbar__userInfo">
              <div className="admin-topbar__userName">
                {user?.full_name || "User"}
              </div>
            </div>
            <ChevronDown size={16} className="admin-topbar__caret" />
          </button>

          {openDropdown && (
            <AdminTopBarMenu onClose={() => setOpenDropdown(false)} />
          )}
        </div>
      </div>
    </header>
  );
}
