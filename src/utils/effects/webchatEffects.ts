import { effect } from '@preact/signals';
import {
  authenticated,
  container,
  sendBoxChatLimitCrossed,
  sendBoxValue,
  webchatStore,
} from '../store';
import { BOT_NAME, DEFAULT_SEND_BOX_ERROR, INPUT_CHAR_LIMIT } from '../constants';
import { ResizePostMessageProps } from '../types';
import { addErrorMessage, postMessageToParent, removeErrorMessage } from '../helper';
import renderWebChat from '../renderWebChat';
import { computedElement } from '../hooks';

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
  const conversationContainer = computedElement<HTMLDivElement>(
    '.webchat__basic-transcript__scrollable'
  );

  effect(() => {
    const root = container.value;
    const conversationContainerValue = conversationContainer.value;
    if (!conversationContainerValue || !root) {
      return;
    }

    const sendIframeSize = () => {
      const containerHeight = root.offsetHeight;
      const conversationHeight = conversationContainerValue.offsetHeight;

      const data: ResizePostMessageProps = {
        height: containerHeight - conversationHeight + conversationContainerValue.scrollHeight + 10,
        type: 'conversationResize',
      };

      postMessageToParent(data);
    };

    const resizeObserver = new ResizeObserver(sendIframeSize);
    resizeObserver.observe(conversationContainerValue);

    sendIframeSize();

    return () => resizeObserver.disconnect();
  });
}

const inputElem = computedElement<HTMLInputElement>('.webchat__send-box-text-box__input');

effect(() => {
  if (!inputElem.value) {
    return;
  }
  inputElem.value.placeholder = 'Message ' + BOT_NAME;
});

effect(() => {
  authenticated.value && renderWebChat();
});

const submitBtnElem = computedElement<HTMLButtonElement>('.webchat__send-box__button');

effect(() => {
  const submitBtnElemValue = submitBtnElem.value;
  const hasErrorValue = sendBoxChatLimitCrossed.value;

  if (submitBtnElemValue) {
    submitBtnElemValue.disabled = hasErrorValue;
  }

  if (hasErrorValue) {
    addErrorMessage(DEFAULT_SEND_BOX_ERROR);
  } else {
    removeErrorMessage(DEFAULT_SEND_BOX_ERROR.id);
  }
});
