import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const envDir = process.cwd()
  const env = loadEnv(mode, envDir, '')

  return {
    envDir,
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
