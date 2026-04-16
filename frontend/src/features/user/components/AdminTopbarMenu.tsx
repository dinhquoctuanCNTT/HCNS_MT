import { Settings, User, Mail, Lock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/auth.store";

export default function AdminTopBarMenu({ onClose }: { onClose: () => void }) {
  const { clearAuthState } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Settings size={18} />, label: "Settings", action: () => {} },
    {
      icon: <User size={18} />,
      label: "Profile",
      action: () => navigate("/admin/profile"),
    },
    { icon: <Mail size={18} />, label: "Gmail", action: () => {} },
    { icon: <Lock size={18} />, label: "Lock Screen", action: () => {} },
    {
      icon: <LogOut size={18} />,
      label: "Logout",
      action: () => {
        clearAuthState();
        navigate("/login");
      },
    },
  ];

  return (
    <div className="admin-topbar__dropdown">
      <div className="admin-topbar__dropdownArrow" />
      {menuItems.map((item) => (
        <button
          key={item.label}
          type="button"
          className="admin-topbar__dropdownItem"
          onClick={() => {
            item.action();
            onClose();
          }}
        >
          <span className="admin-topbar__dropdownIcon">{item.icon}</span>
          <span className="admin-topbar__dropdownText">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
