import { signal } from '@preact/signals';
import {
  FULLSCREEN_SEARCH_QUERY_KEY,
  IS_WINDOW_EMBEDDED,
  WEBCHAT_MODE_KEY,
  WEBCHAT_WINDOW_CLOSED_KEY,
  WEBCHAT_WINDOW_CONDENSED_KEY,
} from './constants';
import { ErrorMessage } from './types';

export const webchatStore = signal<Record<string, unknown> | undefined>();
export const directLine = signal<Record<string, unknown> | undefined>();
export const container = signal<HTMLDivElement | null>(null);
export const sendBoxValue = signal('');
export const sendBoxChatLimitCrossed = signal(false);
export const errorMessages = signal<ErrorMessage[]>([]);

export const webchatInitialized = signal(false);
export const authenticated = signal<boolean | undefined>();
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
