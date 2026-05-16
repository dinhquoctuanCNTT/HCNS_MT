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

// Tab Schedule: HistoryMain là màn đầu, Stats là màn thứ hai
export type HistoryStackParamList = {
  HistoryMain: undefined;
  Stats: undefined;
  DayDetail: { detail: DayDetail };
  UpdateRequest: { detail: DayDetail };
  ExplanationHistory: undefined;
};

// Root stack chỉ còn Tabs và RegisterFace
export type RootStackParamList = {
  Tabs: undefined;
  RegisterFace: undefined;
};
