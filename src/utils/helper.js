import { toggleChatWindow, toggleDarkMode } from "./actions.js";
import { BOT_NAME, DEFAULT_SEND_BOX_ERROR_MESSAGE, DISCLOSURE_TEXT, FULLSCREEN_SEARCH_QUERY_KEY, INPUT_CHAR_LIMIT, WEBCHAT_MODE_KEY, WEBCHAT_WINDOW_CLOSED_KEY } from "./constants.js";
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

export const handleFullscreen = () => {
  const expandIcon = document.querySelector('#chat-window .chat-window__navbar__expand-icon')
  const container = getElement('container')
  expandIcon.addEventListener('click', () => {
    const searchQuery = new URLSearchParams(location.search)
    searchQuery.set(FULLSCREEN_SEARCH_QUERY_KEY, '1')
    let newSearch = searchQuery.toString()
    if (newSearch) { newSearch = '?' + newSearch }
    window.open(location.origin + location.pathname + newSearch + location.hash)
  })

  return subscribe(['isFullscreen'], () => {
    container.classList[getData('isFullscreen') ? 'add' : 'remove']('chat-window--fullscreen')
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

export const handleUsername = () => {
  return subscribe(['username'], () => {
    document.querySelector('#chat-window .chat-window__navbar__mode-username')
      .innerHTML = getData('username')
  })
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