import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: parseInt(process.env.PORT || '4000'),
    proxy: {
      '/api': {
        target: 'http://localhost:' + (process.env.SERVER_PORT || '4001'),
        changeOrigin: true
      }
    }
  },
  preview: {
    port: parseInt(process.env.PREVIEW_PORT || '5000')
  }
});
