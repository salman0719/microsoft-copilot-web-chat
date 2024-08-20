import renderMarkup from "./renderMarkup.js";
import { setData, setElement } from "./store.js";

export default function configureElements() {
  renderMarkup()

  const container = document.querySelector('#chat-window')
  const inputCounter = document.createElement('span')
  const sendBoxErrorInfoElem = document.createElement('div')
  const modeButton = document.querySelector('#chat-window .chat-window__navbar__mode-button')

  setElement('container', container)
  setElement('inputCounter', inputCounter)
  setElement('sendBoxErrorInfoElem', sendBoxErrorInfoElem)
  setElement('modeButton', modeButton)

  setData('isClosed', container.classList.contains('chat-window--closed'))
}
