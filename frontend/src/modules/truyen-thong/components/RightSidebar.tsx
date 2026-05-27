import React from "react";
import BirthdayAlert from "./Widgets/BirthdayAlert";
import TopAgent from "./Widgets/TopAgent";
import AppDownload from "./Widgets/AppDownload";

export default function RightSidebar() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <BirthdayAlert />
      <TopAgent />
      <AppDownload />
    </div>
  );
}
