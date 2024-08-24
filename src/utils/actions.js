import { TARGET_ORIGIN } from "./constants.js";
import { getData, setData } from "./store.js";

export const toggleChatWindow = (show) => {
  setData('isClosed', typeof show === 'boolean' ? !show : !getData('isClosed'))
}

export const toggleDarkMode = (forceMode) => {
  setData('isDarkMode', typeof forceMode === 'boolean' ? forceMode : !getData('isDarkMode'))
}

export const postMessageToParent = (data) => {
  window.parent.postMessage(data, TARGET_ORIGIN)
}