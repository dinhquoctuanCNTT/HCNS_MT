import { HoaDon } from "../types";

// Mock Data Hóa Đơn Ban Đầu
const INITIAL_HOA_DONS: HoaDon[] = [
  {
    id: "hd-001",
    soChungTu: "HDBH-2605-0001",
    ngayHachToan: "2026-05-26",
    ngayChungTu: "2026-05-26",
    loaiChungTu: "HDBH",
    doiTuongId: "kh-001",
    tenDoiTuong: "Công ty Cổ phần MT Holdings Việt Nam",
    mstDoiTuong: "0109123456",
    diaChiDoiTuong: "Số 12 Khuất Duy Tiến, Thanh Xuân, Hà Nội",
    dienGiai: "Bán sơn bóng cao cấp MT-Shield 5L và Dung môi pha sơn",
    chiTiet: [
      {
        id: "ct-001",
        hangHoaId: "hh-001",
        maHH: "HH0001",
        tenHH: "Sơn bóng cao cấp MT-Shield 5L",
        donViTinh: "Thùng",
        soLuong: 10,
        donGia: 1250000,
        thueSuat: 0.1,
        tienThue: 1250000,
        chietKhau: 500000,
        thanhTien: 13250000, // 12.5M - 0.5M + 1.25M
      },
      {
        id: "ct-002",
        hangHoaId: "hh-003",
        maHH: "HH0003",
        tenHH: "Dung môi pha sơn MT-Thinner 1L",
        donViTinh: "Chai",
        soLuong: 20,
        donGia: 85000,
        thueSuat: 0.1,
        tienThue: 170000,
        chietKhau: 0,
        thanhTien: 1870000, // 1.7M + 170k
      },
    ],
    tongTienHang: 14200000,
    tongTienChietKhau: 500000,
    tongTienThue: 1420000,
    tongThanhTien: 15120000,
    trangThai: "DA_THANH_TOAN",
    nguoiLap: "Kế toán viên Lê Thị Mai",
  },
  {
    id: "hd-002",
    soChungTu: "HDBH-2605-0002",
    ngayHachToan: "2026-05-25",
    ngayChungTu: "2026-05-25",
    loaiChungTu: "HDBH",
    doiTuongId: "kh-003",
    tenDoiTuong: "Ông Nguyễn Văn Hùng (Khách lẻ)",
    diaChiDoiTuong: "15 Lê Lợi, Ngô Quyền, Hải Phòng",
    dienGiai: "Bán lẻ bột bả tường ngoại thất",
    chiTiet: [
      {
        id: "ct-003",
        hangHoaId: "hh-002",
        maHH: "HH0002",
        tenHH: "Bột bả tường ngoại thất MT-Plaster 40kg",
        donViTinh: "Bao",
        soLuong: 15,
        donGia: 280000,
        thueSuat: 0.08,
        tienThue: 336000,
        chietKhau: 0,
        thanhTien: 4536000, // 4.2M + 336k
      },
    ],
    tongTienHang: 4200000,
    tongTienChietKhau: 0,
    tongTienThue: 336000,
    tongThanhTien: 4536000,
    trangThai: "CHO_DUYET",
    nguoiLap: "Kế toán viên Lê Thị Mai",
  },
  {
    id: "hd-003",
    soChungTu: "HDMH-2605-0001",
    ngayHachToan: "2026-05-24",
    ngayChungTu: "2026-05-24",
    loaiChungTu: "HDMH",
    doiTuongId: "ncc-001",
    tenDoiTuong: "Tập đoàn Hóa chất Đức Giang",
    mstDoiTuong: "0100109389",
    diaChiDoiTuong: "Số 18 Ngô Tất Tố, Văn Miếu, Đống Đa, Hà Nội",
    dienGiai: "Mua bột màu và phụ gia hóa chất phục vụ sản xuất",
    chiTiet: [],
    tongTienHang: 48000000,
    tongTienChietKhau: 0,
    tongTienThue: 4800000,
    tongThanhTien: 5280000,
    trangThai: "DA_THANH_TOAN",
    nguoiLap: "Trưởng phòng Kế toán",
  },
];

// Khởi tạo localStorage nếu chưa có để lưu trạng thái
const STORAGE_KEY = "mt_ketoan_chung_tu";
if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HOA_DONS));
}

export const chungTuApi = {
  // Lấy danh sách toàn bộ chứng từ/hóa đơn
  getChungTus: async (): Promise<HoaDon[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        resolve(data ? JSON.parse(data) : []);
      }, 300);
    });
  },

  // Lấy chi tiết chứng từ theo ID
  getChungTuById: async (id: string): Promise<HoaDon | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        const list: HoaDon[] = data ? JSON.parse(data) : [];
        const item = list.find((h) => h.id === id) || null;
        resolve(item);
      }, 200);
    });
  },

  // Tạo mới chứng từ
  createChungTu: async (invoice: Omit<HoaDon, "id">): Promise<HoaDon> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        const list: HoaDon[] = data ? JSON.parse(data) : [];
        const newInvoice: HoaDon = {
          ...invoice,
          id: `hd-${Date.now()}`,
        };
        const updatedList = [newInvoice, ...list];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        resolve(newInvoice);
      }, 300);
    });
  },

  // Cập nhật trạng thái chứng từ (ví dụ duyệt hoặc thanh toán)
  updateStatus: async (id: string, status: HoaDon["trangThai"]): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        const list: HoaDon[] = data ? JSON.parse(data) : [];
        const idx = list.findIndex((h) => h.id === id);
        if (idx !== -1) {
          list[idx].trangThai = status;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  },

  // Xóa chứng từ
  deleteChungTu: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        const list: HoaDon[] = data ? JSON.parse(data) : [];
        const filteredList = list.filter((h) => h.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredList));
        resolve(true);
      }, 200);
    });
  },
};
