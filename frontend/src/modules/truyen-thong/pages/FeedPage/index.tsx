import React from "react";
import LeftSidebar from "../../components/LeftSidebar";
import MainFeed from "../../components/Layout/MainFeed";
import RightSidebar from "../../components/RightSidebar";

export default function FeedPage() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "280px minmax(500px, 1fr) 320px",
        gap: "24px",
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "24px",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Left Sidebar - Sticky */}
      <aside
        style={{
          position: "sticky",
          top: "24px",
          height: "fit-content",
          maxHeight: "calc(100vh - 30px)",
          overflowY: "auto",
        }}
        className="hide-scrollbar"
      >
        <LeftSidebar />
      </aside>

      {/* Main Feed - Scrollable */}
      <main
        style={{
          overflowY: "auto",
          height: "calc(100vh - 30px)",
        }}
        className="hide-scrollbar"
      >
        <MainFeed />
      </main>

      {/* Right Sidebar - Sticky */}
      <aside
        style={{
          position: "sticky",
          top: "24px",
          height: "fit-content",
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
        }}
        className="hide-scrollbar"
      >
        <RightSidebar />
      </aside>
    </div>
  );
}
