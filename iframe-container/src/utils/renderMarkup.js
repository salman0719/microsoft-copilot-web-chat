import { IFRAME_SRC } from './constants';

export default function renderMarkup() {
  const html = `
<div id="bot-iframe-wrapper" class="bot-iframe--closed">
  <iframe class="bot-iframe" src="${IFRAME_SRC}"></iframe>
</div>
`;
  document.body.insertAdjacentHTML('beforeend', html);
}
