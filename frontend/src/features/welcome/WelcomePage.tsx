import { useNavigate } from "react-router-dom";
import "./welcome.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      {/* Header nền màu */}
      <div className="welcome-header">
        <img
          src="/mt-logo.png"
          alt="MT Holdings"
          className="welcome-logo-img"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <h1 className="welcome-brand">MT Holdings</h1>
        <p className="welcome-tagline">Hệ thống quản lý nhân sự</p>
      </div>

      {/* Card trắng nổi lên */}
      <div className="welcome-card">
        {/* Input giả — dẫn sang login khi bấm */}
        <div className="welcome-input-fake" onClick={() => navigate("/login")}>
          <span>Số điện thoại</span>
        </div>
        <div className="welcome-input-fake" onClick={() => navigate("/login")}>
          <span>Mật khẩu</span>
        </div>

        <div className="welcome-remember">
          <label className="welcome-checkbox-wrap">
            <input type="checkbox" defaultChecked />
            <span>Ghi nhớ đăng nhập</span>
          </label>
        </div>

        <button
          className="welcome-btn-login"
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
