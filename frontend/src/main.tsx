import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { PendingCountProvider } from "./context/PendingCountContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PendingCountProvider>
      <App />
    </PendingCountProvider>
  </React.StrictMode>,
);
