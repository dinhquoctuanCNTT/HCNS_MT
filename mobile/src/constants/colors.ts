export const COLORS = {
  primary: "#0484d4",
  primaryDark: "#046fa0",
  primaryDarker: "#0e7fc0",
  primaryLight: "#eff6ff",

  navy: "#1e3a8a",
  blue: "#1d4ed8",
  blueLight: "#dbeafe",

  success: "#22c55e",
  successDark: "#16a34a",
  successLight: "#dcfce7",

  warning: "#d97706",
  warningDark: "#b45309",
  warningLight: "#fef3c7",

  danger: "#ef4444",
  dangerDark: "#dc2626",
  dangerLight: "#fee2e2",

  purple: "#7c3aed",
  purpleLight: "#f5f3ff",

  teal: "#0891b2",
  tealLight: "#e0f7fa",

  white: "#ffffff",
  bg: "#f0f2f7",
  bgSecondary: "#f5f7fa",

  textDark: "#111827",
  textMid: "#374151",
  textSub: "#4b5563",
  textLight: "#9ca3af",

  border: "#e2e8f0",
  borderMid: "#e8ecf2",
  borderLight: "#f3f4f6",

  overlay: "rgba(0,0,0,0.5)",
  overlayDark: "rgba(0,0,0,0.65)",
} as const;

export type ColorKey = keyof typeof COLORS;
export default COLORS;
