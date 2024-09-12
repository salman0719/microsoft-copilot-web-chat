import { effect, signal } from '@preact/signals';
import {
  FULLSCREEN_SEARCH_QUERY_KEY,
  IS_WINDOW_EMBEDDED,
  WEBCHAT_MODE_KEY,
  WEBCHAT_WINDOW_CLOSED_KEY,
  WEBCHAT_WINDOW_CONDENSED_KEY,
} from './constants.ts';
import { postMessageToParent } from './helper.ts';
import { ErrorMessage, SetDataPostMessageProps } from './types.ts';

export const broadcastEffect = (key: string, value: unknown, oldValue: unknown) => {
  if (!IS_WINDOW_EMBEDDED) {
    return;
  }

  if (!['string', 'number', 'boolean'].includes(typeof value)) {
    return;
  }

  const data: SetDataPostMessageProps = {
    key,
    oldValue,
    value,
    type: 'setData',
  };

  postMessageToParent(data);
};

export const webchatStore = signal<Record<string, unknown> | undefined>();
export const directLine = signal<Record<string, unknown> | undefined>();
export const container = signal<HTMLDivElement | null>(null);
export const sendBoxValue = signal('');
export const sendBoxChatLimitCrossed = signal(false);
export const errorMessages = signal<ErrorMessage[]>([]);

export const webchatInitialized = signal(false);
export const authenticated = signal(false);
export const isClosed = signal(localStorage.getItem(WEBCHAT_WINDOW_CLOSED_KEY) === '1');
export const isDark = signal(localStorage.getItem(WEBCHAT_MODE_KEY) === '1');
export const isCondensed = signal(localStorage.getItem(WEBCHAT_WINDOW_CONDENSED_KEY) === '1');
export const isFullscreen = signal(
  // @ts-expect-error: Comes from vite's define
  __IS_EMBED_CHILD__
    ? !IS_WINDOW_EMBEDDED
    : new URLSearchParams(location.search).get(FULLSCREEN_SEARCH_QUERY_KEY) === '1'
);
export const username = signal('');
export const isWebchatActive = signal(true);

const broadcastSignals = {
  webchatInitialized,
  authenticated,
  isClosed,
  isDark,
  isCondensed,
  isFullscreen,
  username,
};

// @ts-expect-error: This will come from vite config's `define` attribute
if (__IS_EMBED_CHILD__) {
  for (const [key, signalObj] of Object.entries(broadcastSignals)) {
    let oldValue: typeof signalObj.value;
    effect(() => {
      broadcastEffect(key, signalObj.value, oldValue);
      oldValue = signalObj.peek();
    });
  }
}
