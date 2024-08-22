import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    root: './iframe-container',
    server: {
      port: parseInt(env.PORT || '4000'),
      proxy: {
        '/api': {
          target: 'http://localhost:' + (env.SERVER_PORT || '4001'),
          changeOrigin: true
        }
      }
    },
    preview: {
      port: parseInt(env.PREVIEW_PORT || '5000')
    }
  }
});
