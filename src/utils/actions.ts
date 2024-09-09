import { TARGET_ORIGIN } from './constants.ts';

export const postMessageToParent = (data: Record<string, unknown>) => {
  window.parent.postMessage(data, TARGET_ORIGIN);
};
