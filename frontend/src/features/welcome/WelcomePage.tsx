import { useNavigate } from "react-router-dom";
import Button from "../../shared/ui/Button/Button";
import "./welcome.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-logo">🐾</div>
        <h1>Orix Pet</h1>
        <p className="muted-text">Chào mừng</p>

        <div className="welcome-actions">
          <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
          <Button variant="outline" onClick={() => navigate("/register")}>
            Đăng ký
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
