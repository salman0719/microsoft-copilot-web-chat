import { h, render } from "preact";
import { postMessageToParent, toggleChatWindow, toggleDarkMode } from "./actions.ts";
import { BOT_NAME, DEFAULT_SEND_BOX_ERROR_MESSAGE, DISCLOSURE_TEXT, FULLSCREEN_SEARCH_QUERY_KEY, INPUT_CHAR_LIMIT, WEBCHAT_MODE_KEY, WEBCHAT_WINDOW_CLOSED_KEY, WEBCHAT_WINDOW_CONDENSED_KEY } from "./constants.ts";
import { isAuthenticated, onSignInClick } from "./rootScript.js";
import { getData, getElement, setData, subscribe } from "./store.ts";
import InputCounter from "../components/InputCounter/index.tsx";

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

export const handleAuthentication = () => {
  const container = getElement('container')
  const res = subscribe(['authenticated'], () => {
    container.classList[getData('authenticated') ? 'remove' : 'add']('chat-window--unauthenticated')
  })

  isAuthenticated()

  return res
}

export const handleFullscreen = import.meta.env.VITE_ENABLE_FULLSCREEN === '1' ?
  () => {
    const expandIcon = document.querySelector('#chat-window .chat-window__navbar__expand-icon')
    const container = getElement('container')
    expandIcon.addEventListener('click', () => {
      const searchQuery = new URLSearchParams(location.search)
      searchQuery.set(FULLSCREEN_SEARCH_QUERY_KEY, '1')
      let newSearch = searchQuery.toString()
      if (newSearch) { newSearch = '?' + newSearch }
      window.open(location.origin + location.pathname + newSearch + location.hash)
    })

    const res = subscribe(['isFullscreen'], () => {
      container.classList[getData('isFullscreen') ? 'add' : 'remove']('chat-window--fullscreen')
    })

    const isFullscreen = (new URLSearchParams(location.search)).get(FULLSCREEN_SEARCH_QUERY_KEY) === '1'
    setData('isFullscreen', isFullscreen)
    isFullscreen && setData('isClosed', false)

    return res
  } :
  () => { }

export const handleWindowToggle = () => {
  const container = getElement('container')
  const containerBody = container.querySelector('.chat-window__body')
  const botElem = document.querySelector('#chat-window #webchat-bot')
  botElem.addEventListener('click', () => {
    toggleChatWindow()
  })
  const collapseIcon = document.querySelector('#chat-window .chat-window__navbar__collapse-icon')
  const stopPropagation = (e) => {
    e.stopPropagation()
  }
  collapseIcon.addEventListener('mousedown', stopPropagation)
  collapseIcon.addEventListener('touchstart', stopPropagation)
  collapseIcon.addEventListener('click', (e) => {
    stopPropagation(e)
    !getData('isFullscreen') && toggleChatWindow(false)
  })

  const res = subscribe(['isClosed'], () => {
    const isClosed = getData('isClosed')

    if (isClosed) {
      setTimeout(() => {
        if (getData('isClosed') === isClosed) {
          containerBody.classList.add('chat-window__body--hidden')
        }
        // TODO
        // Use constant
      }, 300)
    } else {
      containerBody.classList.remove('chat-window__body--hidden')
    }

    setTimeout(() => {
      container.classList[isClosed ? 'add' : 'remove']('chat-window--closed')
      isClosed ? localStorage.setItem(WEBCHAT_WINDOW_CLOSED_KEY, '1') :
        localStorage.removeItem(WEBCHAT_WINDOW_CLOSED_KEY)
    }, 1)
  })

  setData('isClosed', localStorage.getItem(WEBCHAT_WINDOW_CLOSED_KEY) === '1')

  return res
}

