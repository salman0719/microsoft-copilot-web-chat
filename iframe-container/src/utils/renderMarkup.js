const iframeSrc =
  import.meta.env.DEV || !import.meta.env.VITE_EMBED_CHILD_URL
    ? 'http://localhost:' + (import.meta.env.VITE_EMBED_CHILD_PORT || '7000')
    : import.meta.env.VITE_EMBED_CHILD_URL;

export default function renderMarkup() {
  // TODO
  // Research sandbox="allow-top-navigation-by-user-activation" and integrate it
  const html = `
<div id="bot-iframe-wrapper" class="bot-iframe--closed">
  <iframe class="bot-iframe" src="${iframeSrc}"></iframe>
</div>
`;
  document.body.insertAdjacentHTML('beforeend', html);
}
