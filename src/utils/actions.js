import { DIRECT_LINE_STATUS_CONNECTED_CODE, WEBCHAT_MODE_KEY, WEBCHAT_WINDOW_CLOSED_KEY } from "./constants.js";
import { getData, setData } from "./store.js";

export const toggleChatWindow = (show) => {
  setData('isClosed', typeof show === 'boolean' ? !show : !getData('isClosed'))
}

export const toggleDarkMode = (forceMode) => {
  setData('isDarkMode', typeof forceMode === 'boolean' ? forceMode : !getData('isDarkMode'))
}

export const processStatusUpdate = (payload, isNewSession) => {
  if (payload.connectionStatus === DIRECT_LINE_STATUS_CONNECTED_CODE) {
    setTimeout(async () => {
      setData('isDarkMode', localStorage.getItem(WEBCHAT_MODE_KEY) === '1')
      isNewSession && await window.isAuthenticated() && setData('isCondensed', true)
      setData('isClosed', localStorage.getItem(WEBCHAT_WINDOW_CLOSED_KEY) === '1')
    }, 200)
  }
}