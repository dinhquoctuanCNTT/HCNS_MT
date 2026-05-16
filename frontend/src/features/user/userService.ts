import axiosClient from "../../api/axiosClient";

// ─── Profile ──────────────────────────────────────────────────────────────────
export const getProfile = async () => {
  const res = await axiosClient.get("/api/users/profile");
  return res.data;
};

export const updateProfile = async (data: {
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  gender?: string;
  jobTitle?: string;
  departmentName?: string;
  // Mới
  national_id?: string;
  country?: string;
  city?: string;
  ward?: string;
  alley?: string;
  house_number?: string;
}) => {
  const res = await axiosClient.put("/api/users/profile", data);
  return res.data;
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await axiosClient.post("/api/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getQrCode = async () => {
  const res = await axiosClient.get("/api/users/qr");
  return res.data;
};

// ─── Password ─────────────────────────────────────────────────────────────────
export const changePassword = async (data: {
  current_password: string;
  new_password: string;
}) => {
  const res = await axiosClient.put("/api/users/change-password", data);
  return res.data;
};

// ─── Settings ─────────────────────────────────────────────────────────────────
export const getSettings = async () => {
  const res = await axiosClient.get("/api/settings");
  return res.data;
};

export const updateSettings = async (data: {
  notify_email?: boolean;
  notify_push?: boolean;
  language?: string;
  theme?: string;
}) => {
  const res = await axiosClient.put("/api/settings", data);
  return res.data;
};

// ─── Support ──────────────────────────────────────────────────────────────────
export const createSupportTicket = async (data: {
  title: string;
  content: string;
}) => {
  const res = await axiosClient.post("/api/support/tickets", data);
  return res.data;
};

export const getMyTickets = async () => {
  const res = await axiosClient.get("/api/support/my-tickets");
  return res.data;
};
