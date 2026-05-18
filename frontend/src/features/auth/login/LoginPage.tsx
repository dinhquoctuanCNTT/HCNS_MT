import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { authService } from "../auth.service";
import { useAuthStore } from "../auth.store";
import type { LoginFromValues } from "./login.types";
import "./login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState<LoginFromValues>({
    employee_code: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!form.employee_code || !form.password) {
      setMessage("Vui lòng nhập mã nhân viên và mật khẩu");
      return;
    }
    try {
      setLoading(true);
      const data = await authService.login(form);
      setAuth(data.token, data.user);
      navigate("/admin/dashboard");
    } catch (error: any) {
      const res = error?.response?.data;
      const status = error?.response?.status;
      if (res?.needOtp && res?.email) {
        navigate(`/verify-otp?email=${encodeURIComponent(res.email)}`);
        return;
      }
      if (status === 401) {
        setMessage("Mã nhân viên hoặc mật khẩu không đúng.");
      } else {
        setMessage(res?.message || "Đăng nhập thất bại, vui lòng thử lại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h3 className="lp-system">HỆ THỐNG QUẢN LÝ NHÂN SỰ</h3>
      <p className="lp-sub">Hãy đăng nhập tài khoản của bạn</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="lp-form">
        <div className="lp-fields-row">
          {/* Tài khoản */}
          <div className="lp-field">
            <label className="lp-label">Tài khoản</label>
            <input
              type="tel"
              className="lp-input"
              placeholder="Nhập mã nhân viên (VD: MTH67)"
              value={form.employee_code}
              onChange={(e) =>
                setForm((p) => ({ ...p, employee_code: e.target.value }))
              }
            />
          </div>

          {/* Mật khẩu */}
          <div className="lp-field">
            <label className="lp-label">Mật khẩu</label>
            <div className="lp-input-wrap">
              <button
                type="button"
                className="lp-eye"
                onClick={() => setShowPass((s) => !s)}
              >
                {showPass ? "🙉" : "🙈"}
              </button>
              <input
                type={showPass ? "text" : "password"}
                className="lp-input lp-input--has-icon"
                placeholder="Nhập mật khẩu tại đây"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {message && <p className="lp-error">{message}</p>}

        <div className="lp-divider" />

        <div className="lp-actions">
          <button type="submit" className="lp-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
