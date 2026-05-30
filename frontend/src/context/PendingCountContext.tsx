import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import axiosClient from "../api/axiosClient";
import { useAuthStore } from "../features/auth/auth.store";

// Only these roles can access the pending-count endpoint
const ROLES_WITH_PENDING = ["admin", "director", "branch_manager", "department_head"];

interface PendingCountContextType {
  pendingCount: number;
  refreshPendingCount: () => void;
}

const PendingCountContext = createContext<PendingCountContextType>({
  pendingCount: 0,
  refreshPendingCount: () => {},
});

export function PendingCountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingCount, setPendingCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { role } = useAuthStore();

  const refreshPendingCount = useCallback(async () => {
    if (!role || !ROLES_WITH_PENDING.includes(role)) return;
    try {
      const res = await axiosClient.get("/api/explanations/pending-count");
      setPendingCount(res.data.count ?? 0);
    } catch {
      // silent fail
    }
  }, [role]);

  useEffect(() => {
    // Fetch ngay khi mount
    refreshPendingCount();

    // Poll mỗi 60 giây
    intervalRef.current = setInterval(refreshPendingCount, 60_000);

    // Lắng nghe custom event từ PheDuyetGiaiTrinhPage
    const handler = () => refreshPendingCount();
    window.addEventListener("explanation:updated", handler);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("explanation:updated", handler);
    };
  }, [refreshPendingCount]);

  return (
    <PendingCountContext.Provider value={{ pendingCount, refreshPendingCount }}>
      {children}
    </PendingCountContext.Provider>
  );
}

export function usePendingCount() {
  return useContext(PendingCountContext);
}

// Helper: gọi sau khi approve/reject để trigger update
export function triggerExplanationUpdate() {
  window.dispatchEvent(new Event("explanation:updated"));
}
