import { getData, setData } from "./store.js";

export const toggleChatWindow = (show) => {
  setData('isClosed', typeof show === 'boolean' ? !show : !getData('isClosed'))
}

export const toggleDarkMode = (forceMode) => {
  setData('isDarkMode', typeof forceMode === 'boolean' ? forceMode : !getData('isDarkMode'))
}