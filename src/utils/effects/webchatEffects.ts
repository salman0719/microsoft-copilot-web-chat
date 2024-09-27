import { effect } from '@preact/signals';
import {
  authenticated,
  container,
  isClosed,
  isFullscreen,
  sendBoxChatLimitCrossed,
  sendBoxValue,
  webchatStore,
} from '../store';
import { BOT_NAME, DEFAULT_SEND_BOX_ERROR, INPUT_CHAR_LIMIT, TARGET_ORIGIN } from '../constants';
import { RequestHeighPostMessageProps, ResizePostMessageProps } from '../types';
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

  let parentHeight = 500;
  window.addEventListener('message', (e) => {
    if (![e.origin, '*'].includes(TARGET_ORIGIN)) {
      return;
    }

    const { data } = e;
    const { type } = data;

    if (type === 'parentInnerHeight') {
      parentHeight = data.value;
    }
  });

  postMessageToParent({ type: 'requestHeight' } as RequestHeighPostMessageProps);

  effect(() => {
    const root = container.value;
    const conversationContainerValue = conversationContainer.value;
    if (isFullscreen.value || !conversationContainerValue || !root) {
      return;
    }

    let previousHeight: number | undefined;
    let cleanUpManipulationTimeoutId: ReturnType<typeof setTimeout>;

    const sendIframeSize = (entries?: ResizeObserverEntry[]) => {
      if (isClosed.peek() || (entries && !entries[0].borderBoxSize[0].blockSize)) {
        return;
      }

      const containerHeight = root.offsetHeight;
      const conversationHeight = conversationContainerValue.offsetHeight;

      // NOTE: This `offset` is to navigate complexities of synchronizing height calculation
      // between iframe and its parent
      const offset = 10;

      const manipulateOverflow = containerHeight < parentHeight - offset;
      if (manipulateOverflow) {
        conversationContainerValue.style.overflow = 'visible';
      }

      const height = containerHeight - conversationHeight + conversationContainerValue.scrollHeight;

      if (height !== previousHeight) {
        previousHeight = height;

        const data: ResizePostMessageProps = { height, type: 'conversationResize' };

        postMessageToParent(data);
      }

      if (manipulateOverflow) {
        clearTimeout(cleanUpManipulationTimeoutId);
        cleanUpManipulationTimeoutId = setTimeout(() => {
          conversationContainerValue.style.removeProperty('overflow');
        });
      }
    };

    const resizeObserver = new ResizeObserver(sendIframeSize);
    resizeObserver.observe(conversationContainerValue);

    let transcriptSection: Element | undefined | null;
    const observeTranscriptSectionMutation = () => {
      if (!transcriptSection) {
        transcriptSection = conversationContainerValue.querySelector(
          '.webchat__basic-transcript__transcript'
        );
        transcriptSection && mutationObserver.observe(transcriptSection, { childList: true });
      }
    };

    const handleMutation = () => {
      observeTranscriptSectionMutation();
      sendIframeSize();
    };

    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(conversationContainerValue, { childList: true });
    const innerRootContainer = conversationContainerValue.parentNode?.parentNode;
    innerRootContainer &&
      mutationObserver.observe(innerRootContainer, {
        childList: true,
      });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
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
