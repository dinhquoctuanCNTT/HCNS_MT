import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import axiosClient from "../api/axiosClient";

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

  const refreshPendingCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axiosClient.get("/api/explanations/pending-count");
      setPendingCount(res.data.count ?? 0);
    } catch {
      // silent fail
    }
  }, []);

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
