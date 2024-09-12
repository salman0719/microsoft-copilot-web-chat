import { BOT_NAME, IS_WINDOW_EMBEDDED, TARGET_ORIGIN } from './constants.ts';
import { container, errorMessages } from './store.ts';
import { ErrorMessage, ResizePostMessageProps, SetDataPostMessageProps } from './types.ts';

export const updateInputPlaceholder = () => {
  const root = container.value;
  if (!root) {
    return;
  }
  const input = root.querySelector<HTMLInputElement>('.webchat__send-box-text-box__input');
  if (!input) {
    return;
  }

  input.placeholder = 'Message ' + BOT_NAME;
};

type PostMessageProps = ResizePostMessageProps | SetDataPostMessageProps;

export const postMessageToParent = (data: PostMessageProps) => {
  IS_WINDOW_EMBEDDED && window.parent.postMessage(data, TARGET_ORIGIN);
};

export const observeConversationResize = () => {
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
};

export const addErrorMessage = (error: ErrorMessage) => {
  const newErrorMessages = errorMessages.peek().filter(({ id }) => id !== error.id);
  newErrorMessages.push(error);

  errorMessages.value = newErrorMessages;
};

export const removeErrorMessage = (id: ErrorMessage['id']) => {
  const newErrorMessages = errorMessages.peek().filter(({ id: _id }) => id !== _id);
  if (newErrorMessages.length !== errorMessages.value.length) {
    errorMessages.value = newErrorMessages;
  }
};
