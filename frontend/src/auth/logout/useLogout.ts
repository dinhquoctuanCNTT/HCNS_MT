import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth.store";

const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuthState } = useAuthStore();

  return () => {
    clearAuthState();
    navigate("/login");
  };
};

export default useLogout;
