import { batch, effect } from '@preact/signals';
import { INACTIVE_CONNECTION_ERROR, WEBCHAT_WINDOW_QUEUE_KEY, WINDOW_ID } from './constants.js';
import { addErrorMessage, removeErrorMessage } from './helper.js';
// TODO
// @ts-expect-error: We haven't converted the script to ts yet
import renderWebChat from './renderWebChat.js';
import { directLine, isWebchatActive, webchatInitialized } from './store.js';

// TODO
// Instead of imperatively calling functions, can we make it totally `effect` based?

function getQueue(): string[] {
  return JSON.parse(localStorage.getItem(WEBCHAT_WINDOW_QUEUE_KEY) || '[]');
}

function restartWebchat() {
  batch(() => {
    isWebchatActive.value = true;
    removeErrorMessage(INACTIVE_CONNECTION_ERROR.id);
    webchatInitialized.peek() && renderWebChat();
  });
}

function addToQueue() {
  const queue = getQueue();
  if (!queue.includes(WINDOW_ID)) {
    queue.unshift(WINDOW_ID);
    localStorage.setItem(WEBCHAT_WINDOW_QUEUE_KEY, JSON.stringify(queue));
  }
}

function removeFromQueue() {
  const queue: string[] = getQueue().filter((id: string) => id !== WINDOW_ID);
  localStorage.setItem(WEBCHAT_WINDOW_QUEUE_KEY, JSON.stringify(queue));
}

window.addEventListener('storage', ({ key }) => {
  if (key === WEBCHAT_WINDOW_QUEUE_KEY) {
    if (getQueue()[0] === WINDOW_ID) {
      !document.hidden && restartWebchat();
    } else {
      isWebchatActive.value = false;
    }
  }
});

window.addEventListener('beforeunload', function () {
  removeFromQueue();
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !isWebchatActive.peek() && getQueue()[0] === WINDOW_ID) {
    restartWebchat();
  }
});

effect(() => {
  if (!isWebchatActive.value) {
    batch(() => {
      // @ts-expect-error: We haven't yet included webchat library's ts version
      directLine.peek()?.end?.();
      addErrorMessage(INACTIVE_CONNECTION_ERROR);
    });
  }
});

addToQueue();
