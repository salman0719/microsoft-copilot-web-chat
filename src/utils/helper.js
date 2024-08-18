import { toggleChatWindow, toggleDarkMode } from "./actions.js";
import { BOT_NAME, CONVERSATION_ID_KEY, DEFAULT_SEND_BOX_ERROR_MESSAGE, DISCLOSURE_TEXT, INITIAL_CHAT_PROMPT_MESSAGE, INPUT_CHAR_LIMIT, LAST_MESSAGE_TIMESTAMP_KEY, WEBCHAT_MODE_KEY, WEBCHAT_WINDOW_CLOSED_KEY } from "./constants.js";
import { getData, getElement, setData, subscribe } from "./store.js";

export const insertDisclosureText = () => {
  const sendBoxElem = document.querySelector('#webchat .webchat__send-box')
  const disclosureText = document.createElement('div')
  disclosureText.innerHTML = DISCLOSURE_TEXT
  disclosureText.className = 'webchat__send-box__info'
  sendBoxElem.appendChild(disclosureText)
}

export const updateInputPlaceholder = () => {
  document.querySelector('#webchat .webchat__send-box-text-box__input')
    .placeholder = 'Message ' + BOT_NAME
}

export const setupExpandIcon = () => {
  const expandIcon = document.querySelector('#chat-window .chat-window__navbar__expand-icon')
  expandIcon.addEventListener('click', () => {
    getElement('container').classList.add('chat-window--expanded')
  })
  document.body.addEventListener('keydown', (e) => {
    const container = getElement('container')
    e.key === 'Escape' && container.classList.contains('chat-window--expanded') &&
      container.classList.remove('chat-window--expanded')
  })
}

export const handleWindowToggle = () => {
  const botElem = document.querySelector('#chat-window #webchat-bot')
  botElem.addEventListener('click', () => {
    toggleChatWindow()
  })
  const collapseIcon = document.querySelector('#chat-window .chat-window__navbar__collapse-icon')
  collapseIcon.addEventListener('click', (e) => {
    e.stopPropagation()
    toggleChatWindow(false)
  })

  return subscribe(['isClosed'], () => {
    const isClosed = getData('isClosed')

    getElement('container').classList[isClosed ? 'add' : 'remove']('chat-window--closed')
    isClosed ? localStorage.setItem(WEBCHAT_WINDOW_CLOSED_KEY, '1') :
      localStorage.removeItem(WEBCHAT_WINDOW_CLOSED_KEY)
  })
}

export const handleCondensation = () => {
  const uncondense = () => {
    getData('isCondensed') && setData('isCondensed', false)
  }
  const webchatBody = document.querySelector('#chat-window .chat-window__body')
  webchatBody.addEventListener('click', uncondense)
  webchatBody.addEventListener('keydown', uncondense)

  return subscribe(['isCondensed'], () => {
    const isCondensed = getData('isCondensed')
    const container = getElement('container')
    if (isCondensed) {
      container.classList.add('chat-window--condensed')
    } else {
      container.classList.remove('chat-window--condensed')
      document.querySelector('#chat-window .webchat__send-box-text-box__input')?.focus()
    }
  })
}

export const insertInputCounter = () => {
  const inputCounter = getElement('inputCounter')
  inputCounter.className = 'webchat__send-box-text-box-counter';
  const inputContainer = document.querySelector('#chat-window .webchat__send-box-text-box')
  inputContainer.insertAdjacentElement('afterend', inputCounter)
}

export const handleModeToggle = () => {
  getElement('modeButton').addEventListener('click', () => {
    toggleDarkMode()
  })

  return subscribe(['isDarkMode'], () => {
    const isDarkMode = getData('isDarkMode')

    getElement('container').classList[isDarkMode ? 'add' : 'remove']('chat-window--dark')
    isDarkMode ? localStorage.setItem(WEBCHAT_MODE_KEY, '1') :
      localStorage.removeItem(WEBCHAT_MODE_KEY)
  })
}

export const initiateChatPrompt = () => {
  if (getData('chatPromptInitialized')) { return }
  setData('chatPromptInitialized', true)

  if (localStorage.getItem(LAST_MESSAGE_TIMESTAMP_KEY)) { return }
  if (getData('webChatStore').getState().activities.length) { return }
  if (!getData('isClosed')) { return }

  setData('isCondensed', true)

  const elem = document.createElement('div')
  elem.className = 'chat-window__initial-prompt'
  elem.innerHTML = INITIAL_CHAT_PROMPT_MESSAGE
  const transcriptContainer = document.querySelector(
    '#chat-window .webchat__basic-transcript__scrollable'
  )
  transcriptContainer.insertBefore(elem, transcriptContainer.firstElementChild)
}

export const handleUsername = () => {
  return subscribe(['username'], () => {
    document.querySelector('#chat-window .chat-window__navbar__mode-username')
      .innerHTML = getData('username')
  })
}

export const updateConversationId = (conversationId) => {
  if (localStorage.getItem(CONVERSATION_ID_KEY) !== conversationId) {
    localStorage.setItem(CONVERSATION_ID_KEY, conversationId)
    localStorage.removeItem(LAST_MESSAGE_TIMESTAMP_KEY)
  }
}

export const updateTimestamp = (activity) => {
  const { type, timestamp } = activity
  if (type !== 'message') { return }

  const prevTimestamp = localStorage.getItem(LAST_MESSAGE_TIMESTAMP_KEY)
  if (!prevTimestamp || timestamp > prevTimestamp) {
    localStorage.setItem(LAST_MESSAGE_TIMESTAMP_KEY, timestamp)
  }
}

export const getSendBoxErrorInfo = () => {
  return 'Maximum limit of ' + INPUT_CHAR_LIMIT + ' characters reached.'
}

export const handleInput = () => {
  const store = getData('webChatStore')

  store.subscribe(() => {
    setData('sendBoxValue', store.getState().sendBoxValue)
  })

  const inputCounter = getElement('inputCounter')
  const sendBoxErrorInfoElem = getElement('sendBoxErrorInfoElem')
  sendBoxErrorInfoElem.className = 'webchat__send-box__error-info';
  sendBoxErrorInfoElem.innerHTML = DEFAULT_SEND_BOX_ERROR_MESSAGE
  document.querySelector('#chat-window .webchat__send-box')
    .insertAdjacentElement('beforebegin', sendBoxErrorInfoElem)

  return [
    subscribe(['sendBoxValue'], () => {
      const sendBoxValue = getData('sendBoxValue')
      const { length } = sendBoxValue
      setData('charLimitExceeded', length > INPUT_CHAR_LIMIT)
      inputCounter.innerHTML = length + '/' + INPUT_CHAR_LIMIT
    }),
    subscribe(['charLimitExceeded'], () => {
      if (getData('charLimitExceeded')) {
        inputCounter.classList.add('webchat__send-box-text-box-counter--error')
        sendBoxErrorInfoElem.classList.remove('webchat__send-box__error-info--hidden')
        inputCounter.nextElementSibling.disabled = true
      } else {
        inputCounter.classList.remove('webchat__send-box-text-box-counter--error')
        sendBoxErrorInfoElem.classList.add('webchat__send-box__error-info--hidden')
        inputCounter.nextElementSibling.disabled = false
      }
    })
  ]
}