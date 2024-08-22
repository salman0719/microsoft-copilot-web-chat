import baseConfig from './vite.config.ts';
import { ConfigEnv, loadEnv, mergeConfig } from 'vite';

export default function defineConfig(config: ConfigEnv) {
  const env = loadEnv(config.mode, process.cwd(), '')

  return mergeConfig(baseConfig(config), {
    define: {
      __IS_EMBED_CHILD__: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            $enable-fullscreen: false;
            $is-embed-child: true;
          `
        }
      }
    },
    server: {
      port: parseInt(env.EMBED_CHILD_PORT || '7000'),
    },
    preview: {
      port: parseInt(env.EMBED_CHILD_PORT || '7000'),
    }
  });
}
