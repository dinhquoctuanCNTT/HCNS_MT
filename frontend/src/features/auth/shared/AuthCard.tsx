import type { PropsWithChildren } from "react";
import "./authCard.css";

const AuthCard = ({ children }: PropsWithChildren) => {
  return <div className="auth-card">{children}</div>;
};

export default AuthCard;
