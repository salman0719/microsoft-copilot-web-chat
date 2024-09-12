import { effect } from '@preact/signals';
import { container, sendBoxChatLimitCrossed, sendBoxValue, webchatStore } from '../store';
import { BOT_NAME, INPUT_CHAR_LIMIT } from '../constants';
import { ResizePostMessageProps } from '../types';
import { postMessageToParent } from '../helper';

effect(() => {
  const store = webchatStore.value;
  if (!store) {
    return;
  }

  // @ts-expect-error: We're not using WebChat's ts library yet
  return store.subscribe(() => {
    // @ts-expect-error: We're not using WebChat's ts library yet
    const newSendBoxValue = store.getState().sendBoxValue;
    if (newSendBoxValue !== sendBoxValue.value) {
      sendBoxValue.value = newSendBoxValue;
    }
  });
});

effect(() => {
  const oldValue = sendBoxChatLimitCrossed.value;
  const newValue = sendBoxValue.value.length > INPUT_CHAR_LIMIT;

  if (oldValue !== newValue) {
    sendBoxChatLimitCrossed.value = newValue;
  }
});

// @ts-expect-error: This will come from vite config's `define` attribute
if (__IS_EMBED_CHILD__) {
  effect(() => {
    const root = container.value;
    if (!root) {
      return;
    }

    const conversationContainer = root.querySelector<HTMLDivElement>(
      '.webchat__basic-transcript__scrollable'
    );
    if (!conversationContainer) {
      return;
    }

    const sendIframeSize = () => {
      const containerHeight = root.offsetHeight;
      const conversationHeight = conversationContainer.offsetHeight;

      const data: ResizePostMessageProps = {
        height: containerHeight - conversationHeight + conversationContainer.scrollHeight + 10,
        type: 'conversationResize',
      };

      postMessageToParent(data);
    };

    const resizeObserver = new ResizeObserver(sendIframeSize);
    resizeObserver.observe(conversationContainer);

    sendIframeSize();

    return () => resizeObserver.disconnect();
  });
}

effect(() => {
  const root = container.value;
  if (!root) {
    return;
  }
  const input = root.querySelector<HTMLInputElement>('.webchat__send-box-text-box__input');
  if (!input) {
    return;
  }

  input.placeholder = 'Message ' + BOT_NAME;
});
