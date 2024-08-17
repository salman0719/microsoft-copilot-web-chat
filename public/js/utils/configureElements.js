import { setElement } from "./store.js";

const container = document.querySelector('#chat-window')
const inputCounter = document.createElement('span')
const sendBoxErrorInfoElem = document.createElement('div')
const modeButton = document.querySelector('#chat-window .chat-window__navbar__mode-button')

setElement('container', container)
setElement('inputCounter', inputCounter)
setElement('sendBoxErrorInfoElem', sendBoxErrorInfoElem)
setElement('modeButton', modeButton)