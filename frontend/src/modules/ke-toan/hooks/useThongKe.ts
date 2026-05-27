import { useState, useEffect, useCallback } from "react";
import { ThongKeKeToan } from "../types";
import { chungTuApi } from "../services/chungTuApi";

export const useThongKe = () => {
  const [stats, setStats] = useState<ThongKeKeToan>({
    doanhThuBanHang: 0,
    doanhThuThangTruoc: 125000000, // Giá trị tĩnh để đối chiếu %
    chiPhiMuaHang: 0,
    chiPhiThangTruoc: 42000000,
    quyTienMat: 450000000, // Giá trị khởi tạo
    quyNganHang: 1280000000, // Giá trị khởi tạo
    congNoPhaiThu: 0,
    congNoPhaiTra: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const allInvoices = await chungTuApi.getChungTus();

      let doanhThu = 0;
      let chiPhi = 0;
      let phaiThu = 0;
      let phaiTra = 0;

      allInvoices.forEach((inv) => {
        if (inv.loaiChungTu === "HDBH") {
          if (inv.trangThai === "DA_THANH_TOAN") {
            doanhThu += inv.tongThanhTien;
          } else if (inv.trangThai === "CHO_DUYET" || inv.trangThai === "TRA_GOP") {
            phaiThu += inv.tongThanhTien;
          }
        } else if (inv.loaiChungTu === "HDMH") {
          if (inv.trangThai === "DA_THANH_TOAN") {
            chiPhi += inv.tongThanhTien;
          } else {
            phaiTra += inv.tongThanhTien;
          }
        }
      });

      // Cập nhật số quỹ tương ứng
      const quyTienMatGoc = 450000000;
      const quyNganHangGoc = 1280000000;

      setStats({
        doanhThuBanHang: doanhThu,
        doanhThuThangTruoc: 125000000,
        chiPhiMuaHang: chiPhi,
        chiPhiThangTruoc: 42000000,
        quyTienMat: quyTienMatGoc + (doanhThu * 0.4) - (chiPhi * 0.3), // 40% thu tiền mặt, 30% chi tiền mặt
        quyNganHang: quyNganHangGoc + (doanhThu * 0.6) - (chiPhi * 0.7), // 60% qua ngân hàng, 70% qua ngân hàng
        congNoPhaiThu: phaiThu + 12500000, // + công nợ cũ
        congNoPhaiTra: phaiTra + 8500000, // + công nợ cũ
      });
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải thống kê kế toán:", err);
      setError("Không thể tải dữ liệu thống kê tài chính.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, reloadStats: fetchStats };
};
export default useThongKe;
