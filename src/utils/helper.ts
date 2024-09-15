import { IS_WINDOW_EMBEDDED, TARGET_ORIGIN, WEBCHAT_LAST_MSG_TIME_KEY } from './constants';
import { errorMessages } from './store';
import {
  ErrorMessage,
  RequestHeighPostMessageProps,
  ResizePostMessageProps,
  SetDataPostMessageProps,
} from './types';

type PostMessageProps =
  | ResizePostMessageProps
  | SetDataPostMessageProps
  | RequestHeighPostMessageProps;

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

export function isLastMsg(timestamp: number) {
  var oldTimestamp = localStorage.getItem(WEBCHAT_LAST_MSG_TIME_KEY);
  if (oldTimestamp !== null && new Date(timestamp) < new Date(oldTimestamp)) {
    return false;
  } else return true;
}

export async function fetchJSON(url: RequestInfo, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch JSON due to ${res.status}`);
  }

  return await res.json();
}

export function isTokenExpired(token: string) {
  if (!token) {
    // Token is considered expired if not available
    return true;
  }

  const tokenData = parseJwt(token);
  // Check if the token has an 'exp' claim
  if (tokenData && tokenData.exp) {
    const expirationTime = Number(tokenData.exp) * 1000; // Convert to milliseconds
    const currentTime = new Date().getTime();
    // Check if the token has expired
    return currentTime > expirationTime;
  }
  // Token is considered expired if 'exp' claim is missing
  return true;
}

export function parseJwt(token: string): Record<string, string | number> | null {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}

export function updateLastMsgTime(timestamp: number) {
  if (isLastMsg(timestamp)) localStorage.setItem(WEBCHAT_LAST_MSG_TIME_KEY, timestamp.toString());
}

export function fontFamily(fonts: string[]) {
  return fonts.map((font) => `'${font}'`).join(', ');
}

// @ts-expect-error: WebChat's ts version not utilized
export function getOAuthCardResourceUri(activity): string | undefined {
  const attachment = activity?.attachments?.[0];
  if (!attachment) {
    return;
  }
  const {
    contentType,
    content: { tokenExchangeResource },
  } = attachment;
  if (contentType === 'application/vnd.microsoft.card.oauth' && tokenExchangeResource) {
    // asking for token exchange with AAD
    return tokenExchangeResource.uri;
  }
}
