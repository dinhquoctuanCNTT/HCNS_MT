import type { PropsWithChildren } from "react";
import "./auth-layout.css";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout-left">
        <div className="auth-brand-box">
          <div className="auth-brand-logo"></div>
          <h1>Orix Pet</h1>
          <p>Community we all need</p>
        </div>
      </div>
      <div className="auth-layout-right">{children}</div>
    </div>
  );
};
export default AuthLayout;
