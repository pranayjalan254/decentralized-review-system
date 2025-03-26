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
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: "dist", // Ensures built files are stored in "dist/" instead of "src/"
    emptyOutDir: true, // Cleans up old build files before each new build
  },
});
