import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import "./button.css";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "outline";
  fullWidth?: boolean;
};

const Button = ({
  children,
  variant = "primary",
  fullWidth = true,
  className = "",
  ...props
}: Props) => {
  return (
    <button
      className={`ui-button ${variant} ${fullWidth ? "full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
