import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) return "vendor";
          if (id.includes("/demos/_shared/")) return "demo-shared";
          if (id.includes("/demos/invenflow/")) return "demo-invenflow";
          if (id.includes("/demos/invoice-sense/")) return "demo-invoice-sense";
          if (id.includes("/demos/channelflow/")) return "demo-channelflow";
          if (id.includes("/demos/kitchen-fresh/")) return "demo-kitchen-fresh";
          if (id.includes("/demos/people-culture/")) return "demo-people-culture";
          return undefined;
        },
      },
    },
  },
})
