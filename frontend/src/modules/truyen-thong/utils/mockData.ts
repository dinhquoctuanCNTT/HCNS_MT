import { IPost } from "../types";

export const mockPosts: IPost[] = [
  {
    id: "1",
    author: {
      id: "u1",
      name: "Nguyễn Văn An",
      avatar: "",
      department: "Phòng Kinh doanh",
    },
    content:
      "Chúc mừng đội ngũ Marketing đã hoàn thành xuất sắc chiến dịch Q1! Doanh số tăng trưởng 25% so với cùng kỳ năm ngoái. Đây là kết quả của sự nỗ lực và sáng tạo không ngừng nghỉ. Tiếp tục phát huy! 🎉",
    createdAt: "2 giờ trước",
    likes: 42,
    comments: [],
    aiSummary:
      "Đội Marketing hoàn thành chiến dịch Q1 với doanh số tăng 25% so với cùng kỳ năm ngoái.",
  },
  {
    id: "2",
    author: {
      id: "u2",
      name: "Trần Thị Bình",
      avatar: "",
      department: "Phòng Nhân sự",
    },
    content:
      "Thông báo: Chương trình đào tạo kỹ năng mềm cho nhân viên mới sẽ được tổ chức vào thứ 6 tuần này. Đăng ký tại phòng Nhân sự trước 17h hôm nay. Chương trình bao gồm: Giao tiếp hiệu quả, Làm việc nhóm, Quản lý thời gian.",
    createdAt: "5 giờ trước",
    likes: 18,
    comments: [
      {
        id: "c1",
        user: {
          id: "u3",
          name: "Lê Văn Cường",
          avatar: "",
          department: "Phòng IT",
        },
        content: "Đã đăng ký, cảm ơn phòng Nhân sự!",
        createdAt: "4 giờ trước",
      },
    ],
  },
  {
    id: "3",
    author: {
      id: "u4",
      name: "Phạm Minh Đức",
      avatar: "",
      department: "Phòng IT",
    },
    content:
      "Hệ thống ERP mới đã được triển khai thành công! Cảm ơn sự hợp tác của tất cả các phòng ban. Nếu có bất kỳ vấn đề gì, vui lòng liên hệ IT Support qua ext 1234.",
    createdAt: "1 ngày trước",
    likes: 56,
    comments: [
      {
        id: "c2",
        user: {
          id: "u5",
          name: "Hoàng Thị Em",
          avatar: "",
          department: "Phòng Kế toán",
        },
        content: "Hệ thống chạy rất mượt, giao diện thân thiện hơn nhiều!",
        createdAt: "1 ngày trước",
      },
      {
        id: "c3",
        user: {
          id: "u6",
          name: "Vũ Văn Phong",
          avatar: "",
          department: "Phòng Kinh doanh",
        },
        content: "Tuyệt vời! Làm việc hiệu quả hơn rất nhiều.",
        createdAt: "1 ngày trước",
      },
    ],
    aiSummary:
      "Hệ thống ERP mới đã triển khai thành công, liên hệ IT Support qua ext 1234 nếu có vấn đề.",
  },
];