export const handleCondensation = (isNewSession) => {
  const container = getElement('container')

  if (getData('isFullscreen') || (!isNewSession && localStorage.getItem(WEBCHAT_WINDOW_CONDENSED_KEY) !== '1')) {
    setData('isCondensed', false)
    return
  } else {
    const uncondense = () => {
      getData('isCondensed') && setData('isCondensed', false)
    }
    const webchatBody = container.querySelector('.chat-window__body')
    webchatBody.addEventListener('touchstart', uncondense)
    webchatBody.addEventListener('mousedown', uncondense)
    webchatBody.addEventListener('keydown', uncondense)

    const unlistenIsClosed = subscribe(['isClosed'], () => {
      if (!getData('isClosed')) {
        setData('isCondensed', false)
        unlistenIsClosed()
      }
    })

    const res = subscribe(['isCondensed'], () => {
      const isCondensed = getData('isCondensed')
      if (isCondensed) {
        !getData('isClosed') && container.classList.add('chat-window--condensed')
        localStorage.setItem(WEBCHAT_WINDOW_CONDENSED_KEY, '1')
      } else {
        container.classList.remove('chat-window--condensed')
        container.querySelector('.webchat__send-box-text-box__input')?.focus()
        localStorage.removeItem(WEBCHAT_WINDOW_CONDENSED_KEY)
      }
    })

    setData('isCondensed', true)

    return res
  }
}

export const insertInputCounter = () => {
  render(h(InputCounter), document.querySelector('#chat-window .webchat__send-box__main'))
}

export const handleModeToggle = () => {
  getElement('modeButton').addEventListener('click', () => {
    toggleDarkMode()
  })

  const res = subscribe(['isDarkMode'], () => {
    const isDarkMode = getData('isDarkMode')

    getElement('container').classList[isDarkMode ? 'add' : 'remove']('chat-window--dark')
    isDarkMode ? localStorage.setItem(WEBCHAT_MODE_KEY, '1') :
      localStorage.removeItem(WEBCHAT_MODE_KEY)
  })

  setData('isDarkMode', localStorage.getItem(WEBCHAT_MODE_KEY) === '1')

  return res
}

export const handleWebchatInitialization = () => {
  const container = getElement('container')
  setData('webchatInitialized', !container.classList.contains('chat-window--webchat-uninitialized'))

  return subscribe(['webchatInitialized'], () => {
    container.classList[getData('webchatInitialized') ? 'remove' : 'add'](
      'chat-window--webchat-uninitialized'
    )
  })
}

export const setupLoginButton = () => {
  getElement('loginScreen').querySelector('.login-button')
    .addEventListener('click', onSignInClick)
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

  const sendBoxErrorInfoElem = getElement('sendBoxErrorInfoElem')
  sendBoxErrorInfoElem.className = 'webchat__send-box__error-info';
  sendBoxErrorInfoElem.innerHTML = DEFAULT_SEND_BOX_ERROR_MESSAGE
  document.querySelector('#chat-window .webchat__send-box')
    .insertAdjacentElement('beforebegin', sendBoxErrorInfoElem)

  const submitBtn = document.querySelector('#chat-window .webchat__send-box__button')

  return [
    subscribe(['sendBoxValue'], (value) => {
      setData('charLimitExceeded', value.length > INPUT_CHAR_LIMIT)
    }),
    subscribe(['charLimitExceeded'], () => {
      if (getData('charLimitExceeded')) {
        sendBoxErrorInfoElem.classList.remove('webchat__send-box__error-info--hidden')
        submitBtn.disabled = true
      } else {
        sendBoxErrorInfoElem.classList.add('webchat__send-box__error-info--hidden')
        submitBtn.disabled = false
      }
    })
  ]
}

export const handleConversationResize = () => {
  const container = getElement('container')
  const conversationContainer = container
    .querySelector('.webchat__basic-transcript__scrollable')

  function sendIframeSize() {
    const containerHeight = container.offsetHeight
    const conversationHeight = conversationContainer.offsetHeight

    const data = {
      height: containerHeight - conversationHeight + conversationContainer.scrollHeight + 10,
      type: 'conversationResize'
    }

    postMessageToParent(data)
  }

  const resizeObserver = new ResizeObserver(sendIframeSize);
  resizeObserver.observe(conversationContainer);

  sendIframeSize();
}