import { effect, signal } from '@preact/signals';
import { postMessageToParent } from './actions.ts';
import {
  WEBCHAT_MODE_KEY,
  WEBCHAT_WINDOW_CLOSED_KEY,
  WEBCHAT_WINDOW_CONDENSED_KEY,
} from './constants.ts';

const isWindowEmbedded = window.top !== window.self;

const data: Record<string, unknown> = {};
const subscribers: Record<string, Function[]> = {};
const elements: Record<string, Element> = {};
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

export const setElement = (key: string, elem: Element) => {
  elements[key] = elem;
};

export const getElement = (key: string): Element | undefined => elements[key];

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

export const initialized = signal(false);
export const isClosed = signal(localStorage.getItem(WEBCHAT_WINDOW_CLOSED_KEY) === '1');
export const isDark = signal(localStorage.getItem(WEBCHAT_MODE_KEY) === '1');
export const isCondensed = signal(localStorage.getItem(WEBCHAT_WINDOW_CONDENSED_KEY) === '1');

const broadcastSignals = {
  initialized,
  isClosed,
  isDark,
  isCondensed,
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
