import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$enable-fullscreen: ${env.VITE_ENABLE_FULLSCREEN ? 'true' : 'false'};`
        }
      }
    },
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
