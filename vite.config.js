import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/NET-Ai-EcoSystem-CommandStation/",
  build: {
    outDir: "docs",
  },
});
