import type { PropsWithChildren } from "react";
import "./auth-layout.css";
import mtLogo from "../../assets/Logo MT Holdings New-01.png";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout-left">
        <div className="auth-left-inner">
          <h2 className="auth-left-title">
            GIẢI PHÁP QUẢN LÝ
            <br />
            NHÂN SỰ TOÀN DIỆN
          </h2>
          <p className="auth-left-sub">
            CHÍNH XÁC – NHANH – HIỆU QUẢ – TIẾT KIỆM
          </p>
        </div>
      </div>

      <div className="auth-layout-right">
        <div className="auth-right-inner">
          <div className="auth-logo-wrap">
            <img src={mtLogo} alt="MT Holdings" className="auth-logo" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
