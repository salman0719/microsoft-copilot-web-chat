import { toggleChatWindow, toggleDarkMode } from "./actions.js";
import { BOT_NAME, DISCLOSURE_TEXT, INITIAL_CHAT_PROMPT_MESSAGE, LAST_MESSAGE_TIMESTAMP_KEY, WEBCHAT_MODE_KEY, WEBCHAT_WINDOW_CLOSED_KEY } from "./constants.js";
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
  window.addEventListener('keydown', (e) => {
    const container = getElement('container')
    e.key === 'Escape' && container.classList.contains('chat-window--expanded') &&
      container.classList.remove('chat-window--expanded')
  })
}

export const setupWindowToggle = () => {
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

export const setupCondensation = () => {
  const uncondense = () => {
    setData('isCondensed', false)
  }
  const webchatElem = document.querySelector('#chat-window #webchat')
  webchatElem.addEventListener('click', uncondense)
  webchatElem.addEventListener('keydown', uncondense)

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

export const insertCharacterCounter = () => {
  const inputContainer = document.querySelector('#chat-window .webchat__send-box-text-box')
  inputContainer.insertAdjacentElement('afterend', getElement('inputCounter'))
}

export const setupModeToggle = () => {
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

  const elem = document.createElement('div')
  elem.className = 'chat-window__initial-prompt'
  elem.innerHTML = INITIAL_CHAT_PROMPT_MESSAGE
  const transcriptContainer = document.querySelector(
    '#chat-window .webchat__basic-transcript__scrollable'
  )
  transcriptContainer.insertBefore(elem, transcriptContainer.firstElementChild)

  setData('isCondensed', true)
}