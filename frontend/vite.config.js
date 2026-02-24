import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/upload-and-generate": "http://localhost:8000",
      "/payment": "http://localhost:8000",
      "/usage-status": "http://localhost:8000",
      "/health": "http://localhost:8000",
    },
  },
});
