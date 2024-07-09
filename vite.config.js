import { defineConfig, loadEnv } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.DEFAULT_USER_LOGIN": JSON.stringify(env.DEFAULT_USER_LOGIN),
    },
    plugins: [
      laravel({
        input: "resources/js/app.jsx",
        refresh: true,
      }),
      react(),
    ],
    optimizeDeps: { exclude: ["fsevents"] },
  };
});