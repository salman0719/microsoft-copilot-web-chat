import { effect, signal } from '@preact/signals';
import { postMessageToParent } from './actions.ts';
import {
  FULLSCREEN_SEARCH_QUERY_KEY,
  WEBCHAT_MODE_KEY,
  WEBCHAT_WINDOW_CLOSED_KEY,
  WEBCHAT_WINDOW_CONDENSED_KEY,
} from './constants.ts';

const isWindowEmbedded = window.top !== window.self;

const data: Record<string, unknown> = {};
const subscribers: Record<string, Function[]> = {};
let callbacksPending: [Function, unknown, unknown][] = [];

const processCallbacks = () => {
  const callbackMap = new Map<Function, 1>();

  callbacksPending.forEach(([callback, value, oldValue]) => {
    if (!callbackMap.has(callback)) {
      callbackMap.set(callback, 1);
      callback(value, oldValue);
    }
  });

  callbacksPending = callbacksPending.filter(([callback]) => !callbackMap.has(callback));
};

export const setData = (key: string, value: unknown) => {
  const oldValue = data[key];
  if (oldValue !== value) {
    data[key] = value;

    subscribers[key]?.forEach((callback) => {
      callbacksPending.push([callback, value, oldValue]);
    });

    setTimeout(processCallbacks);
  }
};

export const getData = (key: string) => data[key];

export const subscribe = (keys: string[], callback: Function) => {
  for (let key of keys) {
    if (!(key in subscribers)) {
      subscribers[key] = [];
    }
    subscribers[key].push(callback);
  }

  return () => {
    for (let subscriberKey in subscribers) {
      subscribers[subscriberKey] = subscribers[subscriberKey].filter((fn) => callback !== fn);
    }
  };
};

export const broadcastEffect = (key: string, value: unknown, oldValue: unknown) => {
  if (!isWindowEmbedded) {
    return;
  }

  if (!['string', 'number', 'boolean'].includes(typeof value)) {
    return;
  }

  const data = {
    key,
    oldValue,
    value,
    type: 'setData',
  };

  postMessageToParent(data);
};

export const webchatStore = signal<Record<string, unknown> | undefined>();
export const container = signal<HTMLDivElement | null>(null);
export const sendBoxValue = signal('');
export const sendBoxChatLimitCrossed = signal(false);

export const webchatInitialized = signal(false);
export const authenticated = signal(false);
export const isClosed = signal(localStorage.getItem(WEBCHAT_WINDOW_CLOSED_KEY) === '1');
export const isDark = signal(localStorage.getItem(WEBCHAT_MODE_KEY) === '1');
export const isCondensed = signal(localStorage.getItem(WEBCHAT_WINDOW_CONDENSED_KEY) === '1');
export const isFullscreen = signal(
  new URLSearchParams(location.search).get(FULLSCREEN_SEARCH_QUERY_KEY) === '1'
);

const broadcastSignals = {
  webchatInitialized,
  authenticated,
  isClosed,
  isDark,
  isCondensed,
  isFullscreen,
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
