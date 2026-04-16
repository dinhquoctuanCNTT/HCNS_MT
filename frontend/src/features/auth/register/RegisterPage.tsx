import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../shared/AuthCard";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import Input from "../../../shared/ui/Input/Input";
import Button from "../../../shared/ui/Button/Button";
import { authService } from "../auth.service";
import type { RegisterFormValues } from "./register.types";
import "./register.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterFormValues>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await authService.register(form);

      setMessage("Đăng ký thành công");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Đăng ký thất bại");
    }
  };
  return (
    <AuthLayout>
      <AuthCard>
        <h2 className="register-title">Sign up</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            value={form.fullName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />
          <Input
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
          <Input
            label="Email"
            placeholder="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Input
            label="Mật khẩu"
            placeholder="password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
          />
          {message ? <p className="error-text">{message}</p> : null}

          <Button type="submit">Đăng ký</Button>
        </form>

        <p className="register-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};
export default RegisterPage;
