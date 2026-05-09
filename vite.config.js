import { defineConfig } from "vite";
import { resolve } from 'path';
import react from "@vitejs/plugin-react";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  // 1. 根目录（默认是项目根，需确认）
  root: process.cwd(),
  // 2. 入口HTML（必须指向index.html）
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, 'index.html'), // 关键：确保指向根目录的index.html
    },
  },
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 11420,
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
    // 4. 如果是TAURI项目，需确认tauri插件配置
    plugins: [
      // 如果有@vitejs/plugin-vue/React，需确认已安装+注册
      // 比如Vue项目：vue()，React项目：react()
    ],
    // 5. 路径别名（如果有，需确保正确）
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'), // 确认src目录存在且路径正确
      },
    },
  },
}));
