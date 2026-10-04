import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 让构建产物可用相对路径打开，方便放到任意静态服务器/手机端
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true,
    port: 5173,
    // 允许通过隧道/域名访问（本机个人开发环境；生产部署不受此配置影响）
    allowedHosts: true,
  },
});
