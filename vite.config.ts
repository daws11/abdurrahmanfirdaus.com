import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
//
// Chunk graph (avoids the circular import that crashed production):
//   vendor                 → node_modules (React, framer-motion, lucide, etc.)
//   demo-shared            → primitives only (Shell, TopBar, Sidebar, Brand,
//                            Button, Badge, Field, Sheet, Stepper, Kanban,
//                            EmptyState, StatTile, DataTable, theme,
//                            useTheme). NO fixtures.
//   demo-fixtures          → _shared/fixtures/* (OUTLETS, SKUS, EMPLOYEES,
//                            INVOICES, BOOKINGS, KITCHEN). Imported by
//                            every demo chunk but doesn't import any demo.
//   demo-<id>              → the per-app entry + screens + mocks.
//
// The old rule put `_shared/fixtures/` inside the `demo-shared` chunk,
// which produced `demo-shared` ↔ `demo-<id>` cycles whenever a per-app
// screens file imported fixtures. That triggered a TDZ crash
// ("Cannot access R before initialization") on first render in production.
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
          if (id.includes("/demos/_shared/fixtures/")) return "demo-fixtures";
          if (id.includes("/demos/_shared/")) return "demo-shared";
          if (id.includes("/demos/invenflow/")) return "demo-invenflow";
          if (id.includes("/demos/invoice-sense/")) return "demo-invoice-sense";
          if (id.includes("/demos/channelflow/")) return "demo-channelflow";
          if (id.includes("/demos/kitchen-fresh/")) return "demo-kitchen-fresh";
          if (id.includes("/demos/people-culture/")) return "demo-people-culture";
          if (id.includes("/demos/taxai-wizard/")) return "demo-taxai-wizard";
          if (id.includes("/demos/taxai-chat/")) return "demo-taxai-chat";
          if (id.includes("/demos/taxai-talk/")) return "demo-taxai-talk";
          return undefined;
        },
      },
    },
  },
})
