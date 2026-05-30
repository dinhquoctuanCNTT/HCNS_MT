import {
  Users,
  Warehouse,
  Handshake,
  ShoppingCart,
  Cog,
  Banknote,
  Network,
  GitFork,
  Megaphone,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import truyenThongImg from "@assets/icons/truyenthong.png";
import daoTaoImg from "@assets/icons/daotao.png";
import kinhDoanhImg from "@assets/icons/kinhdoanh.png";

export type AppModule = {
  id: string;
  icon: LucideIcon;
  imgSrc?: string;
  label: string;
  sub?: string;
  color: string;
  href: string;
  category: string;
};

export const ALL_APPS: AppModule[] = [
  {
    id: "hrm",
    icon: Users,
    label: "HRM",
    sub: "(Nhân sự)",
    color: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    href: "/admin/hrm",
    category: "Nhân sự",
  },
  {
    id: "kho-hang",
    icon: Warehouse,
    label: "Kho hàng",
    color: "linear-gradient(135deg,#0ea5e9,#0369a1)",
    href: "/admin/kho-hang",
    category: "Kinh doanh",
  },
  {
    id: "crm",
    icon: Handshake,
    label: "CRM",
    sub: "(Khách hàng)",
    color: "linear-gradient(135deg,#10b981,#065f46)",
    href: "/admin/crm",
    category: "Kinh doanh",
  },
  {
    id: "mua-hang",
    icon: ShoppingCart,
    label: "Mua hàng",
    color: "linear-gradient(135deg,#f59e0b,#b45309)",
    href: "/admin/mua-hang",
    category: "Kinh doanh",
  },
  {
    id: "san-xuat",
    icon: Cog,
    label: "Sản xuất",
    color: "linear-gradient(135deg,#6366f1,#4338ca)",
    href: "/admin/san-xuat",
    category: "Tài chính",
  },
  {
    id: "ke-toan",
    icon: Banknote,
    label: "Kế toán tài chính",
    color: "linear-gradient(135deg,#ef4444,#b91c1c)",
    href: "/admin/ke-toan/dashboard",
    category: "Tài chính",
  },
  {
    id: "so-do",
    icon: Network,
    label: "Sơ đồ chính",
    color: "linear-gradient(135deg,#ec4899,#9d174d)",
    href: "/admin/so-do",
    category: "Văn phòng số",
  },
  {
    id: "so-do-to-chuc",
    icon: GitFork,
    label: "Sơ đồ tổ chức MTH",
    color: "linear-gradient(135deg,#14b8a6,#0f766e)",
    href: "/admin/so-do-to-chuc-mth",
    category: "Văn phòng số",
  },
  {
    id: "truyen-thong",
    icon: Megaphone,
    imgSrc: truyenThongImg,
    label: "Truyền thông",
    color: "linear-gradient(135deg,#f97316,#c2410c)",
    href: "/admin/truyen-thong",
    category: "Kinh doanh",
  },
  {
    id: "dao-tao",
    icon: GraduationCap,
    imgSrc: daoTaoImg,
    label: "Đào tạo",
    color: "linear-gradient(135deg,#22c55e,#15803d)",
    href: "/admin/dao-tao",
    category: "Nhân sự",
  },
  {
    id: "kinh-doanh",
    icon: TrendingUp,
    imgSrc: kinhDoanhImg,
    label: "Kinh doanh",
    color: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    href: "/admin/ban-hang/thong-tin-kh-360",
    category: "Kinh doanh",
  },
];

export const CATEGORIES = [
  "Ứng dụng của tôi",
  "Tất cả",
  "Tài chính",
  "Kinh doanh",
  "Nhân sự",
  "Văn phòng số",
];
