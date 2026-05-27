import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@auth":    path.resolve(__dirname, "src/auth"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@shell":   path.resolve(__dirname, "src/shell"),
      "@shared":  path.resolve(__dirname, "src/shared"),
      "@api":     path.resolve(__dirname, "src/api"),
      "@assets":  path.resolve(__dirname, "src/assets"),
      "@data":    path.resolve(__dirname, "src/data"),
      "@router":  path.resolve(__dirname, "src/router"),
      "@context": path.resolve(__dirname, "src/context"),
    },
  },
});
