import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';

const defaultScssAdditionalDataObj = {
  'enable-fullscreen': 'false',
  'is-embed-child': 'false'
}

export const getScssAdditionalData = (obj: Record<string, string> = {}) => {
  let scss = '', scssObj = { ...defaultScssAdditionalDataObj, ...obj }
  for (const [key, value] of Object.entries(scssObj)) {
    scss += '$' + key + ':' + value + ';'
  }

  return scss
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      __IS_EMBED_CHILD__: false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: getScssAdditionalData({
            'enable-fullscreen': env.VITE_ENABLE_FULLSCREEN === '1' ? 'true' : 'false'
          })
        }
      }
    },
    server: {
      port: parseInt(env.PORT || '3000')
    },
    preview: {
      open: true,
      port: parseInt(env.PREVIEW_PORT || '3100')
    },
    plugins: [
      preact()
    ]
  }
});
