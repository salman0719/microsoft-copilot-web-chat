import { defineConfig } from 'vite';

export default defineConfig({
  root: './iframe-container',
  server: {
    port: parseInt(process.env.PORT || '8000'),
    proxy: {
      '/api': {
        target: 'http://localhost:' + (process.env.SERVER_PORT || '8001'),
        changeOrigin: true
      }
    }
  },
  preview: {
    port: parseInt(process.env.PREVIEW_PORT || '9000')
  }
});
