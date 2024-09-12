import { IS_WINDOW_EMBEDDED, TARGET_ORIGIN } from './constants.tsx';
import { errorMessages } from './store.ts';
import { ErrorMessage, ResizePostMessageProps, SetDataPostMessageProps } from './types.ts';

type PostMessageProps = ResizePostMessageProps | SetDataPostMessageProps;

export const postMessageToParent = (data: PostMessageProps) => {
  IS_WINDOW_EMBEDDED && window.parent.postMessage(data, TARGET_ORIGIN);
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

export const stopPropagation = (e: Event) => {
  e.stopPropagation();
};
