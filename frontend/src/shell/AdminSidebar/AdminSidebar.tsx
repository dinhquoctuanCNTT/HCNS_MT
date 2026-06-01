import { NavLink, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import logoMT from "@assets/Logo MT Holdings New-01.png";
import { usePendingCount } from "@context/PendingCountContext";
import { GitBranch, Settings, Home } from "lucide-react";
import "./AdminSidebar.css";

type AdminSidebarProps = {
  isOpen: boolean;
};

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const location = useLocation();
  const { pendingCount } = usePendingCount();

  const isWorkflowGroupActive = useMemo(
    () => location.pathname.includes("/admin/workflow"),
    [location.pathname]
  );

  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const toggleSubMenu = (key: string) =>
    setOpenSubMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  const getSublinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "admin-sidebar__sublink admin-sidebar__sublink--active"
      : "admin-sidebar__sublink";

  const [openWorkflow, setOpenWorkflow] = useState(isWorkflowGroupActive);

  useEffect(() => {
    if (isWorkflowGroupActive) setOpenWorkflow(true);
  }, [isWorkflowGroupActive]);

  const isBoardActive =
    isWorkflowGroupActive && !location.search.includes("tab=history");
  const isHistoryActive =
    isWorkflowGroupActive && location.search.includes("tab=history");

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="admin-sidebar__brand">
        <NavLink to="/admin">
          <img src={logoMT} alt="MT Holding" className="sidebar-logo" />
        </NavLink>
      </div>

      <nav className="admin-sidebar__content sidebar-nav-scroll">
        {isOpen && <p className="admin-sidebar__section-label">MENU</p>}
        <div className="admin-sidebar__nav">

          {/* ── WORKFLOW ── */}
          <button
            type="button"
            className={
              isWorkflowGroupActive
                ? "admin-sidebar__groupTrigger admin-sidebar__groupTrigger--active"
                : "admin-sidebar__groupTrigger"
            }
            onClick={() => setOpenWorkflow((prev) => !prev)}
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon"><GitBranch size={18} /></span>
              {isOpen && <span>Workflow</span>}
            </span>
            {isOpen && (
              <span className="admin-sidebar__caret">
                {openWorkflow ? "▼" : "▶"}
              </span>
            )}
          </button>

          {isOpen && openWorkflow && (
            <div className="admin-sidebar__submenu">
              <NavLink
                to="/admin/workflow"
                className={() =>
                  isBoardActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                Board
              </NavLink>
              <NavLink
                to="/admin/workflow?tab=history"
                className={() =>
                  isHistoryActive
                    ? "admin-sidebar__sublink admin-sidebar__sublink--active"
                    : "admin-sidebar__sublink"
                }
              >
                History
              </NavLink>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>

              {/* 1. Thông tin tài khoản */}
              <NavLink to="/admin/nhan-su/tai-khoan" className={getSublinkClass}>
                1. Thông tin tài khoản
              </NavLink>

              {/* 2. Thông tin hòa nhập */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn" onClick={() => toggleSubMenu("hoaNhap")}>
                <span>2. Thông tin hòa nhập</span>
                <span className="sidebar-caret-sm">{openSubMenus["hoaNhap"] ? "▼" : "▶"}</span>
              </button>
              {openSubMenus["hoaNhap"] && (
                <div className="sidebar-sublevel">
                  <NavLink to="/admin/nhan-su/hoa-nhap/he-sinh-thai" className={getSublinkClass}>- Hệ sinh thái</NavLink>
                  <NavLink to="/admin/nhan-su/hoa-nhap/so-do" className={getSublinkClass}>- Sơ đồ tổ chức</NavLink>
                </div>
              )}

              {/* 3. Dữ liệu Driver */}
              <NavLink to="/admin/nhan-su/driver/cau-truc" className={getSublinkClass}>
                3. Dữ liệu Driver
              </NavLink>

              {/* 4. Phúc lợi */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn" onClick={() => toggleSubMenu("phucLoi")}>
                <span>4. Phúc lợi</span>
                <span className="sidebar-caret-sm">{openSubMenus["phucLoi"] ? "▼" : "▶"}</span>
              </button>
              {openSubMenus["phucLoi"] && (
                <div className="sidebar-sublevel">
                  <NavLink to="/admin/nhan-su/phuc-loi/8-3"   className={getSublinkClass}>- Ngày 8/3</NavLink>
                  <NavLink to="/admin/nhan-su/phuc-loi/20-10" className={getSublinkClass}>- Ngày 20/10</NavLink>
                  <NavLink to="/admin/nhan-su/phuc-loi/tet"   className={getSublinkClass}>- Tết Nguyên Đán</NavLink>
                </div>
              )}

              {/* 5. Bảng mô tả công việc & kỹ năng */}
              <NavLink to="/admin/nhan-su/bmtcv/danh-sach" className={getSublinkClass}>
                5. Bảng mô tả CV & kỹ năng
              </NavLink>

              {/* 6. Cấu trúc lương 3P */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn" onClick={() => toggleSubMenu("luong3p")}>
                <span>6. Cấu trúc lương 3P</span>
                <span className="sidebar-caret-sm">{openSubMenus["luong3p"] ? "▼" : "▶"}</span>
              </button>
              {openSubMenus["luong3p"] && (
                <div className="sidebar-sublevel">
                  <NavLink to="/admin/nhan-su/luong-3p/p1" className={getSublinkClass}>- P1</NavLink>
                  <NavLink to="/admin/nhan-su/luong-3p/p2" className={getSublinkClass}>- P2</NavLink>
                  <NavLink to="/admin/nhan-su/luong-3p/p3" className={getSublinkClass}>- P3</NavLink>
                </div>
              )}

              {/* 7. Lộ trình phát triển */}
              <NavLink to="/admin/nhan-su/lo-trinh/thu-viec" className={getSublinkClass}>
                7. Lộ trình phát triển
              </NavLink>

              {/* 8. Bản tin nội bộ */}
              <NavLink to="/admin/nhan-su/ban-tin/ngoai-cty" className={getSublinkClass}>
                8. Bản tin nội bộ
              </NavLink>

              {/* 9. Lịch */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn" onClick={() => toggleSubMenu("lich")}>
                <span>9. Lịch</span>
                <span className="sidebar-caret-sm">{openSubMenus["lich"] ? "▼" : "▶"}</span>
              </button>
              {openSubMenus["lich"] && (
                <div className="sidebar-sublevel">
                  <NavLink to="/admin/nhan-su/lich/nam"   className={getSublinkClass}>- Năm</NavLink>
                  <NavLink to="/admin/nhan-su/lich/thang" className={getSublinkClass}>- Tháng</NavLink>
                  <NavLink to="/admin/nhan-su/ngay-le"    className={getSublinkClass}>- Ngày lễ</NavLink>
                </div>
              )}

              {/* 10. Công việc */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn" onClick={() => toggleSubMenu("congViec")}>
                <span>10. Công việc</span>
                <span className="sidebar-caret-sm">{openSubMenus["congViec"] ? "▼" : "▶"}</span>
              </button>
              {openSubMenus["congViec"] && (
                <div className="sidebar-sublevel">
                  <NavLink to="/admin/nhan-su/cong-viec/muc-tieu-nam"   className={getSublinkClass}>- 10.1 Mục tiêu năm</NavLink>
                  <NavLink to="/admin/nhan-su/cong-viec/muc-tieu-quy"   className={getSublinkClass}>- 10.2 Mục tiêu quý</NavLink>
                  <NavLink to="/admin/nhan-su/cong-viec/muc-tieu-thang" className={getSublinkClass}>- 10.3 Mục tiêu tháng</NavLink>
                  <NavLink to="/admin/nhan-su/cong-viec/muc-tieu-tuan"  className={getSublinkClass}>- 10.4 Mục tiêu tuần</NavLink>
                </div>
              )}

              {/* 11. Hệ thống báo cáo */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn" onClick={() => toggleSubMenu("baoCao")}>
                <span>11. Hệ thống báo cáo</span>
                <span className="sidebar-caret-sm">{openSubMenus["baoCao"] ? "▼" : "▶"}</span>
              </button>
              {openSubMenus["baoCao"] && (
                <div className="sidebar-sublevel">
                  <NavLink to="/admin/nhan-su/bao-cao/ngay"         className={getSublinkClass}>- 11.1 Báo cáo ngày</NavLink>
                  <NavLink to="/admin/nhan-su/bao-cao/tuan"         className={getSublinkClass}>- 11.2 Báo cáo tuần</NavLink>
                  <NavLink to="/admin/nhan-su/bao-cao/thang"        className={getSublinkClass}>- 11.3 Báo cáo tháng</NavLink>
                  <NavLink to="/admin/nhan-su/bao-cao/hop-giao-ban" className={getSublinkClass}>- 11.4 Báo cáo họp giao ban</NavLink>
                </div>
              )}

              {/* 12. Lương thưởng */}
              <NavLink to="/admin/nhan-su/luong-thuong" className={getSublinkClass}>
                12. Lương thưởng
              </NavLink>

              {/* 13. Đơn từ */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn" onClick={() => toggleSubMenu("donTu")}>
                <span>13. Đơn từ</span>
                <span className="sidebar-caret-sm">{openSubMenus["donTu"] ? "▼" : "▶"}</span>
              </button>
              {openSubMenus["donTu"] && (
                <div className="sidebar-sublevel">
                  <NavLink to="/admin/nhan-su/nghi-phep"      className={getSublinkClass}>- 13.1 Nghỉ phép</NavLink>
                  <NavLink to="/admin/nhan-su/lam-them-gio"   className={getSublinkClass}>- 13.2 Làm thêm giờ</NavLink>
                  <NavLink to="/admin/nhan-su/cai-tien"       className={getSublinkClass}>- 13.3 Cải tiến</NavLink>
                  <NavLink to="/admin/nhan-su/dao-tao-nang-cao" className={getSublinkClass}>- 13.4 Đào tạo nâng cao</NavLink>
                </div>
              )}

              {/* 14. Chấm công */}
              <button type="button" className="admin-sidebar__sublink sidebar-subbtn" onClick={() => toggleSubMenu("chamCongGroup")}>
                <span>14. Chấm công</span>
                <span className="sidebar-caret-sm">{openSubMenus["chamCongGroup"] ? "▼" : "▶"}</span>
              </button>
              {openSubMenus["chamCongGroup"] && (
                <div className="sidebar-sublevel">
                  <NavLink to="/admin/nhan-su/cham-cong"   className={getSublinkClass}>- Bảng chấm công</NavLink>
                  <NavLink to="/admin/nhan-su/lich-su"     className={getSublinkClass}>- Lịch sử chấm công</NavLink>
                  <NavLink to="/admin/nhan-su/ca-lam-viec" className={getSublinkClass}>- Ca làm việc</NavLink>
                  <NavLink to="/admin/nhan-su/nhan-vien"   className={getSublinkClass}>- Nhân viên</NavLink>
                  <NavLink to="/admin/nhan-su/phe-duyet"   className={getSublinkClass}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                      - Phê duyệt giải trình
                      {pendingCount > 0 && (
                        <span style={{
                          backgroundColor: "#ef4444", color: "#fff",
                          fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
                          borderRadius: 9, display: "inline-flex", alignItems: "center",
                          justifyContent: "center", padding: "0 5px", lineHeight: 1, flexShrink: 0,
                        }}>
                          {pendingCount > 99 ? "99+" : pendingCount}
                        </span>
                      )}
                    </span>
                  </NavLink>
                </div>
              )}

              {/* 15. Định tuyến */}
              <NavLink to="/admin/nhan-su/dinh-tuyen" className={getSublinkClass}>
                15. Định tuyến
              </NavLink>

            </div>

        </div>

        {/* ── OTHERS ── */}
        {isOpen && <p className="admin-sidebar__section-label">OTHERS</p>}
        <div className="admin-sidebar__nav">
          <NavLink
            to="/admin/icons"
            className={({ isActive }) =>
              isActive ? "admin-sidebar__link admin-sidebar__link--active" : "admin-sidebar__link"
            }
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon"><Settings size={18} /></span>
              {isOpen && <span>Cấu hình</span>}
            </span>
          </NavLink>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "admin-sidebar__link admin-sidebar__link--active" : "admin-sidebar__link"
            }
          >
            <span className="admin-sidebar__groupLeft">
              <span className="admin-sidebar__icon"><Home size={18} /></span>
              {isOpen && <span>Quay về Dashboard</span>}
            </span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
