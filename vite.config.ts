import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const base =
  process.env.NODE_ENV === "production" ? "/front_7th_chapter3-2/" : "/";

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    base,
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  })
);
