import {
  CONVERSATION_ID_KEY,
  LAST_MESSAGE_TIMESTAMP_KEY,
  WEBCHAT_MODE_KEY,
  WEBCHAT_WINDOW_CLOSED_KEY,
  INPUT_CHAR_LIMIT
} from "./utils/constants.js";
import { getElement, setData } from "./utils/store.js";
import "./utils/configureElements.js";
import {
  initiateChatPrompt,
  insertCharacterCounter,
  insertDisclosureText,
  setupCondensation,
  setupExpandIcon,
  setupModeToggle,
  setupWindowToggle,
  updateInputPlaceholder
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
      const { conversationId } = payload.directLine
      const { username } = action.meta
      if (localStorage.getItem(CONVERSATION_ID_KEY) !== conversationId) {
        localStorage.setItem(CONVERSATION_ID_KEY, conversationId)
        localStorage.removeItem(LAST_MESSAGE_TIMESTAMP_KEY)
      }

      // Set username
      if (username) {
        document.querySelector('#chat-window .chat-window__navbar__mode-username')
          .innerHTML = username
      }
    } else if (type === 'DIRECT_LINE/CONNECTION_STATUS_UPDATE') {
      if (payload.connectionStatus === 2) {
        setTimeout(() => {
          setData('isDarkMode', localStorage.getItem(WEBCHAT_MODE_KEY) === '1')
          initiateChatPrompt()
          setData('isClosed', localStorage.getItem(WEBCHAT_WINDOW_CLOSED_KEY) === '1')
        }, 500)
      }
    } else if (type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      const { activity } = payload

      if (activity.type === 'message') {
        const { timestamp } = activity
        const prevTimestamp = localStorage.getItem(LAST_MESSAGE_TIMESTAMP_KEY)
        if (!prevTimestamp || timestamp > prevTimestamp) {
          localStorage.setItem(LAST_MESSAGE_TIMESTAMP_KEY, timestamp)
        }
      }
    } else if (type === 'WEB_CHAT/SET_SEND_BOX') {
      const { text } = payload
      const { length } = text
      const inputCounter = getElement('inputCounter')
      inputCounter.innerHTML = length + '/' + INPUT_CHAR_LIMIT

      // TODO
      // State based implementation required
      const sendBoxErrorInfoElem = getElement('sendBoxErrorInfoElem')
      if (length > INPUT_CHAR_LIMIT) {
        inputCounter.classList.add('webchat__send-box-text-box-counter--error')
        !sendBoxErrorInfoElem.isConnected && document.querySelector(
          '#chat-window .webchat__send-box'
        ).insertAdjacentElement('beforebegin', sendBoxErrorInfoElem)
        sendBoxErrorInfoElem.classList.remove('webchat__send-box__error-info--hidden')
        inputCounter.nextElementSibling.disabled = true
      } else {
        inputCounter.classList.remove('webchat__send-box-text-box-counter--error')
        sendBoxErrorInfoElem.classList.add('webchat__send-box__error-info--hidden')
        inputCounter.nextElementSibling.disabled = false
      }
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
  insertDisclosureText()
  updateInputPlaceholder()
  setupExpandIcon()
  setupWindowToggle()
  setupCondensation()
  insertCharacterCounter()
  setupModeToggle()
})().catch(err => console.error(err));