import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"
import { sentryVitePlugin } from "@sentry/vite-plugin"
import sourceIdentifierPlugin from 'vite-plugin-source-identifier'

const isProd = process.env.BUILD_MODE === 'prod'
const isTest = process.env.VITEST === "true" || process.env.NODE_ENV === "test"
export default defineConfig({
  plugins: [
    react(),
    sourceIdentifierPlugin({
      enabled: !isProd && !isTest,
      attributePrefix: 'data-matrix',
      includeProps: true,
    }),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: "hidden",
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-context-menu",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-label",
            "@radix-ui/react-menubar",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group",
            "@radix-ui/react-tooltip",
          ],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-analytics": ["posthog-js"],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/hooks/**", "src/components/**", "src/pages/**", "src/contexts/**"],
    },
  },
})
