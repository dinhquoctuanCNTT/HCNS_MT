import { KhachHang, HangHoa, NhaCungCap } from "../types";

// Mock Data Khách Hàng
const mockKhachHang: KhachHang[] = [
  {
    id: "kh-001",
    maKH: "KH0001",
    tenKH: "Công ty Cổ phần MT Holdings Việt Nam",
    mst: "0109123456",
    diaChi: "Số 12 Khuất Duy Tiến, Thanh Xuân, Hà Nội",
    email: "accounting@mtholdings.vn",
    soDienThoai: "0901234567",
    nhomKH: "Đại lý",
  },
  {
    id: "kh-002",
    maKH: "KH0002",
    tenKH: "Công ty TNHH Thương mại MT Parts",
    mst: "0316543210",
    diaChi: "280 Nguyễn Văn Cừ, Quận Long Biên, Hà Nội",
    email: "parts@mtholdings.vn",
    soDienThoai: "0987654321",
    nhomKH: "Đại lý",
  },
  {
    id: "kh-003",
    maKH: "KH0003",
    tenKH: "Ông Nguyễn Văn Hùng (Khách lẻ)",
    diaChi: "15 Lê Lợi, Ngô Quyền, Hải Phòng",
    email: "hungnv@gmail.com",
    soDienThoai: "0912345678",
    nhomKH: "Khách lẻ",
  },
  {
    id: "kh-004",
    maKH: "KH0004",
    tenKH: "Đại lý Sơn & Hóa Chất MT Paint",
    mst: "0208112233",
    diaChi: "Lô C2 Cụm công nghiệp Đồng Hòa, Kiến An, Hải Phòng",
    email: "paint@mtholdings.vn",
    soDienThoai: "0966888999",
    nhomKH: "Khách VIP",
  },
];

// Mock Data Nhà Cung Cấp
const mockNhaCungCap: NhaCungCap[] = [
  {
    id: "ncc-001",
    maNCC: "NCC0001",
    tenNCC: "Tập đoàn Hóa chất Đức Giang",
    mst: "0100109389",
    diaChi: "Số 18 Ngô Tất Tố, Văn Miếu, Đống Đa, Hà Nội",
    soDienThoai: "02438258386",
    email: "ducgiang@dgc.vn",
  },
  {
    id: "ncc-002",
    maNCC: "NCC0002",
    tenNCC: "Tổng công ty Dung dịch khoan và Hóa phẩm Dầu khí (DMC)",
    mst: "0100108561",
    diaChi: "Tòa nhà Viện Dầu khí Việt Nam, 167 Trung Kính, Yên Hòa, Cầu Giấy, Hà Nội",
    soDienThoai: "02438545588",
    email: "contact@dmc.com.vn",
  },
];

// Mock Data Hàng Hóa
const mockHangHoa: HangHoa[] = [
  {
    id: "hh-001",
    maHH: "HH0001",
    tenHH: "Sơn bóng cao cấp MT-Shield 5L",
    donViTinh: "Thùng",
    donGiaBan: 1250000,
    donGiaMua: 850000,
    thueSuat: 0.1, // 10%
    tonKho: 120,
  },
  {
    id: "hh-002",
    maHH: "HH0002",
    tenHH: "Bột bả tường ngoại thất MT-Plaster 40kg",
    donViTinh: "Bao",
    donGiaBan: 280000,
    donGiaMua: 190000,
    thueSuat: 0.08, // 8%
    tonKho: 350,
  },
  {
    id: "hh-003",
    maHH: "HH0003",
    tenHH: "Dung môi pha sơn MT-Thinner 1L",
    donViTinh: "Chai",
    donGiaBan: 85000,
    donGiaMua: 55000,
    thueSuat: 0.1, // 10%
    tonKho: 500,
  },
  {
    id: "hh-004",
    maHH: "HH0004",
    tenHH: "Sơn chống thấm đa năng MT-Waterproof 18L",
    donViTinh: "Thùng",
    donGiaBan: 2450000,
    donGiaMua: 1750000,
    thueSuat: 0.1, // 10%
    tonKho: 65,
  },
];

export const danhMucApi = {
  // Lấy danh sách Khách hàng
  getKhachHangs: async (): Promise<KhachHang[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockKhachHang]), 300);
    });
  },

  // Lấy danh sách Nhà cung cấp
  getNhaCungCaps: async (): Promise<NhaCungCap[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockNhaCungCap]), 300);
    });
  },

  // Lấy danh sách Hàng hóa
  getHangHoas: async (): Promise<HangHoa[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockHangHoa]), 300);
    });
  },
};
