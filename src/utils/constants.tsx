import { ErrorMessage } from './types';

export const ELEMENT_ID = 'chat-window';
export const WINDOW_ID = Math.random().toString(36).substring(2, 9);
export const WEBCHAT_TOKEN_KEY = 'webchat-token';
export const WEBCHAT_LAST_MSG_TIME_KEY = 'webchat-last-msg-time';
export const WEBCHAT_WINDOW_CLOSED_KEY = 'webchat-window-closed';
export const WEBCHAT_WINDOW_CONDENSED_KEY = 'webchat-window-condensed';
export const WEBCHAT_MODE_KEY = 'webchat-mode';
export const WEBCHAT_WINDOW_QUEUE_KEY = 'webchat-window-queue';
export const INPUT_CHAR_LIMIT = 500;
export const IS_WINDOW_EMBEDDED = window.top !== window.self;
export const BOT_NAME = 'Scout';
export const DISCLOSURE_TEXT = BOT_NAME + ' can make mistakes, verify important information.';
export const FULLSCREEN_SEARCH_QUERY_KEY = 'fullscreen';
export const MSAL_SCOPES = ['user.read', 'openid', 'profile'];
export const MSAL_REDIRECT_URI =
  'https://unswauepstaetsbot.blob.core.windows.net/custom-canvas/RedirectUri.html';
export const MSAL_CLIENT_ID =
  import.meta.env.VITE_MSAL_CLIENT_ID || 'bf3b31f3-7df6-45d6-8f66-70a15dbeec76';
export const MSAL_TENANT_ID =
  import.meta.env.VITE_MSAL_TENANT_ID || '3ff6cfa4-e715-48db-b8e1-0867b9f9fba3';
export const BOT_TOKEN_ENDPOINT =
  import.meta.env.VITE_BOT_TOKEN_ENDPOINT ||
  'https://829ad9b9104ce6878ce96c9c25af46.ca.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr967_studentBotDev/directline/token?api-version=2022-03-01-preview'; // You can find the token URL via the mobile app channel configuration
export const TARGET_ORIGIN = import.meta.env.DEV
  ? 'http://localhost:' + (import.meta.env.VITE_EMBED_PARENT_PORT || '4000')
  : import.meta.env.VITE_EMBED_PARENT_ORIGIN || '*';

export const DEFAULT_SEND_BOX_ERROR: ErrorMessage = {
  id: 'SEND_BOX_ERROR',
  text: 'Maximum limit of ' + INPUT_CHAR_LIMIT + ' characters reached.',
};
export const INACTIVE_CONNECTION_ERROR: ErrorMessage = {
  id: 'INACTIVE_CONNECTION_ERROR',
};
