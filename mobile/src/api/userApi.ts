import axiosClient from "./axiosClient";

export type ProfileUpdatePayload = {
  full_name?:     string;
  phone?:         string;
  gender?:        string;
  date_of_birth?: string;
  national_id?:   string;   // CCCD số
  cccd_date?:     string;   // Ngày cấp CCCD
  cccd_place?:    string;   // Nơi cấp CCCD
  address?:       string;
  bank_account?:  string;
};

export const userApi = {
  /** Lấy thông tin profile hiện tại */
  getProfile: () =>
    axiosClient.get("/users/profile"),

  /** Cập nhật thông tin cá nhân */
  updateProfile: (data: ProfileUpdatePayload) =>
    axiosClient.put("/users/profile", data),

  /** Đổi mật khẩu */
  changePassword: (data: { current_password: string; new_password: string }) =>
    axiosClient.put("/users/change-password", data),
};
