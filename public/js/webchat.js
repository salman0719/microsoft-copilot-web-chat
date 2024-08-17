import {
  WEBCHAT_MODE_KEY,
  WEBCHAT_WINDOW_CLOSED_KEY,
} from "./utils/constants.js";
import { setData } from "./utils/store.js";
import "./utils/configureElements.js";
import {
  handleInput,
  handleUsername,
  initiateChatPrompt,
  insertDisclosureText,
  insertInputCounter,
  setupCondensation,
  setupExpandIcon,
  setupModeToggle,
  setupWindowToggle,
  updateConversationId,
  updateInputPlaceholder,
  updateTimestamp
} from "./utils/helper.js";

// This is a helper function for fetching JSON resources.
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      accept: 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch JSON due to ${res.status}`);
  }

  return await res.json();
}

(async function main() {
  // This is for obtaining Direct Line token from the bot.
  const { token } = await fetchJSON('/api/directline/token');

  const store = WebChat.createStore({}, () => next => action => {
    const { type, payload } = action

    if (type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      updateConversationId(payload.directLine.conversationId)
      setData('username', action.meta.username)
    } else if (type === 'DIRECT_LINE/CONNECTION_STATUS_UPDATE') {
      if (payload.connectionStatus === 2) {
        setTimeout(() => {
          setData('isDarkMode', localStorage.getItem(WEBCHAT_MODE_KEY) === '1')
          initiateChatPrompt()
          setData('isClosed', localStorage.getItem(WEBCHAT_WINDOW_CLOSED_KEY) === '1')
        }, 500)
      }
    } else if (type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      updateTimestamp(payload.activity)
    }

    return next(action);
  });

  WebChat.renderWebChat(
    {
      directLine: WebChat.createDirectLine({ token }),
      store,
      styleOptions: {
        primaryFont: ['Roboto', 'Calibri', 'Helvetica Neue', 'Arial', 'sans-serif']
          .map(font => `'${font}'`).join(', '),
        botAvatarImage: '../images/bot.png',
        botAvatarInitials: 'S',
      },
    },
    document.getElementById('webchat')
  );

  setData('webChatStore', store)
  setData('chatPromptInitialized', false)
  handleUsername()
  handleInput()
  insertDisclosureText()
  updateInputPlaceholder()
  setupExpandIcon()
  setupWindowToggle()
  setupCondensation()
  insertInputCounter()
  setupModeToggle()
})().catch(err => console.error(err));