import {
  DIRECT_LINE_STATUS_CONNECTED_CODE,
  WEBCHAT_MODE_KEY,
  WEBCHAT_WINDOW_CLOSED_KEY,
} from "./utils/constants.js";
import { setData } from "./utils/store.js";
import "./utils/configureElements.js";
import {
  handleCondensation,
  handleInput,
  handleModeToggle,
  handleUsername,
  handleWindowToggle,
  initiateChatPrompt,
  insertDisclosureText,
  insertInputCounter,
  setupExpandIcon,
  updateConversationId,
  updateInputPlaceholder,
  updateTimestamp
} from "./utils/helper.js";

(async function main() {
  // TODO
  // This is for obtaining Direct Line token from the bot.
  // Should be replaced with your own mechanism
  const { token } = await fetchToken();

  const store = WebChat.createStore({}, () => next => action => {
    const { type, payload } = action

    if (type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      updateConversationId(payload.directLine.conversationId)
      setData('username', action.meta.username)
    } else if (type === 'DIRECT_LINE/CONNECTION_STATUS_UPDATE') {
      if (payload.connectionStatus === DIRECT_LINE_STATUS_CONNECTED_CODE) {
        setTimeout(() => {
          setData('isDarkMode', localStorage.getItem(WEBCHAT_MODE_KEY) === '1')
          initiateChatPrompt()
          setData('isClosed', localStorage.getItem(WEBCHAT_WINDOW_CLOSED_KEY) === '1')
        }, 200)
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
        // TODO
        // Add your custom font
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
  handleWindowToggle()
  handleCondensation()
  insertInputCounter()
  handleModeToggle()
})().catch(err => console.error(err))