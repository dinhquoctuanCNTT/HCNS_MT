import { DayStatus } from "./types";

export const DOW_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
export const DOW_FULL = [
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
  "Chủ Nhật",
];
export const MONTH_PILLS = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
];

export function fmtTime(iso: string) {
  const timePart = iso.split("T")[1] ?? "";
  const [h, m] = timePart.split(":").map(Number);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function fmtDate(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function dowIdx(d: Date) {
  const j = d.getDay();
  return j === 0 ? 6 : j - 1;
}

export function isLate(r: any) {
  if (!r?.check_in) return false;
  const parts = r.check_in.split("T");
  if (parts.length < 2) return false;
  const timePart = parts[1];
  const [h, m] = timePart.split(":").map(Number);
  return h > 8 || (h === 8 && m > 5);
}

export function buildGrid(year: number, month: number): (number | null)[][] {
  const start = dowIdx(new Date(year, month, 1));
  const last = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(start).fill(null),
    ...Array.from({ length: last }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function getDayStatus(
  day: number,
  year: number,
  month: number,
  recMap: Map<number, any>,
  today: Date,
): DayStatus {
  const date = new Date(year, month, day);
  const dow = date.getDay();
  const isToday =
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  if (dow === 0) return "weekend"; // chỉ CN là weekend, T7 tính bình thường
  if (date > today && !isToday) return "future";
  if (isToday) return "today";
  const rec = recMap.get(day);
  if (!rec) return "absent";
  return isLate(rec) ? "late" : "present";
}
