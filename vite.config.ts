import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASENAME ? process.env.VITE_BASENAME + "/" : undefined,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: {
      path: process.env.VITE_BASENAME
        ? `${process.env.VITE_BASENAME}/__vite_hmr`
        : undefined,
    },
  },
  define: {
    "import.meta.env.VITE_BASENAME": JSON.stringify(
      process.env.VITE_BASENAME || "",
    ),
  },
});
