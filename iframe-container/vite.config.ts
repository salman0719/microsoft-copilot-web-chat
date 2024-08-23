import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const envDir = process.cwd()
  const env = loadEnv(mode, envDir, '')

  return {
    envDir,
    root: './iframe-container',
    server: {
      port: parseInt(env.VITE_EMBED_PARENT_PORT || '4000'),
    },
    preview: {
      open: true,
      port: parseInt(env.VITE_EMBED_PARENT_PREVIEW_PORT || '4100')
    }
  }
});
