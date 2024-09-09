import { TARGET_ORIGIN } from './constants.ts';
import { getData, setData } from './store.ts';

export const toggleDarkMode = (forceMode?: boolean) => {
  setData('isDarkMode', typeof forceMode === 'boolean' ? forceMode : !getData('isDarkMode'));
};

export const postMessageToParent = (data: Record<string, unknown>) => {
  window.parent.postMessage(data, TARGET_ORIGIN);
};
