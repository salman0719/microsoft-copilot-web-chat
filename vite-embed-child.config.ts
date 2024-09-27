import baseConfig, { getScssAdditionalData } from './vite.config';
import { ConfigEnv, loadEnv, mergeConfig } from 'vite';

export default function defineConfig(config: ConfigEnv) {
  const env = loadEnv(config.mode, process.cwd(), '');

  return mergeConfig(baseConfig(config), {
    define: {
      __IS_EMBED_CHILD__: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: getScssAdditionalData({
            'enable-fullscreen': env.VITE_DISABLE_FULLSCREEN === '1' ? 'false' : 'true',
            'is-embed-child': 'true',
          }),
        },
      },
    },
    server: {
      port: parseInt(env.VITE_EMBED_CHILD_PORT || '7000'),
    },
    preview: {
      open: false,
      port: parseInt(env.VITE_EMBED_CHILD_PORT || '7000'),
    },
  });
}
