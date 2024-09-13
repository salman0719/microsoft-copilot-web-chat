import { batch, effect, signal } from '@preact/signals';
import { INACTIVE_CONNECTION_ERROR, WEBCHAT_WINDOW_QUEUE_KEY, WINDOW_ID } from './constants.js';
import { addErrorMessage, removeErrorMessage } from './helper.js';
// TODO
// @ts-expect-error: We haven't converted the script to ts yet
import renderWebChat from './renderWebChat.js';
import { directLine, isWebchatActive, webchatInitialized } from './store.js';

const isDocumentVisible = signal(!document.hidden);

function getQueue(): string[] {
  return JSON.parse(localStorage.getItem(WEBCHAT_WINDOW_QUEUE_KEY) || '[]');
}

function addToQueue() {
  const queue: string[] = [WINDOW_ID, ...getQueue().filter((id: string) => id !== WINDOW_ID)];
  localStorage.setItem(WEBCHAT_WINDOW_QUEUE_KEY, JSON.stringify(queue));
}

function removeFromQueue() {
  const queue: string[] = getQueue().filter((id: string) => id !== WINDOW_ID);
  localStorage.setItem(WEBCHAT_WINDOW_QUEUE_KEY, JSON.stringify(queue));
}

window.addEventListener('storage', ({ key }) => {
  if (key === WEBCHAT_WINDOW_QUEUE_KEY) {
    isWebchatActive.value = getQueue()[0] === WINDOW_ID;
  }
});

window.addEventListener('beforeunload', function () {
  removeFromQueue();
});

document.addEventListener('visibilitychange', () => {
  isDocumentVisible.value = !document.hidden;
});

effect(() => {
  const isWebchatActiveValue = isWebchatActive.value;
  const isDocumentVisibleValue = isDocumentVisible.value;

  if (isWebchatActiveValue) {
    if (isDocumentVisibleValue) {
      addToQueue();
      batch(() => {
        if (!directLine.peek()) {
          removeErrorMessage(INACTIVE_CONNECTION_ERROR.id);
          webchatInitialized.peek() && renderWebChat();
        }
      });
    }
  } else {
    if (directLine.peek()) {
      batch(() => {
        // @ts-expect-error: We haven't yet included webchat library's ts version
        directLine.peek()?.end?.();
        addErrorMessage(INACTIVE_CONNECTION_ERROR);
        directLine.value = undefined;
      });
    }
  }
});
