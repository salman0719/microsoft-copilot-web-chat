import { INPUT_CHAR_LIMIT } from "./constants.js";
import { setElement } from "./store.js";

const container = document.querySelector('#chat-window')
const inputCounter = document.createElement('span')
const sendBoxErrorInfoElem = document.createElement('div')
const modeButton = document.querySelector('#chat-window .chat-window__navbar__mode-button')

setElement('container', container)
setElement('inputCounter', inputCounter)
setElement('sendBoxErrorInfoElem', sendBoxErrorInfoElem)
setElement('modeButton', modeButton)

inputCounter.className = 'webchat__send-box-text-box-counter';

sendBoxErrorInfoElem.className = 'webchat__send-box__error-info';
sendBoxErrorInfoElem.innerHTML = 'Maximum limit of ' + INPUT_CHAR_LIMIT + ' characters reached.'