export const IFRAME_SRC =
  import.meta.env.DEV || !import.meta.env.VITE_EMBED_CHILD_URL
    ? 'http://localhost:' + (import.meta.env.VITE_EMBED_CHILD_PORT || '7000')
    : import.meta.env.VITE_EMBED_CHILD_URL;
