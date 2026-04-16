import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import AuthCard from "../shared/AuthCard";
import Input from "../../../shared/ui/Input/Input";
import Button from "../../../shared/ui/Button/Button";
import { authService } from "../auth.service";
import { useAuthStore } from "../auth.store";
import type { LoginFromValues } from "./login.types";
import "./login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState<LoginFromValues>({
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = await authService.login(form);
      setAuth(data.token, data.user);
      navigate("/admin/dashboard");
    } catch (error: any) {
      const res = error?.response?.data;

      if (res?.needOtp && res?.email) {
        navigate(`/verify-otp?email=${encodeURIComponent(res.email)}`);
        return;
      }

      setMessage(res?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <h2 className="login-title">Đăng nhập</h2>

        <form onSubmit={handleSubmit}>
          <Input
            label="Tài khoản"
            type="text"
            placeholder="Nhập số điện thoại đăng nhập"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
          />

          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          {message && <p className="error-text">{message}</p>}

          <Button type="submit">Đăng nhập</Button>
        </form>

        <p className="login-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;
