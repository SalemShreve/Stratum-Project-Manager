import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [sveltekit()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
    // Vitest runs in Node, but Svelte components need the browser entry points
    resolve: process.env.VITEST ? { conditions: ["browser"] } : undefined,

    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./vitest-setup.ts"],
        include: ["src/**/*.{test,spec}.{js,ts}"],
        exclude: ["e2e/**", "node_modules/**", "src-tauri/**"],
    },
}));
