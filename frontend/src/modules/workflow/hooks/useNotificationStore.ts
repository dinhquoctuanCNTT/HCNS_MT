// features/workflow/hooks/useNotificationStore.ts
import { create } from "zustand";

export interface OverdueNotification {
  id: number;
  title: string;
  roleText: string;
  dueDate: string;
  seenAt?: number;
  createdAt: number;
  type: "overdue" | "new_task"; // ✅ thêm type
}

interface NotificationStore {
  notifications: OverdueNotification[];
  addNotification: (n: OverdueNotification) => void;
  markAllSeen: () => void;
  clearAll: () => void; // ✅ thêm
  unseenCount: () => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  addNotification: (n) =>
    set((state) => {
      const existing = state.notifications.find(
        (x) => x.id === n.id && x.type === n.type,
      );
      if (existing && Date.now() - existing.createdAt < 60 * 60 * 1000)
        return state;
      return {
        notifications: [n, ...state.notifications].slice(0, 50),
      };
    }),

  markAllSeen: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        seenAt: n.seenAt ?? Date.now(),
      })),
    })),

  clearAll: () => set({ notifications: [] }), // ✅ thêm

  unseenCount: () => get().notifications.filter((n) => !n.seenAt).length,
}));
