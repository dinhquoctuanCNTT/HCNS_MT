export interface KhachHang {
  id: string;
  maKH: string;
  tenKH: string;
  mst?: string;
  diaChi?: string;
  email?: string;
  soDienThoai?: string;
  nhomKH?: string; // Khách lẻ, Đại lý, Khách VIP
}

export interface NhaCungCap {
  id: string;
  maNCC: string;
  tenNCC: string;
  mst?: string;
  diaChi?: string;
  soDienThoai?: string;
  email?: string;
}

export interface HangHoa {
  id: string;
  maHH: string;
  tenHH: string;
  donViTinh: string;
  donGiaBan: number;
  donGiaMua: number;
  thueSuat: number; // 0.08 đại diện cho 8%, 0.1 đại diện cho 10%
  tonKho: number;
}

export interface ChiTietHoaDon {
  id: string;
  hangHoaId: string;
  maHH: string;
  tenHH: string;
  donViTinh: string;
  soLuong: number;
  donGia: number;
  thueSuat: number;
  tienThue: number;
  chietKhau: number; // Số tiền chiết khấu
  thanhTien: number; // (soLuong * donGia) - chietKhau + tienThue
}

export type LoaiChungTu = "HDBH" | "HDMH" | "PT" | "PC" | "PKT";

export interface HoaDon {
  id: string;
  soChungTu: string;
  ngayHachToan: string;
  ngayChungTu: string;
  loaiChungTu: LoaiChungTu;
  doiTuongId: string; // KhachHang hoặc NhaCungCap ID
  tenDoiTuong: string;
  diaChiDoiTuong?: string;
  mstDoiTuong?: string;
  dienGiai: string;
  chiTiet: ChiTietHoaDon[];
  tongTienHang: number;
  tongTienChietKhau: number;
  tongTienThue: number;
  tongThanhTien: number;
  trangThai: "DA_THANH_TOAN" | "CHO_DUYET" | "DA_HUY" | "TRA_GOP";
  nguoiLap: string;
}

export interface ThongKeKeToan {
  doanhThuBanHang: number;
  doanhThuThangTruoc: number;
  chiPhiMuaHang: number;
  chiPhiThangTruoc: number;
  quyTienMat: number;
  quyNganHang: number;
  congNoPhaiThu: number;
  congNoPhaiTra: number;
}

export interface BaoCaoItem {
  id: string;
  tenBaoCao: string;
  loai: "TAI_CHINH" | "THUE" | "QUY" | "CONG_NO" | "BAN_HANG";
  duongDan: string;
  dienGiai: string;
}
