import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env": process.env,
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  envPrefix: "VITE_",
  server: {
    hmr: true, // Ensure HMR is enabled
    watch: {
      usePolling: true, // Useful in Docker, WSL, or networked file systems
    },
  },
});
