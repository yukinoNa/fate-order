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
    watch: {
      // 忽略编辑器/工具产生的临时文件、构建产物与 .tools 下的外部二进制，
      // 否则监听器可能因文件被占用（EBUSY）而让开发服务器整个崩溃
      ignored: ['**/.*.tmpdir/**', '**/*.tmp', '**/dist/**', '**/.tools/**'],
    },
  },
});
