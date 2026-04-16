import type { InputHTMLAttributes } from "react";
import "./input.css";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Input = ({ label, error, ...props }: Props) => {
  return (
    <div className="ui-input-group">
      <label className="ui-input-label">{label}</label>
      <input className="ui-input" {...props} />
      {error ? <span className="ui-input-error">{error}</span> : null}
    </div>
  );
};

export default Input;
