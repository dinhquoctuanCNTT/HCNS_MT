export interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  gender?: string;
  job_title?: string;
  department_name?: string;
  avatar_url?: string;
  role: "user" | "admin";
}
