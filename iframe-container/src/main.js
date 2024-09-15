import { IFRAME_SRC } from './utils/constants';
import renderMarkup from './utils/renderMarkup';

const IFRAME_ORIGIN = new URL(IFRAME_SRC).origin;

(function () {
  renderMarkup();

  const iframe = document.querySelector('#bot-iframe-wrapper>iframe.bot-iframe');
  const parent = iframe.parentNode;

  parent.style.setProperty(
    '--max-height-diff',
    // @ts-expect-error: Comes from vite's `define` attribute
    __EMBED_PARENT_MAX_HEIGHT_DIFF__ + 'px'
  );

  const store = {};

  const sendInnerHeight = () => {
    iframe.contentWindow.postMessage(
      {
        value: window.innerHeight - __EMBED_PARENT_MAX_HEIGHT_DIFF__,
        type: 'parentInnerHeight',
      },
      IFRAME_ORIGIN
    );
  };

  window.addEventListener(
    'resize',
    (() => {
      let timeoutId;

      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(sendInnerHeight, 200);
      };
    })()
  );

  window.addEventListener('message', (event) => {
    if (event.source !== iframe.contentWindow) {
      return;
    }

    const { data } = event;
    const { type } = data;

    if (type === 'setData') {
      const { key, value } = data;

      store[key] = value;

      if (key === 'isCondensed') {
        parent.classList[value ? 'add' : 'remove']('bot-iframe--condensed');
      } else if (key === 'authenticated') {
        parent.classList[value ? 'remove' : 'add']('bot-iframe--unauthenticated');
      } else if (key === 'webchatInitialized') {
        parent.classList[value ? 'remove' : 'add']('bot-iframe--webchat-uninitialized');
      } else if (key === 'isClosed') {
        if (!value) {
          parent.classList['remove']('bot-iframe--closed');
        } else {
          setTimeout(() => {
            store.isClosed === value && parent.classList.add('bot-iframe--closed');
          }, __CHAT_WINDOW_TRANSITION_DURATION_MS__);
        }
      }
    } else if (type === 'conversationResize') {
      const { height } = data;

      if (!store.authenticated) {
        parent.style.removeProperty('height');
        return;
      }

      if (store.isClosed) {
        return;
      }

      parent.style.height = height + 'px';
    } else if (type === 'requestHeight') {
      sendInnerHeight();
    }
  });
})();
