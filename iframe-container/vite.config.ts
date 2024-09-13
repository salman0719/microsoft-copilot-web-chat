import baseConfig from '../vite.config';
import { ConfigEnv, loadEnv, mergeConfig } from 'vite';

export default function defineConfig(config: ConfigEnv) {
  const envDir = process.cwd();
  const env = loadEnv(config.mode, envDir, '');

  return mergeConfig(baseConfig(config), {
    envDir,
    root: './iframe-container',
    server: {
      port: parseInt(env.VITE_EMBED_PARENT_PORT || '4000'),
    },
    preview: {
      open: true,
      port: parseInt(env.VITE_EMBED_PARENT_PREVIEW_PORT || '5000'),
    },
  });
}
