import { useState } from "react";
import { 
  FileText, 
  Search, 
  Download, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { BaoCaoItem } from "../../types";

export default function ReportList() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const reports: BaoCaoItem[] = [
    {
      id: "bc-001",
      tenBaoCao: "Bảng cân đối kế toán",
      loai: "TAI_CHINH",
      duongDan: "/admin/ke-toan/bao-cao/can-doi-ke-toan",
      dienGiai: "Xem tổng quan tài sản, nguồn vốn của doanh nghiệp"
    },
    {
      id: "bc-002",
      tenBaoCao: "Báo cáo kết quả hoạt động kinh doanh",
      loai: "TAI_CHINH",
      duongDan: "/admin/ke-toan/bao-cao/ket-qua-kinh-doanh",
      dienGiai: "Theo dõi doanh thu, chi phí và xác định lãi/lỗ"
    },
    {
      id: "bc-003",
      tenBaoCao: "Tờ khai thuế GTGT hàng tháng",
      loai: "THUE",
      duongDan: "/admin/ke-toan/bao-cao/thue-gtgt",
      dienGiai: "Bảng kê hóa đơn mua vào, bán ra để khấu trừ thuế"
    },
    {
      id: "bc-004",
      tenBaoCao: "Sổ quỹ tiền mặt chi tiết",
      loai: "QUY",
      duongDan: "/admin/ke-toan/bao-cao/so-quy-tien-mat",
      dienGiai: "Chi tiết dòng tiền mặt vào/ra hàng ngày tại két quỹ"
    },
    {
      id: "bc-005",
      tenBaoCao: "Sổ chi tiết tiền gửi ngân hàng",
      loai: "QUY",
      duongDan: "/admin/ke-toan/bao-cao/so-tien-gui",
      dienGiai: "Số liệu chi tiết tài khoản ngân hàng và đối chiếu sổ phụ"
    },
    {
      id: "bc-006",
      tenBaoCao: "Tổng hợp công nợ phải thu (131)",
      loai: "CONG_NO",
      duongDan: "/admin/ke-toan/bao-cao/cong-no-phai-thu",
      dienGiai: "Theo dõi chi tiết số tiền còn nợ của từng khách hàng"
    },
    {
      id: "bc-007",
      tenBaoCao: "Tổng hợp công nợ phải trả (331)",
      loai: "CONG_NO",
      duongDan: "/admin/ke-toan/bao-cao/cong-no-phai-tra",
      dienGiai: "Theo dõi chi tiết số tiền phải trả cho nhà cung cấp"
    },
    {
      id: "bc-008",
      tenBaoCao: "Báo cáo chi tiết doanh số bán hàng",
      loai: "BAN_HANG",
      duongDan: "/admin/ke-toan/bao-cao/doanh-so-ban-hang",
      dienGiai: "Thống kê doanh số theo nhân viên, đại lý, sản phẩm"
    }
  ];

  const categories = [
    { key: "ALL", label: "Tất cả" },
    { key: "TAI_CHINH", label: "Tài chính" },
    { key: "THUE", label: "Thuế" },
    { key: "QUY", label: "Quỹ & NH" },
    { key: "CONG_NO", label: "Công nợ" }
  ];

  const filteredReports = reports.filter((rep) => {
    const matchesSearch = rep.tenBaoCao.toLowerCase().includes(search.toLowerCase()) || 
                          rep.dienGiai.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || rep.loai === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleExport = (reportName: string, type: "EXCEL" | "PDF") => {
    alert(`Đang xuất báo cáo "${reportName}" dưới dạng tệp ${type}...`);
  };

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.75)",
      backdropFilter: "blur(12px)",
      borderRadius: "24px",
      padding: "24px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.6)",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
        Danh Sách Báo Cáo Kế Toán
      </h3>

      {/* Search Input */}
      <div style={{ position: "relative", marginBottom: "14px" }}>
        <input
          type="text"
          placeholder="Tìm báo cáo nhanh..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px 10px 36px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            fontSize: "13px",
            background: "rgba(248, 250, 252, 0.8)",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
        <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#94a3b8" }} />
      </div>

      {/* Categories Tabs */}
      <div style={{
        display: "flex",
        gap: "6px",
        overflowX: "auto",
        marginBottom: "16px",
        paddingBottom: "4px"
      }} className="hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            style={{
              padding: "6px 12px",
              borderRadius: "18px",
              fontSize: "12px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: selectedCategory === cat.key ? "#0f172a" : "rgba(241, 245, 249, 0.8)",
              color: selectedCategory === cat.key ? "white" : "#64748b",
              transition: "all 0.2s"
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Report Items List */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        overflowY: "auto",
        flex: 1,
        maxHeight: "360px"
      }}>
        {filteredReports.length > 0 ? (
          filteredReports.map((rep) => (
            <div
              key={rep.id}
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s hover",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.01)"
              }}
              className="report-item"
            >
              <div style={{ flex: 1, marginRight: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FileText size={14} style={{ color: "#475569" }} />
                  <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                    {rep.tenBaoCao}
                  </h4>
                </div>
                <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#64748b", lineHeight: "1.3" }}>
                  {rep.dienGiai}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                <button
                  onClick={() => handleExport(rep.tenBaoCao, "EXCEL")}
                  title="Xuất Excel"
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "none",
                    color: "#059669",
                    padding: "6px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Download size={13} />
                </button>
                <button
                  onClick={() => handleExport(rep.tenBaoCao, "PDF")}
                  title="Xuất PDF"
                  style={{
                    background: "rgba(244, 63, 94, 0.1)",
                    border: "none",
                    color: "#e11d48",
                    padding: "6px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "30px 10px", color: "#94a3b8", fontSize: "13px" }}>
            Không tìm thấy báo cáo phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}
