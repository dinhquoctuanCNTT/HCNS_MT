import axiosClient from "../../api/axiosClient";

export const updateProfile = async (data: {
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  gender?: string;
  jobTitle?: string;
  departmentName?: string;
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
