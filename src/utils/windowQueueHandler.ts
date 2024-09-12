import { batch, effect } from '@preact/signals';
import { INACTIVE_CONNECTION_ERROR, WINDOW_ID } from './constants.js';
import { addErrorMessage, removeErrorMessage } from './helper.js';
// TODO
// @ts-expect-error: We haven't converted the script to ts yet
import renderWebChat from './renderWebChat.js';
import { directLine, isWebchatActive, webchatInitialized } from './store.js';

// NOTE
// Keep all these code together, so that if required, we can just skip importing
// this file to ignore window queueing

// TODO
// Use constant keys for localStorage

function restartWebchat() {
  batch(() => {
    isWebchatActive.value = true;
    removeErrorMessage(INACTIVE_CONNECTION_ERROR.id);
    webchatInitialized.peek() && renderWebChat();
  });
}

function addToQueue() {
  const queue: string[] = JSON.parse(localStorage.getItem('windowQueue') || '[]');
  if (!queue.includes(WINDOW_ID)) {
    queue.unshift(WINDOW_ID);
    localStorage.setItem('activeWindow', WINDOW_ID);
    localStorage.setItem('windowQueue', JSON.stringify(queue));
  }
}

function removeFromQueue() {
  const queue: string[] = JSON.parse(localStorage.getItem('windowQueue') || '[]').filter(
    (id: string) => id !== WINDOW_ID
  );
  localStorage.setItem('windowQueue', JSON.stringify(queue));
}

window.addEventListener('storage', ({ key }) => {
  if (key === 'activeWindow') {
    // TODO
    // We can remove usage of `activeWindow`, `windowQueue[0]` is equal to `activeWindow`
    if (localStorage.getItem('activeWindow') !== WINDOW_ID) {
      isWebchatActive.value = false;
    } else {
      !document.hidden && restartWebchat();
    }
  }
});

window.addEventListener('beforeunload', function () {
  removeFromQueue();

  const queue: string[] = JSON.parse(localStorage.getItem('windowQueue') || '[]');
  if (queue.length > 0) {
    localStorage.setItem('activeWindow', queue[0]);
  }
});

document.addEventListener('visibilitychange', () => {
  if (
    !document.hidden &&
    !isWebchatActive.peek() &&
    localStorage.getItem('activeWindow') === WINDOW_ID
  ) {
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
