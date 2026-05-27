import { useState } from "react";
import { 
  ShoppingCart, 
  FileSpreadsheet, 
  TrendingUp, 
  Wallet, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  BookOpen,
  DollarSign
} from "lucide-react";

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  glowColor: string;
  details: string[];
}

export default function ProcessFlow() {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const steps: FlowStep[] = [
    {
      id: "sales",
      title: "1. Bán Hàng",
      description: "Lập báo giá, hóa đơn bán hàng & doanh thu",
      icon: ShoppingCart,
      color: "from-emerald-400 to-teal-600",
      glowColor: "rgba(16, 185, 129, 0.4)",
      details: [
        "Lập báo giá gửi khách hàng",
        "Tạo hóa đơn bán hàng (HDBH)",
        "Ghi nhận doanh thu, thuế VAT đầu ra",
        "Theo dõi công nợ phải thu (131)"
      ]
    },
    {
      id: "purchase",
      title: "2. Mua Hàng",
      description: "Nhập mua nguyên vật liệu, dịch vụ",
      icon: DollarSign,
      color: "from-amber-400 to-orange-600",
      glowColor: "rgba(245, 158, 11, 0.4)",
      details: [
        "Tiếp nhận đơn mua hàng & hóa đơn NCC",
        "Lập hóa đơn mua hàng (HDMH)",
        "Ghi nhận chi phí, VAT đầu vào được khấu trừ",
        "Theo dõi công nợ phải trả (331)"
      ]
    },
    {
      id: "funds",
      title: "3. Quỹ & Ngân Hàng",
      description: "Thu, chi tiền mặt, chuyển khoản",
      icon: Wallet,
      color: "from-blue-400 to-indigo-600",
      glowColor: "rgba(59, 130, 246, 0.4)",
      details: [
        "Lập phiếu thu (PT) tiền bán hàng",
        "Lập phiếu chi (PC) thanh toán nhà cung cấp",
        "Ủy nhiệm chi ngân hàng",
        "Đối chiếu sổ phụ ngân hàng hàng ngày"
      ]
    },
    {
      id: "general_ledger",
      title: "4. Tổng Hợp (Sổ Cái)",
      description: "Kết chuyển, khấu trừ VAT & chi phí",
      icon: BookOpen,
      color: "from-purple-400 to-pink-600",
      glowColor: "rgba(168, 85, 247, 0.4)",
      details: [
        "Định khoản các nghiệp vụ tổng hợp (PKT)",
        "Trích khấu hao TSCĐ, phân bổ CCDC",
        "Khấu trừ thuế VAT đầu vào - đầu ra",
        "Kết chuyển doanh thu, chi phí, xác định lãi lỗ"
      ]
    },
    {
      id: "reports",
      title: "5. Báo Cáo Tài Chính",
      description: "Xem BC kết quả KD, Bảng CĐKT, Thuế",
      icon: FileSpreadsheet,
      color: "from-rose-400 to-red-600",
      glowColor: "rgba(244, 63, 94, 0.4)",
      details: [
        "Lập bảng cân đối kế toán",
        "Báo cáo kết quả hoạt động kinh doanh (B02-DN)",
        "Báo cáo lưu chuyển tiền tệ (B03-DN)",
        "Thuyết minh báo cáo tài chính"
      ]
    }
  ];

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.75)",
      backdropFilter: "blur(12px)",
      borderRadius: "24px",
      padding: "28px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.6)",
      marginBottom: "24px",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>
            Sơ Đồ Nghiệp Vụ Kế Toán Liên Kết
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
            Bấm vào từng bước để xem mô tả quy trình hạch toán chi tiết
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", background: "rgba(16, 185, 129, 0.1)", color: "#059669", padding: "6px 12px", borderRadius: "20px", fontWeight: 600 }}>
          <ShieldCheck size={14} /> Chuẩn Thông Tư 200 / 133
        </div>
      </div>

      {/* Grid Steps */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
        gap: "16px",
        position: "relative",
        zIndex: 2
      }}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === step.id;

          return (
            <div 
              key={step.id}
              onClick={() => setActiveStep(isSelected ? null : step.id)}
              style={{
                background: isSelected ? "white" : "rgba(255, 255, 255, 0.5)",
                border: isSelected ? `2px solid rgba(59, 130, 246, 0.5)` : "1px solid rgba(226, 232, 240, 0.8)",
                borderRadius: "16px",
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isSelected 
                  ? `0 12px 24px ${step.glowColor}` 
                  : "0 4px 6px rgba(0, 0, 0, 0.01)",
                transform: isSelected ? "translateY(-4px)" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                position: "relative"
              }}
            >
              <div style={{
                background: `linear-gradient(135deg, ${step.color.replace("from-", "").replace("to-", "")})`,
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                marginBottom: "12px",
                boxShadow: `0 4px 12px ${step.glowColor}`
              }}>
                <Icon size={22} />
              </div>

              <h4 style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
                {step.title}
              </h4>
              <p style={{ margin: 0, fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>
                {step.description}
              </p>

              {/* Arrow indicator for medium & up devices */}
              {idx < steps.length - 1 && (
                <div style={{
                  position: "absolute",
                  right: "-12px",
                  top: "30px",
                  zIndex: 3,
                  color: "#cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none"
                }} className="flow-arrow">
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Process Flow Active Step Detail Drawer */}
      {activeStep && (
        <div style={{
          marginTop: "20px",
          padding: "20px",
          background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          animation: "slideDown 0.25s ease-out forwards",
        }}>
          {steps.filter(s => s.id === activeStep).map(step => (
            <div key={step.id}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "white",
                  background: "rgba(15, 23, 42, 0.85)"
                }}>HƯỚNG DẪN NGHIỆP VỤ</span>
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                  {step.title} - Chi tiết các bước hạch toán
                </h4>
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: "20px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "10px"
              }}>
                {step.details.map((detail, i) => (
                  <li key={i} style={{ fontSize: "13px", color: "#334155", lineHeight: "1.5" }}>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
