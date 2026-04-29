export type Tab = "calendar" | "list" | "explain";
export type DayStatus =
  | "present"
  | "late"
  | "absent"
  | "weekend"
  | "today"
  | "future";

export interface DayDetail {
  day: number;
  record: any | null;
  status: DayStatus;
  dayOfWeek: string;
  dateStr: string;
}

// Stack param list cho HistoryStack
export type HistoryStackParamList = {
  HistoryMain: undefined;
  DayDetail: { detail: DayDetail };
  UpdateRequest: { detail: DayDetail };
};
