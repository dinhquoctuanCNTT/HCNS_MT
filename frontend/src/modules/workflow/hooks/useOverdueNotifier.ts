// features/workflow/hooks/useOverdueNotifier.ts
import { useEffect, useRef } from "react";
import { useNotificationStore } from "./useNotificationStore";

export interface NotifiableItem {
  id: number;
  title: string;
  due_date?: string | null;
  is_completed: boolean;
  is_archived?: boolean;
  reporter_id?: number | null;
  assignee_id?: number | null;
}

const POLL_INTERVAL_MS = 60 * 1000;
const NOTIFY_AGAIN_AFTER = 60 * 60 * 1000;

export function useOverdueNotifier(
  items: NotifiableItem[],
  currentUserId: number,
): void {
  const notifiedRef = useRef<Map<number, number>>(new Map());
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    const check = () => {
      if (!currentUserId) return;
      const now = Date.now();

      items.forEach((item) => {
        if (item.is_completed || item.is_archived || !item.due_date) return;

        const dueTime = new Date(item.due_date).getTime();
        if (isNaN(dueTime) || dueTime >= now) return;

        const isReporter = item.reporter_id === currentUserId;
        const isAssignee = item.assignee_id === currentUserId;
        if (!isReporter && !isAssignee) return;

        const lastNotified = notifiedRef.current.get(item.id);
        if (lastNotified && now - lastNotified < NOTIFY_AGAIN_AFTER) return;

        notifiedRef.current.set(item.id, now);

        const roleText = isAssignee ? "bạn thực hiện" : "bạn giao";

        addNotification({
          id: item.id,
          title: item.title,
          roleText,
          dueDate: item.due_date!,
          createdAt: now,
          type: "overdue", // ✅ thêm type
        });
      });
    };

    check();
    const id = setInterval(check, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [items, currentUserId, addNotification]);
}
