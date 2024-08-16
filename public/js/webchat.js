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
  const INITIAL_CHAT_PROMPT_MESSAGE = 'Need help with submitting your assessment?'
  const CONVERSATION_ID_KEY = 'webchat-conversation-id'
  const LAST_MESSAGE_TIMESTAMP_KEY = 'webchat-last-message-timestamp'

  let initialized = false
  let chatPromptInitialized = false

  // This is for obtaining Direct Line token from the bot.
  const { token } = await fetchJSON('/api/directline/token');

  const initiateChatPrompt = () => {
    if (chatPromptInitialized) { return }
    chatPromptInitialized = true

    if (store.getState().activities.length) { return }

    const elem = document.createElement('div')
    elem.className = 'chat-window__initial-prompt'
    elem.innerHTML = INITIAL_CHAT_PROMPT_MESSAGE
    const chatWindowBody = document.querySelector('#chat-window>.chat-window__body')
    chatWindowBody.insertBefore(elem, chatWindowBody.lastElementChild)
  }

  const construct = () => {
    if (initialized) { return }
    initialized = true

    const container = document.querySelector('#chat-window')

    // Insert disclosure text
    const sendBoxElem = document.querySelector('#webchat .webchat__send-box')
    const disclosureText = document.createElement('div')
    disclosureText.innerHTML = 'Scout can make mistakes, verify important information.'
    disclosureText.className = 'webchat__send-box__info'
    sendBoxElem.appendChild(disclosureText)

    // Update input placeholder
    document.querySelector('#webchat .webchat__send-box-text-box__input').placeholder = 'Message Scout'

    // Expand to fullscreen and return
    const expandIcon = document.querySelector('#chat-window .chat-window__navbar__expand-icon')
    expandIcon.addEventListener('click', () => {
      container.classList.add('chat-window--expanded')
    })
    window.addEventListener('keydown', (e) => {
      e.key === 'Escape' && container.classList.contains('chat-window--expanded') &&
        container.classList.remove('chat-window--expanded')
    })

    const botElem = document.querySelector('#chat-window #webchat-bot')
    botElem.addEventListener('click', () => {
      container.classList.toggle('chat-window--closed')
    })
  }

  const store = WebChat.createStore({}, () => next => action => {
    const { type, payload } = action

    !initialized && construct()

    if (type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      const conversationId = payload.directLine.conversationId
      if (localStorage.getItem(CONVERSATION_ID_KEY) !== conversationId) {
        localStorage.setItem(CONVERSATION_ID_KEY, conversationId)
        localStorage.removeItem(LAST_MESSAGE_TIMESTAMP_KEY)
      }

      !localStorage.getItem(LAST_MESSAGE_TIMESTAMP_KEY) && initiateChatPrompt()
    } else if (type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      const { activity } = payload

      if (activity.type === 'message') {
        const { timestamp } = activity
        const prevTimestamp = localStorage.getItem(LAST_MESSAGE_TIMESTAMP_KEY)
        if (!prevTimestamp || timestamp > prevTimestamp) {
          localStorage.setItem(LAST_MESSAGE_TIMESTAMP_KEY, timestamp)
        }
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
      },
    },
    document.getElementById('webchat')
  );

})().catch(err => console.error(err));